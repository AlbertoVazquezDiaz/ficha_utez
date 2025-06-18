"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface AntecedentesEscolaresProps {
  data: any
  onChange: (data: any) => void
}

const tiposPrepa = [
  "Bachillerato General",
  "Bachillerato Tecnológico",
  "Preparatoria Abierta",
  "CONALEP",
  "CECYTE",
  "CBTIS",
  "CBTA",
  "CETis",
  "Preparatoria Particular",
  "Telebachillerato",
  "Otra",
]

const preparatorias: Record<string, string[]> = {
  "Bachillerato General": [
    "Preparatoria Federal Lázaro Cárdenas",
    "Preparatoria Oficial No. 1",
    "Preparatoria Oficial No. 2",
    "Preparatoria Oficial No. 3",
  ],
  "Bachillerato Tecnológico": ["CBTis No. 1", "CBTis No. 2", "CBTa No. 1", "CETis No. 1"],
  CONALEP: ["CONALEP Cuernavaca", "CONALEP Cuautla", "CONALEP Jojutla"],
  CECYTE: ["CECYTE Emiliano Zapata", "CECYTE Temixco", "CECYTE Yautepec"],
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

export default function AntecedentesEscolaresComponent({ data, onChange }: AntecedentesEscolaresProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [openTipoPrepa, setOpenTipoPrepa] = useState(false)
  const [openNombrePrepa, setOpenNombrePrepa] = useState(false)

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }

    switch (name) {
      case "claveCCT":
      case "claveCCTConfirmacion":
        if (!/^[A-Z0-9]{10}$/.test(value.toUpperCase()) && value !== "") {
          newErrors[name] = "Debe tener exactamente 10 caracteres alfanuméricos"
        } else {
          delete newErrors[name]
        }

        // Validar que coincidan las claves
        if (name === "claveCCTConfirmacion" && value.toUpperCase() !== data.claveCCT?.toUpperCase()) {
          newErrors[name] = "Las claves CCT no coinciden"
        } else if (
          name === "claveCCT" &&
          data.claveCCTConfirmacion &&
          value.toUpperCase() !== data.claveCCTConfirmacion?.toUpperCase()
        ) {
          newErrors["claveCCTConfirmacion"] = "Las claves CCT no coinciden"
        }

        onChange({ ...data, [name]: value.toUpperCase() })
        setErrors(newErrors)
        return
      case "promedio":
        const promedioNum = Number.parseFloat(value)
        if (isNaN(promedioNum) || promedioNum < 6.0 || promedioNum > 10.0) {
          newErrors[name] = "El promedio debe estar entre 6.0 y 10.0"
        } else {
          delete newErrors[name]
        }
        break
    }

    setErrors(newErrors)
    onChange({ ...data, [name]: value })
  }

  // Limpiar nombre de prepa cuando cambia el tipo
  useEffect(() => {
    if (data.tipoPrepa && data.tipoPrepa !== "Otra") {
      onChange({ ...data, nombrePrepa: "", tipoPrepaOtra: "" })
    }
  }, [data])

  const availablePreparatorias = data.tipoPrepa && preparatorias[data.tipoPrepa] ? preparatorias[data.tipoPrepa] : []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#70785b]">
          <span>📚</span>
          Antecedentes Escolares
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tipo de preparatoria */}
        <div className="space-y-3">
          <Label>Tipo de Preparatoria *</Label>
          <Popover open={openTipoPrepa} onOpenChange={setOpenTipoPrepa}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openTipoPrepa}
                className={cn("w-full justify-between", data.tipoPrepa ? "border-green-500" : "")}
              >
                {data.tipoPrepa || "Selecciona el tipo de preparatoria"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar tipo de preparatoria..." />
                <CommandList>
                  <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                  <CommandGroup>
                    {tiposPrepa.map((tipo) => (
                      <CommandItem
                        key={tipo}
                        onSelect={() => {
                          onChange({ ...data, tipoPrepa: tipo })
                          setOpenTipoPrepa(false)
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", data.tipoPrepa === tipo ? "opacity-100" : "opacity-0")} />
                        {tipo}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {data.tipoPrepa === "Otra" && (
            <div className="space-y-2">
              <Label htmlFor="tipoPrepaOtra">Especifica el tipo de preparatoria *</Label>
              <Input
                id="tipoPrepaOtra"
                value={data.tipoPrepaOtra || ""}
                onChange={(e) => onChange({ ...data, tipoPrepaOtra: e.target.value })}
                className={cn("transition-colors", data.tipoPrepaOtra ? "border-green-500" : "border-[#c0392b]")}
                placeholder="Especifica el tipo de preparatoria"
              />
            </div>
          )}
        </div>

        {/* Nombre de la preparatoria */}
        <div className="space-y-2">
          <Label>Nombre de la Preparatoria *</Label>
          {availablePreparatorias.length > 0 ? (
            <Popover open={openNombrePrepa} onOpenChange={setOpenNombrePrepa}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openNombrePrepa}
                  className={cn("w-full justify-between", data.nombrePrepa ? "border-green-500" : "")}
                  disabled={!data.tipoPrepa || data.tipoPrepa === "Otra"}
                >
                  {data.nombrePrepa || "Selecciona la preparatoria"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar preparatoria..." />
                  <CommandList>
                    <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                    <CommandGroup>
                      {availablePreparatorias.map((prepa) => (
                        <CommandItem
                          key={prepa}
                          onSelect={() => {
                            onChange({ ...data, nombrePrepa: prepa })
                            setOpenNombrePrepa(false)
                          }}
                        >
                          <Check
                            className={cn("mr-2 h-4 w-4", data.nombrePrepa === prepa ? "opacity-100" : "opacity-0")}
                          />
                          {prepa}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          ) : (
            <Input
              value={data.nombrePrepa || ""}
              onChange={(e) => onChange({ ...data, nombrePrepa: e.target.value })}
              className={cn("transition-colors", data.nombrePrepa ? "border-green-500" : "")}
              placeholder="Nombre completo de la preparatoria"
              disabled={!data.tipoPrepa}
            />
          )}
        </div>

        {/* Clave CCT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="claveCCT">Clave CCT *</Label>
            <Input
              id="claveCCT"
              value={data.claveCCT || ""}
              onChange={(e) => validateField("claveCCT", e.target.value)}
              className={cn(
                "transition-colors uppercase",
                errors.claveCCT
                  ? "border-[#c0392b] focus:border-[#c0392b]"
                  : data.claveCCT && data.claveCCT.length === 10
                    ? "border-green-500"
                    : "",
              )}
              placeholder="Ej: 17EBH0001A"
              maxLength={10}
            />
            {errors.claveCCT && <p className="text-xs text-[#c0392b]">{errors.claveCCT}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="claveCCTConfirmacion">Confirmar Clave CCT *</Label>
            <Input
              id="claveCCTConfirmacion"
              value={data.claveCCTConfirmacion || ""}
              onChange={(e) => validateField("claveCCTConfirmacion", e.target.value)}
              className={cn(
                "transition-colors uppercase",
                errors.claveCCTConfirmacion
                  ? "border-[#c0392b] focus:border-[#c0392b]"
                  : data.claveCCTConfirmacion && data.claveCCT === data.claveCCTConfirmacion
                    ? "border-green-500"
                    : "",
              )}
              placeholder="Confirma la clave CCT"
              maxLength={10}
            />
            {errors.claveCCTConfirmacion && <p className="text-xs text-[#c0392b]">{errors.claveCCTConfirmacion}</p>}
          </div>
        </div>

        {/* Estado y Municipio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Estado donde cursaste la preparatoria *</Label>
            <Select
              value={data.estado || ""}
              onValueChange={(value) =>
                onChange({ ...data, estado: value, municipio: "", estadoOtro: "", municipioOtro: "" })
              }
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

            {data.estado === "otro" && (
              <div className="space-y-2">
                <Label htmlFor="estadoOtro">Especifica el estado *</Label>
                <Input
                  id="estadoOtro"
                  value={data.estadoOtro || ""}
                  onChange={(e) => onChange({ ...data, estadoOtro: e.target.value })}
                  className={cn("transition-colors", data.estadoOtro ? "border-green-500" : "border-[#c0392b]")}
                  placeholder="Nombre del estado"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Municipio *</Label>
            <Select
              value={data.municipio || ""}
              onValueChange={(value) => onChange({ ...data, municipio: value, municipioOtro: "" })}
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

            {(data.municipio === "otro" || (data.estado && data.estado !== "Morelos" && data.estado !== "otro")) && (
              <div className="space-y-2">
                <Label htmlFor="municipioOtro">Especifica el municipio *</Label>
                <Input
                  id="municipioOtro"
                  value={data.municipioOtro || ""}
                  onChange={(e) => onChange({ ...data, municipioOtro: e.target.value })}
                  className={cn("transition-colors", data.municipioOtro ? "border-green-500" : "border-[#c0392b]")}
                  placeholder="Nombre del municipio"
                />
              </div>
            )}
          </div>
        </div>

        {/* Promedio */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="promedio">Promedio General *</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-[#888888]" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Ingresa tu promedio general de preparatoria.
                    <br />
                    Debe estar entre 6.0 y 10.0
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="promedio"
            type="number"
            min="6.0"
            max="10.0"
            step="0.1"
            value={data.promedio || ""}
            onChange={(e) => validateField("promedio", e.target.value)}
            className={cn(
              "transition-colors",
              errors.promedio
                ? "border-[#c0392b] focus:border-[#c0392b]"
                : data.promedio && Number.parseFloat(data.promedio) >= 6.0 && Number.parseFloat(data.promedio) <= 10.0
                  ? "border-green-500"
                  : "",
            )}
            placeholder="Ej: 8.5"
          />
          {errors.promedio && <p className="text-xs text-[#c0392b]">{errors.promedio}</p>}
        </div>

        {/* Beca */}
        <div className="space-y-3">
          <Label>¿Tienes alguna beca? *</Label>
          <RadioGroup
            value={data.tieneBeca || ""}
            onValueChange={(value) =>
              onChange({ ...data, tieneBeca: value, nombreBeca: value === "no" ? "" : data.nombreBeca })
            }
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="si" id="beca-si" />
              <Label htmlFor="beca-si">Sí</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="beca-no" />
              <Label htmlFor="beca-no">No</Label>
            </div>
          </RadioGroup>

          {data.tieneBeca === "si" && (
            <div className="space-y-2">
              <Label htmlFor="nombreBeca">Nombre de la beca *</Label>
              <Input
                id="nombreBeca"
                value={data.nombreBeca || ""}
                onChange={(e) => onChange({ ...data, nombreBeca: e.target.value })}
                className={cn("transition-colors", data.nombreBeca ? "border-green-500" : "border-[#c0392b]")}
                placeholder="Nombre de la beca que tienes"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
