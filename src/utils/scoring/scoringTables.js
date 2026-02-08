/**
 * Scoring tables for 2026 PFA (50-20-15-15 model)
 * SIMPLIFIED VERSION - Male/Female 20-29 only
 * TODO: Add remaining 16 age/gender brackets from official AFPC charts
 */

import { EXERCISES, GENDER, AGE_GROUPS } from './constants.js'

/**
 * Scoring table structure:
 * {
 *   [gender]: {
 *     [ageGroup]: {
 *       [exercise]: [
 *         { threshold, points },
 *         ...
 *       ]
 *     }
 *   }
 * }
 *
 * For times (run/walk): threshold = max time in seconds for that point value
 * For reps/shuttles: threshold = minimum reps/shuttles for that point value
 * For WHtR: threshold = max ratio for that point value
 */

// Simplified scoring tables (Male 20-29, Female 20-29)
// Based on provisional Sep 2025 charts - PLACEHOLDER VALUES
export const SCORING_TABLES = {
  [GENDER.MALE]: {
    [AGE_GROUPS.AGE_20_29]: {
      // 2-mile run (cardio, 50 points max) - time in seconds
      [EXERCISES.RUN_2MILE]: [
        { threshold: 780, points: 50.0 }, // 13:00 or faster = 50 pts
        { threshold: 810, points: 48.0 }, // 13:30
        { threshold: 840, points: 46.0 }, // 14:00
        { threshold: 870, points: 44.0 }, // 14:30
        { threshold: 900, points: 42.0 }, // 15:00
        { threshold: 930, points: 40.0 }, // 15:30
        { threshold: 960, points: 38.0 }, // 16:00
        { threshold: 990, points: 36.0 }, // 16:30
        { threshold: 1020, points: 34.0 }, // 17:00
        { threshold: 1050, points: 32.0 }, // 17:30
        { threshold: 1080, points: 30.0 }, // 18:00 - MINIMUM PASSING (60%)
      ],

      // Push-ups (strength, 15 points max) - reps
      [EXERCISES.PUSHUPS]: [
        { threshold: 67, points: 15.0 },
        { threshold: 62, points: 14.0 },
        { threshold: 57, points: 13.0 },
        { threshold: 52, points: 12.0 },
        { threshold: 47, points: 11.0 },
        { threshold: 42, points: 10.0 },
        { threshold: 37, points: 9.0 }, // MINIMUM PASSING (60%)
        { threshold: 32, points: 8.0 },
        { threshold: 27, points: 7.0 },
      ],

      // Sit-ups (core, 15 points max) - reps
      [EXERCISES.SITUPS]: [
        { threshold: 58, points: 15.0 },
        { threshold: 54, points: 14.0 },
        { threshold: 50, points: 13.0 },
        { threshold: 46, points: 12.0 },
        { threshold: 42, points: 11.0 },
        { threshold: 38, points: 10.0 },
        { threshold: 34, points: 9.0 }, // MINIMUM PASSING (60%)
        { threshold: 30, points: 8.0 },
      ],

      // Plank (core, 15 points max) - time in seconds
      [EXERCISES.PLANK]: [
        { threshold: 210, points: 15.0 }, // 3:30+
        { threshold: 180, points: 14.0 }, // 3:00
        { threshold: 150, points: 13.0 }, // 2:30
        { threshold: 120, points: 12.0 }, // 2:00
        { threshold: 105, points: 11.0 }, // 1:45
        { threshold: 90, points: 10.0 }, // 1:30
        { threshold: 75, points: 9.0 }, // 1:15 - MINIMUM PASSING
      ],

      // HAMR Shuttle (cardio, 50 points max) - shuttles completed
      [EXERCISES.HAMR]: [
        { threshold: 120, points: 50.0 },
        { threshold: 110, points: 48.0 },
        { threshold: 100, points: 46.0 },
        { threshold: 94, points: 44.0 },
        { threshold: 88, points: 42.0 },
        { threshold: 82, points: 40.0 },
        { threshold: 76, points: 38.0 },
        { threshold: 70, points: 36.0 },
        { threshold: 64, points: 34.0 },
        { threshold: 58, points: 32.0 },
        { threshold: 52, points: 30.0 }, // MINIMUM PASSING (60%)
      ],

      // Hand-Release Push-ups (strength, 15 points max) - reps in 2 min
      [EXERCISES.HRPU]: [
        { threshold: 57, points: 15.0 },
        { threshold: 53, points: 14.0 },
        { threshold: 49, points: 13.0 },
        { threshold: 45, points: 12.0 },
        { threshold: 41, points: 11.0 },
        { threshold: 37, points: 10.0 },
        { threshold: 33, points: 9.0 }, // MINIMUM PASSING (60%)
        { threshold: 29, points: 8.0 },
        { threshold: 25, points: 7.0 },
      ],

      // Cross-Leg Reverse Crunches (core, 15 points max) - reps in 2 min
      [EXERCISES.CLRC]: [
        { threshold: 60, points: 15.0 },
        { threshold: 56, points: 14.0 },
        { threshold: 52, points: 13.0 },
        { threshold: 48, points: 12.0 },
        { threshold: 44, points: 11.0 },
        { threshold: 40, points: 10.0 },
        { threshold: 36, points: 9.0 }, // MINIMUM PASSING (60%)
        { threshold: 32, points: 8.0 },
      ],

      // 2km Walk (cardio, 50 points max) - time in seconds
      [EXERCISES.WALK_2KM]: [
        { threshold: 1020, points: 50.0 }, // 17:00 or faster
        { threshold: 1050, points: 48.0 }, // 17:30
        { threshold: 1080, points: 46.0 }, // 18:00
        { threshold: 1110, points: 44.0 }, // 18:30
        { threshold: 1140, points: 42.0 }, // 19:00
        { threshold: 1170, points: 40.0 }, // 19:30
        { threshold: 1200, points: 38.0 }, // 20:00
        { threshold: 1230, points: 36.0 }, // 20:30
        { threshold: 1260, points: 34.0 }, // 21:00
        { threshold: 1290, points: 32.0 }, // 21:30
        { threshold: 1320, points: 30.0 }, // 22:00 - MINIMUM PASSING
      ],
    },
  },

  [GENDER.FEMALE]: {
    [AGE_GROUPS.AGE_20_29]: {
      // 2-mile run (cardio, 50 points max) - time in seconds
      [EXERCISES.RUN_2MILE]: [
        { threshold: 900, points: 50.0 }, // 15:00 or faster
        { threshold: 930, points: 48.0 }, // 15:30
        { threshold: 960, points: 46.0 }, // 16:00
        { threshold: 990, points: 44.0 }, // 16:30
        { threshold: 1020, points: 42.0 }, // 17:00
        { threshold: 1050, points: 40.0 }, // 17:30
        { threshold: 1080, points: 38.0 }, // 18:00
        { threshold: 1110, points: 36.0 }, // 18:30
        { threshold: 1140, points: 34.0 }, // 19:00
        { threshold: 1170, points: 32.0 }, // 19:30
        { threshold: 1200, points: 30.0 }, // 20:00 - MINIMUM PASSING
      ],

      // Push-ups (strength, 15 points max) - reps
      [EXERCISES.PUSHUPS]: [
        { threshold: 47, points: 15.0 },
        { threshold: 43, points: 14.0 },
        { threshold: 39, points: 13.0 },
        { threshold: 35, points: 12.0 },
        { threshold: 31, points: 11.0 },
        { threshold: 27, points: 10.0 },
        { threshold: 23, points: 9.0 }, // MINIMUM PASSING
        { threshold: 19, points: 8.0 },
      ],

      // Sit-ups (core, 15 points max) - reps
      [EXERCISES.SITUPS]: [
        { threshold: 54, points: 15.0 },
        { threshold: 50, points: 14.0 },
        { threshold: 46, points: 13.0 },
        { threshold: 42, points: 12.0 },
        { threshold: 38, points: 11.0 },
        { threshold: 34, points: 10.0 },
        { threshold: 30, points: 9.0 }, // MINIMUM PASSING
        { threshold: 26, points: 8.0 },
      ],

      // Plank (core, 15 points max) - time in seconds
      [EXERCISES.PLANK]: [
        { threshold: 180, points: 15.0 }, // 3:00+
        { threshold: 150, points: 14.0 }, // 2:30
        { threshold: 120, points: 13.0 }, // 2:00
        { threshold: 105, points: 12.0 }, // 1:45
        { threshold: 90, points: 11.0 }, // 1:30
        { threshold: 75, points: 10.0 }, // 1:15
        { threshold: 60, points: 9.0 }, // 1:00 - MINIMUM PASSING
      ],

      // HAMR Shuttle (cardio, 50 points max) - shuttles completed
      [EXERCISES.HAMR]: [
        { threshold: 95, points: 50.0 },
        { threshold: 88, points: 48.0 },
        { threshold: 81, points: 46.0 },
        { threshold: 76, points: 44.0 },
        { threshold: 71, points: 42.0 },
        { threshold: 66, points: 40.0 },
        { threshold: 61, points: 38.0 },
        { threshold: 56, points: 36.0 },
        { threshold: 51, points: 34.0 },
        { threshold: 46, points: 32.0 },
        { threshold: 41, points: 30.0 }, // MINIMUM PASSING (60%)
      ],

      // Hand-Release Push-ups (strength, 15 points max) - reps in 2 min
      [EXERCISES.HRPU]: [
        { threshold: 42, points: 15.0 },
        { threshold: 39, points: 14.0 },
        { threshold: 36, points: 13.0 },
        { threshold: 33, points: 12.0 },
        { threshold: 30, points: 11.0 },
        { threshold: 27, points: 10.0 },
        { threshold: 24, points: 9.0 }, // MINIMUM PASSING (60%)
        { threshold: 21, points: 8.0 },
        { threshold: 18, points: 7.0 },
      ],

      // Cross-Leg Reverse Crunches (core, 15 points max) - reps in 2 min
      [EXERCISES.CLRC]: [
        { threshold: 56, points: 15.0 },
        { threshold: 52, points: 14.0 },
        { threshold: 48, points: 13.0 },
        { threshold: 44, points: 12.0 },
        { threshold: 40, points: 11.0 },
        { threshold: 36, points: 10.0 },
        { threshold: 32, points: 9.0 }, // MINIMUM PASSING (60%)
        { threshold: 28, points: 8.0 },
      ],

      // 2km Walk (cardio, 50 points max) - time in seconds
      [EXERCISES.WALK_2KM]: [
        { threshold: 1080, points: 50.0 }, // 18:00 or faster
        { threshold: 1110, points: 48.0 }, // 18:30
        { threshold: 1140, points: 46.0 }, // 19:00
        { threshold: 1170, points: 44.0 }, // 19:30
        { threshold: 1200, points: 42.0 }, // 20:00
        { threshold: 1230, points: 40.0 }, // 20:30
        { threshold: 1260, points: 38.0 }, // 21:00
        { threshold: 1290, points: 36.0 }, // 21:30
        { threshold: 1320, points: 34.0 }, // 22:00
        { threshold: 1350, points: 32.0 }, // 22:30
        { threshold: 1380, points: 30.0 }, // 23:00 - MINIMUM PASSING
      ],
    },
  },
}

// WHtR is universal (not age/gender specific)
export const WHTR_TABLE = [
  { threshold: 0.43, points: 20.0 },
  { threshold: 0.44, points: 19.0 },
  { threshold: 0.45, points: 18.0 },
  { threshold: 0.46, points: 17.0 },
  { threshold: 0.47, points: 16.0 },
  { threshold: 0.48, points: 15.0 },
  { threshold: 0.49, points: 14.0 },
  { threshold: 0.50, points: 13.0 },
  { threshold: 0.51, points: 12.0 },
  { threshold: 0.52, points: 11.0 },
  { threshold: 0.53, points: 10.0 }, // MINIMUM PASSING (50%)
  { threshold: 0.54, points: 9.0 },
  { threshold: 0.55, points: 8.0 },
  { threshold: 0.56, points: 7.0 },
  { threshold: 0.57, points: 6.0 },
]

/**
 * Get scoring table for specific demographic and exercise
 * @param {string} gender - 'M' or 'F'
 * @param {string} ageGroup - Age group constant
 * @param {string} exercise - Exercise type constant
 * @returns {Array|null} Scoring table or null if not found
 */
export function getScoringTable(gender, ageGroup, exercise) {
  if (exercise === EXERCISES.WHTR) {
    return WHTR_TABLE
  }

  const genderTables = SCORING_TABLES[gender]
  if (!genderTables) {
    console.warn(`No scoring tables for gender: ${gender}`)
    return null
  }

  const ageGroupTables = genderTables[ageGroup]
  if (!ageGroupTables) {
    console.warn(`No scoring tables for age group: ${ageGroup} (gender: ${gender})`)
    console.warn('Available age groups:', Object.keys(genderTables))
    return null
  }

  const exerciseTable = ageGroupTables[exercise]
  if (!exerciseTable) {
    console.warn(`No scoring table for exercise: ${exercise} (gender: ${gender}, age: ${ageGroup})`)
    return null
  }

  return exerciseTable
}
