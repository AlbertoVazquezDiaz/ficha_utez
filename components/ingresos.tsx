"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface IngresosProps {
  data: any
  onChange: (data: any) => void
}

export default function IngresosComponent({ data, onChange }: IngresosProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }

    switch (name) {
      case "ingresoFamiliar":
      case "ingresoMensual":
        if (!/^\d{1,5}$/.test(value) && value !== "") {
          newErrors[name] = "Máximo 5 cifras, solo números"
        } else {
          delete newErrors[name]
        }
        break
      case "lada":
        if (!/^\d{3}$/.test(value) && value !== "") {
          newErrors[name] = "Debe tener exactamente 3 dígitos"
        } else {
          delete newErrors[name]
        }
        break
      case "telefono":
        if (!/^\d{7}$/.test(value) && value !== "") {
          newErrors[name] = "Debe tener exactamente 7 dígitos"
        } else {
          delete newErrors[name]
        }
        break
      case "nombreEmpresa":
        if (value.length < 5 || value.length > 50) {
          newErrors[name] = "Entre 5 y 50 caracteres"
        } else {
          delete newErrors[name]
        }
        break
      case "puesto":
        if (value.length > 50) {
          newErrors[name] = "Máximo 50 caracteres"
        } else {
          delete newErrors[name]
        }
        break
    }

    setErrors(newErrors)
    onChange({ ...data, [name]: value })
  }

  const handleNumericInput = (name: string, value: string, maxLength: number) => {
    const numericValue = value.replace(/\D/g, "").slice(0, maxLength)
    validateField(name, numericValue)
  }

  // --- Form State ---
  const [formState, setFormState] = useState<Record<string, { touched: boolean; valid: boolean; error: boolean }>>({})

  // Helper: Check if a value is "empty" (for required fields)
  const isEmpty = (value: any) =>
    value === undefined || value === null || (typeof value === "string" && value.trim() === "")

  // Helper: Validation logic per field
  const getValidation = (field: string, value: any) => {
    switch (field) {
      case "ingresoFamiliar":
      case "ingresoMensual":
        if (isEmpty(value)) return { valid: false, error: true }
        if (!/^\d{1,5}$/.test(value)) return { valid: false, error: true }
        return { valid: true, error: false }
      case "lada":
        if (isEmpty(value)) return { valid: false, error: true }
        if (!/^\d{3}$/.test(value)) return { valid: false, error: true }
        return { valid: true, error: false }
      case "telefono":
        if (isEmpty(value)) return { valid: false, error: true }
        if (!/^\d{7}$/.test(value)) return { valid: false, error: true }
        return { valid: true, error: false }
      case "nombreEmpresa":
        if (isEmpty(value)) return { valid: false, error: true }
        if (typeof value !== "string" || value.length < 5 || value.length > 50) return { valid: false, error: true }
        return { valid: true, error: false }
      case "puesto":
        if (isEmpty(value)) return { valid: false, error: true }
        if (typeof value !== "string" || value.length > 50) return { valid: false, error: true }
        return { valid: true, error: false }
      case "horario":
        if (isEmpty(value)) return { valid: false, error: true }
        return { valid: true, error: false }
      case "trabajas":
        if (isEmpty(value)) return { valid: false, error: true }
        return { valid: true, error: false }
      default:
        return { valid: true, error: false }
    }
  }

  // Update field state (called onChange/onBlur)
  const updateFieldState = (
    field: string,
    value: any,
    data: any,
    touched = true
  ) => {
    const { valid, error } = getValidation(field, value)
    setFormState((prev) => ({
      ...prev,
      [field]: { touched, valid, error }
    }))
    // Optionally, update errors for legacy code
    validateField(field, value)
  }

  // Mark all required fields as touched (for submit)
  const touchAllRequiredFields = () => {
    const requiredFields = [
      "ingresoFamiliar",
      "trabajas",
      ...(data.trabajas === "si"
        ? [
            "lada",
            "telefono",
            "ingresoMensual",
            "nombreEmpresa",
            "puesto",
            "horario"
          ]
        : [])
    ]
    setFormState((prev) => {
      const next = { ...prev }
      for (const field of requiredFields) {
        const { valid, error } = getValidation(field, data[field])
        next[field] = { touched: true, valid, error }
      }
      return next
    })
  }

  // --- Handlers ---
  const handleInputChange = (field: string, value: string, maxLength?: number) => {
    let newValue = value
    if (maxLength) newValue = value.replace(/\D/g, "").slice(0, maxLength)
    onChange({ ...data, [field]: newValue })
    updateFieldState(field, newValue, { ...data, [field]: newValue })
  }

  const handleBlur = (field: string) => {
    updateFieldState(field, data[field], data, true)
  }

  // --- UI ---
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#70785b]">
          <span>💰</span>
          Información de Ingresos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ingreso Familiar */}
        <div className="space-y-2">
          <Label htmlFor="ingresoFamiliar">
            Ingreso Familiar Mensual <span className="text-red-600">*</span>
          </Label>
          <Input
            id="ingresoFamiliar"
            value={data.ingresoFamiliar || ""}
            onChange={(e) => handleInputChange("ingresoFamiliar", e.target.value, 5)}
            onBlur={() => handleBlur("ingresoFamiliar")}
            className={cn(
              "transition-colors",
              formState.ingresoFamiliar?.touched
                ? formState.ingresoFamiliar.error
                  ? "border-[#c0392b] focus:border-[#c0392b]"
                  : formState.ingresoFamiliar.valid
                  ? "border-green-500"
                  : ""
                : ""
            )}
            placeholder="Ingreso en pesos mexicanos"
            maxLength={5}
          />
          {formState.ingresoFamiliar?.touched && isEmpty(data.ingresoFamiliar) && (
            <p className="text-xs text-red-600">Campo obligatorio</p>
          )}
          {errors.ingresoFamiliar && <p className="text-xs text-[#c0392b]">{errors.ingresoFamiliar}</p>}
        </div>

        {/* ¿Trabajas? */}
        <div className="space-y-3">
          <Label>
            ¿Trabajas actualmente? <span className="text-red-600">*</span>
          </Label>
          <RadioGroup
            value={data.trabajas || ""}
            onValueChange={(value) => {
              onChange({ ...data, trabajas: value })
              updateFieldState("trabajas", value, { ...data, trabajas: value })
            }}
            onBlur={() => handleBlur("trabajas")}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="si" id="trabajas-si" />
              <Label htmlFor="trabajas-si">Sí</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="trabajas-no" />
              <Label htmlFor="trabajas-no">No</Label>
            </div>
          </RadioGroup>
          {formState.trabajas?.touched && isEmpty(data.trabajas) && (
            <p className="text-xs text-red-600">Campo obligatorio</p>
          )}
        </div>

        {/* Información laboral (solo si trabaja) */}
        {data.trabajas === "si" && (
          <div className="space-y-6 p-4 bg-[#cfd4c1]/20 rounded-lg">
            <h3 className="font-medium text-[#70785b]">Información Laboral</h3>

            {/* Tipo de trabajo */}
            <div className="space-y-3">
              <Label>Tipo de Trabajo</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={data.tipoTrabajo === "temporal" ? "default" : "outline"}
                  onClick={() => onChange({ ...data, tipoTrabajo: "temporal" })}
                  className={cn("flex-1", data.tipoTrabajo === "temporal" ? "bg-[#70785b] hover:bg-[#70785b]/90" : "")}
                >
                  Temporal
                </Button>
                <Button
                  type="button"
                  variant={data.tipoTrabajo === "permanente" ? "default" : "outline"}
                  onClick={() => onChange({ ...data, tipoTrabajo: "permanente" })}
                  className={cn(
                    "flex-1",
                    data.tipoTrabajo === "permanente" ? "bg-[#70785b] hover:bg-[#70785b]/90" : "",
                  )}
                >
                  Permanente
                </Button>
              </div>
            </div>

            {/* Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lada">
                  Lada <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="lada"
                  value={data.lada || ""}
                  onChange={(e) => handleInputChange("lada", e.target.value, 3)}
                  onBlur={() => handleBlur("lada")}
                  className={cn(
                    "transition-colors",
                    formState.lada?.touched
                      ? formState.lada.error
                        ? "border-[#c0392b] focus:border-[#c0392b]"
                        : formState.lada.valid
                        ? "border-green-500"
                        : ""
                      : ""
                  )}
                  placeholder="777"
                  maxLength={3}
                />
                {formState.lada?.touched && isEmpty(data.lada) && (
                  <p className="text-xs text-red-600">Campo obligatorio</p>
                )}
                {errors.lada && <p className="text-xs text-[#c0392b]">{errors.lada}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">
                  Teléfono <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="telefono"
                  value={data.telefono || ""}
                  onChange={(e) => handleInputChange("telefono", e.target.value, 7)}
                  onBlur={() => handleBlur("telefono")}
                  className={cn(
                    "transition-colors",
                    formState.telefono?.touched
                      ? formState.telefono.error
                        ? "border-[#c0392b] focus:border-[#c0392b]"
                        : formState.telefono.valid
                        ? "border-green-500"
                        : ""
                      : ""
                  )}
                  placeholder="1234567"
                  maxLength={7}
                />
                {formState.telefono?.touched && isEmpty(data.telefono) && (
                  <p className="text-xs text-red-600">Campo obligatorio</p>
                )}
                {errors.telefono && <p className="text-xs text-[#c0392b]">{errors.telefono}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingresoMensual">
                  Ingreso Mensual <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="ingresoMensual"
                  value={data.ingresoMensual || ""}
                  onChange={(e) => handleInputChange("ingresoMensual", e.target.value, 5)}
                  onBlur={() => handleBlur("ingresoMensual")}
                  className={cn(
                    "transition-colors",
                    formState.ingresoMensual?.touched
                      ? formState.ingresoMensual.error
                        ? "border-[#c0392b] focus:border-[#c0392b]"
                        : formState.ingresoMensual.valid
                        ? "border-green-500"
                        : ""
                      : ""
                  )}
                  placeholder="Pesos mexicanos"
                  maxLength={5}
                />
                {formState.ingresoMensual?.touched && isEmpty(data.ingresoMensual) && (
                  <p className="text-xs text-red-600">Campo obligatorio</p>
                )}
                {errors.ingresoMensual && <p className="text-xs text-[#c0392b]">{errors.ingresoMensual}</p>}
              </div>
            </div>

            {/* Empresa y puesto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombreEmpresa">
                  Nombre de la Empresa <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="nombreEmpresa"
                  value={data.nombreEmpresa || ""}
                  onChange={(e) => {
                    onChange({ ...data, nombreEmpresa: e.target.value })
                    updateFieldState("nombreEmpresa", e.target.value, { ...data, nombreEmpresa: e.target.value })
                  }}
                  onBlur={() => handleBlur("nombreEmpresa")}
                  className={cn(
                    "transition-colors",
                    formState.nombreEmpresa?.touched
                      ? formState.nombreEmpresa.error
                        ? "border-[#c0392b] focus:border-[#c0392b]"
                        : formState.nombreEmpresa.valid
                        ? "border-green-500"
                        : ""
                      : ""
                  )}
                  placeholder="Nombre de la empresa"
                  maxLength={50}
                />
                {formState.nombreEmpresa?.touched && isEmpty(data.nombreEmpresa) && (
                  <p className="text-xs text-red-600">Campo obligatorio</p>
                )}
                {errors.nombreEmpresa && <p className="text-xs text-[#c0392b]">{errors.nombreEmpresa}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="puesto">
                  Puesto <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="puesto"
                  value={data.puesto || ""}
                  onChange={(e) => {
                    onChange({ ...data, puesto: e.target.value })
                    updateFieldState("puesto", e.target.value, { ...data, puesto: e.target.value })
                  }}
                  onBlur={() => handleBlur("puesto")}
                  className={cn(
                    "transition-colors",
                    formState.puesto?.touched
                      ? formState.puesto.error
                        ? "border-[#c0392b] focus:border-[#c0392b]"
                        : formState.puesto.valid
                        ? "border-green-500"
                        : ""
                      : ""
                  )}
                  placeholder="Tu puesto de trabajo"
                  maxLength={50}
                />
                {formState.puesto?.touched && isEmpty(data.puesto) && (
                  <p className="text-xs text-red-600">Campo obligatorio</p>
                )}
                {errors.puesto && <p className="text-xs text-[#c0392b]">{errors.puesto}</p>}
              </div>
            </div>

            {/* Horario */}
            <div className="space-y-2">
              <Label htmlFor="horario">
                Horario de Trabajo <span className="text-red-600">*</span>
              </Label>
              <Input
                id="horario"
                value={data.horario || ""}
                onChange={(e) => {
                  onChange({ ...data, horario: e.target.value })
                  updateFieldState("horario", e.target.value, { ...data, horario: e.target.value })
                }}
                onBlur={() => handleBlur("horario")}
                className={cn(
                  "transition-colors",
                  formState.horario?.touched
                    ? formState.horario.error
                      ? "border-[#c0392b] focus:border-[#c0392b]"
                      : formState.horario.valid
                      ? "border-green-500"
                      : ""
                    : ""
                )}
                placeholder="Ej: 7:00 - 15:00"
              />
              {formState.horario?.touched && isEmpty(data.horario) && (
                <p className="text-xs text-red-600">Campo obligatorio</p>
              )}
              <p className="text-xs text-[#888888]">Formato sugerido: HH:MM - HH:MM</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
