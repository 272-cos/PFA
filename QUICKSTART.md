# Quick Start Guide

Get the USAF PFA Tracker running in 5 minutes.

## Installation

```bash
# Clone the repository
git clone https://github.com/mwilco03/PFA.git
cd PFA

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser to `http://localhost:5173`

## First-Time Setup

### 1. Create Your D-Code (One-Time)

Your D-code is your demographic identifier. You'll create it once and reuse it for all self-checks.

1. Go to **Profile** tab
2. Enter your **Date of Birth**
3. Select your **Gender**
4. Tap **Copy D-Code** or **Share**
5. Save it somewhere safe (Notes app, password manager)

**Example D-code**: `D1-abc123ef` (~9 characters)

Your D-code contains ONLY: DOB + gender. No name, rank, or other PII.

### 2. Record Your First Self-Check

1. Go to **Self-Check** tab
2. Enter today's date (or workout date)
3. Fill in your performance:

   **Cardio** (choose one):
   - 2-mile run time (mm:ss)
   - HAMR shuttles or time
   - 2km walk (profile only)

   **Strength** (choose one):
   - Push-ups (reps in 1 min)
   - Hand-Release Push-Ups (reps in 2 min)

   **Core** (choose one):
   - Sit-ups (reps in 1 min)
   - Cross-Leg Reverse Crunches (reps in 2 min)
   - Forearm Plank (time in mm:ss)

   **Body Composition**:
   - Height (inches)
   - Waist (inches, measured at belly button)

4. Watch your score update live at the top
5. Tap **Copy S-Code** or **Share** to save this self-check

**Example S-code**: `S1-xyz789abcdef12345` (~22 characters)

### 3. Optional: Add Context

Tap the feedback section to record:
- How hard it felt (RPE)
- Sleep quality
- Nutrition timing
- Injuries (Yes/No)
- Environment conditions
- Confidence level

This helps explain outliers in your trend data.

### 4. High Altitude? (CO/WY/NM Only)

If you're at one of the 7 high-altitude USAF bases:

1. Toggle "Are you at a base in CO, WY, or NM?"
2. Select your base from the dropdown
3. Future altitude corrections will apply automatically

**High-altitude bases**: USAF Academy, Schriever SFB, Cheyenne Mountain SFS, F.E. Warren AFB, Peterson SFB, Buckley SFB, Kirtland AFB

## Using Your Codes

### Load Your D-Code

**Profile Tab**:
- Paste your D-code into the field
- Tap "Load"
- Your DOB and gender populate automatically

### Load S-Codes (History)

**History Tab**:
- Paste one or more S-codes
- View all past self-checks
- See trends over time
- Flag outliers (bad days)

### Share via URL

Your codes can be shared via URL:

```
https://yoursite.com/?d=D1-abc123ef&s=S1-xyz789ab&tab=check
```

Parameters:
- `d` = D-code
- `s` = S-code (can include multiple: `&s=S1-xxx&s=S1-yyy`)
- `tab` = profile | check | project | history | report

## Project Future Readiness

**Project Tab**:

1. Enter your target PFA date
2. Select projection model:
   - **Linear**: Straight-line improvement (1+ self-checks)
   - **Logarithmic**: Diminishing returns model (2+ self-checks)
   - **Historical Trend**: Best fit from your data (3+ self-checks)
3. Review component gaps and weekly improvement targets

**Example output**:
- "Cardio: Need 0.5 sec/week improvement to pass"
- "Strength: Surplus of 8 reps above minimum"
- "Composite projection: 82.4 (PASS)"

## Generate a Report

**Report Tab**:

1. Enter rank, name, unit (NOT stored or encoded)
2. Review your self-check summary
3. Toggle projection section ON/OFF
4. Tap **Copy** (email/Teams) or **Print** (hardcopy)

**Report includes**:
- Current score estimate
- Component breakdowns
- Exemptions and profiles
- D-code and S-code(s) for verification
- Optional: Projected readiness for target date
- Watermark: "UNOFFICIAL SELF-CHECK"

Share with your supervisor, UFPM, or keep for your records.

## Common Workflows

### Workflow 1: Weekly Self-Check

```
1. Do your workout
2. Open app → Self-Check tab
3. Enter performance data
4. Copy S-code
5. Paste into Notes app with date
```

### Workflow 2: Monthly Review with Supervisor

```
1. Open app → History tab
2. Paste all S-codes from Notes app
3. Review trend chart
4. Navigate to Report tab
5. Enter rank/name/unit
6. Copy report → email to supervisor
```

### Workflow 3: Pre-PFA Projection

```
1. Load all S-codes in History tab
2. Navigate to Project tab
3. Enter PFA date
4. Select "Historical Trend" model
5. Review gaps and weekly targets
6. Adjust training plan accordingly
```

## Tips & Tricks

### Time Entry Formats

All time inputs accept both formats:
- **mm:ss** → `12:30` (12 minutes 30 seconds)
- **seconds** → `750` (same as 12:30)

Display always shows mm:ss.

### HAMR Hidden Feature

HAMR field accepts:
- **Shuttles** → `94`
- **Time** → `12:30` (auto-converts to shuttles)

If you know your time but not shuttles, just enter the time. The app silently converts it.

### Exemptions

Toggle exemption for any component with an AF Form 469 medical profile:
- 0 earned, 0 possible for that component
- Composite scored from remaining components
- Walk (2km) only appears when cardio is exempt

### Age Group Rollover

Your age group is calculated from:
- **Self-check date**: DOB + self-check date
- **Projection date**: DOB + target PFA date

If you're aging into a new bracket, projections use the new bracket's standards automatically.

### Score Estimate vs Official Score

**This app provides ESTIMATES, not official scores.**

- Official PFA = administered at FAC or by UFAC
- Self-check = personal data you enter into this app
- Score estimate = calculated from provisional Sep 2025 charts
- Readiness projection = forward-looking model, not a guarantee

Always defer to your UFPM and official channels.

## Keyboard Shortcuts (Desktop)

- `Tab` / `Shift+Tab` → Navigate fields
- `Enter` on segmented control → Select option
- `Cmd/Ctrl + C` on code display → Copy code
- `Cmd/Ctrl + P` in Report tab → Print

## Mobile Gestures

- **Swipe left/right** → Navigate tabs (if enabled)
- **Tap and hold** on code → Copy to clipboard
- **Share button** → Native OS share sheet (iOS/Android)

## Troubleshooting

### "Invalid code: checksum mismatch"

Your code was truncated or corrupted. Common causes:
- Messaging app added line breaks
- Copy/paste didn't capture full code
- Code was edited

**Fix**: Copy the code again carefully, ensuring no spaces or newlines.

### "Age at self-check date is outside USAF service range"

Your DOB produces an age <17 or >65 at the self-check date.

**Fix**: Verify your DOB is correct in Profile tab.

### "Target date must be after your last self-check"

Your target PFA date is before your most recent self-check.

**Fix**: Enter a future date or record a new self-check.

### Scores look wrong

**Check**:
1. Chart version (Sep 2025 provisional)
2. Age group calculated correctly
3. Gender matches
4. Exercise type selected correctly
5. WHtR rounded to 2 decimals before lookup

**Remember**: Provisional charts may change before Jul 2026.

## Development Commands

```bash
# Development server (hot reload)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run linter
npm run lint

# Run linter with auto-fix
npm run lint -- --fix
```

## Need Help?

- **Official PFA questions**: Contact your UFPM or FAC
- **App technical issues**: Open GitHub issue
- **Design clarification**: See `usaf-pt-tracker-design-v1.3.md`

## Remember

✅ This is an **unofficial** self-check tool
✅ Use it for **personal readiness tracking**
✅ Always rely on **official channels** for authoritative guidance
✅ Save your **D-code and S-codes** securely

Happy training! 💪
