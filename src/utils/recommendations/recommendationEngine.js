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
        'Incline Push-ups: Hands on elevated surface (stairs) for 3×15',
        'Knee Push-ups: Build to 20-40 reps before progressing to regular',
        'Negative Reps: Lower slowly (5 seconds) from plank to floor, build strength',
      ],
      [TIERS.MARGINAL]: [
        '200 Push-up Challenge: Complete 200 total push-ups in one day (break into sets)',
        'Pyramid Sets: 1-2-3-4-5-4-3-2-1 reps with 10-second rest between',
        'Tempo Push-ups: 3-1-3 rhythm (3 sec down, 1 sec hold, 3 sec up)',
      ],
      [TIERS.STRONG]: [
        'Decline Push-ups: Feet elevated on 12" surface for increased difficulty',
        'Explosive Push-ups: Push hard enough to lift hands off ground',
        'Diamond Push-ups: Hands together for tricep emphasis and variety',
      ],
    },
    [EXERCISES.HRPU]: {
      [TIERS.FAILING]: [
        'Dead Stop Practice: Lower to floor, lift hands completely, push back up',
        'Regular Push-up Volume: Build to 40+ regular push-ups first',
        'Split Phases: Practice lowering phase and pushing phase separately',
      ],
      [TIERS.MARGINAL]: [
        'Timed Sets: 30-second max effort, 30-second rest × 4 rounds',
        'Form Drills: Slow HRPUs focusing on complete hand lift and chest touch',
        'EMOM Training: Every minute on the minute, do 15 HRPUs',
      ],
      [TIERS.STRONG]: [
        '2-Minute Test Practice: Full simulation test once per week',
        'Overload Sets: 2.5-minute max effort (beyond test duration)',
        'Pacing Strategy: Experiment with fast vs steady rhythm for optimal reps',
      ],
    },
  },

  [COMPONENTS.CORE]: {
    [EXERCISES.SITUPS]: {
      [TIERS.FAILING]: [
        'Crunches: Focus on controlled movement, curl spine, 3×20',
        'Dead Bug: Alternating arm/leg extension while keeping back flat on ground',
        'Form Focus: Don\'t pull on neck, breathe out on way up, engage core',
      ],
      [TIERS.MARGINAL]: [
        '100 Sit-up Challenge: Complete 100 sit-ups daily, break into manageable sets',
        'Cadence Training: Use metronome at test pace (50-60 bpm) for rhythm',
        'Pyramid Training: 10-20-30-20-10 reps with minimal rest between sets',
      ],
      [TIERS.STRONG]: [
        'Decline Sit-ups: Feet elevated for increased difficulty and ab activation',
        'Sprint Sit-ups: Max reps in 30 seconds × 4 rounds for explosive power',
        'Test Simulation: Full 1-minute test twice per week to maintain performance',
      ],
    },
    [EXERCISES.CLRC]: {
      [TIERS.FAILING]: [
        'Leg Raises: Lying on back, raise legs to 90 degrees, 3×10',
        'Reverse Crunches: Pull knees to chest, lift hips off ground, 3×15',
        'Cross Practice: Master the cross-leg position before adding reps',
      ],
      [TIERS.MARGINAL]: [
        'High Rep Sets: 30-40 reps × 3 with 1-minute rest for endurance',
        'Timed Intervals: 45 sec work / 15 sec rest × 8 rounds',
        'Slow Tempo: 2-1-2 rhythm to build control and form',
      ],
      [TIERS.STRONG]: [
        'Bicycle Crunches: Alternating elbow to knee for variety and challenge',
        'V-Ups: Touch hands to toes for full core engagement',
        '2-Minute+ Tests: Practice beyond test duration to build reserve',
      ],
    },
    [EXERCISES.PLANK]: {
      [TIERS.FAILING]: [
        'Short Holds: 20-30 seconds × 6 with 30-second rest, build foundation',
        'Progression: Add 5-10 seconds to your hold time each week',
        'Form: Straight line from head to heels, elbows under shoulders',
      ],
      [TIERS.MARGINAL]: [
        '2-Minute Goal: Build to continuous 2+ minute hold',
        'Pyramid Training: 30-60-90-60-30 second holds with short rest',
        'Mental Strategy: Break plank into 30-second segments mentally',
      ],
      [TIERS.STRONG]: [
        'Single-Leg Plank: Lift one leg, hold, alternate for added challenge',
        'Dynamic Planks: Add hip dips, shoulder taps for stability training',
        'Plank Complex: Standard + side plank + reverse plank circuit',
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
