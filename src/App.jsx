function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-900 text-white p-4">
        <h1 className="text-2xl font-bold">USAF PFA Tracker</h1>
        <p className="text-sm text-yellow-300 mt-1">UNOFFICIAL SELF-CHECK</p>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-700">
            USAF PFA Readiness Tracker - 2026 Standards (50-20-15-15 Model)
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Based on DAFMAN 36-2905 and AFPC provisional charts (Sep 2025)
          </p>
        </div>
      </main>
    </div>
  )
}

export default App
