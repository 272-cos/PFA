/**
 * S-code (Self-Check Code) encoding/decoding
 * Format: S2-[base64url(bitpacked)][CRC-8]
 *
 * VERSION 2: BIT-PACKED COMPRESSION
 * Maximum compression using bit-packing
 * Target: 10-20 character S-codes
 *
 * Bit allocation (87 bits total = 11 bytes):
 * - Header: 24 bits (version:4, chart:4, date:15, diagnostic:1)
 * - Flags: 4 bits (component presence)
 * - Cardio: 14 bits (exercise:2, exempt:1, value:11)
 * - Strength: 9 bits (exercise:1, exempt:1, value:7)
 * - Core: 14 bits (exercise:2, exempt:1, value:11)
 * - Body: 22 bits (exempt:1, height:11, waist:10)
 * Result: 11 bytes + 1 CRC = 12 bytes → 16 base64 chars + 3 prefix = 19 chars
 */

import { encodeBase64url, decodeBase64url } from './base64url.js'
import { crc8, verifyCrc8 } from './crc8.js'
import { isDiagnosticPeriod } from '../scoring/constants.js'
import {
  BitWriter,
  BitReader,
  CARDIO_EX,
  STRENGTH_EX,
  CORE_EX,
  CARDIO_EX_REV,
  STRENGTH_EX_REV,
  CORE_EX_REV,
  DATE_EPOCH,
} from './bitpack.js'

const SCHEMA_VERSION = 2
const CHART_VERSION = 0
const PREFIX = 'S2-'

function dateToDays(date) {
  const d = new Date(date)
  const diff = d.getTime() - DATE_EPOCH.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function daysToDate(days) {
  return new Date(DATE_EPOCH.getTime() + days * 24 * 60 * 60 * 1000)
}

export function encodeSCode(assessment) {
  const { date, cardio = null, strength = null, core = null, bodyComp = null } = assessment

  if (!date) throw new Error('Assessment date is required')

  const writer = new BitWriter()
  const dateDays = dateToDays(date)
  const diagnostic = isDiagnosticPeriod(date) ? 1 : 0

  // Header (24 bits)
  writer.write(SCHEMA_VERSION, 4)
  writer.write(CHART_VERSION, 4)
  writer.write(dateDays, 15) // 15 bits: days since 2020 (covers 2020-2110)
  writer.write(diagnostic, 1)

  // Presence flags (4 bits)
  writer.write(cardio ? 1 : 0, 1)
  writer.write(strength ? 1 : 0, 1)
  writer.write(core ? 1 : 0, 1)
  writer.write(bodyComp ? 1 : 0, 1)

  // Cardio (14 bits if present)
  if (cardio) {
    writer.write(CARDIO_EX[cardio.exercise] || 0, 2)
    writer.write(cardio.exempt ? 1 : 0, 1)
    if (!cardio.exempt) writer.write(Math.min(Math.round(cardio.value), 2047), 11)
  }

  // Strength (9 bits if present)
  if (strength) {
    writer.write(STRENGTH_EX[strength.exercise] || 0, 1)
    writer.write(strength.exempt ? 1 : 0, 1)
    if (!strength.exempt) writer.write(Math.min(Math.round(strength.value), 127), 7)
  }

  // Core (14 bits if present)
  if (core) {
    writer.write(CORE_EX[core.exercise] || 0, 2)
    writer.write(core.exempt ? 1 : 0, 1)
    if (!core.exempt) writer.write(Math.min(Math.round(core.value), 2047), 11)
  }

  // Body comp
  if (bodyComp) {
    writer.write(bodyComp.exempt ? 1 : 0, 1)
    if (!bodyComp.exempt) {
      const h = Math.min(Math.round(bodyComp.heightInches * 10), 2047)
      const w = Math.min(Math.round(bodyComp.waistInches * 10), 1023)
      writer.write(h, 11)
      writer.write(w, 10)
    }
  }

  const bytes = writer.getBytes()
  const crcValue = crc8(bytes)
  const dataWithCrc = new Uint8Array(bytes.length + 1)
  dataWithCrc.set(bytes)
  dataWithCrc[bytes.length] = crcValue

  return PREFIX + encodeBase64url(dataWithCrc)
}

export function decodeSCode(scode) {
  if (!scode || !scode.startsWith(PREFIX)) {
    throw new Error('Invalid S-code: missing or incorrect prefix')
  }

  const payload = scode.slice(PREFIX.length)
  let bytes
  try {
    bytes = decodeBase64url(payload)
  } catch {
    throw new Error('Invalid S-code: base64url decode failed')
  }

  if (!verifyCrc8(bytes)) {
    throw new Error('Invalid S-code: checksum mismatch')
  }

  const dataBytes = bytes.slice(0, -1)
  const reader = new BitReader(dataBytes)

  const schemaVersion = reader.read(4)
  const chartVersion = reader.read(4)
  const dateDays = reader.read(15) // 15 bits: days since 2020
  const diagnostic = reader.read(1)

  if (schemaVersion > SCHEMA_VERSION) {
    throw new Error('S-code from newer version. Please update the app.')
  }

  const hasCardio = reader.read(1) === 1
  const hasStrength = reader.read(1) === 1
  const hasCore = reader.read(1) === 1
  const hasBodyComp = reader.read(1) === 1

  let cardio = null
  if (hasCardio) {
    const ex = reader.read(2)
    const exempt = reader.read(1) === 1
    cardio = {
      exercise: CARDIO_EX_REV[ex] || '2mile_run',
      value: exempt ? null : reader.read(11), // 11 bits
      exempt,
    }
  }

  let strength = null
  if (hasStrength) {
    const ex = reader.read(1)
    const exempt = reader.read(1) === 1
    strength = {
      exercise: STRENGTH_EX_REV[ex] || 'pushups',
      value: exempt ? null : reader.read(7),
      exempt,
    }
  }

  let core = null
  if (hasCore) {
    const ex = reader.read(2)
    const exempt = reader.read(1) === 1
    core = {
      exercise: CORE_EX_REV[ex] || 'situps',
      value: exempt ? null : reader.read(11), // 11 bits
      exempt,
    }
  }

  let bodyComp = null
  if (hasBodyComp) {
    const exempt = reader.read(1) === 1
    if (!exempt) {
      bodyComp = {
        heightInches: reader.read(11) / 10,
        waistInches: reader.read(10) / 10,
        exempt: false,
      }
    } else {
      bodyComp = { heightInches: null, waistInches: null, exempt: true }
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

export function isValidSCode(scode) {
  try {
    decodeSCode(scode)
    return true
  } catch {
    return false
  }
}
