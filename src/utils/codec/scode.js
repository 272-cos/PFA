/**
 * S-code (Self-Check Code) encoding/decoding
 * Format: S2-[base64url(array)][CRC-8]
 *
 * VERSION 2: SCHEMA-INDEXED ARRAYS
 * Fixed-position array format for reliable copy-paste
 * More compact than JSON, more readable than bit-packing
 */

import { encodeBase64url, decodeBase64url } from './base64url.js'
import { crc8, verifyCrc8 } from './crc8.js'
import { isDiagnosticPeriod } from '../scoring/constants.js'

const SCHEMA_VERSION = 2
const CHART_VERSION = 0 // v2025_sep provisional
const EPOCH_DATE = new Date('1950-01-01')
const PREFIX = 'S2-'

// Exercise code mappings (single chars for compactness)
const CARDIO_EXERCISES = { '2mile_run': 'R', 'hamr': 'H', '2km_walk': 'W' }
const STRENGTH_EXERCISES = { 'pushups': 'P', 'hrpu': 'H' }
const CORE_EXERCISES = { 'situps': 'S', 'clrc': 'C', 'plank': 'L' }

const CARDIO_EXERCISES_REV = Object.fromEntries(Object.entries(CARDIO_EXERCISES).map(([k,v]) => [v,k]))
const STRENGTH_EXERCISES_REV = Object.fromEntries(Object.entries(STRENGTH_EXERCISES).map(([k,v]) => [v,k]))
const CORE_EXERCISES_REV = Object.fromEntries(Object.entries(CORE_EXERCISES).map(([k,v]) => [v,k]))

/**
 * Calculate days since epoch
 */
function dateToDays(date) {
  const d = new Date(date)
  const diff = d.getTime() - EPOCH_DATE.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

/**
 * Convert days to date
 */
function daysToDate(days) {
  return new Date(EPOCH_DATE.getTime() + days * 24 * 60 * 60 * 1000)
}

/**
 * Encode assessment to S-code using schema-indexed array
 * 
 * Array positions (fixed schema):
 * [0] = schema version (number)
 * [1] = chart version (number)
 * [2] = date (days since 1950)
 * [3] = diagnostic flag (0/1)
 * [4] = cardio exercise code (char) or null
 * [5] = cardio value (number) or null
 * [6] = cardio exempt (0/1) or null
 * [7] = strength exercise code (char) or null
 * [8] = strength value (number) or null
 * [9] = strength exempt (0/1) or null
 * [10] = core exercise code (char) or null
 * [11] = core value (number) or null
 * [12] = core exempt (0/1) or null
 * [13] = body height (tenths) or null
 * [14] = body waist (tenths) or null
 * [15] = body exempt (0/1) or null
 * 
 * @param {object} assessment - Assessment data
 * @returns {string} S-code string
 */
export function encodeSCode(assessment) {
  const {
    date,
    cardio = null,
    strength = null,
    core = null,
    bodyComp = null,
  } = assessment

  if (!date) {
    throw new Error('Assessment date is required')
  }

  const dateDays = dateToDays(date)
  const diagnostic = isDiagnosticPeriod(date) ? 1 : 0

  // Build fixed-position array
  const arr = [
    SCHEMA_VERSION,
    CHART_VERSION,
    dateDays,
    diagnostic,
    // Cardio (positions 4-6)
    cardio ? CARDIO_EXERCISES[cardio.exercise] : null,
    cardio && !cardio.exempt ? Math.round(cardio.value) : null,
    cardio ? (cardio.exempt ? 1 : 0) : null,
    // Strength (positions 7-9)
    strength ? STRENGTH_EXERCISES[strength.exercise] : null,
    strength && !strength.exempt ? Math.round(strength.value) : null,
    strength ? (strength.exempt ? 1 : 0) : null,
    // Core (positions 10-12)
    core ? CORE_EXERCISES[core.exercise] : null,
    core && !core.exempt ? Math.round(core.value) : null,
    core ? (core.exempt ? 1 : 0) : null,
    // Body comp (positions 13-15)
    bodyComp && !bodyComp.exempt ? Math.round(bodyComp.heightInches * 10) : null,
    bodyComp && !bodyComp.exempt ? Math.round(bodyComp.waistInches * 10) : null,
    bodyComp ? (bodyComp.exempt ? 1 : 0) : null,
  ]

  // Convert to compact string: comma-separated, nulls as empty
  const str = arr.map(v => v === null ? '' : v).join(',')
  
  // Encode to bytes
  const encoder = new TextEncoder()
  const bytes = encoder.encode(str)

  // Add CRC
  const crcValue = crc8(bytes)
  const dataWithCrc = new Uint8Array(bytes.length + 1)
  dataWithCrc.set(bytes)
  dataWithCrc[bytes.length] = crcValue

  // Encode to base64url
  const encoded = encodeBase64url(dataWithCrc)

  return PREFIX + encoded
}

/**
 * Decode S-code to assessment data
 * @param {string} scode - S-code string
 * @returns {object} Assessment data
 */
export function decodeSCode(scode) {
  // Check prefix
  if (!scode || !scode.startsWith(PREFIX)) {
    throw new Error('Invalid S-code: missing or incorrect prefix')
  }

  // Extract payload
  const payload = scode.slice(PREFIX.length)

  // Decode from base64url
  let bytes
  try {
    bytes = decodeBase64url(payload)
  } catch {
    throw new Error('Invalid S-code: base64url decode failed')
  }

  // Verify CRC
  if (!verifyCrc8(bytes)) {
    throw new Error('Invalid S-code: checksum mismatch')
  }

  // Remove CRC and decode string
  const dataBytes = bytes.slice(0, -1)
  const decoder = new TextDecoder()
  const str = decoder.decode(dataBytes)

  // Parse array (empty strings become null)
  const arr = str.split(',').map(v => v === '' ? null : (isNaN(v) ? v : Number(v)))

  // Check schema version
  if (arr[0] > SCHEMA_VERSION) {
    throw new Error('S-code from newer version. Please update the app.')
  }

  // Extract data from fixed positions
  const schemaVersion = arr[0]
  const chartVersion = arr[1]
  const dateDays = arr[2]
  const diagnostic = arr[3]

  const cardio = arr[4] !== null ? {
    exercise: CARDIO_EXERCISES_REV[arr[4]] || '2mile_run',
    value: arr[5],
    exempt: arr[6] === 1,
  } : null

  const strength = arr[7] !== null ? {
    exercise: STRENGTH_EXERCISES_REV[arr[7]] || 'pushups',
    value: arr[8],
    exempt: arr[9] === 1,
  } : null

  const core = arr[10] !== null ? {
    exercise: CORE_EXERCISES_REV[arr[10]] || 'situps',
    value: arr[11],
    exempt: arr[12] === 1,
  } : null

  const bodyComp = arr[13] !== null || arr[14] !== null || arr[15] !== null ? {
    heightInches: arr[13] !== null ? arr[13] / 10 : null,
    waistInches: arr[14] !== null ? arr[14] / 10 : null,
    exempt: arr[15] === 1,
  } : null

  return {
    date: daysToDate(dateDays),
    isDiagnostic: diagnostic === 1,
    schemaVersion,
    chartVersion,
    cardio,
    strength,
    core,
    bodyComp,
  }
}

/**
 * Validate S-code format
 * @param {string} scode - S-code string
 * @returns {boolean} True if valid
 */
export function isValidSCode(scode) {
  try {
    decodeSCode(scode)
    return true
  } catch {
    return false
  }
}
