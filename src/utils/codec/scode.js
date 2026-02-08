/**
 * S-code (Self-Check Code) encoding/decoding
 * Format: S2-[base64url payload][CRC-8]
 *
 * VERSION 2: BIT-PACKED COMPRESSION
 * Reduces code size from ~300 chars to ~40-50 chars
 * Uses bit-packing instead of JSON for maximum compression
 */

import { encodeBase64url, decodeBase64url } from './base64url.js'
import { crc8, verifyCrc8 } from './crc8.js'
import { isDiagnosticPeriod } from '../scoring/constants.js'
import {
  BitPacker,
  BitUnpacker,
  CARDIO_EXERCISES,
  STRENGTH_EXERCISES,
  CORE_EXERCISES,
  CARDIO_EXERCISES_REV,
  STRENGTH_EXERCISES_REV,
  CORE_EXERCISES_REV,
} from './bitPacker.js'

const SCHEMA_VERSION = 2
const CHART_VERSION = 0 // v2025_sep provisional
const EPOCH_DATE = new Date('1950-01-01')
const PREFIX = 'S2-'

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
 * Encode assessment to S-code using bit-packing
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

  const packer = new BitPacker()

  // Pack header (25 bits total)
  const dateDays = dateToDays(date)
  const diagnostic = isDiagnosticPeriod(date) ? 1 : 0

  packer.pack(SCHEMA_VERSION, 4) // Schema version (0-15)
  packer.pack(CHART_VERSION, 4)  // Chart version (0-15)
  packer.pack(dateDays, 16)      // Date (days since 1950, supports until ~2129)
  packer.pack(diagnostic, 1)     // Diagnostic flag

  // Component presence flags (4 bits)
  packer.pack(cardio ? 1 : 0, 1)
  packer.pack(strength ? 1 : 0, 1)
  packer.pack(core ? 1 : 0, 1)
  packer.pack(bodyComp ? 1 : 0, 1)

  // Pack cardio (if present): 3 + 1 + 0-12 = 4-16 bits
  if (cardio) {
    const exCode = CARDIO_EXERCISES[cardio.exercise] || 0
    packer.pack(exCode, 3)  // Exercise type (0-7)
    packer.pack(cardio.exempt ? 1 : 0, 1)
    if (!cardio.exempt) {
      packer.pack(Math.round(cardio.value), 12) // Value (0-4095 seconds or shuttles)
    }
  }

  // Pack strength (if present): 2 + 1 + 0-7 = 3-10 bits
  if (strength) {
    const exCode = STRENGTH_EXERCISES[strength.exercise] || 0
    packer.pack(exCode, 2)  // Exercise type (0-3)
    packer.pack(strength.exempt ? 1 : 0, 1)
    if (!strength.exempt) {
      packer.pack(Math.round(strength.value), 7) // Reps (0-127)
    }
  }

  // Pack core (if present): 2 + 1 + 0-12 = 3-15 bits
  if (core) {
    const exCode = CORE_EXERCISES[core.exercise] || 0
    packer.pack(exCode, 2)  // Exercise type (0-3)
    packer.pack(core.exempt ? 1 : 0, 1)
    if (!core.exempt) {
      packer.pack(Math.round(core.value), 12) // Value (0-4095 seconds or reps)
    }
  }

  // Pack body comp (if present): 1 + 0-21 = 1-22 bits
  if (bodyComp) {
    packer.pack(bodyComp.exempt ? 1 : 0, 1)
    if (!bodyComp.exempt) {
      const height = Math.round(bodyComp.heightInches * 10) // Store as tenths
      const waist = Math.round(bodyComp.waistInches * 10)
      packer.pack(height, 11) // Height (48.0-110.0 inches in tenths = 480-1100)
      packer.pack(waist, 10)  // Waist (20.0-90.0 inches in tenths = 200-900)
    }
  }

  // Get bytes and add CRC
  const bytes = packer.getBytes()
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

  // Remove CRC and unpack
  const dataBytes = bytes.slice(0, -1)
  const unpacker = new BitUnpacker(dataBytes)

  // Unpack header
  const schemaVersion = unpacker.unpack(4)
  const chartVersion = unpacker.unpack(4)
  const dateDays = unpacker.unpack(16)
  const diagnostic = unpacker.unpack(1)

  if (schemaVersion > SCHEMA_VERSION) {
    throw new Error('S-code from newer version. Please update the app.')
  }

  // Unpack component presence flags
  const hasCardio = unpacker.unpack(1) === 1
  const hasStrength = unpacker.unpack(1) === 1
  const hasCore = unpacker.unpack(1) === 1
  const hasBodyComp = unpacker.unpack(1) === 1

  let cardio = null
  if (hasCardio) {
    const exCode = unpacker.unpack(3)
    const exempt = unpacker.unpack(1) === 1
    const value = exempt ? null : unpacker.unpack(12)
    cardio = {
      exercise: CARDIO_EXERCISES_REV[exCode] || '2mile_run',
      value,
      exempt,
    }
  }

  let strength = null
  if (hasStrength) {
    const exCode = unpacker.unpack(2)
    const exempt = unpacker.unpack(1) === 1
    const value = exempt ? null : unpacker.unpack(7)
    strength = {
      exercise: STRENGTH_EXERCISES_REV[exCode] || 'pushups',
      value,
      exempt,
    }
  }

  let core = null
  if (hasCore) {
    const exCode = unpacker.unpack(2)
    const exempt = unpacker.unpack(1) === 1
    const value = exempt ? null : unpacker.unpack(12)
    core = {
      exercise: CORE_EXERCISES_REV[exCode] || 'situps',
      value,
      exempt,
    }
  }

  let bodyComp = null
  if (hasBodyComp) {
    const exempt = unpacker.unpack(1) === 1
    if (!exempt) {
      const height = unpacker.unpack(11) / 10 // Convert back from tenths
      const waist = unpacker.unpack(10) / 10
      bodyComp = {
        heightInches: height,
        waistInches: waist,
        exempt: false,
      }
    } else {
      bodyComp = {
        heightInches: null,
        waistInches: null,
        exempt: true,
      }
    }
  }

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
