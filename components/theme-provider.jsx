// YourComponent.jsx

"use client"

import React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * @param {object} props - The component's props.
 * @param {React.ReactNode} props.children - The child elements.
 */
export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
