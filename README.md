# Wordramp · by Mr. Saymaz

Wordramp is the new name of Wordrift (and, before that, Wordshift Rally).
Browser saves and `window.WORDRIFT` / `window.WORDSHIFT` keep working: the
save key is unchanged, and the old API names are aliases of `window.WORDRAMP`.
Ulti points live only in Mr. Saymaz's English League (`league.js`, `public/config.js`).

## Deploy on Netlify

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
English League connection. Version 0.24.0 rebuilds the cars and the three arenas, fixes the phone HUD
and several race deadlocks, and rebalances Relaxed rivals. See
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
