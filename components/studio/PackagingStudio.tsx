"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { generateImageApi, loadImageUrl, refinePromptApi } from "@/lib/studio/client";
import { downloadImage } from "@/lib/studio/download";
import { toDescription } from "@/lib/studio/prompt";
import type { DesignFormData } from "@/lib/studio/types";
import { DesignPanel } from "./DesignPanel";
import { Header } from "./Header";
import { PoweredFooter } from "./PoweredFooter";
import { ResultSection } from "./ResultSection";

const FALLBACK_NOTICE =
  "This image was generated with our backup model because primary credits were exhausted.";

export function PackagingStudio() {
  const [product, setProduct] = useState("");
  const [extra, setExtra] = useState("");
  const [boxType, setBoxType] = useState<string | null>(null);
  const [material, setMaterial] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [vibe, setVibe] = useState<string | null>(null);

  const [designError, setDesignError] = useState<string | null>(null);
  const [resultError, setResultError] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [loadingStep, setLoadingStep] = useState<1 | 2 | 3>(1);
  const [loadingText, setLoadingText] = useState("Refining your prompt…");
  const [refinedPrompt, setRefinedPrompt] = useState<string | null>(null);
  const [showRefinedBox, setShowRefinedBox] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showRegenBtn, setShowRegenBtn] = useState(false);
  const [showDlBtn, setShowDlBtn] = useState(false);

  const productRef = useRef<HTMLInputElement>(null);
  const downloadBtnRef = useRef<HTMLButtonElement>(null);
  const resultSectionRef = useRef<HTMLDivElement>(null);

  const backToDesign = useCallback(() => {
    setShowResult(false);
    setImageUrl(null);
    setShowRegenBtn(false);
    setShowDlBtn(false);
    setShowRefinedBox(false);
    setResultError(null);
    setFallbackNotice(null);
    setTimeout(() => productRef.current?.focus(), 0);
  }, []);

  const getFormData = useCallback(
    (): DesignFormData => ({
      product: product.trim(),
      boxType,
      material,
      color,
      vibe,
      extra: extra.trim(),
    }),
    [product, boxType, material, color, vibe, extra],
  );

  const generate = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (isGenerating) return;

      const data = getFormData();
      setDesignError(null);
      setResultError(null);
      setFallbackNotice(null);

      if (!data.product) {
        setDesignError("⚠️ Please describe what's inside the package.");
        return;
      }

      setIsGenerating(true);
      setShowResult(true);
      setShowRefinedBox(false);
      setShowRegenBtn(false);
      setShowDlBtn(false);
      setImageUrl(null);
      setLoadingStep(1);
      setLoadingText("Refining your prompt…");

      setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 0);

      try {
        setLoadingStep(1);
        setLoadingText("Refining your prompt with AI…");
        const refined = await refinePromptApi(toDescription(data));
        setRefinedPrompt(refined);
        setShowRefinedBox(true);

        setLoadingStep(2);
        setLoadingText("Generating your packaging image…");

        const { url, usedFallback } = await generateImageApi(refined);
        if (usedFallback) {
          setFallbackNotice(FALLBACK_NOTICE);
        }
        if (!url.startsWith("data:")) {
          await loadImageUrl(url);
        }

        setLoadingStep(3);
        setImageUrl(url);
        setShowRegenBtn(true);
        setShowDlBtn(true);
        setTimeout(() => downloadBtnRef.current?.focus(), 0);
      } catch (err) {
        setResultError(`⚠️ ${err instanceof Error ? err.message : "Generation failed"}`);
      } finally {
        setIsGenerating(false);
      }
    },
    [getFormData, isGenerating],
  );

  const regen = useCallback(() => {
    setImageUrl(null);
    setShowRegenBtn(false);
    setShowDlBtn(false);
    setShowRefinedBox(false);
    setResultError(null);
    setFallbackNotice(null);
    void generate();
  }, [generate]);

  const handleDownload = useCallback(() => {
    if (imageUrl) void downloadImage(imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    productRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.ctrlKey) {
        e.preventDefault();
        void generate();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [generate]);

  return (
    <div className="widget">
      <Header />

      <div className="card" role="main">
        <DesignPanel
          product={product}
          extra={extra}
          boxType={boxType}
          material={material}
          color={color}
          vibe={vibe}
          designError={designError}
          isGenerating={isGenerating}
          productRef={productRef}
          onProductChange={setProduct}
          onExtraChange={setExtra}
          onBoxTypeChange={setBoxType}
          onMaterialChange={setMaterial}
          onColorChange={setColor}
          onVibeChange={setVibe}
          onSubmit={(e) => void generate(e)}
        />

        <div ref={resultSectionRef}>
          <ResultSection
            visible={showResult}
            resultError={resultError}
            fallbackNotice={fallbackNotice}
            isGenerating={isGenerating}
            loadingText={loadingText}
            loadingStep={loadingStep}
            refinedPrompt={refinedPrompt}
            showRefinedBox={showRefinedBox}
            imageUrl={imageUrl}
            showRegenBtn={showRegenBtn}
            showDlBtn={showDlBtn}
            downloadBtnRef={downloadBtnRef}
            onBackToDesign={backToDesign}
            onRegen={regen}
            onDownload={handleDownload}
          />
        </div>
      </div>

      <PoweredFooter />
    </div>
  );
}
