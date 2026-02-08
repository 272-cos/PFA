/**
 * CRC-8 checksum utility
 * Used for error detection in D-codes and S-codes
 */

// CRC-8 polynomial: x^8 + x^2 + x + 1 (0x07)
const CRC8_POLY = 0x07

/**
 * Calculate CRC-8 checksum for data
 * @param {Uint8Array} data - Data to checksum
 * @returns {number} CRC-8 value (0-255)
 */
export function crc8(data) {
  let crc = 0

  for (let i = 0; i < data.length; i++) {
    crc ^= data[i]

    for (let j = 0; j < 8; j++) {
      if (crc & 0x80) {
        crc = (crc << 1) ^ CRC8_POLY
      } else {
        crc = crc << 1
      }
    }

    crc &= 0xff
  }

  return crc
}

/**
 * Verify CRC-8 checksum
 * @param {Uint8Array} data - Data including checksum as last byte
 * @returns {boolean} True if checksum is valid
 */
export function verifyCrc8(data) {
  if (data.length < 2) return false

  const dataWithoutCrc = data.slice(0, -1)
  const providedCrc = data[data.length - 1]
  const calculatedCrc = crc8(dataWithoutCrc)

  return providedCrc === calculatedCrc
}
