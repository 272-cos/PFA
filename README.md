# USAF PFA Readiness Tracker

**v1.0 | February 2026 | UNOFFICIAL SELF-CHECK TOOL**

A mobile-first web application for USAF Airmen to self-check fitness performance against 2026 PFA scoring standards (50-20-15-15 model), project readiness toward future PFA dates, and generate supervisor-ready reports.

## ⚠️ Important Disclaimer

**THIS IS AN UNOFFICIAL TOOL.** This application is not affiliated with, endorsed by, or representative of the United States Air Force, Department of Defense, or any official government entity.

- This tool provides **score estimates** only, not official PFA scores
- Self-checks have no official standing
- Always refer to official DAFMAN 36-2905 and your Unit Fitness Program Manager (UFPM) for authoritative guidance
- Official PFAs are administered at Fitness Assessment Cells (FACs) or by Unit Fitness Assessment Coordinators (UFACs)

## Features

### Core Capabilities

- **Self-Check Entry**: Record performance data for all four PFA components
  - Cardio: 2-mile run, HAMR shuttle run, or 2km walk (profile-only)
  - Strength: Push-ups or Hand-Release Push-Ups (HRPU)
  - Core: Sit-ups, Cross-Leg Reverse Crunches (CLRC), or Forearm Plank
  - Body Composition: Waist-to-Height Ratio (WHtR)

- **Score Estimation**: Instant composite score calculation based on provisional AFPC charts (Sep 2025)

- **Readiness Projection**: Forward-looking estimates for future PFA dates
  - Linear, logarithmic, and historical trend models
  - Age group rollover support
  - Component-specific gap analysis and improvement recommendations

- **History Tracking**: Store multiple self-checks via compact S-codes
  - Portable, shareable codes
  - Trend visualization
  - Outlier flagging

- **Supervisor Reports**: Generate formatted reports with optional projections
  - No PII stored in codes
  - Clipboard copy and print support

### Technical Features

- **Zero Backend**: All data in URL parameters or session storage
- **Mobile-First**: Optimized for use at gym, track, or FAC
- **Offline-Ready**: Static deployment, works without constant connection
- **Shareable**: Web Share API integration for easy code sharing
- **Altitude Support**: Corrections for 7 high-altitude installations

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/mwilco03/PFA.git
cd PFA

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run linter
npm run lint
```

## Usage Guide

### 1. Set Up Your Profile (One-Time)

1. Navigate to the **Profile** tab
2. Enter your date of birth and select gender
3. Copy or share your D-code for future sessions
4. Save this code securely (Notes app, password manager, etc.)

Your D-code contains: `DOB + gender` (nothing else, ~9 characters)

### 2. Perform a Self-Check

1. Navigate to the **Self-Check** tab
2. Enter the date of your workout
3. For each component:
   - Select your exercise type (segmented control)
   - Enter your performance (reps, time, measurements)
   - Toggle exemption if you have an AF Form 469 profile
4. Optional: Add contextual feedback (RPE, sleep, nutrition, etc.)
5. If at a high-altitude base in CO/WY/NM, toggle altitude and select your base

Your live score estimate updates automatically. Copy your S-code when done.

### 3. Project Future Readiness

1. Navigate to the **Project** tab
2. Enter your target PFA date
3. Select projection model (linear, log, or historical trend)
4. Review component-specific gaps and weekly improvement targets

### 4. Generate a Report

1. Navigate to the **Report** tab
2. Enter rank, name, and unit (not stored or encoded)
3. Toggle projection section if desired
4. Copy to clipboard or print

## Tech Stack

- **Frontend**: React 18 with modern hooks
- **Build Tool**: Vite 6 (fast HMR, optimized builds)
- **Styling**: Tailwind CSS 3 (mobile-first, utility classes)
- **Icons**: Heroicons 2 (React components)
- **Charts**: Recharts 2 (responsive, React-native)
- **Testing**: Vitest with jsdom
- **Linting**: ESLint 9 with React plugins
- **Hosting**: GitHub Pages (static deployment)

## Project Structure

```
PFA/
├── .claude/
│   ├── hooks/
│   │   └── session-start.sh      # Auto-install dependencies (Claude Code web)
│   └── settings.json              # Claude Code hook registration
├── src/
│   ├── components/                # React components (to be created)
│   ├── utils/                     # Utility functions (to be created)
│   │   ├── scoring/              # Scoring engine
│   │   ├── codec/                # D-code/S-code encoding/decoding
│   │   └── projection/           # Projection models
│   ├── App.jsx                    # Main application component
│   ├── main.jsx                   # Application entry point
│   └── index.css                  # Global styles with Tailwind
├── index.html                     # HTML entry point
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind configuration
├── eslint.config.js               # ESLint configuration
├── package.json                   # Dependencies and scripts
└── usaf-pt-tracker-design-v1.3.md # Full design specification
```

## Development Roadmap

Implementation follows the phased approach in the design document:

- **Phase 1**: Scoring Engine ✅ (Next)
  - Pure functions for all 18 age/gender brackets
  - WHtR universal table
  - Component minimums and prorated composites
  - Comprehensive unit tests

- **Phase 2**: Code Codec
  - D-code/S-code encode/decode with CRC-8
  - Base64url encoding
  - Error handling and validation

- **Phase 3**: Profile + Self-Check UI
  - Tab navigation
  - Live score banner
  - Web Share API integration
  - URL hydration

- **Phase 4**: Projection Engine
  - Linear, logarithmic, and historical trend models
  - Age group rollover
  - Gap analysis

- **Phase 5**: History Tab
  - S-code management
  - Outlier flagging
  - Trend visualization

- **Phase 6**: Report Generation
  - Formatted output
  - Clipboard and print support

- **Phase 7**: Polish + Deploy
  - Accessibility improvements
  - Service worker for offline support
  - GitHub Pages CI/CD

## Regulatory Context

As of February 8, 2026:

- **Diagnostic Period**: March 1 - June 30, 2026 (non-scored)
- **Official Scored PFAs**: Begin July 1, 2026
- **Standards**: DAFMAN 36-2905 (Change 1, 22 Jan 2026)
- **Scoring Charts**: AFPC 50-20-15-15 Model (Sep 23, 2025, **provisional**)
- **HAMR Flexibility**: Can substitute for both semiannual 2-mile runs

**Note**: Revised scoring charts are "coming soon" but not yet published. This app uses Sep 2025 provisional charts.

## Key Design Principles

### Guardrails (Locked Decisions)

1. **2026+ standards ONLY** - No legacy 60-20-20 model
2. **Separate D-code and S-code** - Demographics entered once, self-checks create individual S-codes
3. **No free-text input** - All feedback enumerated to prevent content moderation issues
4. **Mobile-first** - Phone is primary device at gym/track/FAC
5. **Zero backend** - Static site, no auth, no database
6. **Unofficial disclaimer** - Persistent on every screen
7. **No PII in codes** - Rank/name/unit only at report time, never encoded

### Code Format

- **D-code**: `D1-[base64url][CRC-8]` (~9 chars)
  - Contains: schema version, DOB, gender
  - Entered once, reused for all self-checks

- **S-code**: `S1-[base64url][CRC-8]` (~22 chars)
  - Contains: schema version, chart version, date, all performance data, feedback
  - One per self-check
  - Scores recalculated at decode time (enables automatic re-scoring when charts update)

## Contributing

This project follows the design specification in `usaf-pt-tracker-design-v1.3.md`. Please review the design document before contributing to understand:

- Locked guardrail decisions (GR-01 through GR-15)
- Input validation rules (IV-01 through IV-13)
- Scoring logic requirements (SL-01 through SL-10)
- Edge case handling (EC-01 through EC-29)
- UX principles (UX-01 through UX-13)

### Development Setup with Claude Code on the Web

This repository includes a session-start hook that automatically installs dependencies when using Claude Code on the web:

1. The hook runs automatically on session start (synchronous mode)
2. Installs all npm dependencies before your session begins
3. Ensures tests and linters are ready to use immediately

To switch to async mode for faster session startup:
- Edit `.claude/hooks/session-start.sh`
- Add `echo '{"async": true, "asyncTimeout": 300000}'` at the top

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

All edge cases from the design document should have corresponding unit tests.

### Code Style

```bash
# Lint all files
npm run lint

# Auto-fix linting issues (where possible)
npm run lint -- --fix
```

## Deployment

The application is configured for GitHub Pages deployment:

```bash
# Build for production
npm run build

# Deploy to GitHub Pages (configure in repository settings)
# Set base path in vite.config.js to match your repository name
```

## License

[Add appropriate license]

## Support

For questions about official Air Force fitness standards:
- Reference DAFMAN 36-2905
- Contact your Unit Fitness Program Manager (UFPM)
- Visit your Fitness Assessment Cell (FAC)

For technical issues with this application:
- Open an issue on GitHub
- Review the design document for clarification
- Check edge case handling in the specification

## Acknowledgments

Based on DAFMAN 36-2905 and AFPC provisional scoring charts. Built to help Airmen prepare for the 2026 PFA transition.

**Remember**: This is a self-check tool for personal readiness tracking. Always rely on official channels for authoritative fitness assessment guidance.
