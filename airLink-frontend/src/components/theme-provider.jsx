import { createContext, useContext, useEffect, useState } from "react"

const themes = {
  light: "light",
  dark: "dark", 
  green: "green",
  yellow: "yellow",
  maroon: "maroon"
}

const initialState = {
  theme: "light",
  setTheme: () => null,
  themes,
}

const ThemeProviderContext = createContext(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "airline-ui-theme",
  ...props
}) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    // Remove all theme classes and data attributes
    Object.values(themes).forEach(themeName => {
      root.classList.remove(themeName)
      root.removeAttribute(`data-theme`)
    })

    // Apply new theme
    root.classList.add(theme)
    root.setAttribute('data-theme', theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
    themes,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
