# Grade-file expansion · Wordrift 0.21.0

`grade5.json` through `grade8.json` are unmodified copies of the supplied files.
Their SHA-256 hashes are recorded in `import-report.json`. Original runtime
items, lesson IDs and titles are preserved. New task IDs include both the
destination unit ID and source unit ID, so sub-themes cannot collide.

Most source topics match their existing grade/unit directly. These extra
topics connect to existing lessons in their own grade:

| Grade | Source topic | Existing unit | Connection |
| --- | --- | --- | --- |
| 5 | Health and Feelings (source 9) | 3 Personal Life | Personal feelings, body parts and everyday needs |
| 5 | Fun and Games (source 10) | 10 At the Toy Shop | Toys, games and play equipment |
| 7 | Digital Life (source 11) | 5 Television | Screen media, viewing devices and digital tools |
| 7 | Shopping and Money (source 12) | 8 Public Buildings | Shops, banking, payments and local services |
| 8 | At School (source 11) | 2 Teen Life | School subjects, study materials and teen routines |
| 8 | Health and Well-being (source 12) | 2 Teen Life | Balanced routines, rest and well-being |

The source names Neighbourhood / City Life and Universe & Future map to the
equivalent existing Grade 5 lessons. Grade 6 Food Shopping and Prices maps to
Shopping and Money; Healthy Habits maps to Health and Well-being. These are
topic connections, not a claim that differently numbered curriculum editions
share identical official unit numbering.

The supplied files cover 39 of the 44 existing destinations after these
connections. The existing Grade 5 Jobs and Workplaces, Grade 7 Food and Cooking
and Travel and Holidays, and Grade 8 Shopping and Services and Animals and Pet
Care keep their existing content; no unrelated source material is assigned to
them just to increase the counts.

## What is playable

| Added road task | Count |
| --- | ---: |
| Vocabulary translation signs | 341 |
| Definition clues | 264 |
| Short Q&A signs | 132 |
| Grammar choices | 132 |
| Three-block repairs | 438 |
| Additional category pairs | 44 |

There are 1,307 additional playable signs/repairs. Each imported unit supplies
three explicitly reviewed Q&A signs from its nine source questions. All source
Q&As and sentence completions are retained for future curation, but the remaining
Q&As and unreviewed completion endings are not silently presented as playable
choices. `reviewed-questions.json` records concise answers, two incorrect
alternatives and a different review clue for each playable Q&A.

Every supplied sentence is considered for repair tasks. Exactly repeated
sentences are deduplicated. Four- and five-part source sentences are regrouped
into three grammatical blocks; selected long or awkward fragments are shortened
with a corresponding Turkish translation. `import-report.json` records these
adaptations. Original sentences remain in the source bank and reference files.

Category pairs rotate between the existing pair and supplied pairs during a
race, without mixing unrelated category titles. The two displayed word lists
are disjoint; their negative examples come from the opposite side. Translation
choices exclude duplicate labels, identical Turkish meanings and common English
aliases. Known ambiguous source definitions have explicitly reviewed options.

## Maintenance

Edit the source files or review tables in `scripts/expand-language-bank.py`,
then run the importer and `npm run build`. The importer removes only records
with its own import tag and rebuilds them deterministically. Do not edit imported
runtime records directly: a repeat import intentionally regenerates them.

`npm run test:language` validates all four source files and destination grades,
IDs, source links, category membership, normal-play reachability and repeat-run
stability. `npm run test:racing` checks all 4,123 current match/category/repair
review cases. Sign tests include every stored option and all complete grammar
review sentences. UI checks are DOM tests; real phone playtesting remains useful.
