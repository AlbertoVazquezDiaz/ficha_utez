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
  const res = await fetch("http://192.168.0.103:8080/api/fichas-utez/states")
  if (!res.ok) throw new Error("No se pudieron obtener los estados")
  const data = await res.json()
  if (!Array.isArray(data.data)) throw new Error("Formato inesperado de respuesta")
  return data.data.map((estado: any) => ({ id: estado.id, name: estado.name }))
}

export async function fetchMunicipiosPorEstado(stateId: number): Promise<Municipio[]> {
  const res = await fetch(`http://192.168.0.103:8080/api/fichas-utez/municipalities/state/${stateId}`)
  if (!res.ok) throw new Error("No se pudieron obtener los municipios")
  const data = await res.json()
console.log(data);

  if (!Array.isArray(data.data)) throw new Error("Formato inesperado de respuesta de municipios")
  return data.data.map((municipio: any) => ({ id: municipio.id, name: municipio.name }))
}

export async function fetchTiposPrepa(): Promise<TipoPrepa[]> {
  const res = await fetch("http://192.168.0.103:8080/api/fichas-utez/high-school-types")
  if (!res.ok) throw new Error("No se pudieron obtener los tipos de preparatoria")
  const data = await res.json()
  if (!Array.isArray(data.data)) throw new Error("Formato inesperado de respuesta de tipos de prepa")
  return data.data.map((tipo: any) => ({ id: tipo.id, name: tipo.name, abrevation: tipo.abrevation }))
}
