# Wordrift · Ulti points contract v1

Wordrift was previously named Wordshift Rally. The existing browser save key,
`sourceGame` and receipt IDs remain stable so the rename preserves earned points
and deduplication. `window.WORDSHIFT` remains an alias of `window.WORDRIFT`.

The receiving game will be a separate Netlify deployment. Its address and API
will be supplied later. This version stores rewards in the current browser and
can export a record. It does not send points to another deployment yet.

## Current rules

- Teams: `slytherin`, `hufflepuff`, `gryffindor`, `ravenclaw`.
- A completed arena in first place earns **10 Ulti points** for the team
  selected at the start of that race, on either difficulty.
- Second/third place, unfinished races and review laps earn no Ulti points.
- Each race has a unique `runId`; its `eventId` is `wordshift-rally:<runId>`.
  The saved ledger prevents duplicate awards, including after expiry.
- Every reward expires exactly **72 hours after `earnedAt`**. Later wins,
  team changes and exports do not renew earlier rewards.
- Stars, fuel and mastery are separate from Ulti points. The two modes are
  `relaxed` and `challenge`. Former `standard` saves migrate to Challenge,
  keeping the highest star count for each arena.

## Export and local API

Open **Team points → Export points record** in the garage, or use:

```js
const snapshot = window.WORDRIFT.ulti.snapshot(); // detached object
const json = window.WORDRIFT.ulti.export();       // JSON string
```

Payload fields:

| Field | Meaning |
| --- | --- |
| `schemaVersion` | `1` |
| `sourceGame` | `wordshift-rally` |
| `driverId` | Anonymous browser profile ID; not a signed student account |
| `generatedAt` | Export time, milliseconds since Unix epoch |
| `validityHours` | `72` |
| `totals` | Active total per team, calculated at export time |
| `receipts` | Only rewards with `earnedAt <= now < expiresAt` |

Each receipt contains `schemaVersion`, `sourceGame`, `eventId`, `runId`,
`driverId`, `teamId`, `points`, `earnedAt`, `expiresAt`, `grade`, `unitId`,
`difficulty` and `arenaId`. All timestamps are UTC epoch milliseconds.
Expired rewards remain in the private browser ledger for deduplication;
they never appear in the active export or team balances.

## Connecting the later Netlify deployment

The receiving service should deduplicate by `eventId`, recompute team totals
from verified receipts, and enforce the original `expiresAt`. Reimporting a
record must neither double an award nor reset its three-day lifetime. Exports
are snapshots, not new awards. Do not sum an old snapshot and a new snapshot.

Separate deployments cannot read each other's localStorage. A production
connection needs a shared student/class identity and an authenticated API or
trusted server-side award service. The current browser receipts are unsigned
and user-editable; they are a prototype transfer format, not proof of a win.
Use server time for authoritative expiry and server-generated/validated awards
for a shared economy. Do not place signing keys or service credentials in this
static game. Configure exact allowed origins when the receiving URL is known.

No destination, credentials or transport assumptions are embedded in this build.
