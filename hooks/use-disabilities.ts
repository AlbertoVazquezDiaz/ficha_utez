"use client"

import { useState, useEffect } from "react"

interface Disability {
  id: number
  nombre: string
}

interface UseDisabilitiesReturn {
  disabilities: Disability[]
  loading: boolean
  error: string | null
  refetch: () => void
  isUsingFallback: boolean
}

// Fallback data in case the API is not available
const fallbackDisabilities: Disability[] = [
  { id: 1, nombre: "Ninguna" },
  { id: 2, nombre: "Visual" },
  { id: 3, nombre: "Auditiva" },
  { id: 4, nombre: "Motriz" },
  { id: 5, nombre: "Intelectual" },
  { id: 6, nombre: "Psicosocial" },
  { id: 7, nombre: "Múltiple" },
  { id: 8, nombre: "Otro" },
]

export function useDisabilities(): UseDisabilitiesReturn {
  const [disabilities, setDisabilities] = useState<Disability[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUsingFallback, setIsUsingFallback] = useState(false)

  const fetchDisabilities = async () => {
    try {
      setLoading(true)
      setError(null)
      setIsUsingFallback(false)

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.106.24:8080/api/fichas-utez"
      const fullUrl = `${baseUrl}/disabilities`

      console.log("🔄 Fetching disabilities from:", fullUrl)

      // Add timeout and better fetch configuration
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: controller.signal,
        // Add mode if CORS is an issue
        mode: "cors",
      })

      clearTimeout(timeoutId)

      console.log("📡 Response status:", response.status)
      console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("✅ Disabilities data received:", data)

      // Validate data structure
      if (!Array.isArray(data)) {
        throw new Error("La respuesta de la API no es un array válido")
      }

      // Ensure each item has the expected structure
      const validatedData = data.map((item, index) => {
        if (typeof item !== "object" || !item.nombre) {
          console.warn(`⚠️ Invalid disability item at index ${index}:`, item)
          return { id: item.id || index, nombre: item.nombre || item.name || `Opción ${index + 1}` }
        }
        return { id: item.id || index, nombre: item.nombre }
      })

      setDisabilities(validatedData)
      console.log("✅ Disabilities loaded successfully:", validatedData.length, "items")
    } catch (err) {
      console.error("❌ Error fetching disabilities:", err)

      let errorMessage = "Error desconocido"

      if (err instanceof Error) {
        if (err.name === "AbortError") {
          errorMessage = "Tiempo de espera agotado. Verifica tu conexión a internet."
        } else if (err.message.includes("Failed to fetch")) {
          errorMessage =
            "No se pudo conectar al servidor. Posibles causas:\n• El servidor no está disponible\n• Problemas de CORS\n• Conexión de red interrumpida"
        } else if (err.message.includes("HTTP")) {
          errorMessage = `Error del servidor: ${err.message}`
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)

      // Use fallback data
      console.log("🔄 Using fallback disabilities data")
      setDisabilities(fallbackDisabilities)
      setIsUsingFallback(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDisabilities()
  }, [])

  const refetch = () => {
    console.log("🔄 Refetching disabilities...")
    fetchDisabilities()
  }

  return {
    disabilities,
    loading,
    error,
    refetch,
    isUsingFallback,
  }
}
