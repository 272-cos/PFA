/**
 * Header with persistent unofficial banner
 */

export default function Header() {
  return (
    <header className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <h1 className="text-2xl font-bold">USAF PFA Tracker</h1>
        <p className="text-sm text-yellow-300 mt-1 font-semibold">
          ⚠️ UNOFFICIAL PERSONAL ASSESSMENT TOOL
        </p>
        <p className="text-xs text-gray-300 mt-1">
          Not affiliated with USAF or DoD. For personal readiness tracking only.
        </p>
      </div>
    </header>
  )
}
