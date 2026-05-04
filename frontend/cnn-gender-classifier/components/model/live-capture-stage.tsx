"use client";

import Image from "next/image";
import type { RefObject } from "react";
import { useEffect, useState } from "react";
import {
  Camera,
  ImageUp,
  ScanSearch,
  Sparkles,
  Trash2,
  Video,
} from "lucide-react";

import { cn } from "@/lib/utils";

type LiveCaptureStageProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  cameraActive: boolean;
  cameraSupported: boolean;
  cameraIsStarting: boolean;
  cameraError: string | null;
  startCamera: () => Promise<void> | void;
  stopCamera: () => void;
  onCapture: () => Promise<void> | void;
  previewUrl: string | null;
  selectedFile: File | null;
  onFileSelected: (file: File | null) => void;
  onClear: () => void;
  onPredict: () => Promise<void> | void;
  isPredicting: boolean;
  includeXai: boolean;
  onToggleXai: () => void;
  acceptedMimeTypes: string[];
  threshold: number;
};

export function LiveCaptureStage({
  videoRef,
  cameraActive,
  cameraSupported,
  cameraIsStarting,
  cameraError,
  startCamera,
  stopCamera,
  onCapture,
  previewUrl,
  selectedFile,
  onFileSelected,
  onClear,
  onPredict,
  isPredicting,
  includeXai,
  onToggleXai,
  acceptedMimeTypes,
  threshold,
}: LiveCaptureStageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    if (acceptedMimeTypes.length && !acceptedMimeTypes.includes(file.type)) return;
    onFileSelected(file);
  }

  return (
    <section className="clinical-card-static overflow-hidden rounded-[var(--radius-lg)] p-0">

      {/* ── Visor ── */}
      <div className="relative aspect-[4/3] w-full bg-[var(--color-card-dark)] sm:aspect-[16/10] xl:aspect-[16/9]">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Imagen lista para inferencia."
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 h-full w-full scale-x-[-1] object-cover"
          />
        )}

        {!previewUrl ? (
          <HeadShoulderSilhouette className="pointer-events-none absolute left-1/2 top-1/2 h-[88%] -translate-x-1/2 -translate-y-1/2" />
        ) : null}

        {/* Loader */}
        {isPredicting ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[rgba(20,24,23,0.6)] backdrop-blur-sm">
            <svg
              className="h-12 w-12 animate-spin text-accent"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm font-medium tracking-wide text-(--color-white-warm)">
              Analizando imagen…
            </p>
          </div>
        ) : null}

        {/* Standby message */}
        {mounted && !previewUrl && !cameraActive ? (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center px-4 sm:inset-0 sm:grid sm:place-items-center sm:translate-y-0">
            <div className="rounded-[var(--radius-md)] border border-[rgba(247,247,240,0.4)] bg-[rgba(20,24,23,0.55)] px-4 py-2.5 text-center text-xs leading-5 text-(--color-white-warm) backdrop-blur-md sm:px-5 sm:py-3 sm:text-sm sm:leading-6">
              {cameraSupported ? (
                <>
                  <span className="sm:hidden">La cámara está inactiva. Inícíala abajo.</span>
                  <span className="hidden sm:inline">La cámara está inactiva. Inícíala a la izquierda.</span>
                </>
              ) : "El navegador actual no soporta getUserMedia."}
            </div>
          </div>
        ) : null}

        {/* Floating cards — desktop/tablet only */}
        <FloatingIndicationsCard
          cameraActive={cameraActive}
          cameraIsStarting={cameraIsStarting}
          cameraError={cameraError}
          startCamera={startCamera}
          stopCamera={stopCamera}
          onCapture={onCapture}
          includeXai={includeXai}
          onToggleXai={onToggleXai}
        />

        <FloatingUploadCard
          acceptedMimeTypes={acceptedMimeTypes}
          threshold={threshold}
          selectedFile={selectedFile}
          isDragging={isDragging}
          onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onFileSelected={onFileSelected}
        />

        {/* Action bar — desktop/tablet only */}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 hidden flex-wrap items-center justify-center gap-2 px-4 sm:flex md:bottom-6">
          <ActionButtons
            selectedFile={selectedFile}
            isPredicting={isPredicting}
            onPredict={onPredict}
            onClear={onClear}
          />
        </div>

        {cameraError ? (
          <div className="absolute inset-x-4 bottom-20 mx-auto hidden max-w-md rounded-[var(--radius-md)] border border-[var(--color-danger-border)] bg-[var(--color-clinical-pink-soft)] px-4 py-3 text-sm leading-6 text-[var(--color-danger)] sm:block md:bottom-24">
            {cameraError}
          </div>
        ) : null}
      </div>

      {/* ── Mobile controls — below the viewfinder ── */}
      <div className="flex flex-col gap-3 p-4 sm:hidden">

        {/* Status pill */}
        <div className="flex items-center gap-2">
          <span className={cn(
            "glass-pill inline-flex items-center gap-2 px-3 py-2 text-xs font-medium",
            cameraActive && "glass-pill-active",
          )}>
            <Video className="h-3.5 w-3.5" strokeWidth={1.8} />
            {cameraActive ? "Live capture" : "Camera standby"}
          </span>
        </div>

        {/* Camera controls */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={cn(
              "glass-pill inline-flex flex-1 items-center justify-center gap-2 px-3 py-3 text-sm font-medium",
              cameraActive && "glass-pill-active",
            )}
            onClick={() => void startCamera()}
            disabled={cameraIsStarting}
          >
            <Camera className="h-4 w-4" strokeWidth={1.8} />
            {cameraIsStarting ? "Abriendo..." : "Iniciar cámara"}
          </button>
          <button
            type="button"
            className="glass-pill inline-flex items-center justify-center px-4 py-3 text-sm font-medium"
            onClick={stopCamera}
            disabled={!cameraActive}
          >
            Detener
          </button>
          <button
            type="button"
            className="glass-pill inline-flex flex-1 items-center justify-center gap-2 px-3 py-3 text-sm font-medium"
            onClick={() => void onCapture()}
            disabled={!cameraActive}
          >
            Capturar
          </button>
        </div>

        {cameraError ? (
          <div className="rounded-[var(--radius-md)] border border-[var(--color-danger-border)] bg-[var(--color-clinical-pink-soft)] px-4 py-3 text-sm leading-6 text-[var(--color-danger)]">
            {cameraError}
          </div>
        ) : null}

        {/* Upload */}
        <label
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-surface-muted)] bg-[rgba(246,246,241,0.55)] px-4 py-3 transition-colors",
            isDragging && "border-[var(--color-accent)] bg-[rgba(238,255,31,0.18)]",
          )}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file && (!acceptedMimeTypes.length || acceptedMimeTypes.includes(file.type))) {
              onFileSelected(file);
            }
          }}
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-surface-muted)] bg-[rgba(247,247,240,0.72)] text-primary">
            <ImageUp className="h-4 w-4" strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary">Subir imagen</p>
            <p className="truncate text-xs text-secondary">JPG, PNG, WEBP · threshold {threshold.toFixed(2)}</p>
          </div>
          <input
            type="file"
            accept={acceptedMimeTypes.join(",")}
            className="sr-only"
            onChange={(event) => onFileSelected(event.target.files?.[0] ?? null)}
          />
        </label>

        {/* XAI toggle */}
        <button
          type="button"
          className={cn(
            "glass-pill inline-flex w-full items-center justify-center gap-2 px-3 py-3 text-sm font-medium",
            includeXai && "glass-pill-active",
          )}
          onClick={onToggleXai}
        >
          <Sparkles className="h-4 w-4" strokeWidth={1.8} />
          {includeXai ? "XAI activado" : "XAI desactivado"}
        </button>

        {/* Predict / clear */}
        <div className="flex flex-wrap gap-2">
          <ActionButtons
            selectedFile={selectedFile}
            isPredicting={isPredicting}
            onPredict={onPredict}
            onClear={onClear}
          />
        </div>

        {selectedFile ? (
          <p className="glass-pill truncate px-3 py-2 text-xs text-secondary">
            Lista: {selectedFile.name}
          </p>
        ) : null}
      </div>
    </section>
  );
}

/* ─── Shared action buttons ─── */
function ActionButtons({
  selectedFile,
  isPredicting,
  onPredict,
  onClear,
}: {
  selectedFile: File | null;
  isPredicting: boolean;
  onPredict: () => Promise<void> | void;
  onClear: () => void;
}) {
  return (
    <>
      <button
        type="button"
        className="pointer-events-auto inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[var(--color-accent)] bg-accent px-5 py-3 text-sm font-semibold text-primary transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 sm:flex-none"
        onClick={() => void onPredict()}
        disabled={!selectedFile || isPredicting}
      >
        <ScanSearch className="h-4 w-4" strokeWidth={1.8} />
        {isPredicting ? "Procesando..." : "Analizar imagen"}
      </button>
      <button
        type="button"
        className="glass-pill pointer-events-auto inline-flex items-center gap-2 px-4 py-3 text-sm font-medium"
        onClick={onClear}
      >
        <Trash2 className="h-4 w-4" strokeWidth={1.8} />
        Limpiar
      </button>
    </>
  );
}

/* ─── Floating cards — sm and up only ─── */
type FloatingIndicationsCardProps = {
  cameraActive: boolean;
  cameraIsStarting: boolean;
  cameraError: string | null;
  startCamera: () => Promise<void> | void;
  stopCamera: () => void;
  onCapture: () => Promise<void> | void;
  includeXai: boolean;
  onToggleXai: () => void;
};

function FloatingIndicationsCard({
  cameraActive,
  cameraIsStarting,
  startCamera,
  stopCamera,
  onCapture,
  includeXai,
  onToggleXai,
}: FloatingIndicationsCardProps) {
  return (
    <aside className="absolute left-3 top-3 hidden w-[260px] rounded-[var(--radius-md)] border border-[rgba(143,145,142,0.42)] bg-[rgba(247,247,240,0.78)] p-4 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.45)] backdrop-blur-md sm:block md:left-5 md:top-5 md:w-[280px]">
      <p className="text-[0.66rem] uppercase tracking-[0.24em] text-secondary">Encuadre</p>
      <div className="mt-2 flex items-center gap-2">
        <span className={cn(
          "glass-pill inline-flex items-center gap-2 px-3 py-2 text-xs font-medium",
          cameraActive && "glass-pill-active",
        )}>
          <Video className="h-3.5 w-3.5" strokeWidth={1.8} />
          {cameraActive ? "Live capture" : "Camera standby"}
        </span>
      </div>

      <ol className="mt-4 space-y-2 text-sm leading-5 text-secondary">
        <li className="flex gap-2"><span className="font-semibold text-primary">1.</span>Centra tu rostro en la silueta.</li>
        <li className="flex gap-2"><span className="font-semibold text-primary">2.</span>Busca buena iluminación frontal.</li>
        <li className="flex gap-2"><span className="font-semibold text-primary">3.</span>Pulsa Capturar para enviar el frame.</li>
      </ol>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className={cn("glass-pill inline-flex items-center gap-2 px-3 py-2 text-xs font-medium", cameraActive && "glass-pill-active")}
          onClick={() => void startCamera()}
          disabled={cameraIsStarting}
        >
          <Camera className="h-3.5 w-3.5" strokeWidth={1.8} />
          {cameraIsStarting ? "Abriendo..." : "Iniciar"}
        </button>
        <button
          type="button"
          className="glass-pill inline-flex items-center px-3 py-2 text-xs font-medium"
          onClick={stopCamera}
          disabled={!cameraActive}
        >
          Detener
        </button>
        <button
          type="button"
          className="glass-pill inline-flex items-center px-3 py-2 text-xs font-medium"
          onClick={() => void onCapture()}
          disabled={!cameraActive}
        >
          Capturar
        </button>
      </div>

      <button
        type="button"
        className={cn("glass-pill mt-3 inline-flex w-full items-center justify-center gap-2 px-3 py-2 text-xs font-medium", includeXai && "glass-pill-active")}
        onClick={onToggleXai}
      >
        <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />
        {includeXai ? "XAI activado" : "XAI desactivado"}
      </button>
    </aside>
  );
}

type FloatingUploadCardProps = {
  acceptedMimeTypes: string[];
  threshold: number;
  selectedFile: File | null;
  isDragging: boolean;
  onDragOver: (event: React.DragEvent<HTMLLabelElement>) => void;
  onDragLeave: () => void;
  onDrop: (event: React.DragEvent<HTMLLabelElement>) => void;
  onFileSelected: (file: File | null) => void;
};

function FloatingUploadCard({
  acceptedMimeTypes,
  threshold,
  selectedFile,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelected,
}: FloatingUploadCardProps) {
  return (
    <aside className="absolute right-3 top-3 hidden w-[260px] rounded-[var(--radius-md)] border border-[rgba(143,145,142,0.42)] bg-[rgba(247,247,240,0.78)] p-4 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.45)] backdrop-blur-md sm:block md:right-5 md:top-5 md:w-[280px]">
      <p className="text-[0.66rem] uppercase tracking-[0.24em] text-secondary">Subir imagen</p>

      <label
        className={cn(
          "mt-3 flex cursor-pointer flex-col gap-2 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-surface-muted)] bg-[rgba(246,246,241,0.55)] p-4 text-left transition-colors",
          isDragging && "border-[var(--color-accent)] bg-[rgba(238,255,31,0.18)]",
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-surface-muted)] bg-[rgba(247,247,240,0.72)] text-primary">
          <ImageUp className="h-4 w-4" strokeWidth={1.8} />
        </span>
        <p className="text-sm font-semibold tracking-[-0.02em] text-primary">Arrastra una imagen</p>
        <p className="text-xs leading-5 text-secondary">o haz click para explorar. Threshold productivo {threshold.toFixed(2)}.</p>
        <input
          type="file"
          accept={acceptedMimeTypes.join(",")}
          className="sr-only"
          onChange={(event) => onFileSelected(event.target.files?.[0] ?? null)}
        />
      </label>

      <p className="mt-3 text-[0.66rem] uppercase tracking-[0.22em] text-secondary">{acceptedMimeTypes.length} tipos MIME</p>
      <p className="mt-1 truncate text-xs text-secondary">{acceptedMimeTypes.join(", ")}</p>

      {selectedFile ? (
        <p className="glass-pill mt-3 truncate px-3 py-2 text-xs text-secondary">Lista: {selectedFile.name}</p>
      ) : null}
    </aside>
  );
}

function HeadShoulderSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 240"
      fill="none"
      aria-hidden="true"
      className={className}
      style={{ filter: "drop-shadow(0 0 10px rgba(0, 0, 0, 0.45))" }}
    >
      <ellipse
        cx="100"
        cy="118"
        rx="82"
        ry="108"
        stroke="rgba(247, 247, 240, 0.85)"
        strokeWidth="2.5"
        strokeDasharray="6 6"
      />
    </svg>
  );
}
