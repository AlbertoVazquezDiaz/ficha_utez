export interface Nacionalidad {
  id: number;
  name: string;
}

export interface Estado {
  id: number;
  name: string;
}

export interface EstadoCivil {
  id: number;
  name: string;
}

export interface LenguaNatal {
  id: number;
  name: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.0.103:8080/api/fichas-utez"

export async function fetchNacionalidades(): Promise<Nacionalidad[]> {
  const res = await fetch(`${API_BASE}/nationalities`)
  if (!res.ok) throw new Error("No se pudieron obtener las nacionalidades")
  const json = await res.json()
  if (!json.data || !Array.isArray(json.data)) {
    throw new Error("La respuesta no contiene un array válido en data")
  }
  return json.data
}

export async function fetchEstadosPorPais(countryId: number = 1): Promise<Estado[]> {
  const res = await fetch(`${API_BASE}/states/country/${countryId}`)
  if (!res.ok) throw new Error("No se pudieron obtener los estados")
  const json = await res.json()
  if (!json.data || !Array.isArray(json.data)) {
    throw new Error("La respuesta no contiene un array válido en data")
  }
  return json.data
}

export async function fetchEstadosCiviles(): Promise<EstadoCivil[]> {
  try {
    const res = await fetch(`${API_BASE}/civil-status`)
    if (!res.ok) throw new Error("No se pudieron obtener los estados civiles")
    const json = await res.json()
    
    if (!Array.isArray(json)) {
      console.error("Respuesta completa:", json)
      throw new Error("La respuesta no contiene un array válido")
    }
    
    return json
  } catch (error) {
    console.error("Error detallado en fetchEstadosCiviles:", error)
    throw error
  }
}

export async function fetchLenguasNatales(): Promise<LenguaNatal[]> {
  try {
    const res = await fetch(`${API_BASE}/native-languages`)
    if (!res.ok) throw new Error("No se pudieron obtener las lenguas natales")
    const json = await res.json()
    
    if (!Array.isArray(json)) {
      console.error("Respuesta completa:", json)
      throw new Error("La respuesta no es un array válido")
    }
    
    return json
  } catch (error) {
    console.error("Error detallado en fetchLenguasNatales:", error)
    throw error
  }
} 