/**
 * Self-Check Tab - Personal assessment entry with live scoring
 */

import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { encodeSCode } from '../../utils/codec/scode.js'
import { EXERCISES, COMPONENTS } from '../../utils/scoring/constants.js'
import { calculateAge, getAgeGroup, isDiagnosticPeriod } from '../../utils/scoring/constants.js'
import { calculateComponentScore, calculateCompositeScore, calculateWHtR, parseTime } from '../../utils/scoring/scoringEngine.js'
import { getRecommendations, getTierLabel, getTierEmoji } from '../../utils/recommendations/recommendationEngine.js'

export default function SelfCheckTab() {
  const { demographics, addSCode } = useApp()

  // Assessment data
  const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString().split('T')[0])

  // Cardio
  const [cardioExercise, setCardioExercise] = useState(EXERCISES.RUN_2MILE)
  const [cardioValue, setCardioValue] = useState('')
  const [cardioExempt, setCardioExempt] = useState(false)

  // Strength
  const [strengthExercise, setStrengthExercise] = useState(EXERCISES.PUSHUPS)
  const [strengthValue, setStrengthValue] = useState('')
  const [strengthExempt, setStrengthExempt] = useState(false)

  // Core
  const [coreExercise, setCoreExercise] = useState(EXERCISES.SITUPS)
  const [coreValue, setCoreValue] = useState('')
  const [coreExempt, setCoreExempt] = useState(false)

  // Body Composition
  const [heightInches, setHeightInches] = useState('')
  const [waistInches, setWaistInches] = useState('')
  const [bodyCompExempt, setBodyCompExempt] = useState(false)

  // UI state
  const [scode, setSCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [scores, setScores] = useState(null)

  // Check if we have demographics
  const hasDemographics = demographics && demographics.dob && demographics.gender

  // Calculate scores whenever inputs change
  useEffect(() => {
    if (!hasDemographics) {
      setScores(null)
      return
    }

    try {
      const age = calculateAge(demographics.dob, assessmentDate)
      const ageGroup = getAgeGroup(age)
      const gender = demographics.gender

      const components = []

      // Cardio
      if (!cardioExempt && cardioValue) {
        const value = cardioExercise === EXERCISES.RUN_2MILE ? parseTime(cardioValue) : parseInt(cardioValue, 10)
        if (value) {
          const cardioScore = calculateComponentScore(
            { type: COMPONENTS.CARDIO, exercise: cardioExercise, value, exempt: false },
            gender,
            ageGroup
          )
          components.push({ ...cardioScore, type: COMPONENTS.CARDIO, exercise: cardioExercise })
        }
      } else if (cardioExempt) {
        components.push({ type: COMPONENTS.CARDIO, exempt: true, tested: false, pass: true })
      }

      // Strength
      if (!strengthExempt && strengthValue) {
        const value = parseInt(strengthValue, 10)
        if (value || value === 0) {
          const strengthScore = calculateComponentScore(
            { type: COMPONENTS.STRENGTH, exercise: strengthExercise, value, exempt: false },
            gender,
            ageGroup
          )
          components.push({ ...strengthScore, type: COMPONENTS.STRENGTH, exercise: strengthExercise })
        }
      } else if (strengthExempt) {
        components.push({ type: COMPONENTS.STRENGTH, exempt: true, tested: false, pass: true })
      }

      // Core
      if (!coreExempt && coreValue) {
        const value = coreExercise === EXERCISES.PLANK ? parseTime(coreValue) : parseInt(coreValue, 10)
        if (value || value === 0) {
          const coreScore = calculateComponentScore(
            { type: COMPONENTS.CORE, exercise: coreExercise, value, exempt: false },
            gender,
            ageGroup
          )
          components.push({ ...coreScore, type: COMPONENTS.CORE, exercise: coreExercise })
        }
      } else if (coreExempt) {
        components.push({ type: COMPONENTS.CORE, exempt: true, tested: false, pass: true })
      }

      // Body Composition
      if (!bodyCompExempt && heightInches && waistInches) {
        const height = parseFloat(heightInches)
        const waist = parseFloat(waistInches)
        if (height && waist) {
          const whtr = calculateWHtR(waist, height)
          const bodyCompScore = calculateComponentScore(
            { type: COMPONENTS.BODY_COMP, exercise: EXERCISES.WHTR, value: whtr, exempt: false },
            gender,
            ageGroup
          )
          components.push({ ...bodyCompScore, type: COMPONENTS.BODY_COMP, exercise: EXERCISES.WHTR, whtr })
        }
      } else if (bodyCompExempt) {
        components.push({ type: COMPONENTS.BODY_COMP, exempt: true, tested: false, pass: true })
      }

      const composite = calculateCompositeScore(components)
      setScores({ components, composite })
    } catch (err) {
      console.error('Error calculating scores:', err)
      setScores(null)
    }
  }, [hasDemographics, demographics, assessmentDate, cardioExercise, cardioValue, cardioExempt, strengthExercise, strengthValue, strengthExempt, coreExercise, coreValue, coreExempt, heightInches, waistInches, bodyCompExempt])

  const handleGenerateSCode = () => {
    setError('')
    setSuccess('')

    if (!hasDemographics) {
      setError('Please create your profile first (Profile tab)')
      return
    }

    try {
      const assessment = {
        date: assessmentDate,
        cardio: !cardioExempt && cardioValue ? {
          exercise: cardioExercise,
          value: cardioExercise === EXERCISES.RUN_2MILE ? parseTime(cardioValue) : parseInt(cardioValue, 10),
          exempt: false
        } : cardioExempt ? { exercise: cardioExercise, value: null, exempt: true } : null,
        strength: !strengthExempt && strengthValue ? {
          exercise: strengthExercise,
          value: parseInt(strengthValue, 10),
          exempt: false
        } : strengthExempt ? { exercise: strengthExercise, value: null, exempt: true } : null,
        core: !coreExempt && coreValue ? {
          exercise: coreExercise,
          value: coreExercise === EXERCISES.PLANK ? parseTime(coreValue) : parseInt(coreValue, 10),
          exempt: false
        } : coreExempt ? { exercise: coreExercise, value: null, exempt: true } : null,
        bodyComp: !bodyCompExempt && heightInches && waistInches ? {
          heightInches: parseFloat(heightInches),
          waistInches: parseFloat(waistInches),
          exempt: false
        } : bodyCompExempt ? { heightInches: null, waistInches: null, exempt: true } : null,
      }

      const code = encodeSCode(assessment)
      setSCode(code)
      addSCode(code)
      setSuccess('S-Code generated successfully!')
    } catch (err) {
      setError(err.message)
    }
  }

  const copyToClipboard = async () => {
    if (!scode) return
    try {
      await navigator.clipboard.writeText(scode)
      setSuccess('S-Code copied to clipboard!')
      setTimeout(() => setSuccess(''), 2000)
    } catch {
      setError('Failed to copy to clipboard')
    }
  }

  if (!hasDemographics) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-yellow-900 mb-2">Profile Required</h3>
        <p className="text-yellow-800 mb-4">
          Please create your profile first (DOB + gender) in the Profile tab before recording assessments.
        </p>
      </div>
    )
  }

  const isDiagnostic = isDiagnosticPeriod(assessmentDate)

  // Helper function to convert inches to feet and inches
  const inchesToFeetInches = (inches) => {
    if (!inches || isNaN(inches)) return ''
    const totalInches = parseFloat(inches)
    const feet = Math.floor(totalInches / 12)
    const remainingInches = Math.round(totalInches % 12)
    return `${feet}' ${remainingInches}"`
  }

  return (
    <div className="space-y-6">
      {/* Live Score Banner */}
      {scores && scores.composite && scores.composite.composite !== null && (
        <div className={`rounded-lg p-4 ${scores.composite.pass ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                {scores.composite.composite.toFixed(1)} / 100
              </h3>
              <p className={`text-sm font-medium ${scores.composite.pass ? 'text-green-800' : 'text-red-800'}`}>
                {scores.composite.pass ? '✓ PASSING' : '✗ FAILING'}
                {isDiagnostic && ' (Diagnostic Period)'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {scores.composite.totalEarned.toFixed(1)} / {scores.composite.totalPossible} pts
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Date */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Assessment</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assessment Date
          </label>
          <input
            type="date"
            value={assessmentDate}
            onChange={(e) => setAssessmentDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {isDiagnostic && (
            <p className="text-xs text-blue-600 mt-1">
              📋 Diagnostic Period (non-scored)
            </p>
          )}
        </div>

        {/* Cardio Component */}
        <ComponentSection
          title="Cardio (50 pts)"
          exempt={cardioExempt}
          onExemptChange={setCardioExempt}
          score={scores?.components.find(c => c.type === COMPONENTS.CARDIO)}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exercise</label>
              <select
                value={cardioExercise}
                onChange={(e) => setCardioExercise(e.target.value)}
                disabled={cardioExempt}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
              >
                <option value={EXERCISES.RUN_2MILE}>2-Mile Run</option>
                <option value={EXERCISES.HAMR}>HAMR Shuttle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {cardioExercise === EXERCISES.RUN_2MILE ? 'Time (mm:ss)' : 'Shuttles'}
              </label>
              <input
                type="text"
                value={cardioValue}
                onChange={(e) => setCardioValue(e.target.value)}
                disabled={cardioExempt}
                placeholder={cardioExercise === EXERCISES.RUN_2MILE ? '13:30' : '94'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
              />
            </div>
          </div>
        </ComponentSection>

        {/* Strength Component */}
        <ComponentSection
          title="Strength (15 pts)"
          exempt={strengthExempt}
          onExemptChange={setStrengthExempt}
          score={scores?.components.find(c => c.type === COMPONENTS.STRENGTH)}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exercise</label>
              <select
                value={strengthExercise}
                onChange={(e) => setStrengthExercise(e.target.value)}
                disabled={strengthExempt}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
              >
                <option value={EXERCISES.PUSHUPS}>Push-ups (1 min)</option>
                <option value={EXERCISES.HRPU}>Hand-Release Push-ups (2 min)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reps</label>
              <input
                type="number"
                value={strengthValue}
                onChange={(e) => setStrengthValue(e.target.value)}
                disabled={strengthExempt}
                placeholder="42"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
              />
            </div>
          </div>
        </ComponentSection>

        {/* Core Component */}
        <ComponentSection
          title="Core (15 pts)"
          exempt={coreExempt}
          onExemptChange={setCoreExempt}
          score={scores?.components.find(c => c.type === COMPONENTS.CORE)}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exercise</label>
              <select
                value={coreExercise}
                onChange={(e) => setCoreExercise(e.target.value)}
                disabled={coreExempt}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
              >
                <option value={EXERCISES.SITUPS}>Sit-ups (1 min)</option>
                <option value={EXERCISES.CLRC}>Reverse Crunches (2 min)</option>
                <option value={EXERCISES.PLANK}>Forearm Plank (max time)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {coreExercise === EXERCISES.PLANK ? 'Time (mm:ss)' : 'Reps'}
              </label>
              <input
                type="text"
                value={coreValue}
                onChange={(e) => setCoreValue(e.target.value)}
                disabled={coreExempt}
                placeholder={coreExercise === EXERCISES.PLANK ? '2:30' : '42'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
              />
            </div>
          </div>
        </ComponentSection>

        {/* Body Composition */}
        <ComponentSection
          title="Body Composition (20 pts)"
          exempt={bodyCompExempt}
          onExemptChange={setBodyCompExempt}
          score={scores?.components.find(c => c.type === COMPONENTS.BODY_COMP)}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (inches)</label>
              <input
                type="number"
                value={heightInches}
                onChange={(e) => setHeightInches(e.target.value)}
                disabled={bodyCompExempt}
                placeholder="70"
                min="48"
                max="84"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
              />
              {heightInches && !bodyCompExempt && (
                <p className="text-xs text-gray-500 mt-1">
                  {inchesToFeetInches(heightInches)}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Waist (inches)</label>
              <input
                type="number"
                value={waistInches}
                onChange={(e) => setWaistInches(e.target.value)}
                disabled={bodyCompExempt}
                placeholder="32.5"
                min="20"
                max="55"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
              />
            </div>
          </div>
          {!bodyCompExempt && heightInches && waistInches && (
            <p className="text-sm text-gray-600 mt-2">
              WHtR: {calculateWHtR(parseFloat(waistInches), parseFloat(heightInches))?.toFixed(2)}
            </p>
          )}
        </ComponentSection>

        {/* Generate S-Code Button */}
        <button
          onClick={handleGenerateSCode}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Generate S-Code
        </button>

        {/* Success/Error Messages */}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm mt-4">
            {success}
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm mt-4">
            {error}
          </div>
        )}

        {/* Display S-Code */}
        {scode && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Your S-Code:</p>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm text-blue-900 flex-1 break-all">{scode}</p>
              <button
                onClick={copyToClipboard}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors whitespace-nowrap"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Save this code with today's date to track your progress over time.
            </p>
          </div>
        )}
      </div>

      {/* Improvement Tips */}
      {scores && scores.components.length > 0 && (
        <ImprovementTips components={scores.components} />
      )}
    </div>
  )
}

// Component Section with score display
function ComponentSection({ title, exempt, onExemptChange, score, children }) {
  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <div className="flex items-center gap-4">
          {score && score.tested && (
            <div className="text-right">
              <p className={`text-lg font-bold ${score.pass ? 'text-green-600' : 'text-red-600'}`}>
                {score.points.toFixed(1)} / {score.maxPoints} pts
              </p>
              <p className="text-xs text-gray-600">
                {score.percentage.toFixed(1)}% {score.pass ? '✓' : '✗'}
              </p>
            </div>
          )}
          {score && score.exempt && (
            <p className="text-sm text-gray-600">EXEMPT</p>
          )}
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={exempt}
              onChange={(e) => onExemptChange(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Exempt</span>
          </label>
        </div>
      </div>
      {!exempt && children}
    </div>
  )
}

// Improvement Tips Component
function ImprovementTips({ components }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">💪 Improvement Tips</h3>

      {components.map((component, idx) => {
        if (!component.tested || component.exempt) return null

        const recommendations = getRecommendations(
          component.type,
          component.exercise,
          component.percentage,
          component.exempt
        )

        if (!recommendations) return null

        const tierLabel = getTierLabel(component.percentage)
        const tierEmoji = getTierEmoji(component.percentage)

        return (
          <div key={idx} className="mb-6 last:mb-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{tierEmoji}</span>
              <h4 className="font-bold text-gray-900 capitalize">{component.type}</h4>
              <span className={`text-xs px-2 py-1 rounded ${
                component.percentage < 75 ? 'bg-red-100 text-red-800' :
                component.percentage <= 80 ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {tierLabel}
              </span>
            </div>
            <ul className="space-y-2">
              {recommendations.map((tip, i) => (
                <li key={i} className="text-sm text-gray-700 pl-4 border-l-2 border-gray-300">
                  • {tip}
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
