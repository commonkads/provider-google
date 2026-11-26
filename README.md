# @commonkads/provider-google

> **Disclaimer:** This project is an independent open-source software implementation inspired by the CommonKADS knowledge engineering methodology (Schreiber et al.). It is not affiliated with or endorsed by the original methodology authors or any third-party trademark holders.

Google Gemini provider implementation for the [CommonKADS engine](https://github.com/commonkads/engine).

## Provided implementations

| Export | Interface | Description |
|--------|-----------|-------------|
| `GeminiTextInference` | `IInferenceProvider` | Google Gemini API |

## Usage

### Via the registry (recommended)

```ts
import { registerGoogleProviders } from '@commonkads/provider-google';
import { buildInference } from '@commonkads/engine';

// Call once at startup, before any buildInference calls.
registerGoogleProviders();

const inference = buildInference({
  type: 'gemini',
  model: 'gemini-2.5-flash',
  apiKey: process.env.GOOGLE_API_KEY,
});
```

### Direct construction

```ts
import { GeminiTextInference } from '@commonkads/provider-google';

const inference = new GeminiTextInference('gemini-2.5-flash', {
  apiKey: process.env.GOOGLE_API_KEY,
  thinking: true,
});
```

## Third-party extension pattern

`registerGoogleProviders()` is the official extension point for wiring providers into
the engine without forking it. See `@commonkads/provider-aws` for the full pattern
documentation.

## Credentials

Set `GOOGLE_API_KEY` or `GEMINI_API_KEY` in the environment, or pass `apiKey` directly
to the constructor. The SDK prefers `GOOGLE_API_KEY` when both are set.
