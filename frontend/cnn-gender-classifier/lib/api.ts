import type {
  ApiHealthResponse,
  ModelMetadata,
  PredictionResponse,
} from "@/lib/types";

const FALLBACK_API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

async function parseError(response: Response) {
  try {
    const payload = (await response.json()) as { detail?: string };
    return payload.detail ?? "La API devolvió un error inesperado.";
  } catch {
    return "No fue posible leer el detalle del error de la API.";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${FALLBACK_API_URL}${path}`, init);

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as T;
}

export async function fetchModelMetadata(signal?: AbortSignal) {
  return request<ModelMetadata>("/model-metadata", {
    cache: "no-store",
    signal,
  });
}

export async function fetchApiHealth(signal?: AbortSignal) {
  return request<ApiHealthResponse>("/health", {
    cache: "no-store",
    signal,
  });
}

export async function predictImage({
  file,
  includeXai,
  signal,
}: {
  file: File;
  includeXai: boolean;
  signal?: AbortSignal;
}) {
  const formData = new FormData();
  formData.append("file", file);

  return request<PredictionResponse>(`/predict?include_xai=${includeXai}`, {
    method: "POST",
    body: formData,
    signal,
  });
}
