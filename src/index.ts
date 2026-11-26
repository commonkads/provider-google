import { registerProvider } from "@commonkads/engine";
import { GeminiTextInference } from "./gemini.js";

export { GeminiTextInference };
export type { GeminiTextInferenceOptions } from "./gemini.js";

export interface GeminiProviderOptions {
  type: "gemini";
  model?: string;
  apiKey?: string;
  thinking?: boolean;
}

export function registerGoogleProviders(): void {
  registerProvider("gemini", (opts) => {
    const o = opts as unknown as GeminiProviderOptions;
    return new GeminiTextInference(o.model, {
      apiKey: o.apiKey,
      thinking: o.thinking ?? true,
    });
  });
}

export { registerGoogleProviders as register };
