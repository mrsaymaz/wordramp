# English League learning log · shared format v1

Every game connected to Mr. Saymaz's English League can send one **learning
record** per round: which English it asked, and how each answer went. The League
writes it to Google Sheets so Mr. Saymaz can see what a class, or a student,
keeps missing at home. Games ask different kinds of questions, so each answer
says **what English it tested** (`skill` + `target`), not how the game asks it.
A word missed on a Wordramp road sign and in another game's crossword adds up.

Wordramp sends it from version 0.30.0 (`learning-log.js`, `league.js`).

## When a game sends it

- Once per League round (one that got a start ticket), **won or lost**, when the
  round ends. Practice-only copies (`ultiApi: ''`) and rounds without a ticket
  (review laps, or offline at the start) send nothing.
- Only when the League's settings for that game say `learning: true` (see
  "League switch" below). Until then the game sends nothing.
- Sent before the win claim, with the round's own start ticket. A network
  failure keeps the record in a queue that is resent on the next launch or round;
  records older than 47 hours are dropped. A refusal (4xx) is final.

## The request

```
POST https://mrsaymaz.netlify.app/api/ulti
{ action: 'learn', game: 'wordramp', ticket, device, log }
```

`ticket` is the round's start ticket, so the League already knows the game,
grade, team, unit, arena, pace and (with "Who are you?") the student. A ticket
is logged once. `log`:

| Field | Meaning |
| --- | --- |
| `v` | format version, `1` |
| `unit` | lesson id, e.g. `g5u1` |
| `arena`, `pace` | as in the start ticket |
| `finished` | `true` if the round was completed (not a breakdown or timeout) |
| `place` | finishing position, or `null` |
| `seconds` | how long the round took |
| `first`, `total` | answers right first time, answers logged |
| `items` | at most 48 answers, below |

Each item:

| Field | Shared? | Meaning | Example |
| --- | --- | --- | --- |
| `item` | yes | fixed id, starting with the game | `wordramp:g5u1-ext26-g5u1-d5` |
| `skill` | yes | `vocabulary`, `grammar`, `sentence-order`, `reading`, `spelling` or `listening` | `vocabulary` |
| `target` | yes | the English point tested | `word:lab`, `grammar:<item>`, `sentence:<id>`, `reading:<id>` |
| `result` | yes | `first`, `retry`, `missed`, `timeout` or `skipped` | `missed` |
| `answer` | yes | the right answer (at most 80 characters) | `lab` |
| `wrong` | yes, when wrong | the wrong choice the student made | `canteen` |
| `tries` | optional | attempts, when more than one | `2` |
| `prompt` | optional | the question, for grammar and reading | `GRAMMAR: The coach ___ very helpful.` |
| `type` | game's own | how this game asked it | `light-description`, `bridge-blocks`, `crosswalk-sort` |
| `review` | optional | `true` when a review of an earlier miss | `true` |

Rules for every game: `word:` targets are the English word in lower case, so
the same word matches across games. Grammar and sentence targets use the game's
own item or sentence id. The League's "Targets" tab can group them into named
grammar points (e.g. "present simple: be") without changing any game. Only
answers chosen from the game's own options are sent: never free text the
student typed, never a points value.

## Wordramp's questions

| Wordramp task | `skill` | `target` | `wrong` |
| --- | --- | --- | --- |
| Green Light / Shortcut: translation, description, picture | `vocabulary` | `word:<answer>` | the sign the student drove into |
| Shortcut: grammar | `grammar` | `grammar:<item id>` | the form chosen |
| Green Light: question | `reading` | `reading:<item id>` | the answer chosen |
| Bridge Out (three blocks) | `sentence-order` | `sentence:<sentence id>` | the block placed too early (`retry` if fixed) |
| Crosswalk (sort each visitor) | `vocabulary` | `word:<word>` | the group it was sent to (`timeout` if left on the road) |
| Review signs | as the original item | as the original | as above, with `review: true` |

## League switch

In the Apps Script's ULTI `games` block, add `learning: true` to a game's line:

```
wordramp: { points: { relaxed: [2, 4, 6], challenge: [5, 7, 9] }, deviceDailyWins: 6, minSeconds: 180, learning: true },
```

Students see "Your answers help Mr. Saymaz plan your lessons." on the "Who are
you?" confirmation card, and a line in the rules, only while it is on.

## Privacy

The records are about children's learning, played on family devices. Keep the
sheet in the school's Google account, open only to the teacher; tell the school
and parents; clear named rows at the end of each school year. Use the data to
plan lessons, not for marks: a sibling may play under a name, and home play is
practice, not a test.
