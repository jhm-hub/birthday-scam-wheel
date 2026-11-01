Saved settings and permanent OBS source: see SAVED-VERSIONS.md.

# Faith’s Birthday Scam Wheel

A separate browser game with ten original birthday mechanics, editable prices and
names, individual playable demos, automatic sample rounds, and transparent stream art.
The operator UI uses Faith’s rose, lilac, cream and arcade lettering.

Play at https://jhm-hub.github.io/birthday-scam-wheel/ without signing in.

See [START-HERE.txt](START-HERE.txt) for use, game descriptions and streaming setup.

## Develop

Use Node.js and `npm ci`, then `npm test` and `npm run build`.
The build emits `dist/index.html` and the self-contained `Birthday-Scam-Wheel.html`.
Serve `dist` with a static HTTP server for local browser review.
The font is Bungee, licensed under the OFL in `assets/Bungee-OFL.txt`.

## Architecture

- `src/model.js`: integer-cent rules, plans tied to round/revision, ten independent modes.
- `src/art.js` / `src/style.css`: SVG wheel, Web Animations spins and per-game art.
- `src/app.js`: practice mode, controls, live viewer, settings and sample orchestration.
- `src/room.ts`: PeerJS transport with mutual HMAC authentication and heartbeats.
- `src/twitch.ts` / `src/commands.js`: read-only chat and isolated `!birthday` namespace.
- `test/model.test.mjs`: exact accounting, invalid/stale actions, commands and 2,000 varied rounds.

Default page runs locally. `?controls=1#room=...` sends private actions to
`?view=stream#room=...`, the sole authoritative engine. Room fragments grant control.
Settings use a separate birthday namespace; the original wheel is untouched.
No payment collection, player accounts, or server database is involved.

The public GitHub Pages release uses a dedicated repository and does not change the
other stream games. The earlier owner-private Site remains a historical preview.
Live broadcaster chat, audio routing, and an actual OBS/Streamlabs session remain
operator acceptance checks, not inferred from model tests.

## Birthday catch update

The ten games now stage a small-looking quote followed by an explicit animated catch:
a whole cake, relit candle bill, the unpopped balloons, cascading plus-ones, a whole-round
wish, a full table reservation, confetti cleaning fees, per-inch ribbon, concatenated
photo digits, and a discount that flips into a surcharge. Settings v3 migrates old
default names while preserving custom names and current explicit zero fees.

The reveal freezes its exact math after the final spin. The additional charge commits
once after the animation; reset invalidates that pending commit. The operator can
pull the popper manually; samples handle it automatically. State schema v2 prevents
old control/viewer versions from mixing incompatible game mechanics.

The simple rim is restored. Small decorations reuse the approved candy atlas.
The previously generated frame is retained as an asset for the small crown crop,
but no full frame is rendered around the wheel. All live figures remain text.
Original asset prompts are in assets/royal/. Reveal props use native SVG/CSS.

src/reveals.js and src/reveals.css implement the ten staged props and receipts.
The build embeds those styles and all required assets into the portable HTML.

The GitHub release source excludes local reviews, room state, Sites metadata,
credentials and other games. .github/workflows/pages.yml tests and builds
the exact commit before publishing dist to GitHub Pages.
