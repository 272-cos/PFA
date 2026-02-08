/**
 * Global App Context for PFA Tracker
 * Manages D-code, S-codes, current tab, and onboarding state
 */

import { createContext, useContext, useState, useEffect } from 'react'
import {
  getDCode,
  saveDCode,
  getSCodes,
  addSCode as addSCodeToStorage,
  isOnboarded,
  setOnboarded,
} from '../utils/storage/localStorage.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // D-code (demographics): DOB + gender
  const [dcode, setDCode] = useState(null)
  const [demographics, setDemographics] = useState(null) // Decoded D-code data

  // S-codes (self-checks): Array of assessment codes
  const [scodes, setSCodes] = useState([])

  // Current active tab
  const [activeTab, setActiveTab] = useState('profile')

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const storedDCode = getDCode()
    if (storedDCode) {
      setDCode(storedDCode)
      // TODO: Decode D-code when codec is implemented
    }

    const storedSCodes = getSCodes()
    setSCodes(storedSCodes)

    // Show onboarding if first visit
    if (!isOnboarded()) {
      setShowOnboarding(true)
    }
  }, [])

  // Save D-code to localStorage when it changes
  const updateDCode = (newDCode, decodedData = null) => {
    setDCode(newDCode)
    setDemographics(decodedData)
    if (newDCode) {
      saveDCode(newDCode)
    }
  }

  // Add S-code to list
  const addSCode = (scode) => {
    if (scode && !scodes.includes(scode)) {
      const updated = [...scodes, scode]
      setSCodes(updated)
      addSCodeToStorage(scode)
    }
  }

  // Complete onboarding
  const completeOnboarding = () => {
    setShowOnboarding(false)
    setOnboarded()
  }

  const value = {
    // D-code
    dcode,
    demographics,
    updateDCode,

    // S-codes
    scodes,
    addSCode,

    // Navigation
    activeTab,
    setActiveTab,

    // Onboarding
    showOnboarding,
    completeOnboarding,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
