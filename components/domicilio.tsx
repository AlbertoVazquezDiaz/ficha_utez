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
    const estadoObj = estados.find(e => e.id === data.estado)
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

  // Estado reactivo para el estado visual de cada campo
  const [formState, setFormState] = useState<Record<string, { touched: boolean; valid: boolean; error: boolean }>>({})

  // Inicializa formState para los campos relevantes
  useEffect(() => {
    const fields = [
      "calle",
      "numeroExterior",
      "colonia",
      "estado",
      "municipio",
      "codigoPostal",
      "email",
      // opcionales:
      "numeroInterior",
      "localidad",
    ]
    setFormState((prev) => {
      const next: typeof prev = { ...prev }
      fields.forEach((f) => {
        if (!next[f]) {
          next[f] = { touched: false, valid: false, error: false }
        }
      })
      return next
    })
  }, [])

  // Validación de
  // Handler para onBlur
  const handleBlur = (name: string, value: string) => {
    setFormState((prev) => {
      const { valid, error } = validateFieldState(name, value)
      return {
        ...prev,
        [name]: {
          touched: true,
          valid,
          error: !valid,
        },
      }
    })
  }

  // Helper para validar el estado de un campo
  const validateFieldState = (name: string, value: string): { valid: boolean; error: string | null } => {
    switch (name) {
      case "codigoPostal":
        if (!/^\d{5}$/.test(value)) {
          return { valid: false, error: "Debe tener exactamente 5 dígitos" }
        }
        return { valid: true, error: null }
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          return { valid: false, error: "Formato de email inválido" }
        }
        return { valid: true, error: null }
      case "numeroInterior":
      case "localidad":
        // Opcionales: si están vacíos, son válidos
        if (typeof value !== 'string' || !value.trim()) {
          return { valid: true, error: null }
        }
        return { valid: true, error: null }
      default:
        if (typeof value !== 'string' || !value.trim()) {
          return { valid: false, error: "Este campo es obligatorio" }
        }
        return { valid: true, error: null }
    }
  }

  // Handler para onChange
  const handleChange = (name: string, value: string) => {
    const { valid } = validateFieldState(name, value)
    setFormState((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        valid,
        error: prev[name]?.touched ? !valid : false,
      },
    }))
    onChange({ ...data, [name]: value })
  }

  // Handler para onFocus (opcional, por si quieres marcar touched en focus)
  const handleFocus = (name: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched: true,
      },
    }))
  }

  // Validar todos los campos obligatorios al intentar enviar
  const validateAllOnSubmit = () => {
    const requiredFields = [
      "calle",
      "numeroExterior",
      "colonia",
      "estado",
      "municipio",
      "codigoPostal",
      "email",
    ]
    setFormState((prev) => {
      const next = { ...prev }
      requiredFields.forEach((name) => {
        const value = data[name] || ""
        const { valid } = validateFieldState(name, value)
        next[name] = {
          touched: true,
          valid,
          error: !valid,
        }
      })
      // Opcionales: si tienen valor, validar
      ;["numeroInterior", "localidad"].forEach((name) => {
        const value = data[name] || ""
        if (value.trim() !== "") {
          next[name] = {
            touched: true,
            valid: true,
            error: false,
          }
        }
      })
      return next
    })
  }

  // Helper para clases visuales
  const getInputClass = (name: string) => {
    const state = formState[name]
    if (!state || !state.touched) return "transition-colors"
    if (state.error) return "transition-colors border-[#c0392b] focus:border-[#c0392b]"
    if (state.valid) return "transition-colors border-green-500"
    return "transition-colors"
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
            <Label htmlFor="calle">
              Calle <span className="text-red-600">*</span>
            </Label>
            <Input
              id="calle"
              value={data.calle || ""}
              onChange={(e) => handleChange("calle", e.target.value)}
              onBlur={(e) => handleBlur("calle", e.target.value)}
              onFocus={() => handleFocus("calle")}
              className={getInputClass("calle")}
              placeholder="Nombre de la calle"
            />
            {formState.calle?.error && <p className="text-xs text-[#c0392b]">Este campo es obligatorio</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="numeroExterior">
              Número Exterior <span className="text-red-600">*</span>
            </Label>
            <Input
              id="numeroExterior"
              value={data.numeroExterior || ""}
              onChange={(e) => handleChange("numeroExterior", e.target.value)}
              onBlur={(e) => handleBlur("numeroExterior", e.target.value)}
              onFocus={() => handleFocus("numeroExterior")}
              className={getInputClass("numeroExterior")}
              placeholder="Núm. exterior"
            />
            {formState.numeroExterior?.error && <p className="text-xs text-[#c0392b]">Este campo es obligatorio</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="numeroInterior">Número Interior</Label>
            <Input
              id="numeroInterior"
              value={data.numeroInterior || ""}
              onChange={(e) => handleChange("numeroInterior", e.target.value)}
              onBlur={(e) => handleBlur("numeroInterior", e.target.value)}
              onFocus={() => handleFocus("numeroInterior")}
              className={getInputClass("numeroInterior")}
              placeholder="Núm. interior (opcional)"
            />
          </div>
        </div>

        {/* Colonia y Localidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="colonia">
              Colonia <span className="text-red-600">*</span>
            </Label>
            <Input
              id="colonia"
              value={data.colonia || ""}
              onChange={(e) => handleChange("colonia", e.target.value)}
              onBlur={(e) => handleBlur("colonia", e.target.value)}
              onFocus={() => handleFocus("colonia")}
              className={getInputClass("colonia")}
              placeholder="Nombre de la colonia"
            />
            {formState.colonia?.error && <p className="text-xs text-[#c0392b]">Este campo es obligatorio</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="localidad">Localidad</Label>
            <Input
              id="localidad"
              value={data.localidad || ""}
              onChange={(e) => handleChange("localidad", e.target.value)}
              onBlur={(e) => handleBlur("localidad", e.target.value)}
              onFocus={() => handleFocus("localidad")}
              className={getInputClass("localidad")}
              placeholder="Localidad (opcional)"
            />
          </div>
        </div>

        {/* Estado y Municipio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>
              Estado <span className="text-red-600">*</span>
            </Label>
            <Select
              value={data.estado || ""}
              onValueChange={(value) => {
                handleChange("estado", value)
                onChange({ ...data, estado: value, municipio: "" })
              }}
              onBlur={() => handleBlur("estado", data.estado || "")}
              onFocus={() => handleFocus("estado")}
            >
              <SelectTrigger className={getInputClass("estado")}>
                <SelectValue placeholder={loadingEstados ? "Cargando..." : "Selecciona el estado"} />
              </SelectTrigger>
              <SelectContent>
                {loadingEstados ? (
                  <SelectItem value="placeholder" disabled>Cargando...</SelectItem>
                ) : errorEstados ? (
                  <SelectItem value="error" disabled>Error al cargar</SelectItem>
                ) : (
                  estados.map((estado) => (
                    <SelectItem key={estado.id} value={estado.id}>
                      {estado.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {formState.estado?.error && <p className="text-xs text-[#c0392b]">Este campo es obligatorio</p>}
          </div>

          <div className="space-y-2">
            <Label>
              Municipio <span className="text-red-600">*</span>
            </Label>
            <Select
              value={data.municipio || ""}
              onValueChange={(value) => handleChange("municipio", value)}
              onBlur={() => handleBlur("municipio", data.municipio || "")}
              onFocus={() => handleFocus("municipio")}
              disabled={!data.estado || loadingMunicipios}
            >
              <SelectTrigger className={getInputClass("municipio")}>
                <SelectValue placeholder={loadingMunicipios ? "Cargando..." : "Selecciona el municipio"} />
              </SelectTrigger>
              <SelectContent>
                {loadingMunicipios ? (
                  <SelectItem value="placeholder" disabled>Cargando...</SelectItem>
                ) : errorMunicipios ? (
                  <SelectItem value="error" disabled>Error al cargar</SelectItem>
                ) : (
                  municipios.map((municipio) => (
                    <SelectItem key={municipio.id} value={municipio.id}>
                      {municipio.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {formState.municipio?.error && <p className="text-xs text-[#c0392b]">Este campo es obligatorio</p>}
          </div>
        </div>

        {/* Código Postal y Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="codigoPostal">
              Código Postal <span className="text-red-600">*</span>
            </Label>
            <Input
              id="codigoPostal"
              value={data.codigoPostal || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 5)
                handleChange("codigoPostal", value)
              }}
              onBlur={(e) => handleBlur("codigoPostal", e.target.value)}
              onFocus={() => handleFocus("codigoPostal")}
              className={getInputClass("codigoPostal")}
              placeholder="12345"
              maxLength={5}
            />
            {formState.codigoPostal?.error && <p className="text-xs text-[#c0392b]">Debe tener exactamente 5 dígitos</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Correo Electrónico <span className="text-red-600">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={data.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={(e) => handleBlur("email", e.target.value)}
              onFocus={() => handleFocus("email")}
              className={getInputClass("email")}
              placeholder="tu@email.com"
            />
            {formState.email?.error && <p className="text-xs text-[#c0392b]">Formato de email inválido</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
