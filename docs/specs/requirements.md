# Requirements — @commonkads/provider-google

## Overview

Google Gemini provider implementation for the [CommonKADS engine](https://github.com/commonkads/engine). Provides `IInferenceProvider` backed by the Gemini API.

## REQ-1 — GeminiTextInference

Implements `IInferenceProvider`. Constructor accepts `modelId: string` and `GeminiTextInferenceOptions`.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | — | Gemini API key; falls back to `GOOGLE_API_KEY` / `GEMINI_API_KEY` env var |
| `maxOutputTokens` | `number` | `8192` | Maximum output tokens |
| `thinking` | `boolean` | `true` | Enable adaptive thinking (`thinkingBudget: -1`); `false` disables it (`thinkingBudget: 0`) |
| `client` | `GoogleGenAI` | — | Injectable for testing |

`infer()` returns `response.text` from the Gemini SDK.

## REQ-2 — Registry Integration

`registerGoogleProviders()` registers a builder for type `"gemini"`. The `register` named export is an alias. `GeminiProviderOptions` (`{ type: "gemini"; model; apiKey?; thinking? }`) is the config shape.

## REQ-3 — Credentials

Pass `apiKey` to the constructor, or set `GOOGLE_API_KEY` or `GEMINI_API_KEY` in the environment.

## Out of Scope

- Multimodal inputs (images, audio, video)
- Embedding generation
- Streaming responses
