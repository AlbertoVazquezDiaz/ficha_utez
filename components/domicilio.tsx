"use client"

import { useEffect, useState } from "react"
import { fetchEstadosMexico, fetchMunicipiosPorEstado, Estado, Municipio } from "@/lib/api-estados"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface DomicilioProps {
  data: any
  onChange: (data: any) => void
}

export default function DomicilioComponent({ data, onChange }: DomicilioProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [estados, setEstados] = useState<Estado[]>([])
  const [municipios, setMunicipios] = useState<Municipio[]>([])
  const [loadingEstados, setLoadingEstados] = useState(false)
  const [loadingMunicipios, setLoadingMunicipios] = useState(false)
  const [errorEstados, setErrorEstados] = useState<string | null>(null)
  const [errorMunicipios, setErrorMunicipios] = useState<string | null>(null)

  useEffect(() => {
    setLoadingEstados(true)
    fetchEstadosMexico()
      .then(setEstados)
      .catch((err) => setErrorEstados(err.message))
      .finally(() => setLoadingEstados(false))
  }, [])

  useEffect(() => {
    if (!data.estado) {
      setMunicipios([])
      return
    }
    setLoadingMunicipios(true)
    const estadoObj = estados.find(e => e.name === data.estado)
    if (!estadoObj) {
      setMunicipios([])
      setLoadingMunicipios(false)
      return
    }
    fetchMunicipiosPorEstado(estadoObj.id)
      .then(setMunicipios)
      .catch((err) => setErrorMunicipios(err.message))
      .finally(() => setLoadingMunicipios(false))
  }, [data.estado, estados])

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }

    switch (name) {
      case "codigoPostal":
        if (!/^\d{5}$/.test(value)) {
          newErrors[name] = "Debe tener exactamente 5 dígitos"
        } else {
          delete newErrors[name]
        }
        break
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          newErrors[name] = "Formato de email inválido"
        } else {
          delete newErrors[name]
        }
        break
      default:
        if (!value.trim()) {
          newErrors[name] = "Este campo es obligatorio"
        } else {
          delete newErrors[name]
        }
        break
    }

    setErrors(newErrors)
    onChange({ ...data, [name]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#70785b]">
          <span>🏠</span>
          Domicilio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dirección */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="calle">Calle *</Label>
            <Input
              id="calle"
              value={data.calle || ""}
              onChange={(e) => validateField("calle", e.target.value)}
              className={cn(
                "transition-colors",
                (!data.calle || errors.calle)
                  ? "border-[#c0392b] focus:border-[#c0392b]"
                  : data.calle.length > 0
                    ? "border-green-500"
                    : ""
              )}
              placeholder="Nombre de la calle"
            />
            {errors.calle && <p className="text-xs text-[#c0392b]">{errors.calle}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="numeroExterior">Número Exterior *</Label>
            <Input
              id="numeroExterior"
              value={data.numeroExterior || ""}
              onChange={(e) => validateField("numeroExterior", e.target.value)}
              className={cn(
                "transition-colors",
                (!data.numeroExterior || errors.numeroExterior)
                  ? "border-[#c0392b] focus:border-[#c0392b]"
                  : data.numeroExterior.length > 0
                    ? "border-green-500"
                    : ""
              )}
              placeholder="Núm. exterior"
            />
            {errors.numeroExterior && <p className="text-xs text-[#c0392b]">{errors.numeroExterior}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="numeroInterior">Número Interior</Label>
            <Input
              id="numeroInterior"
              value={data.numeroInterior || ""}
              onChange={(e) => onChange({ ...data, numeroInterior: e.target.value })}
              placeholder="Núm. interior (opcional)"
            />
          </div>
        </div>

        {/* Colonia y Localidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="colonia">Colonia *</Label>
            <Input
              id="colonia"
              value={data.colonia || ""}
              onChange={(e) => validateField("colonia", e.target.value)}
              className={cn(
                "transition-colors",
                (!data.colonia || errors.colonia)
                  ? "border-[#c0392b] focus:border-[#c0392b]"
                  : data.colonia.length > 0
                    ? "border-green-500"
                    : ""
              )}
              placeholder="Nombre de la colonia"
            />
            {errors.colonia && <p className="text-xs text-[#c0392b]">{errors.colonia}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="localidad">Localidad</Label>
            <Input
              id="localidad"
              value={data.localidad || ""}
              onChange={(e) => onChange({ ...data, localidad: e.target.value })}
              placeholder="Localidad (opcional)"
            />
          </div>
        </div>

        {/* Estado y Municipio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Estado *</Label>
            <Select
              value={data.estado || ""}
              onValueChange={(value) => onChange({ ...data, estado: value, municipio: "" })}
            >
              <SelectTrigger className={cn(
                "transition-colors",
                (!data.estado)
                  ? "border-[#c0392b] focus:border-[#c0392b]"
                  : "border-green-500"
              )}>
                <SelectValue placeholder={loadingEstados ? "Cargando..." : "Selecciona el estado"} />
              </SelectTrigger>
              <SelectContent>
                {loadingEstados ? (
                  <SelectItem value="placeholder" disabled>Cargando...</SelectItem>
                ) : errorEstados ? (
                  <SelectItem value="error" disabled>Error al cargar</SelectItem>
                ) : (
                  estados.map((estado) => (
                    <SelectItem key={estado.id} value={estado.name}>
                      {estado.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Municipio *</Label>
            <Select
              value={data.municipio || ""}
              onValueChange={(value) => onChange({ ...data, municipio: value })}
              disabled={!data.estado || loadingMunicipios}
            >
              <SelectTrigger className={cn(
                "transition-colors",
                (!data.municipio)
                  ? "border-[#c0392b] focus:border-[#c0392b]"
                  : "border-green-500"
              )}>
                <SelectValue placeholder={loadingMunicipios ? "Cargando..." : "Selecciona el municipio"} />
              </SelectTrigger>
              <SelectContent>
                {loadingMunicipios ? (
                  <SelectItem value="placeholder" disabled>Cargando...</SelectItem>
                ) : errorMunicipios ? (
                  <SelectItem value="error" disabled>Error al cargar</SelectItem>
                ) : (
                  municipios.map((municipio) => (
                    <SelectItem key={municipio.id} value={municipio.name}>
                      {municipio.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Código Postal y Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="codigoPostal">Código Postal *</Label>
            <Input
              id="codigoPostal"
              value={data.codigoPostal || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 5)
                validateField("codigoPostal", value)
              }}
              className={cn(
                "transition-colors",
                (!data.codigoPostal || errors.codigoPostal)
                  ? "border-[#c0392b] focus:border-[#c0392b]"
                  : data.codigoPostal.length === 5
                    ? "border-green-500"
                    : ""
              )}
              placeholder="12345"
              maxLength={5}
            />
            {errors.codigoPostal && <p className="text-xs text-[#c0392b]">{errors.codigoPostal}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico *</Label>
            <Input
              id="email"
              type="email"
              value={data.email || ""}
              onChange={(e) => validateField("email", e.target.value)}
              className={cn(
                "transition-colors",
                (!data.email || errors.email)
                  ? "border-[#c0392b] focus:border-[#c0392b]"
                  : data.email.includes("@") && data.email.length > 4
                    ? "border-green-500"
                    : ""
              )}
              placeholder="tu@email.com"
            />
            {errors.email && <p className="text-xs text-[#c0392b]">{errors.email}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
