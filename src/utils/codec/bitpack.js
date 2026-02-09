/**
 * Bit-packing compression for S-code
 * Packs data into minimal bits for maximum compression
 * Target: 10-20 character S-codes
 *
 * Bit allocation (87 bits total):
 * - Header: 24 bits (version:4, chart:4, date:15, diagnostic:1)
 * - Flags: 4 bits (component presence)
 * - Cardio: 14 bits (exercise:2, exempt:1, value:11)
 * - Strength: 9 bits (exercise:1, exempt:1, value:7)
 * - Core: 14 bits (exercise:2, exempt:1, value:11)
 * - Body: 22 bits (exempt:1, height:11, waist:10)
 * Total: 87 bits = 11 bytes → ~19 chars with CRC and base64
 */

// Date epoch: days since 2020-01-01 (covers 2020-2110 with 15 bits)
export const DATE_EPOCH = new Date('2020-01-01')

export class BitWriter {
  constructor() {
    this.bytes = []
    this.currentByte = 0
    this.bitPosition = 0
  }

  /**
   * Write bits to stream
   * @param {number} value - Value to write
   * @param {number} numBits - Number of bits
   */
  write(value, numBits) {
    for (let i = numBits - 1; i >= 0; i--) {
      const bit = (value >> i) & 1
      this.currentByte = (this.currentByte << 1) | bit
      this.bitPosition++

      if (this.bitPosition === 8) {
        this.bytes.push(this.currentByte)
        this.currentByte = 0
        this.bitPosition = 0
      }
    }
  }

  /**
   * Get packed bytes
   */
  getBytes() {
    // Flush remaining bits
    if (this.bitPosition > 0) {
      this.currentByte <<= (8 - this.bitPosition)
      this.bytes.push(this.currentByte)
    }
    return new Uint8Array(this.bytes)
  }
}

export class BitReader {
  constructor(bytes) {
    this.bytes = bytes
    this.bytePosition = 0
    this.bitPosition = 0
  }

  /**
   * Read bits from stream
   * @param {number} numBits - Number of bits to read
   */
  read(numBits) {
    let value = 0
    for (let i = 0; i < numBits; i++) {
      if (this.bytePosition >= this.bytes.length) return 0

      const bit = (this.bytes[this.bytePosition] >> (7 - this.bitPosition)) & 1
      value = (value << 1) | bit
      this.bitPosition++

      if (this.bitPosition === 8) {
        this.bytePosition++
        this.bitPosition = 0
      }
    }
    return value
  }
}

// Exercise encodings (minimal bits)
export const CARDIO_EX = { '2mile_run': 0, 'hamr': 1, '2km_walk': 2 }
export const STRENGTH_EX = { 'pushups': 0, 'hrpu': 1 }
export const CORE_EX = { 'situps': 0, 'clrc': 1, 'plank': 2 }

export const CARDIO_EX_REV = { 0: '2mile_run', 1: 'hamr', 2: '2km_walk' }
export const STRENGTH_EX_REV = { 0: 'pushups', 1: 'hrpu' }
export const CORE_EX_REV = { 0: 'situps', 1: 'clrc', 2: 'plank' }
