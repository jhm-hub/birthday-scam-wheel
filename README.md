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

## Royal Popper update

Party Popper Payday replaces the old four-cannon Confetti Overload mechanic. Three
cash spins fill one popper; the pull pays the stored cash plus an explicit birthday
bonus. The screen shows all three deposits and the exact sum before confirmation.
Sample rounds hold that sum briefly before the big pull.

The wheel frame and popper were generated with the built-in image-generation tool
using Faith’s approved Crown Vault and Birthday Royalty candy as style references.
The candy atlas is reused without pixel edits. Transparent PNGs and exact prompts
are in `assets/royal/`. Interface labels and totals remain live text.

The GitHub release source excludes local reviews, room state, Sites metadata,
credentials and the other games. `.github/workflows/pages.yml` tests and builds
the exact commit before publishing `dist` to GitHub Pages.
