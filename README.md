# G2 Fitness website

Your own copy of g2fitness.org, hosted on Netlify from your GitHub repo.

## What's where
- `build.py` — all page text lives here. Edit text, then commit; Netlify rebuilds automatically.
- `static/js/links.js` — **paste your Stripe Payment Links here**, one per plan. Blank = button goes to the contact form.
- `static/images/` — put `logo.jpg`, `trevon.jpg`, `parisi.jpg` here (see README.txt in that folder).
- `static/css/style.css` — colors and fonts (top of file).
- Contact form uses Netlify Forms; submissions show in Netlify → your site → Forms.

## Go live
1. GitHub: create a new repo (e.g. `g2fitness-site`) → "uploading an existing file" → drag in everything from this folder → Commit.
2. Netlify: Add new site → Import an existing project → GitHub → pick the repo. Build settings fill in from `netlify.toml`. Deploy.
3. Netlify → Forms: make sure form detection is on, then send a test from /sign-up/. Under Forms → Notifications, add an email notification to coachtre@g2fitness.org.
4. Stripe: create a Payment Link per plan, paste each into `static/js/links.js` in GitHub (pencil icon → edit → Commit).
5. Domain: Netlify → Domain management → Add `g2fitness.org` and `www.g2fitness.org`, then update DNS at your domain registrar as Netlify instructs. Do this last, once everything above tests clean.
