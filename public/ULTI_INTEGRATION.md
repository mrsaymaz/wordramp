# Wordramp · Ulti points contract v2

Wordramp was previously named Wordrift and, before that, Wordshift Rally. The
existing browser save key,
`sourceGame` and receipt IDs remain stable so the rename preserves earned points
and deduplication. `window.WORDRIFT` and `window.WORDSHIFT` remain aliases of
`window.WORDRAMP`.

The receiving game will be a separate Netlify deployment. Its address and API
will be supplied later. This version stores rewards in the current browser and
can export a record. It does not send points to another deployment yet.

## Current rules (v2)

- Teams: `slytherin`, `hufflepuff`, `gryffindor`, `ravenclaw`.
- A completed arena in **first place with 2 or more stars** earns points for
  the team selected at the start of that race. Two stars means at least 75%
  of tasks answered right first time.

  | Mode | Sunlit Boulevard | Coastal Overpass | Stormcrest Expressway |
  | --- | ---: | ---: | ---: |
  | Relaxed | 2 | 4 | 6 |
  | Challenge | 5 | 7 | 9 |

- **Daily cap:** each browser profile earns at most **40 points per local
  calendar day**. The win that crosses the cap pays only the remainder (for
  example, 4 of 9), and later wins that day pay nothing. The count includes
  rewards that have already expired, and resets at local midnight.
- Second/third place, wins below 2 stars, unfinished races and review laps
  earn nothing. The result screen says why a first place earned nothing.
- Each race has a unique `runId`; its `eventId` is `wordshift-rally:<runId>`.
  The saved ledger prevents duplicate awards, including after expiry.
- Every reward expires exactly **72 hours after `earnedAt`**. Later wins,
  team changes and exports do not renew earlier rewards.
- Stars, fuel and mastery are separate from Ulti points. The two modes are
  `relaxed` and `challenge`. Former `standard` saves migrate to Challenge,
  keeping the highest star count for each arena.
- **Version 1 receipts** (10 points per first place, before these rules)
  remain valid until their own expiry, so no earned points are lost. New
  awards are version 2.

## Export and local API

Open **Team points → Export points record** in the garage, or use:

```js
const snapshot = window.WORDRAMP.ulti.snapshot(); // detached object
const json = window.WORDRAMP.ulti.export();       // JSON string
```

Payload fields:

| Field | Meaning |
| --- | --- |
| `schemaVersion` | `2` |
| `sourceGame` | `wordshift-rally` |
| `driverId` | Anonymous browser profile ID; not a signed student account |
| `generatedAt` | Export time, milliseconds since Unix epoch |
| `validityHours` | `72` |
| `rules` | `points` (table above), `minStars` (2), `dailyCap` (40) and `earnedToday` |
| `totals` | Active total per team, calculated at export time |
| `receipts` | Only rewards with `earnedAt <= now < expiresAt` |

Each receipt contains `schemaVersion`, `sourceGame`, `eventId`, `runId`,
`driverId`, `teamId`, `points`, `earnedAt`, `expiresAt`, `grade`, `unitId`,
`difficulty` and `arenaId`. Version 2 receipts add `arenaIndex` (0–2) and `stars`. A
receiving service should accept a version 2 receipt only when `points` is a
whole number from 1 to the table value for its `difficulty` and `arenaIndex`,
and should apply the daily cap itself rather than trust the browser. All timestamps are UTC epoch milliseconds.
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
