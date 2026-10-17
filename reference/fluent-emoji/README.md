# Picture signs · Fluent Emoji (3D)

`word-emoji.json` is the reviewed list of English words that get a picture,
with the confusable groups. `python3 scripts/build-emoji-bank.py` turns it into
`public/emoji-bank.js` and keeps `public/emoji/` to exactly the pictures in
use. Pass `--assets <folder>` with the `assets` folder of the npm package
`@lobehub/fluent-emoji-3d` (MIT; Microsoft's Fluent Emoji as 256 px WebP files)
when adding a new word.

## Review rules

- A word gets a picture only if one Fluent picture clearly means it. Left out:
  abstract words, ambiguous ones such as mouse (animal or computer), pepper
  (black pepper here, but the emoji is a bell pepper) and bat, and
  near-duplicates (bin looked like basket, sea like wave, hiking boots like
  boots).
- Confusable groups (happy/excited/calm, tram/train, boat/ferry/kayak, pasta/
  noodles, doctor/scientist, …) and words sharing a picture (jeans/trousers)
  are never offered as each other's wrong answers.
- 226 words and 220 pictures, about 1 MB in all, reviewed on a labelled
  contact sheet.

## How they play

A translation card becomes a picture sign only when its word and at least two
of its reviewed wrong answers have clearly different pictures, so exactly one
option can match. Answers stay English words: scoring, reviews, results and
saved progress are unchanged.

| Slot | Mode | Where |
| --- | --- | --- |
| Second traffic light (task 5) | Picture → word: the picture is the clue, words on the lanes | Every arena, all grades |
| Fourth traffic light (task 13) | Word → picture: the word is the clue, pictures on the lanes | Arenas 2–3, Grades 5–6 |
| Final route fork (task 15) | Word → picture | Arena 3, all grades |

Those slots prefer a pictured card from the top of the shuffled draw without
crowding out unpictured ones. That gives 0.6–0.8 picture signs per race in
the first two arenas and 1.4–2.2 in Stormcrest, slightly more in Grades 5–6. Card selection uses its own random
stream, so pictures and language edits never change traffic, obstacles or
rivals for a given course.
