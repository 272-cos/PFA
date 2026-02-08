# Claude Code Memory - PFA Trajectory App

## Critical Information

### User Workflow
- **ALL CHANGES GO THROUGH PULL REQUESTS** - User creates PRs to merge to main
- Feature branch naming: `claude/setup-repository-[hash]`
- PRs are reviewed and merged by user
- Do NOT push directly to main

### GitHub Pages Deployment Issue (2026-02-08)

**Problem Found:**
- Root `index.html` (development file) was being served instead of built `dist/index.html`
- Browser error: "Loading module from https://mwilco03.github.io/src/main.jsx was blocked because of a disallowed MIME type"
- GitHub Pages must be configured to deploy from "GitHub Actions" NOT "Deploy from branch"

**Root Cause:**
1. GitHub Pages was configured to deploy from **branch** instead of **GitHub Actions**
2. When deploying from branch, it serves root `index.html` (source file with `/src/main.jsx`)
3. When deploying from Actions, it serves `dist/index.html` (built file with `/PFA/assets/index-[hash].js`)

**Solution:**
- Root `index.html` MUST exist - it's the Vite source file (do NOT delete it!)
- GitHub Actions workflow already configured correctly to deploy ./dist folder
- **THE FIX:** GitHub Pages settings → Source must be set to "GitHub Actions" NOT "Deploy from a branch"
- This is a GitHub repo settings issue, not a code issue

### Project Structure
- Vite + React 18 + Tailwind CSS
- Base path: `/PFA/` (for GitHub Pages mwilco03/PFA)
- Development: `npm run dev` → http://localhost:5173/PFA/
- Production: Build to dist/, deploy via GitHub Actions

### Common Issues Checklist

**White screen on deployed site:**
1. ✅ Check browser console for MIME type errors
2. ✅ Verify GitHub Pages source is "GitHub Actions" not "Branch"
3. ✅ Ensure root index.html doesn't exist (should only be in dist/)
4. ✅ Check dist/index.html has correct base path `/PFA/`
5. ✅ Verify vite.config.js has `base: '/PFA/'`

**App works locally but not deployed:**
- Local dev server ignores base path issues
- Production must have correct base path
- Check Network tab for 404s on assets

### Files That Should NOT Be in Git Root
- `dist/` folder - In .gitignore, built by GitHub Actions on deployment

### Files That MUST Be in Git Root
- **`index.html`** - Vite source file (entry point for build)
- `vite.config.js` - Build configuration
- `.github/workflows/deploy.yml` - Deployment workflow
- `src/` - Source code
- `public/` - Static assets
- `package.json` - Dependencies

### Code Changes That Broke Deployment (2026-02-08)

**Changes that DIDN'T break it:**
- Removed assessment date picker from SelfCheckTab ✓
- Added target PFA date to ProfileTab ✓
- Added targetPfaDate to AppContext ✓
- Added decodeDCode import and call in AppContext ✓

**Actual cause of white screen:**
- GitHub Pages was set to deploy from "branch" instead of "GitHub Actions"
- This served root index.html (source with `/src/main.jsx`) instead of dist/index.html (built with `/PFA/assets/`)
- NOT a code issue - purely a GitHub repo settings issue
- **Fix:** Go to repo Settings → Pages → Source → select "GitHub Actions"

### Lessons Learned
- Always check browser console Network tab for MIME type errors
- White screen ≠ code bug (can be deployment config)
- Root index.html should not exist in git for Vite projects
- GitHub Actions can build correctly but Pages source must point to Actions artifact
