# @absolutejs/agent-control

Authenticated web-standard operator API over `@absolutejs/agency`'s control
plane. It inventories every registered source, activates the durable kill switch
before cleanup, reports partial source failures, restores deliberately, and uses
leased idempotency records so operator retries cannot change the requested input.

Scopes are `agents:read`, `agents:revoke`, and `agents:restore`. Mutations require
an `operationId` and `reason`; PostgreSQL operations can be safely reclaimed
after a crashed operator process's lease expires.
