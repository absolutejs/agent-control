import { expect, test } from "bun:test";
import {
  createAgentControlPlane,
  createMemoryAgentControlStore,
} from "@absolutejs/agency";
import { createAgentControlHandler, createMemoryOperationStore } from "../src";

test("authenticates, kills first, revokes sources, and replays idempotently", async () => {
  const store = createMemoryAgentControlStore();
  let sawKilled = false;
  let revocations = 0;
  const control = createAgentControlPlane({
    store,
    sources: [
      {
        name: "tasks",
        inventory: async () => [],
        revoke: async (agentId) => {
          sawKilled = (await store.getKillSwitch(agentId)) !== undefined;
          revocations += 1;
          return 2;
        },
      },
    ],
  });
  const handler = createAgentControlHandler({
    authorize: () => ({
      id: "operator",
      scopes: ["agents:read", "agents:revoke"],
    }),
    control,
    operations: createMemoryOperationStore(),
  });
  const input = { operationId: "op-1", reason: "incident" };
  const call = () =>
    handler(
      new Request("https://example.test/agent-control/agents/agent-1/revoke", {
        body: JSON.stringify(input),
        method: "POST",
      }),
    );
  expect((await call())?.status).toBe(200);
  expect(sawKilled).toBe(true);
  expect(revocations).toBe(1);
  expect((await call())?.status).toBe(200);
  expect(revocations).toBe(1);
  const inventory = await handler(
    new Request("https://example.test/agent-control/agents/agent-1"),
  );
  expect((await inventory?.json()).killSwitch.reason).toBe("incident");
});
