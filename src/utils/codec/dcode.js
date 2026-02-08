/**
 * D-code (Demographics Code) encoding/decoding
 * Format: D1-[base64url payload][CRC-8]
 * Contains: schema_version (4 bits) + gender (1 bit) + dob_days_since_epoch (16 bits)
 * Total: 21 bits = 3 bytes
 */

import { encodeBase64url, decodeBase64url } from './base64url.js'
import { crc8, verifyCrc8 } from './crc8.js'
import { GENDER } from '../scoring/constants.js'

const SCHEMA_VERSION = 1
const EPOCH_DATE = new Date('1950-01-01')
const PREFIX = 'D1-'

/**
 * Calculate days since epoch (1950-01-01)
 * @param {Date|string} date - Date to convert
 * @returns {number} Days since epoch
 */
function dateToDaysSinceEpoch(date) {
  const d = new Date(date)
  const diff = d.getTime() - EPOCH_DATE.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

/**
 * Convert days since epoch to Date
 * @param {number} days - Days since epoch
 * @returns {Date}
 */
function daysToDate(days) {
  const ms = days * 24 * 60 * 60 * 1000
  return new Date(EPOCH_DATE.getTime() + ms)
}

/**
 * Encode demographics to D-code
 * @param {object} demographics - { dob: Date|string, gender: 'M'|'F' }
 * @returns {string} D-code string (e.g., "D1-abc123ef")
 */
export function encodeDCode(demographics) {
  const { dob, gender } = demographics

  if (!dob || !gender) {
    throw new Error('Missing required demographics: dob and gender')
  }

  // Convert gender to bit
  const genderBit = gender === GENDER.FEMALE ? 1 : 0

  // Convert DOB to days since epoch
  const dobDays = dateToDaysSinceEpoch(dob)

  if (dobDays < 0 || dobDays > 0xffff) {
    throw new Error('DOB out of valid range')
  }

  // Pack bits into 3 bytes
  // Byte 0: [schema_version (4 bits)][gender (1 bit)][dob high 3 bits]
  // Byte 1: [dob middle 8 bits]
  // Byte 2: [dob low 5 bits][padding 3 bits]

  const bytes = new Uint8Array(3)

  bytes[0] = (SCHEMA_VERSION << 4) | (genderBit << 3) | ((dobDays >> 13) & 0x07)
  bytes[1] = (dobDays >> 5) & 0xff
  bytes[2] = (dobDays << 3) & 0xff

  // Add CRC-8
  const crcValue = crc8(bytes)
  const dataWithCrc = new Uint8Array(4)
  dataWithCrc.set(bytes)
  dataWithCrc[3] = crcValue

  // Encode to base64url
  const encoded = encodeBase64url(dataWithCrc)

  return PREFIX + encoded
}

/**
 * Decode D-code to demographics
 * @param {string} dcode - D-code string
 * @returns {object} { dob: Date, gender: 'M'|'F', schemaVersion: number }
 */
export function decodeDCode(dcode) {
  // Check prefix
  if (!dcode || !dcode.startsWith(PREFIX)) {
    throw new Error('Invalid D-code: missing or incorrect prefix')
  }

  // Extract payload
  const payload = dcode.slice(PREFIX.length)

  // Decode from base64url
  let bytes
  try {
    bytes = decodeBase64url(payload)
  } catch {
    throw new Error('Invalid D-code: base64url decode failed')
  }

  // Verify CRC
  if (!verifyCrc8(bytes)) {
    throw new Error('Invalid D-code: checksum mismatch')
  }

  // Remove CRC
  const data = bytes.slice(0, -1)

  if (data.length !== 3) {
    throw new Error('Invalid D-code: incorrect data length')
  }

  // Unpack bits
  const schemaVersion = (data[0] >> 4) & 0x0f
  const genderBit = (data[0] >> 3) & 0x01
  const dobDays = ((data[0] & 0x07) << 13) | (data[1] << 5) | (data[2] >> 3)

  // Check schema version
  if (schemaVersion > SCHEMA_VERSION) {
    throw new Error('D-code from newer version. Please update the app.')
  }

  // Convert to readable format
  const gender = genderBit === 1 ? GENDER.FEMALE : GENDER.MALE
  const dob = daysToDate(dobDays)

  return {
    dob,
    gender,
    schemaVersion,
  }
}

/**
 * Validate D-code format
 * @param {string} dcode - D-code string to validate
 * @returns {boolean} True if valid
 */
export function isValidDCode(dcode) {
  try {
    decodeDCode(dcode)
    return true
  } catch {
    return false
  }
}
