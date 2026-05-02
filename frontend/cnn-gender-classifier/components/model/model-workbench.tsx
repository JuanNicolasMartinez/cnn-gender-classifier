"use client";

import Image from "next/image";
import { startTransition, useEffect, useRef, useState } from "react";
import { Camera, ImageUp, ScanSearch, Sparkles, Trash2, Video } from "lucide-react";

import { useCameraCapture } from "@/hooks/use-camera-capture";
import { useModelMetadata } from "@/hooks/use-model-metadata";
import { usePrediction } from "@/hooks/use-prediction";
import type { SourceMode } from "@/lib/types";
import { titleize } from "@/lib/utils";

import { ResultPanel } from "@/components/model/result-panel";
import { XaiTabs } from "@/components/model/xai-tabs";
import { SectionCard } from "@/components/section-card";

const DEFAULT_ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

export function ModelWorkbench() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);
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
  const { metadata, error: metadataError, isLoading: metadataLoading } =
    useModelMetadata();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sourceMode, setSourceMode] = useState<SourceMode>("upload");
  const [includeXai, setIncludeXai] = useState(true);

  const acceptedMimeTypes =
    metadata?.accepted_mime_types ?? DEFAULT_ACCEPTED_MIME_TYPES;
  const positiveClass = metadata?.classes.positive ?? "male";
  const negativeClass = metadata?.classes.negative ?? "female";
  const threshold = metadata?.threshold ?? 0.65;

  function revokePreviewUrl() {
    if (!previewUrlRef.current) {
      return;
    }

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

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSourceChange(nextMode: SourceMode) {
    if (nextMode === sourceMode) {
      return;
    }

    if (nextMode !== "camera") {
      stopCamera();
    }

    startTransition(() => {
      setSourceMode(nextMode);
      clearSelection();
    });
  }

  function handleFileSelection(file: File | null) {
    prediction.reset();
    setFileWithPreview(file);
  }

  async function handleCapture() {
    const capturedFile = await captureCamera();

    if (!capturedFile) {
      return;
    }

    handleFileSelection(capturedFile);
  }

  async function handlePredict() {
    if (!selectedFile) {
      return;
    }

    await prediction.predict(selectedFile, includeXai, acceptedMimeTypes);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <SectionCard
          eyebrow="Entrada"
          title="Fuente de imagen"
          description="Carga una imagen local o activa la cámara del dispositivo para generar un frame y enviarlo al backend."
          className="h-full"
        >
          <div className="flex flex-wrap items-center gap-2">
            {([
              { key: "upload", label: "Subir imagen", icon: ImageUp },
              { key: "camera", label: "Usar cámara", icon: Camera },
            ] as const).map((option) => (
              <button
                key={option.key}
                type="button"
                className={`glass-pill inline-flex items-center gap-2 px-4 py-3 text-sm font-medium transition-transform duration-200 hover:-translate-y-0.5 ${
                  sourceMode === option.key ? "glass-pill-active" : ""
                }`}
                onClick={() => handleSourceChange(option.key)}
              >
                <option.icon className="h-4 w-4" strokeWidth={1.8} />
                {option.label}
              </button>
            ))}

            <button
              type="button"
              className={`glass-pill inline-flex items-center gap-2 px-4 py-3 text-sm font-medium transition-transform duration-200 hover:-translate-y-0.5 ${
                includeXai ? "glass-pill-active" : ""
              }`}
              onClick={() => setIncludeXai((current) => !current)}
            >
              <Sparkles className="h-4 w-4" strokeWidth={1.8} />
              {includeXai ? "XAI activado" : "XAI desactivado"}
            </button>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
            <div className="space-y-4">
              {sourceMode === "upload" ? (
                <label className="preview-frame flex min-h-[22rem] cursor-pointer flex-col justify-between gap-5 rounded-[28px] border-2 border-dashed border-[var(--color-surface-muted)] bg-surface-light p-5 text-left transition-colors hover:border-[var(--color-accent)]">
                  <div className="space-y-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-surface-muted)] bg-[rgba(247,247,240,0.72)] text-primary">
                      <ImageUp className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="text-lg font-semibold tracking-[-0.04em] text-primary">
                        Selecciona una imagen clínica
                      </p>
                      <p className="mt-2 max-w-lg text-sm leading-6 text-secondary">
                        El backend acepta {acceptedMimeTypes.join(", ")} y mantiene
                        el threshold productivo en {threshold.toFixed(2)}.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-secondary">
                    <span className="glass-pill px-4 py-3">Explorar archivo</span>
                    <span>JPG, JPEG, PNG o WEBP</span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedMimeTypes.join(",")}
                    className="sr-only"
                    onChange={(event) =>
                      handleFileSelection(event.target.files?.[0] ?? null)
                    }
                  />
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="preview-frame relative aspect-[4/3] overflow-hidden rounded-[28px]">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute left-4 top-4 z-10">
                      <span className="glass-pill inline-flex items-center gap-2 px-4 py-2 text-sm text-secondary">
                        <Video className="h-4 w-4" strokeWidth={1.8} />
                        {cameraActive ? "Live capture" : "Camera standby"}
                      </span>
                    </div>
                    {!cameraActive ? (
                      <div className="absolute inset-0 grid place-items-center p-6 text-center text-sm leading-6 text-secondary">
                        {cameraSupported
                          ? "La cámara está inactiva. Iníciala para capturar un frame."
                          : "El navegador actual no soporta getUserMedia."}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={`glass-pill inline-flex items-center gap-2 px-4 py-3 text-sm font-medium ${
                        cameraActive ? "glass-pill-active" : ""
                      }`}
                      onClick={() => void startCamera()}
                      disabled={cameraIsStarting}
                    >
                      <Camera className="h-4 w-4" strokeWidth={1.8} />
                      {cameraIsStarting ? "Abriendo cámara..." : "Iniciar cámara"}
                    </button>
                    <button
                      type="button"
                      className="glass-pill px-4 py-3 text-sm font-medium"
                      onClick={stopCamera}
                    >
                      Detener
                    </button>
                    <button
                      type="button"
                      className="glass-pill px-4 py-3 text-sm font-medium"
                      onClick={() => void handleCapture()}
                      disabled={!cameraActive}
                    >
                      Capturar frame
                    </button>
                  </div>

                  {cameraError ? (
                    <div className="clinical-alert rounded-[24px] p-4 text-sm leading-6">
                      {cameraError}
                    </div>
                  ) : null}
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto]">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-accent)] bg-accent px-5 py-3 text-sm font-semibold text-primary transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
                  onClick={() => void handlePredict()}
                  disabled={!selectedFile || prediction.isLoading}
                >
                  <ScanSearch className="h-4 w-4" strokeWidth={1.8} />
                  {prediction.isLoading ? "Procesando..." : "Analizar imagen"}
                </button>
                <button
                  type="button"
                  className="glass-pill inline-flex items-center gap-2 px-4 py-3 text-sm font-medium"
                  onClick={clearSelection}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                  Limpiar
                </button>
                <div className="glass-pill flex items-center px-4 py-3 text-sm leading-6 text-secondary">
                  {selectedFile
                    ? `Lista: ${selectedFile.name}`
                    : "Sin imagen seleccionada"}
                </div>
              </div>
            </div>

            <div className="grid content-start gap-3">
              <article className="rounded-[24px] border border-[var(--color-surface-muted)] bg-surface-light p-4">
                <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
                  Modo activo
                </p>
                <p className="mt-2 text-lg font-semibold tracking-[-0.04em] text-primary">
                  {sourceMode === "upload" ? "Upload local" : "Camera capture"}
                </p>
                <p className="mt-2 text-sm leading-6 text-secondary">
                  {sourceMode === "upload"
                    ? "Ideal para validar imágenes ya disponibles."
                    : "Útil para probar captura directa desde dispositivo."}
                </p>
              </article>

              <article className="rounded-[24px] border border-[var(--color-surface-muted)] bg-surface-light p-4">
                <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
                  Input policy
                </p>
                <p className="mt-2 text-lg font-semibold tracking-[-0.04em] text-primary">
                  {acceptedMimeTypes.length} tipos MIME
                </p>
                <p className="mt-2 text-sm leading-6 text-secondary">
                  {acceptedMimeTypes.join(", ")}
                </p>
              </article>

              <article className="rounded-[24px] border border-[var(--color-surface-muted)] bg-surface-light p-4">
                <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
                  Overlays
                </p>
                <p className="mt-2 text-lg font-semibold tracking-[-0.04em] text-primary">
                  {includeXai ? "Grad-CAM + Saliency" : "Solo predicción"}
                </p>
                <p className="mt-2 text-sm leading-6 text-secondary">
                  {metadata?.supports_xai
                    ? "El runtime soporta interpretabilidad bajo demanda."
                    : "La metadata actual no anuncia overlays XAI."}
                </p>
              </article>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Preview"
          title="Imagen actual"
          description="El preview se reutiliza como referencia para comparar la predicción final con los overlays XAI."
          className="h-full"
        >
          <div className="preview-frame relative aspect-[4/3] overflow-hidden rounded-[28px]">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Preview de la imagen lista para inferencia."
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center p-6 text-center text-sm leading-6 text-secondary">
                Carga una imagen o captura un frame para ver el preview aquí.
              </div>
            )}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <article className="rounded-[24px] border border-[var(--color-surface-muted)] bg-surface-light p-4">
              <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
                Metadata backend
              </p>
              <p className="mt-2 text-lg font-semibold tracking-[-0.04em] text-primary">
                {metadataLoading
                  ? "Cargando..."
                  : metadata
                    ? `${titleize(positiveClass)} / ${titleize(negativeClass)}`
                    : "Usando fallback local"}
              </p>
              <p className="mt-2 text-sm leading-6 text-secondary">
                {metadataError
                  ? metadataError
                  : `Threshold actual ${threshold.toFixed(2)} y XAI ${
                      includeXai ? "activado" : "desactivado"
                    }.`}
              </p>
            </article>

            <article className="rounded-[24px] border border-[var(--color-surface-muted)] bg-surface-light p-4">
              <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
                Política de entrada
              </p>
              <p className="mt-2 text-lg font-semibold tracking-[-0.04em] text-primary">
                {acceptedMimeTypes.length} tipos MIME
              </p>
              <p className="mt-2 text-sm leading-6 text-secondary">
                {acceptedMimeTypes.join(", ")}
              </p>
            </article>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
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
