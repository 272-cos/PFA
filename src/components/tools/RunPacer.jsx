/**
 * Run Pacer - Audio lap pacing for 2-mile run
 * Plays beep tones at lap intervals using Web Audio API
 */

import { useState, useRef, useCallback, useEffect } from 'react'

// Track configuration
const RUN_DISTANCE_METERS = 3218.688 // 2 miles in meters
const DEFAULT_TRACK_METERS = 400
const TRACK_OPTIONS = [
  { label: '400m (standard)', value: 400 },
  { label: '200m (indoor)', value: 200 },
  { label: '300m', value: 300 },
  { label: '1600m (1 mile)', value: 1600 },
]
const MILES_PER_RUN = 2

function parseTargetTime(input) {
  if (!input) return null
  const parts = input.split(':')
  if (parts.length !== 2) return null
  const min = parseInt(parts[0], 10)
  const sec = parseInt(parts[1], 10)
  if (isNaN(min) || isNaN(sec) || min < 0 || sec < 0 || sec >= 60) return null
  const total = min * 60 + sec
  return total > 0 && total <= 7200 ? total : null
}

function formatSeconds(totalSec) {
  if (totalSec == null || totalSec < 0) return '--:--'
  const m = Math.floor(totalSec / 60)
  const s = Math.floor(totalSec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatSecondsDecimal(totalSec) {
  if (totalSec == null) return '--:--'
  const m = Math.floor(totalSec / 60)
  const s = (totalSec % 60).toFixed(1)
  return `${m}:${s.padStart(4, '0')}`
}

// Web Audio tone synthesis
function playTone(audioCtx, frequency, duration, type = 'sine') {
  if (!audioCtx) return
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.type = type
  osc.frequency.value = frequency
  gain.gain.value = 0.5
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration)
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.start()
  osc.stop(audioCtx.currentTime + duration)
}

function playLapBeep(audioCtx) {
  playTone(audioCtx, 880, 0.15)
  setTimeout(() => playTone(audioCtx, 880, 0.15), 200)
}

function playHalfwayBeep(audioCtx) {
  playTone(audioCtx, 1047, 0.2)
  setTimeout(() => playTone(audioCtx, 1319, 0.2), 250)
  setTimeout(() => playTone(audioCtx, 1047, 0.2), 500)
}

function playFinishBeep(audioCtx) {
  playTone(audioCtx, 1319, 0.15)
  setTimeout(() => playTone(audioCtx, 1568, 0.15), 150)
  setTimeout(() => playTone(audioCtx, 2093, 0.3), 300)
}

export default function RunPacer() {
  const [targetInput, setTargetInput] = useState('')
  const [trackMeters, setTrackMeters] = useState(DEFAULT_TRACK_METERS)
  const [running, setRunning] = useState(false)
  const [paused, setPaused] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [currentLap, setCurrentLap] = useState(1)
  const [finished, setFinished] = useState(false)

  const totalLaps = Math.ceil(RUN_DISTANCE_METERS / trackMeters)

  const audioCtxRef = useRef(null)
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)
  const pauseOffsetRef = useRef(0)
  const lastLapRef = useRef(0)

  const targetTotal = parseTargetTime(targetInput)
  const lapPace = targetTotal ? targetTotal / totalLaps : null
  const milePace = targetTotal ? targetTotal / MILES_PER_RUN : null

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }, [])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setRunning(false)
    setPaused(false)
    setElapsed(0)
    setCurrentLap(1)
    setFinished(false)
    pauseOffsetRef.current = 0
    lastLapRef.current = 0
  }, [])

  const start = useCallback(() => {
    if (!targetTotal) return
    const ctx = getAudioCtx()
    setRunning(true)
    setPaused(false)
    setFinished(false)
    setCurrentLap(1)
    setElapsed(0)
    pauseOffsetRef.current = 0
    lastLapRef.current = 0
    startTimeRef.current = performance.now()

    intervalRef.current = setInterval(() => {
      const now = performance.now()
      const elapsedSec = (now - startTimeRef.current) / 1000 + pauseOffsetRef.current

      setElapsed(elapsedSec)

      // Check lap crossings
      const lapTime = targetTotal / totalLaps
      const currentLapNum = Math.min(Math.floor(elapsedSec / lapTime) + 1, totalLaps)
      const completedLaps = Math.floor(elapsedSec / lapTime)

      if (completedLaps > lastLapRef.current && completedLaps < totalLaps) {
        lastLapRef.current = completedLaps
        if (completedLaps === totalLaps / 2) {
          playHalfwayBeep(ctx)
        } else {
          playLapBeep(ctx)
        }
        setCurrentLap(currentLapNum)
      }

      // Finish
      if (elapsedSec >= targetTotal) {
        playFinishBeep(ctx)
        clearInterval(intervalRef.current)
        intervalRef.current = null
        setFinished(true)
        setRunning(false)
        setElapsed(targetTotal)
      }
    }, 100)
  }, [targetTotal, getAudioCtx])

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    pauseOffsetRef.current = elapsed
    setPaused(true)
  }, [elapsed])

  const resume = useCallback(() => {
    if (!targetTotal) return
    const ctx = getAudioCtx()
    setPaused(false)
    startTimeRef.current = performance.now()

    intervalRef.current = setInterval(() => {
      const now = performance.now()
      const elapsedSec = (now - startTimeRef.current) / 1000 + pauseOffsetRef.current
      setElapsed(elapsedSec)

      const lapTime = targetTotal / totalLaps
      const completedLaps = Math.floor(elapsedSec / lapTime)

      if (completedLaps > lastLapRef.current && completedLaps < totalLaps) {
        lastLapRef.current = completedLaps
        if (completedLaps === totalLaps / 2) {
          playHalfwayBeep(ctx)
        } else {
          playLapBeep(ctx)
        }
        setCurrentLap(Math.min(completedLaps + 1, totalLaps))
      }

      if (elapsedSec >= targetTotal) {
        playFinishBeep(ctx)
        clearInterval(intervalRef.current)
        intervalRef.current = null
        setFinished(true)
        setRunning(false)
        setElapsed(targetTotal)
      }
    }, 100)
  }, [targetTotal, getAudioCtx])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const lapTimeRemaining = lapPace ? lapPace - (elapsed % lapPace) : 0
  const isActive = running || paused

  return (
    <div className="space-y-4">
      {/* Target time input */}
      <div>
        <label htmlFor="pacer-target" className="block text-sm font-medium text-gray-700 mb-1">
          Target 2-Mile Time
        </label>
        <input
          id="pacer-target"
          type="text"
          inputMode="numeric"
          placeholder="e.g. 15:30"
          value={targetInput}
          onChange={(e) => setTargetInput(e.target.value)}
          disabled={isActive}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg font-mono disabled:bg-gray-100"
        />
      </div>

      {/* Track size selector */}
      <div>
        <label htmlFor="pacer-track" className="block text-sm font-medium text-gray-700 mb-1">
          Track Length
        </label>
        <select
          id="pacer-track"
          value={trackMeters}
          onChange={(e) => setTrackMeters(Number(e.target.value))}
          disabled={isActive}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-100"
        >
          {TRACK_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">{totalLaps} laps for 2 miles</p>
      </div>

      {/* Pace breakdown */}
      {targetTotal && !isActive && !finished && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <p className="text-xs text-blue-600 font-medium">Per Mile</p>
            <p className="text-lg font-bold text-blue-900 font-mono">{formatSecondsDecimal(milePace)}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <p className="text-xs text-blue-600 font-medium">Per Lap ({trackMeters}m)</p>
            <p className="text-lg font-bold text-blue-900 font-mono">{formatSecondsDecimal(lapPace)}</p>
          </div>
        </div>
      )}

      {/* Active display */}
      {isActive && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Lap {currentLap} of {totalLaps}</span>
            <span className={`text-xs font-bold px-2 py-1 rounded ${paused ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
              {paused ? 'PAUSED' : 'RUNNING'}
            </span>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold font-mono text-gray-900">{formatSeconds(elapsed)}</p>
            <p className="text-sm text-gray-500 mt-1">of {formatSeconds(targetTotal)}</p>
          </div>
          {!paused && lapPace && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Lap time remaining: <span className="font-mono font-bold">{formatSeconds(lapTimeRemaining)}</span>
              </p>
            </div>
          )}
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min((elapsed / targetTotal) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Finished display */}
      {finished && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-lg font-bold text-green-800">Target time reached</p>
          <p className="text-sm text-green-600 mt-1">Final: {formatSeconds(targetTotal)}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        {!isActive && !finished && (
          <button
            onClick={start}
            disabled={!targetTotal}
            className="flex-1 min-h-[44px] bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Start Pacer
          </button>
        )}
        {running && !paused && (
          <button
            onClick={pause}
            className="flex-1 min-h-[44px] bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Pause
          </button>
        )}
        {paused && (
          <button
            onClick={resume}
            className="flex-1 min-h-[44px] bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Resume
          </button>
        )}
        {isActive && (
          <button
            onClick={stop}
            className="flex-1 min-h-[44px] bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Reset
          </button>
        )}
        {finished && (
          <button
            onClick={stop}
            className="flex-1 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            New Run
          </button>
        )}
      </div>
    </div>
  )
}
