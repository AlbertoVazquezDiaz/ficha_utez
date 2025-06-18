"use client"

import { useState, useEffect } from "react"

interface Disability {
  id: number
  nombre: string
}

interface ApiResponse {
  code: number
  message: string
  data: Array<{
    id: number
    name: string
  }>
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

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  console.error("❌ Error: NEXT_PUBLIC_API_BASE_URL environment variable is not defined")
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export function useDisabilities(): UseDisabilitiesReturn {
  const [disabilities, setDisabilities] = useState<Disability[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUsingFallback, setIsUsingFallback] = useState(false)

  const fetchDisabilities = async () => {
    try {
      if (!API_BASE_URL) {
        throw new Error("La URL base de la API no está configurada. Verifica la variable de entorno NEXT_PUBLIC_API_BASE_URL.")
      }

      setLoading(true)
      setError(null)
      setIsUsingFallback(false)

      const fullUrl = `${API_BASE_URL}/disabilities`
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
        mode: "cors",
      })

      clearTimeout(timeoutId)

      console.log("📡 Response status:", response.status)
      console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const apiResponse = await response.json() as ApiResponse
      console.log("✅ API Response received:", apiResponse)

      // Validate data structure
      if (!apiResponse.data || !Array.isArray(apiResponse.data)) {
        throw new Error("La respuesta de la API no contiene un array válido en la propiedad 'data'")
      }

      // Transform and validate each item
      const validatedData = apiResponse.data.map((item, index) => {
        if (!item || typeof item !== "object" || !item.name) {
          console.warn(`⚠️ Invalid disability item at index ${index}:`, item)
          throw new Error(`Elemento inválido en el índice ${index}: falta la propiedad 'name'`)
        }
        return {
          id: item.id || index,
          nombre: item.name // Map 'name' to 'nombre' for frontend
        }
      })

      // Add "Ninguna" option if it doesn't exist
      if (!validatedData.some(item => item.nombre === "Ninguna")) {
        validatedData.unshift({ id: 0, nombre: "Ninguna" })
      }

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
