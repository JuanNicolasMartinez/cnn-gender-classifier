"use client";

import { useEffect, useState } from "react";

import { fetchModelMetadata } from "@/lib/api";
import type { ModelMetadata } from "@/lib/types";

type MetadataState = {
  metadata: ModelMetadata | null;
  error: string | null;
  isLoading: boolean;
};

const initialState: MetadataState = {
  metadata: null,
  error: null,
  isLoading: true,
};

export function useModelMetadata() {
  const [state, setState] = useState<MetadataState>(initialState);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMetadata() {
      try {
        const metadata = await fetchModelMetadata(controller.signal);

        setState({
          metadata,
          error: null,
          isLoading: false,
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          metadata: null,
          error:
            error instanceof Error
              ? error.message
              : "No fue posible cargar la metadata del backend.",
          isLoading: false,
        });
      }
    }

    void loadMetadata();

    return () => controller.abort();
  }, []);

  return state;
}
