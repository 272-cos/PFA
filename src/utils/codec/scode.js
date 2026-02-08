/**
 * S-code (Self-Check Code) encoding/decoding
 * Format: S1-[base64url payload][CRC-8]
 *
 * SIMPLIFIED VERSION for Sprint 2:
 * Contains essential assessment data only
 * Full implementation with all feedback fields in Sprint 3
 */

import { encodeBase64url, decodeBase64url } from './base64url.js'
import { crc8, verifyCrc8 } from './crc8.js'
// import { EXERCISES } from '../scoring/constants.js'
import { isDiagnosticPeriod } from '../scoring/constants.js'

const SCHEMA_VERSION = 1
const CHART_VERSION = 0 // v2025_sep provisional
const EPOCH_DATE = new Date('1950-01-01')
const PREFIX = 'S1-'

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
 * Encode assessment to S-code
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

  // Simplified bit packing (will expand in Sprint 3)
  // For now: JSON stringify and encode (NOT production-ready, but functional)
  const data = {
    v: SCHEMA_VERSION,
    c: CHART_VERSION,
    d: dateDays,
    diag: diagnostic,
    cardio: cardio ? {
      ex: cardio.exercise,
      val: cardio.value,
      exempt: cardio.exempt || false,
    } : null,
    strength: strength ? {
      ex: strength.exercise,
      val: strength.value,
      exempt: strength.exempt || false,
    } : null,
    core: core ? {
      ex: core.exercise,
      val: core.value,
      exempt: core.exempt || false,
    } : null,
    body: bodyComp ? {
      h: bodyComp.heightInches,
      w: bodyComp.waistInches,
      exempt: bodyComp.exempt || false,
    } : null,
  }

  // Convert to JSON and then to bytes
  const jsonStr = JSON.stringify(data)
  const encoder = new TextEncoder()
  const jsonBytes = encoder.encode(jsonStr)

  // Add CRC
  const crcValue = crc8(jsonBytes)
  const dataWithCrc = new Uint8Array(jsonBytes.length + 1)
  dataWithCrc.set(jsonBytes)
  dataWithCrc[jsonBytes.length] = crcValue

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

  // Remove CRC
  const jsonBytes = bytes.slice(0, -1)

  // Decode JSON
  const decoder = new TextDecoder()
  const jsonStr = decoder.decode(jsonBytes)
  const data = JSON.parse(jsonStr)

  // Check schema version
  if (data.v > SCHEMA_VERSION) {
    throw new Error('S-code from newer version. Please update the app.')
  }

  // Convert back to assessment format
  const assessment = {
    date: daysToDate(data.d),
    isDiagnostic: data.diag === 1,
    schemaVersion: data.v,
    chartVersion: data.c,
    cardio: data.cardio ? {
      exercise: data.cardio.ex,
      value: data.cardio.val,
      exempt: data.cardio.exempt || false,
    } : null,
    strength: data.strength ? {
      exercise: data.strength.ex,
      value: data.strength.val,
      exempt: data.strength.exempt || false,
    } : null,
    core: data.core ? {
      exercise: data.core.ex,
      value: data.core.val,
      exempt: data.core.exempt || false,
    } : null,
    bodyComp: data.body ? {
      heightInches: data.body.h,
      waistInches: data.body.w,
      exempt: data.body.exempt || false,
    } : null,
  }

  return assessment
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
