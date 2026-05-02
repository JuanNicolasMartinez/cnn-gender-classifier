"use client";

import { useEffect, useRef, useState } from "react";

import { predictImage } from "@/lib/api";
import type { PredictionResponse } from "@/lib/types";

type PredictionStatus = "idle" | "loading" | "success" | "error";

type PredictionState = {
  status: PredictionStatus;
  result: PredictionResponse | null;
  error: string | null;
  lastFileName: string | null;
};

const DEFAULT_ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

const initialState: PredictionState = {
  status: "idle",
  result: null,
  error: null,
  lastFileName: null,
};

export function usePrediction() {
  const controllerRef = useRef<AbortController | null>(null);
  const [state, setState] = useState<PredictionState>(initialState);

  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  function reset() {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setState(initialState);
  }

  async function predict(
    file: File,
    includeXai: boolean,
    acceptedMimeTypes = DEFAULT_ACCEPTED_MIME_TYPES,
  ) {
    if (!acceptedMimeTypes.includes(file.type)) {
      setState({
        status: "error",
        result: null,
        error: "Formato inválido. Usa JPG, PNG o WEBP.",
        lastFileName: file.name,
      });

      return;
    }

    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    setState({
      status: "loading",
      result: null,
      error: null,
      lastFileName: file.name,
    });

    try {
      const result = await predictImage({
        file,
        includeXai,
        signal: controller.signal,
      });

      if (controller.signal.aborted) {
        return;
      }

      setState({
        status: "success",
        result,
        error: null,
        lastFileName: file.name,
      });
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      setState({
        status: "error",
        result: null,
        error:
          error instanceof Error
            ? error.message
            : "No fue posible completar la predicción.",
        lastFileName: file.name,
      });
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
    }
  }

  return {
    ...state,
    isLoading: state.status === "loading",
    predict,
    reset,
  };
}
