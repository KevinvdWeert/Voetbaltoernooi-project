# Football Tournament Project

A lightweight PHP + MySQL backend with a React (UMD) single-page UI styled with Tailwind via CDN. Inspired by Flashscore for quick navigation, live-ish match status, and fast search.

## Overview
- Frontend: React 18 (UMD) + Tailwind (CDN), hash-based routing.
- Backend: PHP 8 + PDO, JSON APIs under `api/data.php` using a centralized `jsonResponse()` helper.
- Auth: Session-based; secure cookies; password hashing with opportunistic rehash on login.
- Accessibility: ARIA roles, aria-live toast region, keyboard shortcuts (press `/` to open search, `Esc` to close).
- Theme: Dark/light stored in `localStorage` and applied to `html.dark`.

## Project Structure
- `assets/js/app.jsx`: React SPA (Header, pages, search, settings dropdown, etc.).
- `assets/js/script.js`: Loader/progress/toasts (with aria-live announcements).
- `api/data.php`: API endpoints (`teams`, `team`, `matches`, `stats`, `search`).
- `includes/init.php`: Bootstraps DB, sessions, utilities (CSRF + jsonResponse).
- `includes/header.php`: Mount points for React, exposes `APP_SESSION` and `CSRF_TOKEN`.
- `database/voetbaltoernooi_base.sql`: Initial schema.
- `manifest.json`: PWA metadata (en locale, icons, scope).

## Running Locally (Laragon/WAMP)
1. Place the project under your web root (e.g., Laragon `www`).
2. Create a database using `database/voetbaltoernooi_base.sql`.
3. Configure DB credentials in `config/config.php`.
4. Navigate to the site (e.g., `http://localhost/Voetbaltoernooi-project/`).

## API Contract
All endpoints return JSON via `jsonResponse()` with shape:
```
{ "success": true|false, "data": any, "error": { "message": string, "code"?: string } }
```
- `GET api/data.php?action=teams`
- `GET api/data.php?action=team&id=<id>`
- `GET api/data.php?action=matches`
- `GET api/data.php?action=stats`
- `GET api/data.php?action=search&query=<term>` (also accepts `q`)

Live match status is derived server-side based on `match_date` window.

## Security
- Sessions: `httponly`, `samesite=Lax` (enable `secure` in production over HTTPS).
- CSRF: Token helpers in `includes/init.php`; token exposed as `window.CSRF_TOKEN` for forms.
- Passwords: `password_hash`/`password_verify`; rehash on login when algorithm params change.
- Headers: Basic hardening in `includes/header.php` (`X-Frame-Options`, `X-Content-Type-Options`).

## UI/UX Highlights
- Header with search overlay, mobile nav, active link highlight.
- Settings dropdown: contains dark mode toggle and space for future options.
- Debounced search with skeleton states and retry logic.
- Accessible toasts via aria-live; keyboard shortcuts: `/` (search), `Esc` (close overlays).

## Conventions
- Dark mode: Apply/remove `html.dark` and persist `localStorage.theme`.
- API fetch: Expect `{success, data}` and handle errors uniformly.
- Routing: Use hash routes: `#/`, `#/teams`, `#/matches`, `#/results`, `#/team/:id`.

## Next Steps
- Prune unused legacy CSS selectors under `assets/css/style.css` (ensure not used by any PHP page).
- Add CSRF hidden field in server-rendered forms (e.g., Contact page) and validate server-side.
- Optionally migrate from in-browser Babel to Vite for faster dev + production builds.
- Add DB indexes for `matches(match_date, status)` and make `teams.captain_id` nullable if UI allows.
