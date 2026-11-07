# UI polish plan

Medium-style reading layout for the existing Blogify pages. Dark mode included. The only added route is `/library` for saved stories.

## Pages

- `views/home.ejs` — single-column story list, topic filter, search
- `views/signup.ejs` — account form
- `views/login.ejs` — sign-in form
- `views/addBlog.ejs` — writing surface
- `views/readBlog.ejs` — a single story at `/blog/:id`
- `views/viewProfile.ejs` — your profile at `/myprofile`, and another person’s profile from the profile route. On someone else’s profile, Follow becomes Following when `following` is true, and Unfollow sits beside it.
- `views/dashboard.ejs` — same shell, not routed yet
- `views/library.ejs` — saved stories at `/library`
- Shared partials: `views/partials/head.ejs`, `views/partials/navbar.ejs`, `views/partials/sidebar.ejs`, `views/partials/script.ejs`
- Styles: `public/styles.css`

## What stays the same

- Signup posts to `/signup` with `username`, `email`, and `password`.
- Login posts to `/login` with `email` and `password`.
- Add blog posts to `/blog/add-new` with `title`, `category`, `imageUrl`, and `body`.
- Home still lists `allBlogs` and links each story to `/blog/:id`, which renders `readBlog`.
- A cover image is optional. Publishing without one no longer throws.

## Visual rules

- Paper background, near-black ink, Medium green (`#1A8917`) only on primary actions.
- Source Serif 4 for titles and the wordmark. Source Sans 3 for the interface.
- One reading column. Story rows, not cards. Dark mode via `data-theme` on `<html>`, saved in `localStorage`.
- The same left rail on every page: Home, Library, Profile, and Create blog.
