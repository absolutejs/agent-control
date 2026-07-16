import { defineManifest } from "@absolutejs/manifest";
import { Type } from "@sinclair/typebox";
export const manifest = defineManifest<Record<string, never>>()({
  contract: 2,
  identity: {
    accent: "#dc2626",
    category: "security",
    description:
      "Authenticated operator API for agent inventory, durable kill switches, source revocation, restoration, and leased idempotent operations.",
    docsUrl: "https://github.com/absolutejs/agent-control",
    name: "@absolutejs/agent-control",
    tagline: "See and stop every capability an agent holds.",
  },
  settings: Type.Object({}),
  wiring: [],
});
