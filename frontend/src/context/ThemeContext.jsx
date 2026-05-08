import { createContext, useState } from 'react'
export const ThemeContext = createContext()
export const ThemeProvider = ({ children }) => {
  const [theme] = useState('cosmic')
  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
}
