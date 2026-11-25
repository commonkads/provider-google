# Design — @commonkads/provider-google

## 1. Component Overview

| File | Export | Engine Interface |
|------|--------|-----------------|
| `src/gemini.ts` | `GeminiTextInference`, `GeminiTextInferenceOptions` | `IInferenceProvider` |
| `src/index.ts` | `registerGoogleProviders`, `register`, `GeminiProviderOptions` | — |

## 2. Interface Implementation

`GeminiTextInference implements IInferenceProvider`

The `infer(prompt, options?)` method:
1. Builds a content array with an optional system instruction and a user message
2. Calls `this.client.models.generateContent` with `thinkingConfig.thinkingBudget` set to `-1` (automatic) or `0` (disabled)
3. Returns `response.text`

## 3. Options Schema

```ts
interface GeminiTextInferenceOptions {
  apiKey?: string;
  maxOutputTokens?: number;  // default 8192
  thinking?: boolean;         // default true
  client?: GoogleGenAI;       // injectable for testing
}
```

## 4. Registry Wiring

```ts
registerGoogleProviders();
// Registers: registerProvider('gemini', (opts) => new GeminiTextInference(opts.model, { ... }))

const inference = buildInference({ type: 'gemini', model: 'gemini-2.0-flash' });
```
