/**
 * Profile Tab - D-code generation and demographics
 */

import { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'

export default function ProfileTab() {
  const { dcode, updateDCode } = useApp()

  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('M')

  const handleGenerateDCode = () => {
    // TODO: Implement D-code encoding when codec is ready
    const fakeDCode = `D1-${Math.random().toString(36).substr(2, 9)}`
    updateDCode(fakeDCode, { dob, gender })
    alert('D-code generated! (Encoding will be implemented in Sprint 2)')
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile</h2>

      <div className="space-y-6">
        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="M"
                checked={gender === 'M'}
                onChange={(e) => setGender(e.target.value)}
                className="mr-2"
              />
              Male
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="F"
                checked={gender === 'F'}
                onChange={(e) => setGender(e.target.value)}
                className="mr-2"
              />
              Female
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateDCode}
          disabled={!dob}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Generate D-Code
        </button>

        {/* Display D-Code */}
        {dcode && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Your D-Code:</p>
            <p className="font-mono text-lg text-blue-900">{dcode}</p>
            <p className="text-xs text-gray-600 mt-2">
              Save this code! You'll need it to load your profile on other devices.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
