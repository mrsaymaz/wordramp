# v0.25.0 · Sky Coaster

Sky Coaster (Sunlit Boulevard)
- Each Sunlit route choice hides a Sky Coaster behind the correct sign. After
  the answer is judged, a twin-track coaster rises out of the ground ahead:
  a 13.6 m lift hill, a first drop beside the park, two airtime hills and a
  banked swerve, then a landing back in the lane. The ride is 300 m.
- The track stays hidden while the sign is read, and buildings step back on
  both sides of the road, so neither the track nor the cleared side gives the
  answer away. A rival riding it first is drawn on the ordinary shortcut branch
  until your own answer reveals the track, which then carries the rival up.
- Speed follows the drop: about 0.8x up the lift and 1.2x at the bottoms. The
  ride gains exactly 18 m, the same reward as a shortcut, so race balance and
  the English League timing are unchanged.
- Cars on the raised track and cars on the road never meet; the landing
  stretch after a coaster has no obstacles or waiting traffic. Rivals who
  answer right ride the passing track beside you. Traffic never rides.
- Camera rides along slightly wider, looks down the drops and widens the view
  on the way down; speed lines on drops; chain-lift clicks, rushing air and a
  landing thud. The HUD shows SKY COASTER, and the approach warning says the
  right answer rides it.
- Reduced motion keeps the ride with drops flattened above 4 m, no banking,
  no camera dive and no speed lines.
- Coastal Overpass and Stormcrest Expressway are unchanged.

# v0.24.0 · Grand Prix Polish

Name
- Wordrift is now Wordramp: the title, wordmark, help and pause screens,
  phone preview, car livery and Ulti export file name. Saved progress, stars,
  team points and Ulti receipt/source identifiers are unchanged, and
  `window.WORDRIFT` / `window.WORDSHIFT` remain aliases of `window.WORDRAMP`.

Graphics, world and presentation
- New vehicles built from sculpted cross sections: a striped player coupe in
  team paint, two winged rival GTs (Cobalt 02, Ember 03) and muted civilian
  sedans, hatches, SUVs and vans. Real glass, painted roofs and flares, wheel
  wells, five-spoke wheels, head/tail lamps, indicators and soft contact
  shadows. Damage cracks, bonnet and loose panel now sit on the real body.
- Three art-directed arenas. Sunlit Boulevard: planted verges, street lamps,
  shopfronts with awnings, balconies, glass towers, pocket parks and an
  observation wheel, clock tower, stadium and twin towers. Coastal Overpass:
  bridge deck with railings and piers, causeway towns with palms, sailboats,
  buoys, islets, lit tunnels through headlands, a lighthouse, suspension
  towers and a cargo ship. Stormcrest: rock cuts, guardrails with reflectors,
  pine forests, snow peaks, wind turbines, an observatory and restrained rain.
- Sky dome, fog and horizon share one colour, so distant chunks dissolve into
  the sky instead of popping in. Layered backdrops are pre-tinted, not fogged.
- Real-time shadows are reserved for cars, hazards and gates near the player.
  Static scenery carries baked contact shading, removing the shadow pop-in at
  the frustum edge and the crawling building shadows.
- Scenery is chosen per course segment (deterministic hash), not per pooled
  slot, so a segment always looks the same and the city no longer repeats
  every 380 m. Curbs, sidewalks, rails and bridge decks bend with the road and
  follow task aprons and fork branches continuously; fork islands are filled.
- Batched vertex-colour geometry: race-start draw calls fell from about 910 to
  about 207 in Chromium; obstacles are one draw call each. Rendering behind a
  full-screen panel is throttled while the race is idle or paused.
- Portrait phones pull the chase camera back so both neighbouring lanes stay
  visible. Nitro adds a restrained low camera dive; the speed FOV is capped
  lower. English focus adds a calm in-world grade (cooler, dimmer world) while
  the HTML signs stay crisp; reduced motion keeps the grade without motion.
- Home screen frames the whole showcase car; the label sits below it.
- Phone HUD fixed: clock, position, Nitro meter and Pause share one row (the
  Nitro meter was clipped and Pause wrapped). Nitro text and the three
  condition marks are larger. The launch overlay always hides after the
  countdown.
- Audio: engine body and sub, a sustained Nitro layer, arena ambience (city
  hum, sea swell, rain), richer impact and answer cues, and a low-pass duck of
  the world during English focus. Task cues are never ducked. Mute, Pause and
  the browser gesture rule are respected.

English League connection (follow-up within v0.24.0)
- Arena wins now add Ulti points to the student's grade and team pool in Mr.
  Saymaz's English League (game id `wordramp`). Each race asks the League for
  a ticket at the start line; a qualifying first place claims it. The League
  decides the points, and the game sends no points value and holds no key.
- The result screen shows "+N Ulti for Grade g Team!", or explains a daily
  device or team limit, a refusal, or that the win will be sent when online.
  Offline wins wait in an outbox for up to 47 hours.
- The garage's LEAGUE · GRADE n button shows the four team pools with live
  points and Battle Arena strength. Its rules text comes from the League's own
  settings.
- `config.js` holds the League URL; set `ultiApi: ''` for a practice-only
  copy with no League UI and no network requests.
- Browser-only team points are retired: Ulti points now live only in the
  League. The team-points window, local 40-point daily cap, 72-hour receipts
  and points export are removed. Garage team cards show the League's live
  points for the student's grade (hidden in practice-only copies). Old saves
  drop the local ledger on load; its receipts still count as past first
  places for arena unlocks.

Ulti points v2 (follow-up within v0.24.0)
- Points now rise by arena, and Challenge pays more: Relaxed 2 / 4 / 6 and
  Challenge 5 / 7 / 9 for Sunlit / Coastal / Stormcrest.
- A first place earns points only with enough tasks right first time:
  at least 60% on Relaxed, so struggling readers who win still contribute,
  and 2+ stars (75%) on Challenge. Each device earns at most 40 points a
  local day. The win that
  crosses the cap pays the remainder.
- The result screen explains a first place that earned nothing. The
  team-points window shows the table and today's total.
- Before this change both modes paid 10 for every first place, so
  replaying Relaxed Sunlit earned as much as any race. With earned Nitro,
  any competent student made about 130–140 points an hour, whatever their
  accuracy or mode.
- Receipts are version 2 (adding `arenaIndex` and `stars`). Earlier 10-point
  receipts stay valid until they expire. See ULTI_INTEGRATION.md.
- Arena difficulty now rises in both modes. Before, a driver who never
  boosts found Sunlit the hardest arena and Stormcrest the easiest
  (Challenge: 0, 0 and 8 wins of 12). Rival pace rises by arena, and the
  later arenas' rivals charge Nitro faster, weave tighter and wait less at
  crosswalks. A perfect reader without Nitro now wins Relaxed 12 / 9 / 5 and
  Challenge 5 / 4 / 3 of 12, Sunlit to Stormcrest; with earned Nitro, 36/36
  in both modes. The rival suite checks this order.

Picture signs (follow-up within v0.24.0)
- Some vocabulary signs now use Microsoft's Fluent Emoji (3D) pictures:
  - Picture → word: the picture is the clue, with three words on the lanes.
    It appears at the second traffic light of every race.
  - Word → picture: the word is the clue, with three pictures on the lane
    signs. It appears at the last route fork in Stormcrest and, for Grades
    5–6, at the fourth light in the later arenas.
- Most races in the first two arenas have one picture sign, and Stormcrest
  has one or two (about 0.6–0.8 and 1.4–2.2 per race).
- 226 reviewed words have one of 220 pictures. Only clearly picturable words
  are included, and lookalikes (tram/train, happy/excited, pasta/noodles, …)
  are never offered against each other, so exactly one option matches.
- Answers stay English words, so scoring, missed-word reviews and progress
  are unchanged. The pictures (about 1 MB, MIT licence) ship inside the game
  and are fetched at the start line.
- Card choices now use their own random stream. Language content and bank
  edits no longer move traffic, obstacles or rivals for a given course; the
  two language imports had been shifting them.
- The merged grade files gain an `emoji` field for the pictured words.

Language expansion, second batch (follow-up within v0.24.0)
- Four more grade files (grade5-2 to grade8-2) are imported after the first
  batch, adding only what is not already in the game. That adds 648 playable
  signs (252 definition clues, 136 translations, 128 reviewed Q&A signs and
  132 grammar choices), 164 three-block repairs and 26 crossing category
  pairs. All 44 lessons, their IDs and saved progress are unchanged.
- Extra topics join the closest lesson in the same grade as sub-themes. Grade
  5 Jobs and Workplaces, Grade 7 Food and Cooking and Grade 7 Travel and
  Holidays gain imported material for the first time.
- Everything playable was reviewed before import:
  - Q&A signs use only questions with one right answer, with reviewed wrong
    answers and review prompts.
  - 22 definition clues were reworded and 10 gained review prompts.
  - Only topic-specific sentences become repairs; templated ones are skipped.
  - A category pair is added only when it brings a new category.
  - The live Grade 6 sign "English for “eş”: partner" now reads "çalışma
    arkadaşı"; "eş" means spouse.
  - Details are in reference/language-expansion-2026b/README.md.

Traffic and host (follow-up within v0.24.0)
- Civilian traffic now arrives in short groups of 2-3 cars from the first
  stretch: Relaxed 6 / 12 / 18 and Challenge 10 / 18 / 26 cars across Sunlit
  Boulevard, Coastal Overpass and Stormcrest. A group row never blocks all
  three lanes, each open lane is reachable from the one before it, and rows
  are spaced for a lane change at maximum Nitro closing speed. Groups wait
  parked in the fog until the player is about 300 m away, so they are met,
  not chased. Until a group wakes it is not on the road at all: it is not
  drawn and rivals far ahead of the player drive straight through its spot
  instead of queuing behind parked cars. A group wakes only when its place
  is clear of rivals and other traffic. Static obstacle rows make room for them; total hazards still
  escalate by arena.
- Traffic AI fixes exposed by the denser traffic: a stale remembered lane
  could send a car from one shoulder across the whole road; a car leaving a
  shoulder could start a three-lane gap move; two civilians could merge into
  each other in the same instant; and two bunched cars could choose the same
  shoulder, parking one in the lane the crosswalk exit assist keeps the
  player in. Each is fixed in the core. Rivals also move to a crosswalk's
  side lane 130 m ahead (60 m for other tasks), so they never sit in the
  player's approach lane.
- Challenge rivals now weave through traffic groups (they need 6 m behind a
  slower car they have passed rather than 16 m, and plan across the centre
  lane when the only open lane is two over) and charge Nitro at 13 per
  correct answer instead of 10. Without this, traffic cost them several
  seconds a race and Challenge felt almost like Relaxed. Relaxed rivals keep
  the cautious rules. Measured on the 36-race benchmark of a perfect driver
  who never boosts: Relaxed 25/36 wins, Challenge 14/36; with earned Nitro
  36/36 in both.
- Two rival deadlocks found by the full verification with traffic: a rival
  half into an escape lane beside a rockfall could neither finish the move
  (the stopped player was 5 m behind) nor drive on, freezing both cars until
  the clock ran out; and a rival already in a row's escape lane close behind
  the player could be pushed out by the keep-clear courtesy rule into the
  blocked lane beside it and park there. A rival may now finish a lane move
  ahead of a car that is clear behind it and not closing, and keeps an escape
  lane it already holds.
- Mr. Saymaz hosts the game: a portrait beside "by Mr. Saymaz", a presenting
  figure beside the showcase car on desktop, and poses in How to play
  (pointing), Pause (thinking), garage (thumbs up), team points and first
  place (cheering), other finishes (thumbs up) and DNF (thinking). He never
  appears over the road while driving. Images are trimmed, 900 px tall
  palette PNGs (about 60 KB each) supplied by the project owner.

Gameplay and fairness fixes (found by the full test matrix)
- Deadlock: a rival stopped just ahead of a player in protected crosswalk
  focus could freeze both cars until the clock ran out. A rival parked in the
  player's following gap may now open it.
- A player who changed lane as the car's tail cleared an obstacle could be
  pinned by that obstacle behind it until timeout. Driving away from a body
  that is behind is always allowed.
- A civilian already within 50 m of an obstacle entry row parked in place,
  sometimes in the only escape lane beside the player. It now drives through.
- Pre-obstacle courtesy no longer makes rivals ahead crawl or brake in front
  of the player; it applies to rivals at or behind the player, until the row.
- Held-input open-road impacts use the true body width; the following margin
  no longer counts a 0.13 m near miss as a hit. The player's assisted
  braking also uses the physical path, so a rival stopped 0.1 m beside the
  lane can no longer hold the player behind it while it waits for the player
  (a second deadlock found by the fairness benchmark).
- The protected (neutral) learning phase no longer charges rivals for their
  own reading on top of the shared pace cap.
- Relaxed rival profiles are tuned per arena; Challenge is unchanged in
  profile. `npm run test:rivals` prints the current balance benchmark.
- Random distractors never contain the answer as a whole word (for example
  "kapı" → gate is no longer paired with "school gate"). No language item was
  edited; seeded courses are unchanged.

Tests
- Legacy stress drivers (fairness, rivals, clear-roads, pacing) held the pedal
  through every hazard, which v0.23.1 deliberately turned into real impacts.
  They now release to brake like an attentive student (tests/attentive-driver.cjs)
  and keep their zero-bump, finish and balance assertions unchanged.
- Updated fixtures that predated v0.23.1 rules (entry-row waits, physical
  lane-step window, reckless driver must hold acceleration, swept Nitro stop at
  the bumper). Added checks for the entry wait, distractor clarity and
  stand placement. The full gameplay matrix also failed at baseline
  (g5u4 Relaxed Stormcrest seed 2 deadlock); it now passes.

Verification limits: rendering was inspected in headless Chromium with
SwiftShader (software WebGL). It confirms layout, composition and draw calls,
not device frame rate, touch feel or audio quality. No physical phone or
tablet was available.

# v0.23.1 · Impact & DNF Fix

- Removed proximity braking while holding open-road acceleration or Nitro.
  Releasing both returns to assisted coasting, so the driver can brake before
  an occupied lane without an extra control.
  Obstacle and moving-car collisions are resolved at their physical bumper
  boundary. Vehicles remain separated; task/crossing stopping stays protected.
- Resolve moving traffic before the player's manual forward step, so rear-end
  contact uses the vehicle's actual moved position. Equal-speed following is
  stable at 30, 60 and 120 Hz. A contacted leader can leave the extra safety
  margin instead of becoming stuck during a small frame step.
- Kept the approach reservation that leaves a readable escape gap, and
  suspended that rival courtesy immediately after an impact. Rivals then
  keep driving through clear road space. Three seconds of player recovery gives a nearby
  rival a chance to catch up or pass without moving any car instantly.
- Civilian traffic yields 50 m before the first row of an obstacle sequence,
  then resumes after the player clears its entrance. It does not park inside
  the sequence or fill its only escape lane. Traffic identities stay fixed.
- Preserve stored Nitro when the player is physically pinned after impact.
  A continuing scrape still counts once; task fairness and crossing queues
  conserve boost time. Relaxed/Challenge protection remains 3/2 seconds.
- Every breakdown and timeout shows DNF / DID NOT FINISH in the HUD and result.
  Failed results have no podium or finishing position, even if the player had
  been leading. Failure, damage or incomplete distance rejects stale finish
  data before stars, Ulti points and arena wins can be awarded.
- Added real collision regressions using generated obstacle patterns and both
  rival AIs: 36 bumper impacts/passes, 6 moving-car contacts plus equal-speed
  following, 18 moving recoveries and 6 continuous three-hit DNF races across
  both modes and 30/60/120 Hz. UI checks cover failed leaders, timeouts, stale
  first-place metadata, reward exclusion and fully repaired retries.
- Updated crosswalk test fixtures for the expanded language bank and selected
  category pairs. The lesson data is unchanged. The full-unit driver assesses
  relative vehicle motion. The isolated crash suite deliberately holds its
  course to verify that the game does not brake for it.
- Visual checks use a mocked renderer; native phone rendering remains unverified.

Verification limit: the legacy `test:fairness` / `test:rivals` automatic-driver
benchmarks still flag zero-bump assertions when they hold acceleration/Nitro
through traffic. They were written for automatic proximity braking, which this
patch removes. The 264 full-unit runs and dedicated real-impact, moving-recovery,
DNF, model separation and protected-task checks pass. These stress benchmarks
are retained unchanged for further driving-balance work.


# v0.23.0 · Car Condition

- Three separate open-road impacts end a race. The player coasts to a stop
  during a 1.15-second breakdown, followed by a clear failure result.
- Progressive model damage: cracked front/rear glass, dented paint, scratches,
  bent bonnet, loose side panel, light smoke, then heavier breakdown smoke.
  The bonnet stays below the roof; collision protection keeps the car visible.
- Three small condition marks share the clock's existing footprint, with
  accessible remaining-hit labels. They never intercept driving fingers.
- Each hazard contact stays latched until physical separation. A scrape during
  protection cannot become a delayed extra strike. Relaxed protection lasts
  3 seconds; Challenge lasts 2. Both modes allow three strikes.
- Impacts cause brief speed loss and retain their existing time penalty.
  Nearby rivals can close the gap through continuous driving. Their position
  is never moved instantly. English-task pace protection remains intact.
- Wrong answers do not damage the car. Tasks, autopilot and protected exits
  cannot consume condition. Saved Nitro survives a collision without burning
  during recovery. Retry and review races start fully repaired.
- Breakdowns never award stars, Ulti points or arena unlocks. Reduced motion
  preserves static damage without sparks, smoke or impact motion. Battery
  mode reduces smoke emission. Pause freezes the effect pools.
- Damage warnings appear immediately beneath the clock, even when ordinary
  drive messages wait for a nearby hazard to clear. They hide during tasks.
- Automated checks cover physics, real contacts, 30/60/120 Hz, both modes,
  all arenas, reward exclusion, retry, DOM interactions and Three.js geometry.
  Rendering uses a mocked renderer; native-device visual QA remains unverified.

Known calibration flag: `test:rivals` still flags the perfect zero-fuel Relaxed
benchmark (seeds 1–3, all arenas): 9/9 wins instead of its expected mixed
positions. The previous v0.22.0 build produces identical outcomes for all nine
cases. This release preserves rival tuning and adds natural catch-up only
through the player's impact slowdown.

# Wordrift v0.22.0 · Touch Drive

Phones and tablets use one continuous road touch. Hold anywhere on the road
to accelerate, swipe left/right repeatedly to steer, and slide forward to
engage Nitro. Keep the thumb there to continue boosting. Slide down to stop
Nitro while keeping regular acceleration; the unused charge is saved. Slide
farther forward to load a second or third level. Each added charge costs 30
fuel, and resuming a saved charge is free. A stationary hold never buys more
fuel charges, even when its current reservoir runs out.

The bottom speed, steering arrows, Nitro and +30 controls are removed from
the touch layout. A compact non-interactive meter beside race position shows
Nitro state, saved levels and fuel. It becomes subdued during English tasks.
The lower road stays available to the thumb. Task layout reserves visible
space above the thumb area and adapts to changing browser-bar height.

Pointer capture preserves driving through lane swipes and across overlays.
Cancelled/lost pointers, release, Pause and blur clear holds. Road-repair
connections and pedestrian choices work with a second finger. Autopilot
preserves the physical hold through all four task types, and a downward
Nitro cancellation stays effective after control returns. Desktop buttons,
keyboard controls, speed calibration, fuel costs and racing rules remain.

The phone preview also uses the touch interface with a desktop mouse. Its
browser-bar controls resize the existing race without reloading it. Start
instructions and Help describe the controls for the current input mode.

Checks cover continuous gestures, deliberate stacks, saved-charge cruise,
no extra purchases on release/exhaustion, second-finger safety, four task
handoffs, phone/tablet bounds, browser bars, desktop regressions and racing.
UI/geometry checks use DOM doubles and mathematical fixtures. Native device
playtesting remains necessary; no phone browser rendering was available.

## v0.21.0 · Expanded Language Bank

The four supplied grade files are connected to the existing grade/unit bank.
All 44 lesson IDs, titles and saved progression keys remain intact. Extra
topics appear as sub-themes of the closest existing unit in the same grade;
the Lessons cards show an Includes line so teachers can see the coverage.

The playable expansion adds 341 vocabulary translations, 264 definition
clues, 132 short question-and-answer signs, 132 grammar choices and 438
three-block road repairs. Pedestrian crossings rotate between the original
and supplied category pairs. Each displayed pair has disjoint word lists.
Q&A signs use the same on-road choices and slow-motion controls as other
traffic-light tasks. Missed items return with a reviewed alternative clue.

The original JSON files, source-to-unit mapping, reviewed question choices,
repair adaptations and a repeatable importer are included in reference/ and
scripts/. Original source Q&As and completions remain available for further
curation; only reviewed answer choices enter the playable task bank. Some
source options were changed to prevent two reasonably correct answers,
including cashier/shopkeeper, athlete/teammate and storm/tornado choices.

Validation covers source provenance, all mappings and new task reachability,
repeat imports, alternative-clue review, full races, Lessons interactions,
whole-word sign sizing and the Netlify build. UI/typography checks use test
doubles and font fixtures; they are not real-device screenshots.

## v0.20.4 · Touch Fix

The entire game surface disables native text selection and iOS touch callouts,
including HUD text, road signs, control labels, icons and canvas content.
Native selectstart, dragstart and contextmenu events are cancelled on game
content. Image/canvas dragging is disabled. Race start and road presses clear
an existing browser selection so its handles cannot keep covering the game.

Driving surfaces use touch-action none. Home, Lessons and settings retain
their scrolling behavior, and real form controls keep native editing/pickers.
Held acceleration, saved Nitro, swipes and finger connections retain their
existing input paths. Release, cancelled pointers, Pause and blur still clear
holds. No global touchstart cancellation or viewport zoom restriction is added.

Automated checks cover native-gesture cancellation during a car hold, retained
pointer capture, old-selection removal, normal release, form-control exceptions,
lesson selection, repair connections and focus handoffs. UI uses a DOM double;
actual iPhone/Android long-press behavior still needs device playtesting.
The Netlify build/export fix remains in place.

## v0.20.3 · Netlify Build

The exported project now keeps the same directory layout as the source
checkout. netlify.toml sets npm run build and publishes dist. The build copies
all static files from public into a freshly recreated dist, bundles app.js
there and checks that local HTML assets exist. It works without an existing
dist and removes stale files on subsequent builds.

The release ZIP contains the complete source project, build script and a
prebuilt dist folder. For a build-based deployment use the full project; for
manual drag-and-drop use the dist folder inside it. README.md explains both.
The previous export wrote game.bundle.js and playable assets at the ZIP root,
which conflicted with the configured dist publish path. That mismatch is fixed.

Checks cover empty-dist and repeat builds, complete published assets, a fresh
extraction of the actual release ZIP and the lesson/driving interface. No
Netlify account deployment is performed by these local checks. Gameplay and
the Lessons pop-up retain their behavior.

## v0.20.2 · Lessons

The lesson button opens a Lessons pop-up with the prompt Choose your lesson.
The four grade choices show Grade 5 A1, Grade 6 A1+, Grade 7 A2 and Grade 8 A2+.
Below them, each unit is a numbered card with a bold full title and a short
specific description drawn from its existing target language. Grade 7 begins
with Appearance and Personality, Sports and Biographies. All 44 units have
previews. The selected card retains its gold highlight and check.

Grade choices and the confirmation footer stay visible while the unit list
scrolls. Short landscape windows can scroll the whole pop-up. Full titles
and descriptions wrap naturally. Apply saves the draft; Cancel, Close and
Escape preserve the prior lesson. Other pop-ups keep their usual layouts.

Validation covers all 44 unit cards, grade/level labels, descriptions, bold
titles, selection/focus behavior, save/cancel/close actions and the build.
UI checks use a DOM double; actual phone visuals remain unverified.

## v0.20.1 · Unit List

The Theme / Unit picker displays every unit for the chosen grade as a
numbered, tappable row: unit 1, then unit 2, then unit 3 and so on. Full titles
wrap between words instead of being clipped. The selected row has a gold
number, border and check. Changing grades refreshes the ordered list. Unit
taps preserve keyboard focus; Apply saves the choice and Cancel/Escape keep
the previous lesson. The existing setup arrangement and race behavior stay.

Validation covers all 44 unit choices, full titles and numbering, grade
changes, selection state, focus preservation, Apply/Cancel and the build.
UI tests use a DOM double; real browser and phone appearance are unverified.

## v0.20.0 · Win and Go

Arena progression requires a first-place full-race finish. Second and third
place still save English stars, fuel and mastery. Review laps and unfinished
races do not unlock arenas. Wins are saved separately for every unit and
difficulty, and earlier arenas must be won in order. Home cards, race starts
and the post-race Next Arena action enforce the same rule. Existing recorded
first-place Ulti victories count even after their points expire; old stars
alone do not imply a win. Team points retain their original 72-hour expiry.

After choosing, hold the car, the speed button or Up to shorten the slow-motion
return to about a quarter of a second. An already-held control works too.
Release it to keep the remaining gentle fade. Lane choices wait for the car
to align, repairs wait for the correct three-block sentence and crossings
wait for visitors to reach the pavement. The normal hands-free fade remains.
Captured entry speed, live input restoration, saved Nitro, rival fairness,
physical answer lines and wrong-answer consequences stay in place.

Automated checks cover win gates, historical victory migration, saved stars,
second/third/failed/review results, all four focus tasks, both difficulties,
all arenas, 30/60/120 Hz, car/Up/button handoffs and release/Pause cancellation.
DOM checks use mocks. Real browser and phone visuals/touch need playtesting.

## v0.19.0 · Race Ready

The opening screen uses the reference arrangement while retaining Wordrift's
navy, teal and gold style. Illustrated arena tiles sit above four team crest
cards with active Ulti balances. A compact Grade / Unit lesson card sits beside
the vertical pace selector, followed by the full-width start button. Tapping
the lesson opens the four grades and only that grade's units. Full unit names
remain visible. Apply saves the change; Cancel or Escape preserves the lesson.
The panel scrolls within the browser's visible viewport on shorter screens.

Open-road stretches have substantially more hazards. Stable two-row beats
shift the safe gap one lane at a time, requiring actual steering instead of
leaving one clear lane for an entire stretch. The first row and each gap shift
have two blocked lanes. All task approach/departure and fork buffers remain.
Relaxed rows use 66 / 48 / 44m minimum spacing across the arenas; Challenge
uses 58 / 46 / 42m. Counts vary by course, with more hazards in later arenas.
Coastal Overpass adds stacked tires and loose road panels. Stormcrest adds
rockfall. Civilian traffic signals and follows successive gaps so an abandoned
merge into a blocked lane cannot lock the entire road. Cars remain continuous
and on the asphalt, with the existing shared-footprint collision safeguards.
A close-rival shortcut can guide the player slightly within the chosen branch
to keep both cars moving. Separating movement remains allowed within a safety
buffer; moving toward the other car stays blocked.

Existing task slow motion, captured entry speed, held-input restoration,
Nitro conservation, question pace protection, stars, team colours and 72-hour
Ulti receipts retain their behavior. Language material is unchanged.

Automated checks cover all 44 lesson selections, Cancel/Escape, team balances,
scene geometry, increasing hazard counts, reachable adjacent gaps, clear task
areas, traffic following, model spacing, full races and focus/input behavior.
DOM and renderer checks use mocks. Actual browser visuals and phone touch or
performance have not been verified in this environment.

## v0.18.0 · Clear Signs

Road answers, repair blocks, category signs and pedestrian word cards now
measure their actual font against the card's inner width. Font size adapts
to fit complete words; line breaks happen between words, including keeping
hyphenated words together. Category headings use title case, so Personality
and Appearance remain intact on narrow phone lanes. Card spacing is retained.
Sizing is cached and refreshed when the viewport or fonts change.

Traffic lights and route tasks enter focus cruise only 52 metres before the
answer line. Entry speed remains on the dashboard, the world slows into the
green-gold effect, Nitro is banked and steering stays responsive. Sign taps,
arrow controls, swipes and keyboard lane choices work during the effect. A
deliberate choice starts the smooth return once the car settles into its lane.
The answer is judged at the road line and the fork starts there; students can
still correct their lane before arrival. Focus runs once per checkpoint.
Each arena adds 600 metres of open road between checkpoints to preserve the
five-minute reading pace as task exits become faster. Live held driving
inputs resume automatically. Rivals match progress through
the reading window and return; wrong routes retain their detour and penalty.
Controlled traffic clears task lanes at a responsive cadence. Relaxed rivals
use stronger boosts, paid for with their existing fuel, to keep the faster
task flow competitive. Regular engine and maximum Nitro limits are unchanged.

Automated checks cover complete-word metrics across the current language
material, narrow lane geometry, focus entry/return at 30/60/120 Hz, responsive
steering, entry-speed capture, Nitro conservation, answer accuracy, input
handoffs, existing repairs/crossings, vehicle spacing and full-race pacing.
DOM and renderer checks use mocks. Actual browser visuals and real-phone
input/performance remain unverified.

## v0.17.0 · Crossing Cruise

Pedestrian tasks enter focus cruise 150 metres before the crossing. Autopilot
holds the entry speed on the dashboard and guides the centre lane while the
world slows into the existing green-gold effect. Students can sort all four
visitors before arriving. Correct sorting keeps the approach moving; normal
time returns smoothly after the last visitor reaches the pavement. If anyone
is still on the road, travel waits safely before the stripes.

Vehicles already on the stripes clear promptly before visitors enter. Nearby
traffic moves into its controlled side queues without an extended slow-motion
merge. Its forward movement remains continuous; no car is repositioned.
Rivals remain limited to the player's progress during focus and recovery.

Held driving inputs now survive both repair and crossing autopilot. An Up key,
car touch or speed-button touch can begin before focus, during the task or
during the return. A still-held input resumes acceleration automatically when
autopilot ends. The speed button accepts and acknowledges holds during focus.
Key-up, pointer-up, cancellation, Pause and window blur clear the appropriate
holds. Pause still requires a new driving input after resuming. Left/right
controls continue to sort pedestrians during focus instead of steering.

Checks cover moving approaches at cruise/90/200 entry speeds, both modes, all
arenas and 30/60/120 Hz; safe timeout escorts, prompt crossing evacuation,
held-input handoffs and cancellations, repair/Nitro regressions, rival
fairness, race timing, vehicle spacing and early word-carrier projections.
Scene and DOM checks use mocks. Browser appearance and real-phone touch and
performance remain unverified.

## v0.16.0 · Focus Drive (hold behaviour superseded)

Repair autopilot now captures the speed and lane at task entry. It preserves
that engine speed and dashboard reading while dilating world travel, traffic,
rivals, wheel travel, spectators and environmental animation. A green-gold
vignette and slow edge streaks indicate focus without colouring English signs
or the HUD. Reduced motion removes the animated streaks.

The correct three-block order repairs the road immediately. Autopilot remains
in control during a 1.35-second eased return to normal time; RESUMING appears
in the existing speed control. After that, fresh touches or key presses take
over. A Nitro-speed entry eases down to the regular engine ceiling during the
return, conserving the stored charge without creating a permanent free boost.
An extended thought period safely freezes world travel before the gap while
the task clock continues. Rivals remain limited to the player's progress.

Both difficulties now use more obstacle rows between tasks. Each short
sequence reserves one continuous escape lane: denser action without forced
last-second reversals. Relaxed uses single-lane hazards; Challenge mixes in
paired rows. The six existing obstacle types rotate through the sequences.
Traffic remains sparse, and full task approach/departure buffers stay clear.

Validation covers captured cruise/90/200-speed entries at 30/60/120 Hz,
world-time recovery, input ownership, pause/resume, saved Nitro, immediate
construction, obstacle corridors, real steering and shared vehicle footprints.
Renderer and DOM checks use mocks. Browser/device appearance, touch feel and
GPU performance remain unverified.

## v0.15.1 · Repair Cruise (superseded)

Road repair tasks use automatic slow cruise. The car holds its lane, releases
old accelerator/Nitro holds and approaches at reading pace. If the blocks need
more thought, the car waits eight metres before the construction instead of
crossing the unanswered line. The race clock still runs at the task rate;
existing rival distance protection remains active. Nitro charge is conserved.

Correct connections still repair the road immediately, release the waiting
point and resume normal automatic forward travel. Wrong orders can be retried.
Normal acceleration remains available for other road-answer tasks.

The task sign says to release the car, and the speed control shows AUTO CRUISE.
Driving/steering controls yield to connecting the blocks. Partial connections
survive lifted fingers and Pause; pausing releases any captured repair pointer.
Old car gestures and keyboard repeats cannot rearm acceleration after repair.

Validation passes 18 repair scenarios across both modes, all arenas and
30/60/120 Hz, including held/released inputs, safe waiting, conserved charge,
no extra rival ground, wrong-order retry and immediate correct departure.
UI checks cover captured-car release, separate block taps, Pause preservation
and key rearming. Existing reading fairness, Nitro hold, acceleration and race
pacing checks pass. UI uses mocks; actual phone touch/appearance remain unverified.

## v0.15.0 · Clear Road

The racing header now contains a steady timer, position and Pause, with a thin
progress line. The logo and garage actions stay in the opening screen. Detailed
accuracy, checkpoint/distance counts, lesson/arena/team information, best streak
and bumps are in Pause and results. Pause also exposes settings, sound and help.
Fuel and streak pips sit in a compact resource row attached to Nitro.

Questions and their resolving feedback use the same quiet HUD positions. Time
and position remain legible; low time changes colour without pulsing. Full-text
lane answers and immediate three-block road repairs remain on the road.

The separate overtake banner and floating Nitro reminder are removed. A single
driving-message slot queues optional notices, yielding to questions, advance
task cues, active routes, nearby hazards, occupied crossings and modal screens.
Queued messages expire after five seconds; outdated position/charge messages
are discarded. Answer feedback stays alongside the English question. Collision
flash, optional sound and vibration remain immediate. Nitro engagement effects
remain prominent while boosting; idle streak and ready-state sweeps are quieter.

The opening wordmark, help, preview title, exports and car markings use Wordrift.
Existing local saves and Ulti receipt/source identifiers retain their stable
keys. `window.WORDRIFT` exposes the current API and `window.WORDSHIFT` is an alias.
The existing hosted address continues to serve the game.

Validation covers UI structure, task/message priority, Pause statistics, sound,
help/settings round trips, release/resume inputs, saved fuel/API compatibility,
browser-bar preview scenarios and short portrait/landscape question/repair bounds.
DOM and renderer mocks do not verify actual browser appearance or phone touch
performance; real-device playtesting remains outstanding.

## v0.14.2 · Browser Ready

The game follows the visible browser height when address bars/toolbars change.
The camera, world-to-screen projections and car touch bounds now use the
canvas container dimensions rather than assuming the whole window is visible.
ResizeObserver updates the renderer when browser UI changes its container;
VisualViewport updates the playable height and compact layouts. Pinch zoom
keeps the game layout stable. Standard window sizing remains a fallback.

Phone controls and dialogs include safe-area spacing. Short portrait and very
short landscape screens use smaller race HUDs to leave room for the questions.
The setup panel remains scrollable, with full-size touch controls.

The phone preview shows illustrative top or bottom browser bars, collapsed
controls or no bars. It subtracts those areas from the actual game iframe and
reports both screen and playable dimensions. Switching bars preserves the race.
Its default 390 × 844 screen leaves a 390 × 672 playable area with bottom bars.
Preset dimensions are examples, not claims about any specific browser release.

Validation passes 32 preview screen/bar/orientation scenarios, visible-height
and pinch-zoom handling, short-screen question/repair bounds, the existing UI
flow, production build and scene geometry. Scene checks include changing canvas
heights independently of window height, camera aspect, car touch bounds and
projections. DOM/renderer mocks do not verify browser rendering, real safe-area
values or phone performance; those still need real-device testing.

## v0.14.1 · Garage

The opening screen places "by Mr. Saymaz" below the Wordshift Rally name and
logo. The slogan moves beside the car on desktop and below setup on phones,
so it no longer pushes the lesson controls down the screen. Grade and Unit
share a desktop row; on phones the fields stack with full-size touch targets.
Short desktop windows use tighter spacing, and small screens can scroll.

`phone-preview.html` embeds the actual game in a 390 × 844 CSS-pixel viewport.
It also offers 320 × 568, 430 × 932 and tablet presets, rotation, and display
scaling without changing the selected viewport. It does not simulate a phone's
browser UI, notches, input hardware or graphics performance.

Validation for this layout release covers the existing UI interaction flow,
the production build and preview preset/rotation/scaling logic. UI uses a DOM
double. Browser rendering and real-device testing remain unverified.

## v0.14.0 · Grandstand

The review focused on input consistency, spending feedback, animation triggers
and keeping the road readable while making the race environment feel occupied.

| Finding | Change |
| --- | --- |
| Nitro continued burning after the student released the accelerator. | Nitro now requires an accelerator or boost hold; releasing both banks its remaining seconds. |
| Pressing Space again purchased another stack instead of resuming a saved charge. | Space/NITRO holds resume for free. N and the separate +30 control add a charge. |
| The boost control became disabled at maximum level or with no fuel, even when charge remained. | Saved charge remains usable; only additional purchases are disabled. |
| A stopped traffic queue could waste a running charge. | Nitro waits when traffic prevents reaching boost speed. |
| Launch effects followed charge purchases, even if the car could not boost yet. | Effects begin on actual boost engagement, resume and active level increases. |
| Result statistics called all purchases “Nitro used.” | Results now report “Charges loaded,” matching what is counted. |
| Roof stripes floated above the painted roof panel. | Roof stripes and new team/number markings align closely with the roof. |
| The roadside lacked a race audience and activity. | Pooled viewing stands, instanced spectators, proximity cheering, cloth flags, quiet crowd ambience and applause. |

The HUD now carries a team marker. The coast adds offshore sailboats. The
Nitro reservoir shows saved seconds and the controls separate holding from
loading, with clearer active/saved states and steady numeric readouts.

Spectators remain behind barriers and outside task/fork areas. Models only
move to another station once behind the camera. Reduced motion disables
cheering movement and cloth flutter; pause freezes animations; battery saver
reduces the crowd to four fans per visible stand. Crowd audio fades out during
English tasks and respects the existing sound setting.

Validation includes held-input release/resume at 30/60/120 Hz, zero-fuel resume,
touch cancellation, repeat-purchase prevention, max-level controls, reading
and traffic conservation, rival competition and road containment. Crowd
checks cover 52,640 off-road fan transforms and 90 hidden-only stand changes.
The traffic matrix covers 1,152 ordinary/accelerated/boosted races with zero
bumps for the attentive test driver; 144 rival benchmark races and 24 timed
pacing races also pass. UI uses a DOM double, and the 3D renderer is mocked.
Real-device appearance, audio balance, frame rate and touch playtesting remain
unverified.

Both difficulties, team rewards, 72-hour Ulti expiry, the later Netlify export
contract, English banks and existing saved progress remain in place.
