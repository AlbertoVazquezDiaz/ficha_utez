"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface DomicilioProps {
  data: any
  onChange: (data: any) => void
}

const estadosMexico = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "México",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
]

const municipiosMorelos = [
  "Amacuzac",
  "Atlatlahucan",
  "Axochiapan",
  "Ayala",
  "Coatlán del Río",
  "Cuautla",
  "Cuernavaca",
  "Emiliano Zapata",
  "Huitzilac",
  "Jantetelco",
  "Jiutepec",
  "Jojutla",
  "Jonacatepec de Leandro Valle",
  "Mazatepec",
  "Miacatlán",
  "Ocuituco",
  "Puente de Ixtla",
  "Temixco",
  "Tepalcingo",
  "Tepoztlán",
  "Tetecala",
  "Tetela del Volcán",
  "Tlalnepantla",
  "Tlaltizapán de Zapata",
  "Tlaquiltenango",
  "Tlayacapan",
  "Totolapan",
  "Xochitepec",
  "Yautepec",
  "Yecapixtla",
  "Zacatepec",
  "Zacualpan de Amilpas",
]

export default function DomicilioComponent({ data, onChange }: DomicilioProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

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
                errors.calle ? "border-[#c0392b] focus:border-[#c0392b]" : data.calle ? "border-green-500" : "",
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
                errors.numeroExterior
                  ? "border-[#c0392b] focus:border-[#c0392b]"
                  : data.numeroExterior
                    ? "border-green-500"
                    : "",
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
                errors.colonia ? "border-[#c0392b] focus:border-[#c0392b]" : data.colonia ? "border-green-500" : "",
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
              <SelectTrigger className={cn("transition-colors", data.estado ? "border-green-500" : "")}>
                <SelectValue placeholder="Selecciona el estado" />
              </SelectTrigger>
              <SelectContent>
                {estadosMexico.map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Municipio *</Label>
            <Select
              value={data.municipio || ""}
              onValueChange={(value) => onChange({ ...data, municipio: value })}
              disabled={!data.estado}
            >
              <SelectTrigger className={cn("transition-colors", data.municipio ? "border-green-500" : "")}>
                <SelectValue placeholder="Selecciona el municipio" />
              </SelectTrigger>
              <SelectContent>
                {data.estado === "Morelos" ? (
                  municipiosMorelos.map((municipio) => (
                    <SelectItem key={municipio} value={municipio}>
                      {municipio}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="otro">Otro</SelectItem>
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
                errors.codigoPostal
                  ? "border-[#c0392b] focus:border-[#c0392b]"
                  : data.codigoPostal && data.codigoPostal.length === 5
                    ? "border-green-500"
                    : "",
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
                errors.email
                  ? "border-[#c0392b] focus:border-[#c0392b]"
                  : data.email && data.email.includes("@")
                    ? "border-green-500"
                    : "",
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
