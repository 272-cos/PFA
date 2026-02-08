/**
 * Base64url encoding/decoding (RFC 4648 section 5)
 * URL-safe variant without padding
 */

/**
 * Encode Uint8Array to base64url string
 * @param {Uint8Array} data - Data to encode
 * @returns {string} Base64url encoded string
 */
export function encodeBase64url(data) {
  // Convert to regular base64
  let base64 = ''
  const bytes = new Uint8Array(data)
  const len = bytes.byteLength

  for (let i = 0; i < len; i++) {
    base64 += String.fromCharCode(bytes[i])
  }

  base64 = btoa(base64)

  // Convert to base64url (replace + with -, / with _, remove padding =)
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

/**
 * Decode base64url string to Uint8Array
 * @param {string} str - Base64url string
 * @returns {Uint8Array} Decoded data
 */
export function decodeBase64url(str) {
  // Convert base64url to regular base64
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')

  // Add padding if needed
  while (base64.length % 4) {
    base64 += '='
  }

  // Decode base64
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  return bytes
}
