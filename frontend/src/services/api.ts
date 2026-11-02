import type { StudyMaterialResponse } from "../types/study";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export async function generateFromText(text: string): Promise<StudyMaterialResponse> {
  const response = await fetch(`${API_BASE_URL}/api/study/generate-from-text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Unknown server error" }));
    throw new ApiError(response.status, errorData.detail || "Failed to generate study materials");
  }

  return response.json();
}

export async function generateFromFile(file: File): Promise<StudyMaterialResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/study/generate-from-file`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Unknown server error" }));
    throw new ApiError(response.status, errorData.detail || "Failed to process file and generate materials");
  }

  return response.json();
}

export async function checkBackendHealth(): Promise<{ status: string; provider: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error("Backend service is currently unreachable");
  }
  return response.json();
}
