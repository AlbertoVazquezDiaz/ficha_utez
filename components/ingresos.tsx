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
          <Label htmlFor="ingresoFamiliar">Ingreso Familiar Mensual *</Label>
          <Input
            id="ingresoFamiliar"
            value={data.ingresoFamiliar || ""}
            onChange={(e) => handleNumericInput("ingresoFamiliar", e.target.value, 5)}
            className={cn(
              "transition-colors",
              errors.ingresoFamiliar
                ? "border-[#c0392b] focus:border-[#c0392b]"
                : data.ingresoFamiliar
                  ? "border-green-500"
                  : "",
            )}
            placeholder="Ingreso en pesos mexicanos"
            maxLength={5}
          />
          {errors.ingresoFamiliar && <p className="text-xs text-[#c0392b]">{errors.ingresoFamiliar}</p>}
        </div>

        {/* ¿Trabajas? */}
        <div className="space-y-3">
          <Label>¿Trabajas actualmente? *</Label>
          <RadioGroup
            value={data.trabajas || ""}
            onValueChange={(value) => onChange({ ...data, trabajas: value })}
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
                <Label htmlFor="lada">Lada *</Label>
                <Input
                  id="lada"
                  value={data.lada || ""}
                  onChange={(e) => handleNumericInput("lada", e.target.value, 3)}
                  className={cn(
                    "transition-colors",
                    errors.lada
                      ? "border-[#c0392b] focus:border-[#c0392b]"
                      : data.lada && data.lada.length === 3
                        ? "border-green-500"
                        : "",
                  )}
                  placeholder="777"
                  maxLength={3}
                />
                {errors.lada && <p className="text-xs text-[#c0392b]">{errors.lada}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  value={data.telefono || ""}
                  onChange={(e) => handleNumericInput("telefono", e.target.value, 7)}
                  className={cn(
                    "transition-colors",
                    errors.telefono
                      ? "border-[#c0392b] focus:border-[#c0392b]"
                      : data.telefono && data.telefono.length === 7
                        ? "border-green-500"
                        : "",
                  )}
                  placeholder="1234567"
                  maxLength={7}
                />
                {errors.telefono && <p className="text-xs text-[#c0392b]">{errors.telefono}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingresoMensual">Ingreso Mensual *</Label>
                <Input
                  id="ingresoMensual"
                  value={data.ingresoMensual || ""}
                  onChange={(e) => handleNumericInput("ingresoMensual", e.target.value, 5)}
                  className={cn(
                    "transition-colors",
                    errors.ingresoMensual
                      ? "border-[#c0392b] focus:border-[#c0392b]"
                      : data.ingresoMensual
                        ? "border-green-500"
                        : "",
                  )}
                  placeholder="Pesos mexicanos"
                  maxLength={5}
                />
                {errors.ingresoMensual && <p className="text-xs text-[#c0392b]">{errors.ingresoMensual}</p>}
              </div>
            </div>

            {/* Empresa y puesto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombreEmpresa">Nombre de la Empresa *</Label>
                <Input
                  id="nombreEmpresa"
                  value={data.nombreEmpresa || ""}
                  onChange={(e) => validateField("nombreEmpresa", e.target.value)}
                  className={cn(
                    "transition-colors",
                    errors.nombreEmpresa
                      ? "border-[#c0392b] focus:border-[#c0392b]"
                      : data.nombreEmpresa && data.nombreEmpresa.length >= 5
                        ? "border-green-500"
                        : "",
                  )}
                  placeholder="Nombre de la empresa"
                  maxLength={50}
                />
                {errors.nombreEmpresa && <p className="text-xs text-[#c0392b]">{errors.nombreEmpresa}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="puesto">Puesto *</Label>
                <Input
                  id="puesto"
                  value={data.puesto || ""}
                  onChange={(e) => validateField("puesto", e.target.value)}
                  className={cn(
                    "transition-colors",
                    errors.puesto ? "border-[#c0392b] focus:border-[#c0392b]" : data.puesto ? "border-green-500" : "",
                  )}
                  placeholder="Tu puesto de trabajo"
                  maxLength={50}
                />
                {errors.puesto && <p className="text-xs text-[#c0392b]">{errors.puesto}</p>}
              </div>
            </div>

            {/* Horario */}
            <div className="space-y-2">
              <Label htmlFor="horario">Horario de Trabajo *</Label>
              <Input
                id="horario"
                value={data.horario || ""}
                onChange={(e) => onChange({ ...data, horario: e.target.value })}
                className={cn("transition-colors", data.horario ? "border-green-500" : "")}
                placeholder="Ej: 7:00 - 15:00"
              />
              <p className="text-xs text-[#888888]">Formato sugerido: HH:MM - HH:MM</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
