"use client";

import { useEffect, useState } from "react";

import { fetchApiHealth } from "@/lib/api";
import type { ApiHealthResponse } from "@/lib/types";

type ApiHealthState = {
  health: ApiHealthResponse | null;
  error: string | null;
  isLoading: boolean;
};

const initialState: ApiHealthState = {
  health: null,
  error: null,
  isLoading: true,
};

const HEALTH_POLL_INTERVAL_MS = 30_000;

export function useApiHealth() {
  const [state, setState] = useState<ApiHealthState>(initialState);

  useEffect(() => {
    let isActive = true;
    let activeController: AbortController | null = null;

    async function loadHealth() {
      activeController?.abort();

      const controller = new AbortController();
      activeController = controller;

      try {
        const health = await fetchApiHealth(controller.signal);

        if (!isActive || controller.signal.aborted) {
          return;
        }

        setState({
          health,
          error: null,
          isLoading: false,
        });
      } catch (error) {
        if (!isActive || controller.signal.aborted) {
          return;
        }

        setState({
          health: null,
          error:
            error instanceof Error
              ? error.message
              : "No fue posible verificar el estado de la API.",
          isLoading: false,
        });
      }
    }

    void loadHealth();

    const intervalId = window.setInterval(() => {
      void loadHealth();
    }, HEALTH_POLL_INTERVAL_MS);

    return () => {
      isActive = false;
      activeController?.abort();
      window.clearInterval(intervalId);
    };
  }, []);

  return state;
}
