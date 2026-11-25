import { GoogleGenAI } from "@google/genai";

import type {
  InferenceOptions,
  IInferenceProvider,
} from "@commonkads/engine";
import { createDiagnosticsLogger } from "@commonkads/engine";

const logger = createDiagnosticsLogger("providers:gemini");
const DEFAULT_MAX_OUTPUT_TOKENS = 8192;
/** `thinkingConfig.thinkingBudget`: -1 lets the model decide, 0 disables thinking. */
const THINKING_BUDGET_AUTOMATIC = -1;
const THINKING_BUDGET_DISABLED = 0;

export interface GeminiTextInferenceOptions {
  /** Falls back to the SDK's own GOOGLE_API_KEY / GEMINI_API_KEY env var lookup if omitted. */
  apiKey?: string;
  maxOutputTokens?: number;
  /** Lets the model decide how much to think (default true). Pass false to disable thinking. */
  thinking?: boolean;
  /** Injectable for testing; defaults to a real `GoogleGenAI` client. */
  client?: GoogleGenAI;
}

/** `IInferenceProvider` backed by the Gemini API. */
export class GeminiTextInference implements IInferenceProvider {
  private readonly client: GoogleGenAI;

  constructor(
    private readonly modelId: string,
    private readonly options: GeminiTextInferenceOptions = {},
  ) {
    this.client =
      options.client ??
      new GoogleGenAI(options.apiKey ? { apiKey: options.apiKey } : undefined);
  }

  async infer(prompt: string, options: InferenceOptions = {}): Promise<string> {
    logger.debug(
      `calling model=${this.modelId} promptLength=${prompt.length} explain=${Boolean(options.explain)}`,
    );

    const response = await this.client.models.generateContent({
      model: this.modelId,
      contents: prompt,
      config: {
        systemInstruction: options.systemPrompt,
        maxOutputTokens:
          this.options.maxOutputTokens ?? DEFAULT_MAX_OUTPUT_TOKENS,
        thinkingConfig: {
          thinkingBudget:
            (this.options.thinking ?? true)
              ? THINKING_BUDGET_AUTOMATIC
              : THINKING_BUDGET_DISABLED,
        },
      },
    });

    return response.text ?? "";
  }
}
