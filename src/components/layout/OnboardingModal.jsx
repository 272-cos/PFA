/**
 * Onboarding Modal - First-time user experience
 */

import { useApp } from '../../context/AppContext.jsx'

export default function OnboardingModal() {
  const { completeOnboarding, setActiveTab } = useApp()

  const handleStartFresh = () => {
    completeOnboarding()
    setActiveTab('profile')
  }

  const handleHaveCodes = () => {
    completeOnboarding()
    setActiveTab('profile') // They can paste codes in profile
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to Trajectory
        </h2>

        <p className="text-gray-600 mb-4">
          Track your fitness progress and project readiness against 2026 PFA standards.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-900">
            <strong>Important:</strong> This is an <strong>unofficial</strong> personal assessment tool.
            It provides <strong>estimates only</strong>, not official PFA scores.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleStartFresh}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Start Fresh
          </button>

          <button
            onClick={handleHaveCodes}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            I Have Previous Codes
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
          Your data stays private. No login required.
        </p>
      </div>
    </div>
  )
}
