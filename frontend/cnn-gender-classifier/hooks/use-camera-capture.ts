"use client";

import { useEffect, useRef, useState } from "react";

type CameraState = {
  active: boolean;
  supported: boolean;
  isStarting: boolean;
  error: string | null;
};

export function useCameraCapture() {
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [state, setState] = useState<CameraState>({
    active: false,
    supported:
      typeof navigator !== "undefined" &&
      Boolean(navigator.mediaDevices?.getUserMedia),
    isStarting: false,
    error: null,
  });

  function stop() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    setState((current) => ({
      ...current,
      active: false,
      isStarting: false,
    }));
  }

  async function start() {
    if (!state.supported) {
      setState((current) => ({
        ...current,
        error: "Este navegador no expone `getUserMedia`.",
      }));

      return;
    }

    stop();

    setState((current) => ({
      ...current,
      isStarting: true,
      error: null,
    }));

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setState((current) => ({
        ...current,
        active: true,
        isStarting: false,
        error: null,
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        active: false,
        isStarting: false,
        error:
          error instanceof Error
            ? error.message
            : "No fue posible acceder a la cámara.",
      }));
    }
  }

  async function capture() {
    if (!videoRef.current) {
      return null;
    }

    const video = videoRef.current;
    const vw = video.videoWidth || 224;
    const vh = video.videoHeight || 224;

    // The silhouette oval is rendered at 88% of the container height.
    // Its SVG viewBox is 200×240, so width = height * (200/240).
    // We compute the oval's bounding box in video-pixel space and crop to it.
    const ovalH = vh * 0.88;
    const ovalW = ovalH * (200 / 240);
    const sx = (vw - ovalW) / 2;
    const sy = (vh - ovalH) / 2;

    const OUTPUT = 224;
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;

    const context = canvas.getContext("2d");

    if (!context) {
      setState((current) => ({
        ...current,
        error: "No fue posible generar un frame de la cámara.",
      }));

      return null;
    }

    // Crop the oval bounding box and scale to 224×224.
    context.drawImage(video, sx, sy, ovalW, ovalH, 0, 0, OUTPUT, OUTPUT);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/png", 0.95);
    });

    if (!blob) {
      setState((current) => ({
        ...current,
        error: "La captura devolvió un blob vacío.",
      }));

      return null;
    }

    return new File([blob], `capture-${Date.now()}.png`, {
      type: "image/png",
    });
  }

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return {
    ...state,
    videoRef,
    start,
    stop,
    capture,
  };
}
