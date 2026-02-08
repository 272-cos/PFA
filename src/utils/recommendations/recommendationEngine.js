/**
 * Performance Recommendation Engine
 * Provides tiered training suggestions based on component scores
 */

import { COMPONENTS, EXERCISES } from '../scoring/constants.js'

// Recommendation tiers based on component percentage
const TIERS = {
  FAILING: 'failing', // < 75%
  MARGINAL: 'marginal', // 75-80%
  STRONG: 'strong', // > 80%
}

/**
 * Get recommendation tier from percentage
 * @param {number} percentage - Component percentage score
 * @returns {string} Tier constant
 */
function getTier(percentage) {
  if (percentage < 75) return TIERS.FAILING
  if (percentage <= 80) return TIERS.MARGINAL
  return TIERS.STRONG
}

/**
 * Recommendation database
 * Structure: { [component]: { [exercise]: { [tier]: [recommendations] } } }
 *
 * CRITICAL SAFETY NOTE:
 * - Cardio: 2-3×/week with 1-2 rest days between
 * - Strength: 2-3×/week with two days rest between sessions
 * - Core: 2-3×/week with two days rest between sessions
 * - NEVER train same muscle group daily - muscles need recovery time
 */
const RECOMMENDATIONS = {
  [COMPONENTS.CARDIO]: {
    [EXERCISES.RUN_2MILE]: {
      [TIERS.FAILING]: [
        'Walk-Run Intervals: 2 min run / 1 min walk × 10, gradually decrease walk time',
        'Long Slow Distance: 3-5 mile runs at conversational pace, 2×/week',
        'Breathing Technique: Practice rhythmic breathing (3-step inhale, 2-step exhale)',
      ],
      [TIERS.MARGINAL]: [
        'Tempo Runs: 15-20 min at 80% max heart rate, 1×/week',
        'Fartlek Training: Varied pace for 20 minutes (fast 2 min, easy 3 min)',
        'Goal-Paced Running: Run at target PFA pace for 1 mile, rest, repeat',
      ],
      [TIERS.STRONG]: [
        'Norwegian 4×4: 4 minutes high intensity + 3 min recovery × 4',
        'Track Intervals: 400m repeats at faster than race pace (6-8 reps)',
        'Distance Extension: Push to 3-4 mile runs to build endurance reserve',
      ],
    },
    [EXERCISES.HAMR]: {
      [TIERS.FAILING]: [
        'Cone Drills: 5-10 yard shuttle runs, focus on quick direction change',
        'Lateral Shuffles: Side-to-side movement for 30 seconds × 5',
        'Form Practice: Low center of gravity on turns, push off outside foot',
      ],
      [TIERS.MARGINAL]: [
        'Sprint Intervals: 20m sprints × 10 with 30-second rest',
        'Plyometrics: Jump squats, burpees for power development',
        'Tabata HAMR: 20 sec max effort / 10 sec rest × 8',
      ],
      [TIERS.STRONG]: [
        'Overspeed Training: Downhill sprints for speed adaptation',
        'Complex Training: Burpees + HAMR simulation for power endurance',
        'Mental Practice: Visualization of perfect runs, pacing strategy',
      ],
    },
  },

  [COMPONENTS.STRENGTH]: {
    [EXERCISES.PUSHUPS]: {
      [TIERS.FAILING]: [
        'Incline Push-ups: 3×15 on elevated surface (stairs), 2-3×/week with two days rest between',
        'Knee Push-ups: Build to 20-40 reps before progressing, 2-3×/week',
        'Negative Reps: Lower slowly (5 sec) from plank to floor, 2×/week to build strength',
      ],
      [TIERS.MARGINAL]: [
        '200 Push-up Challenge: Complete 200 total in one session (sets as needed), 1×/week max',
        'Pyramid Sets: 1-2-3-4-5-4-3-2-1 reps with 10sec rest, 2-3×/week',
        'Tempo Push-ups: 3-1-3 rhythm (3 sec down, 1 hold, 3 up), 2×/week',
      ],
      [TIERS.STRONG]: [
        'Decline Push-ups: Feet elevated 12" for difficulty, 3-4×10-15, 2×/week',
        'Explosive Push-ups: Push hard to lift hands off ground, 2-3×/week',
        'Diamond Push-ups: Hands together for tricep emphasis, 2×/week',
      ],
    },
    [EXERCISES.HRPU]: {
      [TIERS.FAILING]: [
        'Dead Stop Practice: Complete hand lift each rep, 3×10, 2-3×/week with two days rest',
        'Regular Push-up Volume: Build to 40+ regular first, 2-3×/week',
        'Split Phases: Practice lowering and pushing separately, 2×/week',
      ],
      [TIERS.MARGINAL]: [
        'Timed Sets: 30sec max / 30sec rest × 4 rounds, 2-3×/week',
        'Form Drills: Slow HRPUs with complete hand lift, 2×/week',
        'EMOM Training: 15 HRPUs every minute × 10min, 2×/week',
      ],
      [TIERS.STRONG]: [
        '2-Min Test Practice: Full simulation 1×/week only (avoid overtraining)',
        'Overload Sets: 2.5min max effort beyond test duration, 1×/week',
        'Pacing Strategy: Test fast vs steady rhythm, 1-2×/week',
      ],
    },
  },

  [COMPONENTS.CORE]: {
    [EXERCISES.SITUPS]: {
      [TIERS.FAILING]: [
        'Crunches: Controlled movement, curl spine, 3×20, 2-3×/week with two days rest',
        'Dead Bug: Alternating arm/leg extension, 3×10 each side, 2-3×/week',
        'Form Focus: Don\'t pull neck, breathe out on up, 2-3×/week practice',
      ],
      [TIERS.MARGINAL]: [
        '100 Sit-up Challenge: 100 total per session (NOT daily), 2×/week max with rest days',
        'Cadence Training: Metronome at test pace (50-60 bpm), 2-3×/week',
        'Pyramid Training: 10-20-30-20-10 with minimal rest, 2×/week',
      ],
      [TIERS.STRONG]: [
        'Decline Sit-ups: Feet elevated for difficulty, 3×25, 2×/week',
        'Sprint Sit-ups: Max reps 30sec × 4 rounds, 2×/week',
        'Test Simulation: Full 1-min test 1-2×/week max (avoid overtraining)',
      ],
    },
    [EXERCISES.CLRC]: {
      [TIERS.FAILING]: [
        'Leg Raises: Lying down, raise to 90°, 3×10, 2-3×/week with two days rest',
        'Reverse Crunches: Knees to chest, lift hips, 3×15, 2-3×/week',
        'Cross Practice: Master position before adding reps, 2-3×/week',
      ],
      [TIERS.MARGINAL]: [
        'High Rep Sets: 30-40 reps × 3 with 1min rest, 2×/week',
        'Timed Intervals: 45sec work / 15sec rest × 8 rounds, 2×/week',
        'Slow Tempo: 2-1-2 rhythm for control, 2-3×/week',
      ],
      [TIERS.STRONG]: [
        'Bicycle Crunches: Alternating elbow to knee, 3×20, 2×/week',
        'V-Ups: Touch hands to toes for full engagement, 3×15, 2×/week',
        '2-Min+ Tests: Practice beyond test duration, 1×/week to build reserve',
      ],
    },
    [EXERCISES.PLANK]: {
      [TIERS.FAILING]: [
        'Short Holds: 20-30sec × 6 with 30sec rest, 2-3×/week with two days rest',
        'Progression: Add 5-10sec each week, train 2-3×/week consistently',
        'Form Check: Straight line head to heels, practice 2-3×/week',
      ],
      [TIERS.MARGINAL]: [
        '2-Min Goal: Build to 2+ min continuous hold, 2-3×/week training',
        'Pyramid Training: 30-60-90-60-30sec holds, 2×/week',
        'Mental Strategy: Break into 30sec segments, practice 2-3×/week',
      ],
      [TIERS.STRONG]: [
        'Single-Leg Plank: Lift one leg and hold, alternate, 2×/week',
        'Dynamic Planks: Hip dips, shoulder taps for stability, 2×/week',
        'Plank Complex: Standard + side + reverse plank circuit, 2×/week',
      ],
    },
  },

  [COMPONENTS.BODY_COMP]: {
    [EXERCISES.WHTR]: {
      [TIERS.FAILING]: [
        'Calorie Tracking: Use app (MyFitnessPal, Lose It!) to establish baseline',
        'Clean Eating: Focus on whole foods, lean proteins, vegetables, fruits',
        'Dietary Journal: Track what you eat for 2 weeks to identify problem areas',
      ],
      [TIERS.MARGINAL]: [
        'Meal Prep: Prepare 3-4 days of healthy meals at once for consistency',
        'Portion Control: Use hand-size portions (protein = palm, carbs = fist)',
        'Reduce Processed Foods: Limit packaged snacks, fast food, sugary drinks',
      ],
      [TIERS.STRONG]: [
        'Nutritionist Consultation: Get professional guidance for optimization',
        'Macro Tracking: Balance protein/carbs/fats for performance goals',
        'Meal Timing: Optimize pre/post-workout nutrition for body composition',
      ],
    },
  },
}

/**
 * Get recommendations for a component
 * @param {string} componentType - Component type (cardio, strength, core, bodyComp)
 * @param {string} exercise - Exercise type
 * @param {number} percentage - Component percentage score
 * @param {boolean} exempt - Is component exempt?
 * @returns {Array|null} Array of recommendation strings or null
 */
export function getRecommendations(componentType, exercise, percentage, exempt = false) {
  // No recommendations for exempt components
  if (exempt) {
    return null
  }

  // No recommendations if no valid percentage
  if (percentage === null || percentage === undefined) {
    return null
  }

  const tier = getTier(percentage)

  const componentRecs = RECOMMENDATIONS[componentType]
  if (!componentRecs) {
    console.warn(`No recommendations for component: ${componentType}`)
    return null
  }

  const exerciseRecs = componentRecs[exercise]
  if (!exerciseRecs) {
    console.warn(`No recommendations for exercise: ${exercise}`)
    return null
  }

  const tierRecs = exerciseRecs[tier]
  if (!tierRecs || tierRecs.length === 0) {
    return null
  }

  // Return up to 3 recommendations
  return tierRecs.slice(0, 3)
}

/**
 * Get tier label for display
 * @param {number} percentage - Component percentage score
 * @returns {string} Display label
 */
export function getTierLabel(percentage) {
  if (percentage < 75) return 'BELOW PASSING'
  if (percentage <= 80) return 'MARGINAL PASS'
  return 'STRONG PASS'
}

/**
 * Get tier emoji
 * @param {number} percentage - Component percentage score
 * @returns {string} Emoji
 */
export function getTierEmoji(percentage) {
  if (percentage < 75) return '💪'
  if (percentage <= 80) return '⚡'
  return '🚀'
}
