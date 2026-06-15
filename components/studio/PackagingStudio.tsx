"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { generateImageApi, loadImageUrl, refinePromptApi } from "@/lib/studio/client";
import { downloadImage } from "@/lib/studio/download";
import { toDescription } from "@/lib/studio/prompt";
import type { DesignFormData, Provider } from "@/lib/studio/types";
import { DesignPanel } from "./DesignPanel";
import { Header } from "./Header";
import { PoweredFooter } from "./PoweredFooter";
import { ResultSection } from "./ResultSection";
import { SetupPanel } from "./SetupPanel";
import { StepTabs } from "./StepTabs";

export function PackagingStudio() {
  const [provider, setProvider] = useState<Provider>("pollinations");
  const [designUnlocked, setDesignUnlocked] = useState(false);
  const [showSetup, setShowSetup] = useState(true);
  const [showDesign, setShowDesign] = useState(false);

  const [product, setProduct] = useState("");
  const [extra, setExtra] = useState("");
  const [boxType, setBoxType] = useState<string | null>(null);
  const [material, setMaterial] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [vibe, setVibe] = useState<string | null>(null);

  const [setupError, setSetupError] = useState<string | null>(null);
  const [designError, setDesignError] = useState<string | null>(null);
  const [resultError, setResultError] = useState<string | null>(null);

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

  const pickProvider = useCallback((p: Provider) => {
    setProvider(p);
  }, []);

  const confirmSetup = useCallback(() => {
    setSetupError(null);
    setDesignUnlocked(true);
    setShowSetup(false);
    setShowDesign(true);
    setTimeout(() => productRef.current?.focus(), 0);
  }, []);

  const backToSetup = useCallback(() => {
    setShowSetup(true);
    setShowDesign(false);
    setShowResult(false);
    setDesignUnlocked(false);
    setImageUrl(null);
    setShowRegenBtn(false);
    setShowDlBtn(false);
    setShowRefinedBox(false);
    setResultError(null);
    setDesignError(null);
  }, []);

  const backToDesign = useCallback(() => {
    setShowResult(false);
    setImageUrl(null);
    setShowRegenBtn(false);
    setShowDlBtn(false);
    setShowRefinedBox(false);
    setResultError(null);
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
        setLoadingText(
          provider === "wavespeed"
            ? "Generating image via WaveSpeed…"
            : "Generating image via Pollinations…",
        );

        const url = await generateImageApi(provider, refined);
        if (provider === "wavespeed") {
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
    [getFormData, isGenerating, provider],
  );

  const regen = useCallback(() => {
    setImageUrl(null);
    setShowRegenBtn(false);
    setShowDlBtn(false);
    setShowRefinedBox(false);
    setResultError(null);
    void generate();
  }, [generate]);

  const handleDownload = useCallback(() => {
    if (imageUrl) void downloadImage(imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.ctrlKey && showDesign && !showSetup) {
        e.preventDefault();
        void generate();
      }

      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const pollinate = document.getElementById("card-pollinations");
        const wavespeed = document.getElementById("card-wavespeed");
        if (
          document.activeElement === pollinate ||
          document.activeElement === wavespeed
        ) {
          e.preventDefault();
          const next = e.key === "ArrowRight" ? wavespeed : pollinate;
          next?.focus();
          pickProvider(next === wavespeed ? "wavespeed" : "pollinations");
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [generate, pickProvider, showDesign, showSetup]);

  return (
    <div className="widget">
      <Header />

      <div className="card" role="main">
        <StepTabs
          designUnlocked={designUnlocked}
          onDesignTab={() => {
            if (designUnlocked) {
              setShowSetup(false);
              setShowDesign(true);
            }
          }}
        />

        <SetupPanel
          hidden={!showSetup}
          provider={provider}
          setupError={setupError}
          onProviderChange={pickProvider}
          onConfirm={confirmSetup}
        />

        <DesignPanel
          hidden={!showDesign}
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
          onBackToSetup={backToSetup}
          onSubmit={(e) => void generate(e)}
        />

        <div ref={resultSectionRef}>
          <ResultSection
            visible={showResult}
            resultError={resultError}
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
