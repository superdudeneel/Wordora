# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

A simple blog application built with **Node.js**, **Express**, and **EJS** (server-side rendered views). Users can sign up, log in, view the home page, manage their blogs from a dashboard, and add new blog posts.


## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Templating:** EJS (server-rendered, no frontend framework)
- **Database:** configured in `db/` (check the connection file and `models/` for the exact ODM/driver in use)
- **Package manager:** npm (`package-lock.json` is committed)

## Project Structure

```
blog-app/
├── index.js          # App entry point: Express setup, middleware, route mounting
├── controllers/      # Request handlers (business logic for each route)
│   ├── blog.js
│   └── user.js
├── routes/           # Route definitions; map URLs to controllers
│   ├── blog.js
│   └── user.js
├── models/           # Database schemas/models
├── db/               # Database connection/config
├── middlewares/      # Custom Express middleware (e.g., auth checks)
├── services/         # Reusable helpers/logic (e.g., token or auth utilities)
├── views/            # EJS templates
│   ├── partials/     # Shared fragments (header, footer, navbar, etc.)
│   ├── home.ejs
│   ├── login.ejs
│   ├── signup.ejs
│   ├── dashboard.ejs
│   └── addBlog.ejs
├── PLAN.md           # Project plan / roadmap
└── AGENTS.md         # This file
```

## Setup & Commands

```bash
npm install          # install dependencies
npm start            # run the app (check package.json "scripts" for the exact command)
node index.js        # fallback if no start script is defined
```

- Check `package.json` for available scripts before assuming any exist (e.g., `dev`, `test`).
- Environment variables (DB URI, secrets, port) should live in a `.env` file. **Never commit `.env` or hardcode secrets.**

## Architecture & Conventions

### Request flow

`index.js` → `routes/*` → `middlewares/*` (if any) → `controllers/*` → `models/*` / `services/*` → `res.render('<view>')` or redirect.

### Layering rules

- **Routes** only define paths, HTTP methods, and attach middleware + controller. No business logic here.
- **Controllers** handle `req`/`res`, validate input, call models/services, and render or redirect.
- **Models** define schemas and data access only.
- **Services** hold reusable logic that isn't tied to `req`/`res`.
- **Middlewares** are for cross-cutting concerns (authentication, logging, error handling).

### Naming & placement

- Keep file names matched across layers: `routes/blog.js` ↔ `controllers/blog.js`, `routes/user.js` ↔ `controllers/user.js`.
- New feature areas should follow the same pattern: add a route file, a controller file, and a model if data is stored. Mount the new router in `index.js`.
- Use `camelCase` for variables/functions and `PascalCase` for models.
- Use `async/await` with `try/catch` in controllers; avoid nested callbacks.

### Views (EJS)

- Reuse `views/partials/` for shared layout pieces; don't duplicate headers/footers.
- Escape user content with `<%= %>`. Only use `<%- %>` for trusted, pre-sanitized HTML.
- Keep logic in templates minimal (simple loops/conditionals only). Do data prep in the controller.
- Pass only the data a view needs through `res.render()`.

## Security Guidelines

- Hash passwords (e.g., bcrypt) before storing; never store or log plaintext passwords.
- Protect routes like the dashboard and add-blog pages with authentication middleware.
- Validate and sanitize all user input (blog title/content, signup/login fields).
- Verify that a user can only edit or delete their own blogs.
- Never commit secrets, tokens, or `.env` files.

## Do's and Don'ts

**Do**
- Read existing controllers/routes before adding new ones and match their style.
- Make small, focused changes and keep the existing folder structure.
- Handle errors and return meaningful responses or error pages.
- Update `PLAN.md` when completing or adding planned work.

**Don't**
- Don't edit anything in `node_modules/`.
- Don't put business logic in route files or heavy logic in EJS templates.
- Don't add new dependencies without a clear need; prefer what's already installed.
- Don't rename or restructure top-level folders without being asked.
- Don't modify `package-lock.json` manually.

## Testing & Verification

There is no test setup defined by default. After making changes:

1. Start the server and confirm it boots without errors.
2. Manually test the affected flow in the browser (signup, login, dashboard, add blog).
3. Check the terminal for runtime errors or unhandled promise rejections.

If you add tests, place them in a `tests/` directory and add a `test` script to `package.json`.

## Notes for Agents

- When unsure about a convention, follow the pattern in the existing `blog` and `user` controllers/routes.
- Ask for clarification before making large architectural changes (e.g., switching template engine, adding a frontend framework, changing the database).