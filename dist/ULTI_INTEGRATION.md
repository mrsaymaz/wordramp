# Wordramp · Ulti points and the English League

Ulti points live only in Mr. Saymaz's English League (the tally system). Arena
wins add points to the student's (grade, team) pool in the League's Battle
Arena. The League decides every point value and limit; Wordramp only decides
which wins it claims. This game's League id is **`wordramp`**.

The earlier browser-only team points (a local ledger with a 40-point daily cap,
72-hour receipts and an export file) are retired. Old saves drop that ledger
on load; its receipts are still read once so past first places keep their
arena unlocks. Nothing from the old ledger is sent anywhere.

Wordramp was previously named Wordrift and, before that, Wordshift Rally.
`window.WORDRIFT` and `window.WORDSHIFT` remain aliases of `window.WORDRAMP`.

## Which wins are claimed

- Teams: `slytherin`, `hufflepuff`, `gryffindor`, `ravenclaw`. The team is the
  one selected when the race starts; the grade comes from the race's unit.
- Only a completed arena in **first place** is claimed, and only when enough
  tasks were answered right first time:
  **Relaxed: at least 60%** (8 of 12, 9 of 14 or 10 of 16 tasks).
  **Challenge: 2 or more stars**, which means at least 75%.
- Second/third place, wins below that accuracy, unfinished races, breakdowns
  and review laps are never claimed. A first place below the accuracy rule
  says why on the result screen.
- Stars, fuel, mastery and arena unlocks are separate from Ulti points and are
  saved in the browser as before.

## Configuration

`config.js` sets
`window.WORDRAMP_CONFIG = { ultiApi: 'https://mrsaymaz.netlify.app/api/ulti' }`.
With `ultiApi: ''` the copy is practice-only: no League button, no team points
on the garage cards, no Ulti messages and no network requests. If `config.js`
is missing, the same League URL is used.

## Requests

- **Start:** when a race begins (not a review lap), the game sends
  `{action:'start', game:'wordramp', grade, team, arena, pace, unit, device}`.
  `arena` is 0–2 (Sunlit, Coastal, Stormcrest), `pace` is `relaxed` or
  `challenge`, and `unit` is the lesson id (for example `g5u1`). The ticket is
  kept with the run in this browser. If the device is offline at the start
  line, it asks again at each task checkpoint.
- **Claim:** `{action:'claim', ticket, device}` is sent only after a claimed
  win (above). The game never sends a points value and holds no key.
  - A network failure, a 5xx reply or `retry: true` keeps the ticket in an
    outbox, which is resent on the next launch or win. Outbox items are
    dropped after 47 hours.
  - A 400 refusal (`too-fast`, `expired` or any other) is final.
- **Pools:** `{action:'pools', grade}` on launch and when the League panel
  opens. The last reply (settings and pools) is cached in this browser.
- `device` is a random 24-character id made once and kept in localStorage.

## What students see

- **Garage team cards:** each card shows its team's live League points for the
  student's grade (last known values, hidden until the League has answered).
- **LEAGUE · GRADE n** button (also in the Race Journal): the four team pools
  for the grade: live points from entries within the League's `hours`, out of
  `capacity`, and strength
  `1 + (maxStrength − 1) × √(min(points, capacity) / capacity)`. The rules
  text is built only from the League's settings. If the League has not
  switched `wordramp` on, the panel says so.
- **Result screen:** "+N Ulti for Grade g Team!", or a message for
  `device-limit`, `team-limit`, `off`, `too-fast`, `expired`, a queued win
  (offline) or a race that never got a ticket.

`window.WORDRAMP.ulti` exposes `enabled` and `snapshot(grade)` (the cached
League pools); there is no local points record or export.

## The League line

For the `games` section of the ULTI block in the Apps Script:

```
wordramp: { points: { relaxed: [2, 4, 6], challenge: [5, 7, 9] }, deviceDailyWins: 6, minSeconds: 180 },
```

Arena order: 0 Sunlit Boulevard, 1 Coastal Overpass, 2 Stormcrest Expressway.
The fastest honest Sunlit win (perfect answers, constant Nitro) takes about 218
seconds from the start line, so `minSeconds: 180` leaves a safe margin.
