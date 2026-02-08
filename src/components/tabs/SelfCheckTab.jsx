/**
 * Self-Check Tab - Personal assessment entry
 * TODO: Full implementation with component inputs
 */

export default function SelfCheckTab() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Assessment</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-900">
          <strong>Coming Soon:</strong> Enter your workout performance for each component.
          Partial assessments supported (test 1+ components at a time).
        </p>
      </div>

      <div className="space-y-4 text-gray-600">
        <p>✓ Cardio: 2-mile run, HAMR, or 2km walk (profile)</p>
        <p>✓ Strength: Push-ups or Hand-Release Push-Ups</p>
        <p>✓ Core: Sit-ups, Reverse Crunches, or Plank</p>
        <p>✓ Body Composition: Waist-to-Height Ratio</p>
      </div>
    </div>
  )
}
