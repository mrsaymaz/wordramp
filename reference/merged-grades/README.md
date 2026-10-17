# Merged grade files · Wordramp 0.24.0

`grade5.json` to `grade8.json` hold every lesson's complete language content
as the game uses it: the original lessons plus both reviewed grade-file
batches. Use them as the master copy for future editing or curriculum review.
Regenerate them with `python3 scripts/export-grade-files.py` after changing the
language bank; `npm run test:language` fails if they are out of date.

They follow the supplied grade-file layout (grade, cefr, units with
categories, descriptions, pictures, questions, completions, sentences and
translations), with IDs renumbered per unit in the same style (g5u1d1, ...).
Unit IDs and titles are the game's own (all 44 lessons). Items that were
reviewed for play appear in their reviewed form, such as reworded clues and
regrouped repairs. A few extra keys record how items are played:

| Key | Meaning |
| --- | --- |
| `subthemes` | Topics joined to this lesson from the grade files. |
| `categoryPairs` | The two categories that share each crossing. |
| `descriptions[].reviewClue` | The clue shown when a missed item returns. |
| `questions[].sign` | The reviewed road sign: answer, two wrong answers, review prompt. Questions without `sign` are source material only. |
| `sentences[].repair` | Played as a three-block road repair. `repairBlocks` / `repairTr` appear only when the played version differs. |
| `sentences[].grammar` | Grammar choices built from the sentence. |

Pictures and sentence completions are kept as source material; the game does
not play them.

| Grade | Lessons | Clues | Translations | Q&A signs | Grammar | Repairs | Category pairs |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 5 (A1) | 10 | 177 | 207 | 57 | 90 | 195 | 25 |
| 6 (A1+) | 10 | 175 | 197 | 60 | 90 | 198 | 25 |
| 7 (A2) | 12 | 212 | 234 | 71 | 108 | 237 | 33 |
| 8 (A2+) | 12 | 216 | 235 | 72 | 108 | 236 | 31 |
