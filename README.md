# about-sparq

Standalone public About website for **sparq** (independent from the Flutter app).

## Files
- `index.html`: Full page structure and section content
- `style.css`: Premium dark glassmorphism design, animated blobs, responsive layout, motion styles
- `script.js`: Hero sequencing, IntersectionObserver reveals, shortcut-nav active state, countdown, stats count-up, timeline reveal, cursor glow, waitlist ticker
- `README.md`: Local usage and project notes

## Section Map
- `#intro`
- `#meet-people`
- `#groups`
- `#events`
- `#stories`
- `#intercollege`
- `#why-students`
- `#features`
- `#stats`
- `#vision`
- `#trust`
- `#campus`
- `#join`

## Notes
- Top sticky shortcut nav is keyboard accessible and uses IntersectionObserver for active highlighting.
- The page uses CSS-only animated background blobs (no external images, no external libraries).
- All CTAs are frontend links to the external Google Form.
- Countdown target is set to **August 15, 2026**.
- This folder is fully separate from `sparq/`, `sparq-admin/`, `sparq-backend/`, and app routes/navigation.

## Open Locally
Open this file directly in a browser:
- `about-sparq/index.html`

Or from your repo root (`sparq-app`), double-click `about-sparq/index.html`.
