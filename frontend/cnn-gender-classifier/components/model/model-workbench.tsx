"use client";

import { useEffect, useRef, useState } from "react";

import { useCameraCapture } from "@/hooks/use-camera-capture";
import { useModelMetadata } from "@/hooks/use-model-metadata";
import { usePrediction } from "@/hooks/use-prediction";

import { LiveCaptureStage } from "@/components/model/live-capture-stage";
import { ResultPanel } from "@/components/model/result-panel";
import { XaiTabs } from "@/components/model/xai-tabs";

const DEFAULT_ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

export function ModelWorkbench() {
  const previewUrlRef = useRef<string | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const {
    active: cameraActive,
    supported: cameraSupported,
    isStarting: cameraIsStarting,
    error: cameraError,
    videoRef,
    start: startCamera,
    stop: stopCamera,
    capture: captureCamera,
  } = useCameraCapture();
  const prediction = usePrediction();
  const { metadata } = useModelMetadata();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [includeXai, setIncludeXai] = useState(true);

  const acceptedMimeTypes =
    metadata?.accepted_mime_types ?? DEFAULT_ACCEPTED_MIME_TYPES;
  const positiveClass = metadata?.classes.positive ?? "male";
  const negativeClass = metadata?.classes.negative ?? "female";
  const threshold = metadata?.threshold ?? 0.65;

  function revokePreviewUrl() {
    if (!previewUrlRef.current) return;
    URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
  }

  function setFileWithPreview(file: File | null) {
    revokePreviewUrl();

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;

    setSelectedFile(file);
    setPreviewUrl(objectUrl);
  }

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  function clearSelection() {
    prediction.reset();
    setFileWithPreview(null);
  }

  function handleFileSelection(file: File | null) {
    prediction.reset();
    setFileWithPreview(file);
  }

  async function handleCapture() {
    const capturedFile = await captureCamera();
    if (!capturedFile) return;
    handleFileSelection(capturedFile);
  }

  async function handlePredict() {
    if (!selectedFile) return;
    await prediction.predict(selectedFile, includeXai, acceptedMimeTypes);
  }

  useEffect(() => {
    if (prediction.status === "success" || prediction.status === "error") {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [prediction.status]);

  return (
    <div className="space-y-5">
      <LiveCaptureStage
        videoRef={videoRef}
        cameraActive={cameraActive}
        cameraSupported={cameraSupported}
        cameraIsStarting={cameraIsStarting}
        cameraError={cameraError}
        startCamera={startCamera}
        stopCamera={stopCamera}
        onCapture={handleCapture}
        previewUrl={previewUrl}
        selectedFile={selectedFile}
        onFileSelected={handleFileSelection}
        onClear={clearSelection}
        onPredict={handlePredict}
        isPredicting={prediction.isLoading}
        includeXai={includeXai}
        onToggleXai={() => setIncludeXai((current) => !current)}
        acceptedMimeTypes={acceptedMimeTypes}
        threshold={threshold}
      />

      <div ref={resultsRef} className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <ResultPanel
          status={prediction.status}
          error={prediction.error}
          result={prediction.result}
          lastFileName={prediction.lastFileName}
          positiveClass={positiveClass}
          negativeClass={negativeClass}
          threshold={threshold}
        />

        <XaiTabs
          originalSrc={previewUrl}
          gradcam={prediction.result?.gradcam ?? null}
          saliency={prediction.result?.saliency ?? null}
          includeXai={includeXai}
          isLoading={prediction.isLoading}
        />
      </div>
    </div>
  );
}
