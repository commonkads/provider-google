import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { GoogleGenAI } from "@google/genai";

import { GeminiTextInference } from "./gemini.js";

let dir: string;

before(() => {
  dir = mkdtempSync(join(tmpdir(), "ck-gemini-test-"));
});

after(() => {
  rmSync(dir, { recursive: true, force: true });
});

function stubClient(): GoogleGenAI {
  return {
    models: {
      generateContent: async () => ({ text: "ok" }),
    },
  } as unknown as GoogleGenAI;
}

describe("GeminiTextInference config resolution", () => {
  it("resolves modelId from explicit arg", () => {
    assert.doesNotThrow(
      () =>
        new GeminiTextInference("gemini-2.0-flash", { client: stubClient() }),
    );
  });

  it("resolves modelId from config file", () => {
    const cfg = join(dir, "google.yml");
    writeFileSync(cfg, "modelId: gemini-2.0-flash\n");
    assert.doesNotThrow(
      () =>
        new GeminiTextInference(undefined, {
          configFile: cfg,
          client: stubClient(),
        }),
    );
  });

  it("throws when modelId is absent and config file has no model", () => {
    const cfg = join(dir, "no-model.yml");
    writeFileSync(cfg, "apiKey: gk-test\n");
    assert.throws(
      () =>
        new GeminiTextInference(undefined, {
          configFile: cfg,
          client: stubClient(),
        }),
      /modelId is required/,
    );
  });

  it("throws when explicit configFile is not found", () => {
    assert.throws(
      () =>
        new GeminiTextInference(undefined, {
          configFile: join(dir, "ghost.yml"),
        }),
      /Config file not found/,
    );
  });

  it("env var GOOGLE_API_KEY takes priority over config file", () => {
    const cfg = join(dir, "envvar.yml");
    writeFileSync(cfg, "modelId: gemini-2.0-flash\napiKey: from-file\n");
    const prev = process.env["GOOGLE_API_KEY"];
    process.env["GOOGLE_API_KEY"] = "from-env";
    try {
      assert.doesNotThrow(
        () =>
          new GeminiTextInference(undefined, {
            configFile: cfg,
            client: stubClient(),
          }),
      );
    } finally {
      if (prev === undefined) delete process.env["GOOGLE_API_KEY"];
      else process.env["GOOGLE_API_KEY"] = prev;
    }
  });
});
