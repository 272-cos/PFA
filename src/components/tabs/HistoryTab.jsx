/**
 * History Tab - S-code management and trends
 * TODO: Full implementation
 */

import { useApp } from '../../context/AppContext.jsx'

export default function HistoryTab() {
  const { scodes } = useApp()

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Assessment History</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-900">
          <strong>Coming Soon:</strong> View all your past assessments, track trends, and flag
          outliers.
        </p>
      </div>

      {scodes.length > 0 ? (
        <div>
          <p className="text-sm text-gray-600 mb-2">Saved S-Codes: {scodes.length}</p>
          <div className="space-y-2">
            {scodes.map((code, i) => (
              <div key={i} className="p-2 bg-gray-50 rounded font-mono text-sm">
                {code}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No assessments yet. Complete a self-check to get started!</p>
      )}
    </div>
  )
}
