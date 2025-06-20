export interface Estado {
  id: number;
  name: string;
}

export interface Municipio {
  id: number;
  name: string;
}

export interface TipoPrepa {
  id: number;
  name: string;
  abrevation: string | null;
}

export async function fetchEstadosMexico(): Promise<Estado[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const endpoint = "/states";
  const res = await fetch(`${baseUrl}${endpoint}`)
  if (!res.ok) throw new Error("No se pudieron obtener los estados")
  const data = await res.json()
  if (!Array.isArray(data.data)) throw new Error("Formato inesperado de respuesta")
  return data.data.map((estado: any) => ({ id: estado.id, name: estado.name }))
}

export async function fetchMunicipiosPorEstado(stateId: number): Promise<Municipio[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const endpoint = `/municipalities/state/${stateId}`;
  const res = await fetch(`${baseUrl}${endpoint}`)
  if (!res.ok) throw new Error("No se pudieron obtener los municipios")
  const data = await res.json()
  console.log(data);

  if (!Array.isArray(data.data)) throw new Error("Formato inesperado de respuesta de municipios")
  return data.data.map((municipio: any) => ({ id: municipio.id, name: municipio.name }))
}

export async function fetchTiposPrepa(): Promise<TipoPrepa[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const endpoint = "/high-school-types";
  const res = await fetch(`${baseUrl}${endpoint}`)
  if (!res.ok) throw new Error("No se pudieron obtener los tipos de preparatoria")
  const data = await res.json()
  if (!Array.isArray(data.data)) throw new Error("Formato inesperado de respuesta de tipos de prepa")
  return data.data.map((tipo: any) => ({ id: tipo.id, name: tipo.name, abrevation: tipo.abrevation }))
}
