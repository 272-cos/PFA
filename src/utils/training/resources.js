/**
 * Curated Training Resource Registry
 *
 * Static list of verified training resource links per PFA component and exercise.
 * All links open in new tab (target="_blank"). No embedded content.
 *
 * Periodic review process:
 *   1. Quarterly (Mar, Jun, Sep, Dec): visit each URL and confirm it loads
 *   2. Update lastVerified date (YYYY-MM-DD) for any link that still works
 *   3. Replace or remove any broken/redirected links
 *   4. Add new official resources as they become available (DVIDS, HPRC, afpc.af.mil)
 *
 * Source types:
 *   'official'  - DoD / Air Force official channels (DVIDS, AFPC, af.mil, hprc-online.org)
 *   'vetted'    - Reputable third-party sources reviewed for accuracy (military.com, etc.)
 */

import { COMPONENTS, EXERCISES } from '../scoring/constants.js'

/**
 * @typedef {Object} TrainingResource
 * @property {string} title        - Display name for the link
 * @property {string} url          - Full absolute URL
 * @property {string} source       - 'official' | 'vetted'
 * @property {string} description  - One-sentence description shown below the title
 * @property {string} lastVerified - ISO date (YYYY-MM-DD) link was last confirmed working
 */

/** @type {Record<string, TrainingResource[]>} */
const RESOURCES = {
  // ----- CARDIO -----
  [COMPONENTS.CARDIO]: [
    {
      title: 'HPRC Air Force Physical Fitness Training Series',
      url: 'https://www.hprc-online.org/physical-fitness/training-performance/physical-fitness-training-series-air-force-physical-fitness',
      source: 'official',
      description: 'Official Human Performance Resource Center series with cardio, strength, and core training guidance for Air Force members.',
      lastVerified: '2026-03-01',
    },
    {
      title: 'Best Running Interval Workouts for Cardio Fitness (Military.com)',
      url: 'https://www.military.com/military-fitness/best-running-interval-workouts-improve-your-cardio-fitness',
      source: 'vetted',
      description: 'Evidence-based interval training plans designed to improve 2-mile run times for military fitness tests.',
      lastVerified: '2026-03-01',
    },
  ],

  // ----- CARDIO per-exercise: 2-mile run -----
  [EXERCISES.RUN_2MILE]: [
    {
      title: 'HPRC Air Force Physical Fitness Training Series',
      url: 'https://www.hprc-online.org/physical-fitness/training-performance/physical-fitness-training-series-air-force-physical-fitness',
      source: 'official',
      description: 'Official HPRC training series covering aerobic base building and run pacing strategies.',
      lastVerified: '2026-03-01',
    },
    {
      title: 'Best Running Interval Workouts for Cardio Fitness (Military.com)',
      url: 'https://www.military.com/military-fitness/best-running-interval-workouts-improve-your-cardio-fitness',
      source: 'vetted',
      description: 'Structured interval and tempo run workouts tailored to military 2-mile run standards.',
      lastVerified: '2026-03-01',
    },
  ],

  // ----- CARDIO per-exercise: HAMR shuttle -----
  [EXERCISES.HAMR]: [
    {
      title: 'HAMR Shuttle Run Instructions (DVIDS official video)',
      url: 'https://www.dvidshub.net/video/796774/hamr-shuttle-run',
      source: 'official',
      description: 'Official Defense Visual Information Distribution Service video demonstrating proper HAMR shuttle run execution and lane setup.',
      lastVerified: '2026-03-01',
    },
    {
      title: 'Official HAMR Audio Track (SoundCloud)',
      url: 'https://soundcloud.com/afpersonnel/hamr-audio',
      source: 'official',
      description: 'Official HAMR beep-test audio from Air Force Personnel Center for practice sessions.',
      lastVerified: '2026-03-01',
    },
    {
      title: 'HPRC Air Force Physical Fitness Training Series',
      url: 'https://www.hprc-online.org/physical-fitness/training-performance/physical-fitness-training-series-air-force-physical-fitness',
      source: 'official',
      description: 'HPRC guidance on shuttle run agility and aerobic conditioning for HAMR preparation.',
      lastVerified: '2026-03-01',
    },
  ],

  // ----- STRENGTH -----
  [COMPONENTS.STRENGTH]: [
    {
      title: 'HPRC Air Force Physical Fitness Training Series',
      url: 'https://www.hprc-online.org/physical-fitness/training-performance/physical-fitness-training-series-air-force-physical-fitness',
      source: 'official',
      description: 'Official HPRC series covering upper-body push strength development for push-up and HRPU standards.',
      lastVerified: '2026-03-01',
    },
    {
      title: 'Push-up Training Strategies for Military Fitness Tests',
      url: 'https://blog.hundredpushups.com/push-ups-for-military-fitness-tests-training-strategies/',
      source: 'vetted',
      description: 'Progressive push-up training program with periodization guidance for military test preparation.',
      lastVerified: '2026-03-01',
    },
    {
      title: 'Military Calisthenics Workout Guide (BetterMe)',
      url: 'https://betterme.world/articles/military-calisthenics-workout/',
      source: 'vetted',
      description: 'Full-body military calisthenics programming including push-up and HRPU progressions.',
      lastVerified: '2026-03-01',
    },
  ],

  // ----- STRENGTH per-exercise: push-ups -----
  [EXERCISES.PUSHUPS]: [
    {
      title: 'Push-up Training Strategies for Military Fitness Tests',
      url: 'https://blog.hundredpushups.com/push-ups-for-military-fitness-tests-training-strategies/',
      source: 'vetted',
      description: 'Progressive push-up training program with periodization guidance for military test preparation.',
      lastVerified: '2026-03-01',
    },
    {
      title: 'HPRC Air Force Physical Fitness Training Series',
      url: 'https://www.hprc-online.org/physical-fitness/training-performance/physical-fitness-training-series-air-force-physical-fitness',
      source: 'official',
      description: 'Official HPRC guidance on push strength development and proper push-up form.',
      lastVerified: '2026-03-01',
    },
  ],

  // ----- STRENGTH per-exercise: HRPU -----
  [EXERCISES.HRPU]: [
    {
      title: 'HPRC Air Force Physical Fitness Training Series',
      url: 'https://www.hprc-online.org/physical-fitness/training-performance/physical-fitness-training-series-air-force-physical-fitness',
      source: 'official',
      description: 'Official HPRC guidance covering hand-release push-up technique and upper-body endurance.',
      lastVerified: '2026-03-01',
    },
    {
      title: 'Military Calisthenics Workout Guide (BetterMe)',
      url: 'https://betterme.world/articles/military-calisthenics-workout/',
      source: 'vetted',
      description: 'Calisthenics programming that includes hand-release push-up progressions and recovery protocols.',
      lastVerified: '2026-03-01',
    },
  ],

  // ----- CORE -----
  [COMPONENTS.CORE]: [
    {
      title: 'HPRC Air Force Physical Fitness Training Series',
      url: 'https://www.hprc-online.org/physical-fitness/training-performance/physical-fitness-training-series-air-force-physical-fitness',
      source: 'official',
      description: 'Official HPRC series with core endurance training guidance for sit-ups, CLRC, and plank standards.',
      lastVerified: '2026-03-01',
    },
    {
      title: 'Military Calisthenics Workout Guide (BetterMe)',
      url: 'https://betterme.world/articles/military-calisthenics-workout/',
      source: 'vetted',
      description: 'Military core programming covering sit-ups, crunches, and plank hold progressions.',
      lastVerified: '2026-03-01',
    },
  ],

  // ----- BODY COMP -----
  [COMPONENTS.BODY_COMP]: [
    {
      title: 'HPRC Body Composition and Nutrition Resources',
      url: 'https://www.hprc-online.org/nutrition/body-composition',
      source: 'official',
      description: 'Human Performance Resource Center evidence-based guidance on body composition, nutrition, and waist measurement.',
      lastVerified: '2026-03-01',
    },
    {
      title: 'Total Force Fitness: Nutrition and Body Composition (AF.mil)',
      url: 'https://www.af.mil/News/Article-Display/Article/2833222/air-force-emphasizes-total-force-fitness/',
      source: 'official',
      description: 'Official Air Force guidance on total force fitness including body composition standards and healthy lifestyle resources.',
      lastVerified: '2026-03-01',
    },
  ],
}

/**
 * Get training resources for a given component or exercise.
 *
 * Priority: exercise-specific resources first; falls back to component-level.
 *
 * @param {string} component - COMPONENTS constant (e.g. COMPONENTS.CARDIO)
 * @param {string} [exercise] - EXERCISES constant (e.g. EXERCISES.HAMR); optional
 * @returns {TrainingResource[]} Deduplicated list of resources
 */
export function getTrainingResources(component, exercise) {
  const exerciseResources = exercise ? (RESOURCES[exercise] ?? []) : []
  const componentResources = RESOURCES[component] ?? []

  if (exerciseResources.length === 0) return componentResources

  // Deduplicate: exercise-level URLs take precedence; skip component ones with same URL
  const seen = new Set(exerciseResources.map(r => r.url))
  const extras = componentResources.filter(r => !seen.has(r.url))
  return [...exerciseResources, ...extras]
}

export default RESOURCES
