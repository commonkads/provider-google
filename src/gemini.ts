import { GoogleGenAI } from "@google/genai";

import type {
  InferenceOptions,
  IInferenceProvider,
  ProviderFileConfig,
} from "@commonkads/engine";
import {
  createDiagnosticsLogger,
  loadProviderConfig,
} from "@commonkads/engine";

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
  /** Path to a provider config file; defaults to ~/.commonkads/google.yml. */
  configFile?: string;
  /** Injectable for testing; defaults to a real `GoogleGenAI` client. */
  client?: GoogleGenAI;
}

/** `IInferenceProvider` backed by the Gemini API. */
export class GeminiTextInference implements IInferenceProvider {
  private readonly client: GoogleGenAI;
  private readonly modelId: string;

  constructor(
    modelId?: string,
    private readonly options: GeminiTextInferenceOptions = {},
  ) {
    const fileConfig = loadProviderConfig<ProviderFileConfig>(
      "google",
      options.configFile,
    );

    let resolvedModel: string;
    let modelSource: string;
    if (modelId !== undefined) {
      resolvedModel = modelId;
      modelSource = "explicit-arg";
    } else if (fileConfig.modelId !== undefined) {
      resolvedModel = fileConfig.modelId;
      modelSource = "config-file";
    } else {
      throw new Error(
        "modelId is required: pass it or set modelId in ~/.commonkads/providers/google.yml",
      );
    }
    this.modelId = resolvedModel;

    const resolvedApiKey =
      options.apiKey ??
      process.env["GOOGLE_API_KEY"] ??
      process.env["GEMINI_API_KEY"] ??
      fileConfig.apiKey;
    const apiKeySource =
      options.apiKey !== undefined
        ? "explicit-arg"
        : process.env["GOOGLE_API_KEY"] !== undefined ||
            process.env["GEMINI_API_KEY"] !== undefined
          ? "env-var"
          : fileConfig.apiKey !== undefined
            ? "config-file"
            : "sdk-default";

    logger.info(`config: model="${resolvedModel}" source=${modelSource}`);
    if (resolvedApiKey !== undefined) {
      logger.info(`config: apiKey=*** source=${apiKeySource}`);
    } else {
      logger.info(`config: apiKey=<none> source=${apiKeySource}`);
    }

    this.client =
      options.client ??
      new GoogleGenAI(resolvedApiKey ? { apiKey: resolvedApiKey } : undefined);
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
