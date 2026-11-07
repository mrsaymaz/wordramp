# Wordramp · by Mr. Saymaz

Wordramp is the new name of Wordrift (and, before that, Wordshift Rally).
Browser saves and `window.WORDRIFT` / `window.WORDSHIFT` keep working: the
save key is unchanged, and the old API names are aliases of `window.WORDRAMP`.
Ulti points live only in Mr. Saymaz's English League (`league.js`, `public/config.js`).

## Who are you? (English League v11.7.0)

With the League on, the first START on a device asks the student to tap their
name from the League's class list (`student-picker.js`), after they have chosen
their team and lesson grade. Only that grade's classes and that team's names
are listed (a one-class grade such as 6-C goes straight to the names), sorted
in Turkish alphabet order. "Not here? Show everyone" lists every grade and
team; "Not on the list? Play without a name" plays as before. The choice is
saved with the game's progress, and the pill beside LEAGUE in the garage
("Zeynep · 5-A  Change") reopens the picker for shared tablets. Every race's
League start ticket then carries the Student ID, and the result screen names
the grade and team the League credited. The class list is cached per grade,
so the picker opens at once and never blocks play. With `ultiApi: ''` there is
no picker. Run `npm run test:student` for the roster, ticket and picker checks.

## Learning log (English League)

From 0.30.0, every English League race (won or lost) can send one learning
record to the League: each English task reached, what it tested (skill and
word or sentence), whether it was right first time, a retry, missed or too
late, and the wrong choice (`learning-log.js`). It is off until the League's
settings for `wordramp` include `learning: true`, so the game can be published
before the League side is ready. The shared format for all League games is in
`public/LEARNING_LOG.md`. Run `npm run test:learning`.

## Deploy on Vercel

From version 0.29.0 the game is published on Vercel. The English League itself stays on
Netlify: the game keeps sending wins to `https://mrsaymaz.netlify.app/api/ulti`
(`public/config.js`), which accepts requests from any site.

The included `vercel.json` configures:

| Setting | Value |
| --- | --- |
| Framework preset | Other (`"framework": null`) |
| Root directory | Project root (leave blank) |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |

**From GitHub (recommended).** In Vercel choose *Add New → Project*, import
this GitHub repository and keep the settings above (they come from
`vercel.json`). Then open *Settings → Git* and set the **Production Branch**
to the branch that holds this version (for example
`claude/zen-lovelace-cbbg2v`, or `main` once it is merged there). Otherwise
Vercel publishes the repository's default branch, which may be an older
version. Every push to that branch publishes a new production version.

**Drag and drop.** Run `npm run build` and `python3 scripts/package-release.py`,
unzip `Wordramp-vX-Vercel.zip` and drop the folder on Vercel's
new-project page (or run `vercel deploy` inside it). That folder is the
published game itself, with `index.html` at its top level, plus a
`vercel.json` holding only the header rules, because a dropped folder is
published as it is, with no build step. Dropping the `dist` folder of a build
works the same way.

**No extra Vercel settings are needed.** The game has no Netlify Functions,
Edge Functions, Forms or Identity, reads no environment variables at build
time, and `netlify.toml` has no header, redirect or rewrite rules, so
`vercel.json` lists none either. There is no service worker. Run
`npm run test:vercel` to check that `vercel.json` and the Netlify files keep
the same build, header, redirect and rewrite rules.

**Fresh saves on the new address.** Browsers keep saved data per web address.
Stars, arena wins, fuel, the Driving School tick and the chosen "Who are
you?" name saved on the Netlify address do not move to the Vercel address:
students start fresh there (this move does not migrate saves). Ulti points
already sent are safe in the English League.

## Deploy on Netlify

Netlify still works exactly as before (`netlify.toml` is unchanged).

The included `netlify.toml` configures:

| Setting | Value |
| --- | --- |
| Base directory | Project root (leave blank) |
| Build command | `npm run build` |
| Publish directory | `dist` |

Use the entire extracted project for a deployment that runs a build. The build
recreates `dist` from the static files in `public` and bundles the application
there. It also checks that local HTML assets exist before reporting success.

For a manual drag-and-drop deployment, upload the **dist folder inside this
ZIP**. It already contains the finished game; no build command is needed for
that manual upload. Upload the folder containing `index.html`, `style.css` and
`game.bundle.js`.

## Build locally

Install the locked dependencies with `npm ci`, then run `npm run build`.
Open `dist/index.html` to play. `dist` is generated output and can be deleted
and rebuilt. Edit HTML, CSS and readable language/gameplay banks in `public`;
edit application modules such as `app.js` in the project root.

Run `npm run test:deploy` to check a build with no pre-existing `dist` folder,
and `npm run test:ui` to check the lesson and driving interface interactions.
These tests use installed dependencies; UI checks use a DOM double.

## Create a release ZIP

Run `npm run build`, then `python3 scripts/package-release.py`.
The release keeps the project layout intact, includes prebuilt `dist`, and
excludes dependencies, local hosting identity and compiled test files.

See `dist/QUICK_START.txt` for controls and `dist/ULTI_INTEGRATION.md` for the
English League connection. Version 0.30.0 adds the learning log; 0.29.0 added the "Who are you?" student picker and Vercel deployment; 0.28.0 added a Driving School for first-time players (hands-on practice pads for holding to drive, swiping and sliding up for Nitro, the four English tasks, a first-race coach, and finger tips on the car and on each English task the first time it appears); 0.27.1 put a ride behind every route choice (escalating Sky Coasters in Sunlit, a Sea Jump on the Coastal Overpass, a Cliff Plunge in Stormcrest) and turns road repairs into a Bridge Builder; 0.26.0 added the launch, loop, corkscrew and helix to the Sky Coaster, which arrived in 0.25.0: in Sunlit
Boulevard the right answer at a route choice rides a raised coaster track
(`coaster-track.js` builds it; the ride itself lives in `public/game-core.js`).
Version 0.24.0 rebuilt the cars and the three arenas, fixed the phone HUD
and several race deadlocks, and rebalanced Relaxed rivals. See
`public/RELEASE_NOTES.md`. Collisions, DNF, touch controls and the language
bank from earlier versions remain.

## Car condition

Every race starts with three condition marks below the clock. A separate
open-road impact consumes one mark and the existing time penalty. The first
hit cracks the glass and dents the car; the second loosens the bonnet and adds
light smoke. The third triggers a brief engine stop and ends the race.
Wrong English answers never damage the car. Guided tasks and their protected
exits remain safe. A continuing scrape counts once, with 3 seconds of impact
protection in Relaxed and 2 seconds in Challenge. Rivals close lost ground by
continuous driving during the three-second impact recovery. Open-road
braking no longer prevents bumper contact while holding acceleration or
Nitro. Release acceleration/Nitro to coast and brake for occupied lanes.
No position jumps are added. Every retry and
review lap starts fully repaired. Breakdown results cannot unlock arenas or
earn Ulti points. Reduced motion keeps the visible damage without particles.

Run `npm run test:impacts` for real driving impacts, moving-car contacts,
rival passes, moving recovery and three-hit DNF races.
Run `npm run test:damage` for collision, protection and breakdown scenarios;
`npm run test:scene` checks the model and effect lifecycle with a mocked
renderer. Real browser and phone rendering still need device play-testing.
Every failed race shows DNF (Did Not Finish), with no finishing position or
podium. Damage, failure reasons and incomplete distance also invalidate stale
finish metadata before win rewards and arena progression are considered.
The `test:fairness`, `test:rivals`, `test:clear-roads` and `test:pacing`
stress drivers release the pedal to brake like an attentive student
(`tests/attentive-driver.cjs`) and pass with zero bumps.

## Graphics and performance

Arena art direction lives in `world.js` (looks, scenery kits, landmarks,
tunnels, sky) and vehicles in `vehicle-geometry.js`; `parts.js` batches
coloured primitives into one draw call per material. Scenery is chosen per
course segment, so a stretch always looks the same. `npm run test:scene`
checks the geometry with a mocked renderer; it does not measure frame rate,
so test on real phones before relying on performance.

Run the full gameplay matrix faster in four shards with
`WORDRAMP_TEST_GRADE=5 node tests/gameplay.cjs` (and 6, 7, 8).

## Picture signs

Some vocabulary signs use Fluent Emoji (3D) pictures, either as the clue or as
the three answers. The reviewed word list and confusable groups live in
`reference/fluent-emoji/` (see its README). After editing it, run
`python3 scripts/build-emoji-bank.py`, then `npm run build`. `npm run
test:pictures` checks the pictures, that exactly one option can match, and that
pictures never change the road layout.

## Mr. Saymaz host images

`public/img/saymaz-*.png` are the host portraits supplied by the project
owner (bust, full/presenting, point, think, smile, cheer), trimmed and
reduced to 900 px tall palette PNGs. The build fails if any image used by
`index.html` or `app.js` is missing.

## Phone and tablet controls

Hold anywhere on the road to accelerate. Keep the thumb down and swipe left
or right to steer, including repeated swipes. Slide forward and hold for
Nitro; slide down to save the remaining charge while continuing regular
acceleration. Slide farther forward for a second or third charge. Each new
charge costs 30 fuel; saved charge resumes for free. Holding a fixed position
never buys additional charges. Lift the thumb to release acceleration/Nitro.

Road repairs and crossings retain autopilot so students can lift their thumb
or use another finger to complete them. The original keyboard and mouse
controls remain available on desktop. `dist/phone-preview.html` shows the
touch layout with illustrative browser bars and can be operated with a mouse.

Run `npm run test:touch` for gesture, fuel conservation and viewport bounds;
`npm run test:ui` covers input ownership, two-finger repair, task handoffs,
Pause/release and desktop paths. These are automated checks, not device QA.

## Language material

The expansion adds 341 vocabulary translations, 264 definition signs, 132
reviewed Q&A signs, 132 grammar choices and 438 three-block repairs. Source
material is mapped by grade and topic, not blindly by the uploaded unit number.
See `reference/language-expansion-2026/README.md` for the sub-theme mappings,
coverage limits and source files, and `import-report.json` for item counts.

Run `python3 scripts/expand-language-bank.py` after editing the reviewed source
material, then `npm run build`. The importer preserves original task IDs and
replaces only its own imported records. Run `npm run test:language` to verify
grade/topic mappings, provenance, normal-play reachability and repeat imports;
`npm run test:racing` also checks every item's alternative-clue review.
