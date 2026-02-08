/**
 * Bit packing utilities for efficient S-code encoding
 * Packs assessment data into minimal number of bits
 */

export class BitPacker {
  constructor() {
    this.bits = []
  }

  /**
   * Add bits to the stream
   * @param {number} value - Value to pack
   * @param {number} bitCount - Number of bits to use
   */
  pack(value, bitCount) {
    for (let i = bitCount - 1; i >= 0; i--) {
      this.bits.push((value >> i) & 1)
    }
  }

  /**
   * Get packed bytes
   * @returns {Uint8Array}
   */
  getBytes() {
    // Pad to byte boundary
    while (this.bits.length % 8 !== 0) {
      this.bits.push(0)
    }

    const bytes = new Uint8Array(this.bits.length / 8)
    for (let i = 0; i < bytes.length; i++) {
      let byte = 0
      for (let j = 0; j < 8; j++) {
        byte = (byte << 1) | this.bits[i * 8 + j]
      }
      bytes[i] = byte
    }
    return bytes
  }
}

export class BitUnpacker {
  constructor(bytes) {
    this.bits = []
    for (let i = 0; i < bytes.length; i++) {
      for (let j = 7; j >= 0; j--) {
        this.bits.push((bytes[i] >> j) & 1)
      }
    }
    this.position = 0
  }

  /**
   * Unpack bits from stream
   * @param {number} bitCount - Number of bits to read
   * @returns {number}
   */
  unpack(bitCount) {
    let value = 0
    for (let i = 0; i < bitCount; i++) {
      value = (value << 1) | (this.bits[this.position++] || 0)
    }
    return value
  }

  /**
   * Check if we have more bits to read
   */
  hasMore() {
    return this.position < this.bits.length
  }
}

/**
 * Exercise type encoding (3 bits each)
 */
export const CARDIO_EXERCISES = {
  '2mile_run': 0,
  'hamr': 1,
  '2km_walk': 2,
}

export const STRENGTH_EXERCISES = {
  'pushups': 0,
  'hrpu': 1,
}

export const CORE_EXERCISES = {
  'situps': 0,
  'clrc': 1,
  'plank': 2,
}

// Reverse mappings
export const CARDIO_EXERCISES_REV = Object.fromEntries(
  Object.entries(CARDIO_EXERCISES).map(([k, v]) => [v, k])
)
export const STRENGTH_EXERCISES_REV = Object.fromEntries(
  Object.entries(STRENGTH_EXERCISES).map(([k, v]) => [v, k])
)
export const CORE_EXERCISES_REV = Object.fromEntries(
  Object.entries(CORE_EXERCISES).map(([k, v]) => [v, k])
)
