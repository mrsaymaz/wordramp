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
- A completed arena in **first place** earns points for the team selected at
  the start of that race, when enough tasks were answered right first time:
  **Relaxed: at least 60%** (8 of 12, 9 of 14 or 10 of 16 tasks).
  **Challenge: 2 or more stars**, which means at least 75%.

  | Mode | Sunlit Boulevard | Coastal Overpass | Stormcrest Expressway |
  | --- | ---: | ---: | ---: |
  | Relaxed | 2 | 4 | 6 |
  | Challenge | 5 | 7 | 9 |

- **Daily cap:** each browser profile earns at most **40 points per local
  calendar day**. The win that crosses the cap pays only the remainder (for
  example, 4 of 9), and later wins that day pay nothing. The count includes
  rewards that have already expired, and resets at local midnight.
- Second/third place, wins below that accuracy, unfinished races and review laps
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
| `rules` | `points` (table above), `minRelaxedAccuracy` (0.6), `minChallengeStars` (2), `dailyCap` (40) and `earnedToday` |
| `totals` | Active total per team, calculated at export time |
| `receipts` | Only rewards with `earnedAt <= now < expiresAt` |

Each receipt contains `schemaVersion`, `sourceGame`, `eventId`, `runId`,
`driverId`, `teamId`, `points`, `earnedAt`, `expiresAt`, `grade`, `unitId`,
`difficulty` and `arenaId`. Version 2 receipts add `arenaIndex` (0–2), `stars` and `accuracy` (first-try share, two decimals). A
receiving service should accept a version 2 receipt only when `points` is a
whole number from 1 to the table value for its `difficulty` and `arenaIndex`,
and should apply the daily cap itself rather than trust the browser. All timestamps are UTC epoch milliseconds.
Expired rewards remain in the private browser ledger for deduplication;
they never appear in the active export or team balances.

## English League connection (live)

Arena wins also count in Mr. Saymaz's English League (the tally system). This
game's id is **`wordramp`**. `config.js` sets
`window.WORDRAMP_CONFIG = { ultiApi: 'https://mrsaymaz.netlify.app/api/ulti' }`;
with `ultiApi: ''` the copy is practice-only: no League panel, no League
messages and no network requests. If `config.js` is missing, the same URL is
used.

- **Start:** when a race begins (not a review lap), the game sends
  `{action:'start', game:'wordramp', grade, team, arena, pace, unit, device}`.
  `arena` is 0–2 (Sunlit, Coastal, Stormcrest), `pace` is `relaxed` or
  `challenge`, and `unit` is the lesson id (for example `g5u1`). The ticket is
  kept with the run in this browser. If the device is offline at the start
  line, it asks again at each task checkpoint.
- **Claim:** `{action:'claim', ticket, device}` is sent only after a real
  first place that meets this game's accuracy rule (Relaxed 60%, Challenge
  2 stars). The League decides the points; the game never sends a points
  value and holds no key.
  - A network failure, a 5xx reply or `retry: true` keeps the ticket in an
    outbox, which is resent on the next launch or win. Outbox items are
    dropped after 47 hours.
  - A 400 refusal (`too-fast`, `expired` or any other) is final.
- **Panel:** the garage's **LEAGUE · GRADE n** button shows the four team
  pools for the student's grade: live points from entries within the League's
  `hours`, out of `capacity`, and strength
  `1 + (maxStrength − 1) × √(min(points, capacity) / capacity)`. The rules text
  is built only from the League's settings. If the League has not switched
  `wordramp` on, the panel says so.
- **Kept separately:** the local team points described above remain as they
  were. They are not sent anywhere.

The League line for the Apps Script `games` section:

```
wordramp: { points: { relaxed: [2, 4, 6], challenge: [5, 7, 9] }, deviceDailyWins: 6, minSeconds: 180 },
```

Arena order: 0 Sunlit Boulevard, 1 Coastal Overpass, 2 Stormcrest Expressway.
The fastest honest Sunlit win (perfect answers, constant Nitro) takes about 218
seconds from the start line, so `minSeconds: 180` leaves a safe margin.

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
