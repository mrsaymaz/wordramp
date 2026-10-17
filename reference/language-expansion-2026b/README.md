# Grade-file expansion, second batch · Wordramp 0.24.0

`grade5-2.json` through `grade8-2.json` are unmodified copies of the supplied
files. Their SHA-256 hashes are recorded in `import-report.json`. The import
runs after the first batch (`../language-expansion-2026`) and only adds what
that batch and the original game do not already cover, so no existing task ID
or saved-progress key changes. Run `python3 scripts/expand-language-bank.py`
to rebuild both batches; a repeat run is byte-for-byte stable.

## Where the extra topics go

Unit numbers in these files are local to them; for example, the files' `g5u9`
is not the game's Grade 5 unit 9. Topics that match an existing lesson title
import into it directly. The others become sub-themes of the closest lesson in
the same grade:

| Grade | Source topic | Existing lesson | Connection |
| --- | --- | --- | --- |
| 5 | Feelings and Well-being (source 9) | 3 Personal Life | Feelings, health items and everyday needs |
| 5 | Everyday Jobs (source 10) | 9 Jobs and Workplaces | Jobs, workplaces and what people do there |
| 6 | Health and First Aid (source 9) | 10 Health and Well-being | Illness, first aid and care items |
| 6 | Sports and Fitness (source 10) | 10 Health and Well-being | Sport, exercise and safety equipment |
| 7 | Travel and Transport (source 12) | 12 Travel and Holidays | Tickets, transport and travel items |
| 8 | School Clubs and Learning (source 11) | 2 Teen Life | Clubs, subjects and study tools |
| 8 | Health and Well-being (source 12) | 2 Teen Life | Balanced routines, rest and well-being |

Grade 7 Food and Cooking matches its lesson directly. Together with Grade 5
Jobs and Workplaces and Grade 7 Travel and Holidays, three of the five lessons
the first batch could not cover now have imported material. Grade 8 Shopping
and Services and Animals and Pet Care still keep only their original content.

## What is playable

| Added road task | Count |
| --- | ---: |
| Definition clues | 252 |
| Vocabulary translation signs | 136 |
| Short Q&A signs (reviewed) | 128 |
| Grammar choices | 132 |
| Three-block repairs | 164 |
| Category pairs for crossings | 26 |

## Review and polish

- **Q&A signs:** `reviewed-questions.json` picks up to three questions per
  unit that have one right answer, with two plausible wrong answers and a
  fill-in review prompt. Personal questions ("When do you wake up?") stay
  source material. Grade 5 Family Life has none, and Television has two. Several
  signs practise question words (time, place, transport, frequency) and
  common errors ("taller than", "would like to", "I'd love to").
- **Definition clues:** all 252 were read. 22 were reworded: activities and
  sports now have activity clues ("The activity of moving across ice on
  special boots" → skating), chore verbs get a blank ("I clean the floor with
  a broom. I ___ it."), and a few clues that allowed another reading were
  tightened. Ten clues without another review route got a review prompt.
- **Repairs:** only the first four sentences per unit become road repairs.
  The other six repeat the same frames in every unit ("This is my
  favourite…", "… says … is …") and stay source material. Two were regrouped or
  their Turkish corrected.
- **Translations:** departure → kalkış, revise → tekrar etmek. Two words
  spelled the same in both languages (pilot, plan) are not used as signs.
  The first batch's "partner = eş" (spouse) is corrected to "çalışma
  arkadaşı" there too.
- **Category pairs:** a pair is added only when at least one of its
  categories is new to the lesson. Pairs that repeated the first batch's
  categories (six or more shared words) are skipped. Words shared within a
  pair are removed, so every crossing visitor belongs to exactly one side.
- **Not used in play:** pictures and sentence completions, as in the first
  batch.
