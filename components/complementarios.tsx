"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronDown, X, RefreshCw, Wifi, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDisabilities } from "../hooks/use-disabilities"

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  console.error("❌ Error: NEXT_PUBLIC_API_BASE_URL environment variable is not defined")
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface ComplementariosProps {
  data: any
  onChange: (data: any) => void
}

interface MultiSelectProps {
  options: { id: string, name: string }[]
  selected: string[]
  onSelectionChange: (selected: string[]) => void
  placeholder: string
  searchPlaceholder: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

function MultiSelect({ options, selected, onSelectionChange, placeholder, searchPlaceholder, isOpen, onOpenChange }: MultiSelectProps) {
  const handleSelect = (option: string) => {
    if (option === "Ninguna") {
      onSelectionChange(["Ninguna"])
    } else {
      const newSelected = selected.includes("Ninguna") ? [] : [...selected]
      if (newSelected.includes(option)) {
        onSelectionChange(newSelected.filter((item) => item !== option))
      } else {
        onSelectionChange([...newSelected, option])
      }
    }
  }

  const removeItem = (item: string) => {
    onSelectionChange(selected.filter((s) => s !== item))
  }

  return (
    <div className="space-y-2">
      <Popover open={isOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-between h-auto min-h-[40px] p-2"
          >
            <div className="flex flex-wrap gap-1">
              {selected.map((id) => {
                const option = options.find((opt) => opt.id === id)
                return (
                  <Badge
                    key={id}
                    className="bg-[#70785b] text-white hover:bg-[#70785b]/90"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeItem(id)
                    }}
                  >
                    {option?.name || id}
                    <X className="ml-1 h-3 w-3 cursor-pointer" />
                  </Badge>
                )
              })
              }
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              {/* <CommandEmpty>No se encontraron opciones.</CommandEmpty> */}
              <CommandGroup>
                {options.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <Check className={cn("mr-2 h-4 w-4", selected.includes(option) ? "opacity-100" : "opacity-0")} />
                    {option.name}
                  </div>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

interface DisabilityMultiSelectProps {
  selected: string[]
  onSelectionChange: (selected: string[]) => void
  placeholder: string
  searchPlaceholder: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

function DisabilityMultiSelect({
  selected,
  onSelectionChange,
  placeholder,
  searchPlaceholder,
  isOpen,
  onOpenChange
}: DisabilityMultiSelectProps) {
  const { disabilities, loading, error, refetch, isUsingFallback } = useDisabilities()

  const handleSelect = (disabilityId: string) => {
  if (disabilityId === "ninguna") {
    onSelectionChange(["ninguna"])
  } else {
    const newSelected = selected.includes("ninguna") ? [] : [...selected]
    if (newSelected.includes(disabilityId)) {
      onSelectionChange(newSelected.filter((item) => item !== disabilityId))
    } else {
      onSelectionChange([...newSelected, disabilityId])
    }
  }
}


  const removeItem = (item: string) => {
    onSelectionChange(selected.filter((s) => s !== item))
  }

  return (
    <div className="space-y-2">
      {/* Status indicator */}
      {(error || isUsingFallback) && (
      <div
        className={cn(
        "flex items-center gap-2 p-2 rounded-md text-xs",
        error && !isUsingFallback
          ? "bg-red-50 text-red-700 border border-red-200"
          : "bg-yellow-50 text-yellow-700 border border-yellow-200",
        )}
      >
        {error && !isUsingFallback ? (
        <>
          <WifiOff className="h-3 w-3" />
          <span>Error de conexión - usando datos locales</span>
        </>
        ) : (
        <>
          <Wifi className="h-3 w-3" />
          <span>Usando datos locales (servidor no disponible)</span>
        </>
        )}
        <Button variant="ghost" size="sm" onClick={refetch} className="ml-auto h-6 px-2">
        <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
      )}

      {/* Error details (expandable) */}
      {error && !isUsingFallback && (
      <details className="text-xs">
        <summary className="cursor-pointer text-[#c0392b] hover:underline">Ver detalles del error</summary>
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-[#c0392b] whitespace-pre-line">
        {error}
        </div>
      </details>
      )}

      <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className="w-full justify-between h-auto min-h-[40px] p-2"
        disabled={loading}
        >
        <div className="flex flex-wrap gap-1">
          {loading ? (
          <div className="flex items-center gap-2">
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span className="text-muted-foreground">Cargando discapacidades...</span>
          </div>
          ) : selected.length === 0 ? (
          <span className="text-muted-foreground">{placeholder}</span>
          ) : (
          selected.map((id) => {
            const disability = disabilities.find((d) => d.id === id)
            return (
            <Badge
              key={id}
              className="bg-[#70785b] text-white hover:bg-[#70785b]/90"
              onClick={(e) => {
              e.stopPropagation()
              removeItem(id)
              }}
            >
              {disability ? disability.nombre : id}
              <X className="ml-1 h-3 w-3 cursor-pointer" />
            </Badge>
            )
          })
          )}
        </div>
        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
        <CommandInput placeholder={searchPlaceholder} />
        <CommandList>
          {/* <CommandEmpty>{loading ? "Cargando..." : "No se encontraron opciones."}</CommandEmpty> */}
          <CommandGroup>
          {disabilities.map((disability) => (
            <div 
            key={disability.id}
            onClick={() => handleSelect(disability.id)}
            className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
            <Check
              className={cn("mr-2 h-4 w-4", selected.includes(disability.id) ? "opacity-100" : "opacity-0")}
            />
            {disability.nombre}
            </div>
          ))}
          </CommandGroup>
        </CommandList>
        </Command>
      </PopoverContent>
      </Popover>
    </div>
  )
}

export default function ComplementariosComponent({ data, onChange, showErrors = false }: ComplementariosProps & { showErrors?: boolean }) {
const [lenguasIndigenasAPI, setLenguasIndigenasAPI] = useState<{ id: string, name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openPopover, setOpenPopover] = useState<string | null>(null)

  // Validaciones locales para UX
  const isDiscapacidadObligatoria = showErrors && (!data.discapacidades || data.discapacidades.length === 0)
  const isDiscapacidadOtraObligatoria = showErrors && data.discapacidades?.includes("Otro") && !data.discapacidadOtra
  const isLenguasPadresObligatoria = showErrors && (!data.lenguasIndigenasPadres || data.lenguasIndigenasPadres.length === 0)
  const isLenguasPadresOtraObligatoria = showErrors && data.lenguasIndigenasPadres?.includes("Otro o varias") && !data.lenguasIndigenasPadresOtra
  const isLenguasPersonalesObligatoria = showErrors && (!data.lenguasIndigenasPersonales || data.lenguasIndigenasPersonales.length === 0)
  const isLenguasPersonalesOtraObligatoria = showErrors && data.lenguasIndigenasPersonales?.includes("Otro o varias") && !data.lenguasIndigenasPersonalesOtra

  useEffect(() => {
    const fetchLenguasIndigenas = async () => {
      try {
        if (!API_BASE_URL) {
          throw new Error("La URL base de la API no está configurada. Verifica la variable de entorno NEXT_PUBLIC_API_BASE_URL.")
        }

        const response = await fetch(`${API_BASE_URL}/api/indigenous-languages`)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (!Array.isArray(data)) {
          throw new Error("La respuesta de la API no es un array válido")
        }

      const languages = data.map((item, index) => {
      if (!item || typeof item !== "object" || !item.id || !item.name) {
         throw new Error(`Elemento inválido en el índice ${index}`)
      }
      return { id: item.id, name: item.name }
    })

    // Agrega "Ninguna" y "Otro o varias" como objetos
    setLenguasIndigenasAPI([
       { id: "ninguna", name: "Ninguna" },
      ...languages,
      { id: "otro", name: "Otro o varias" }
])
        setLoading(false)
      } catch (err) {
        console.error("❌ Error fetching indigenous languages:", err)
        setError(err instanceof Error ? err.message : 'Error al cargar las lenguas indígenas')
        setLoading(false)
      }
    }

    fetchLenguasIndigenas()
  }, [])

  const handleDiscapacidadesChange = (selected: string[]) => {
    onChange({
      ...data,
      discapacidades: selected,
      discapacidadOtra: selected.includes("Otro") ? data.discapacidadOtra : "",
    })
  }

  const handleLenguasPadresChange = (selected: string[]) => {
    onChange({
      ...data,
      lenguasIndigenasPadres: selected,
      lenguasIndigenasPadresOtra: selected.includes("Otro o varias") ? data.lenguasIndigenasPadresOtra : "",
    })
  }

  const handleLenguasPersonalesChange = (selected: string[]) => {
    onChange({
      ...data,
      lenguasIndigenasPersonales: selected,
      lenguasIndigenasPersonalesOtra: selected.includes("Otro o varias") ? data.lenguasIndigenasPersonalesOtra : "",
    })
  }

  // --- Form state management for visual validation ---
  type FieldState = {
    touched: boolean
    valid: boolean
    error: boolean
  }

  type FormState = {
    [field: string]: FieldState
  }

  // Estado inicial: todos los campos neutros (no tocados)
  const initialFormState: FormState = {
  discapacidadOtra: { touched: false, valid: false, error: false },
  lenguasIndigenasPadresOtra: { touched: false, valid: false, error: false },
  lenguasIndigenasPersonalesOtra: { touched: false, valid: false, error: false },
  discapacidades: { touched: false, valid: false, error: false },
  lenguasIndigenasPadres: { touched: false, valid: false, error: false },
  lenguasIndigenasPersonales: { touched: false, valid: false, error: false },
}


  const [formState, setFormState] = useState<FormState>(initialFormState)

  // Validadores por campo con logs para depuración
const validators: { [field: string]: (value: any, data: any) => boolean } = {
  discapacidadOtra: (value, data) => {
    const isRequired = data.discapacidades?.includes("Otro")
    const isValid = !isRequired || (typeof value === "string" && value.trim().length > 0)
    console.log(`[VALIDACIÓN] discapacidadOtra | Requerido: ${isRequired} | Valor: "${value}" | Válido: ${isValid}`)
    return isValid
  },

  lenguasIndigenasPadresOtra: (value, data) => {
    const isRequired = data.lenguasIndigenasPadres?.includes("otro")
    const isValid = !isRequired || (typeof value === "string" && value.trim().length > 0)
    console.log(`[VALIDACIÓN] lenguasIndigenasPadresOtra | Requerido: ${isRequired} | Valor: "${value}" | Válido: ${isValid}`)
    return isValid
  },

  lenguasIndigenasPersonalesOtra: (value, data) => {
    const isRequired = data.lenguasIndigenasPersonales?.includes("otro")
    const isValid = !isRequired || (typeof value === "string" && value.trim().length > 0)
    console.log(`[VALIDACIÓN] lenguasIndigenasPersonalesOtra | Requerido: ${isRequired} | Valor: "${value}" | Válido: ${isValid}`)
    return isValid
  },

  discapacidades: (value) => {
    const isValid = Array.isArray(value) && value.length > 0
    console.log(`[VALIDACIÓN] discapacidades | Seleccionadas: ${value?.length || 0} | Válido: ${isValid}`)
    return isValid
  },

  lenguasIndigenasPadres: (value) => {
    const isValid = Array.isArray(value) && value.length > 0
    console.log(`[VALIDACIÓN] lenguasIndigenasPadres | Seleccionadas: ${value?.length || 0} | Válido: ${isValid}`)
    return isValid
  },

  lenguasIndigenasPersonales: (value) => {
    const isValid = Array.isArray(value) && value.length > 0
    console.log(`[VALIDACIÓN] lenguasIndigenasPersonales | Seleccionadas: ${value?.length || 0} | Válido: ${isValid}`)
    return isValid
  }
}



  // Actualiza el estado visual de un campo
  function updateFieldState(
    field: string,
    value: any,
    data?: any,
    touched = true
  ) {
    const isValid = validators[field]
      ? validators[field](value, data)
      : true
    setFormState((prev) => ({
      ...prev,
      [field]: {
        touched,
        valid: isValid,
        error: touched && !isValid,
      },
    }))
  }

  // Marca todos los campos requeridos como tocados (para mostrar errores al intentar enviar)
  function touchAllRequiredFields(formValues: any) {
    const updated: FormState = { ...formState }
    Object.keys(validators).forEach((field) => {
      const value = formValues[field]
      const isValid = validators[field] ? validators[field](value, formValues) : true
      updated[field] = {
        touched: true,
        valid: isValid,
        error: !isValid,
      }
    })
    setFormState(updated)
  }

  // Example: call touchAllRequiredFields() on "Siguiente" button click

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#70785b]">
          <span>🧩</span>
          Información Complementaria
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Discapacidades - Ahora consume la API con fallback */}
        <div className="space-y-3">
          <Label>
            ¿Tienes alguna discapacidad? <span className="text-red-600">*</span>
          </Label>
          <DisabilityMultiSelect
            selected={data.discapacidades || []}
            onSelectionChange={handleDiscapacidadesChange}
            placeholder="Selecciona las opciones que apliquen"
            searchPlaceholder="Buscar discapacidad..."
            isOpen={openPopover === 'disabilities'}
            onOpenChange={(open) => setOpenPopover(open ? 'disabilities' : null)}
          />
          {isDiscapacidadObligatoria && (
            <p className="text-xs text-[#c0392b]">Selecciona al menos una discapacidad</p>
          )}

          {data.discapacidades?.includes("Otro") && (
            <div className="space-y-2">
              <Label htmlFor="discapacidadOtra">
                Especifica la discapacidad <span className="text-red-600">*</span>
              </Label>
              <Input
                id="discapacidadOtra"
                value={data.discapacidadOtra || ""}
                onChange={(e) => {
                  onChange({ ...data, discapacidadOtra: e.target.value })
                  updateFieldState("discapacidadOtra", e.target.value, { ...data, discapacidadOtra: e.target.value })
                }}
                onBlur={() =>
                  updateFieldState("discapacidadOtra", data.discapacidadOtra, data)
                }
                placeholder="Describe la discapacidad"
                className={cn(
                  "transition-colors",
                  formState.discapacidadOtra.touched
                    ? formState.discapacidadOtra.valid
                      ? "border-green-500"
                      : "border-[#c0392b]"
                    : ""
                )}
              />
              {formState.discapacidadOtra.touched && formState.discapacidadOtra.error && (
                <p className="text-xs text-[#c0392b]">Este campo es obligatorio</p>
              )}
            </div>
          )}
        </div>

        {/* Lenguas indígenas de los padres */}
        <div className="space-y-3">
          <Label>
            ¿Qué lenguas indígenas hablan tus padres? <span className="text-red-600">*</span>
          </Label>
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Cargando lenguas indígenas...</span>
              </div>
            ) : error ? (
              <div className="text-[#c0392b] text-sm">{error}</div>
            ) : (
              <MultiSelect
                options={lenguasIndigenasAPI}
                selected={data.lenguasIndigenasPadres || []}
                onSelectionChange={handleLenguasPadresChange}
                placeholder="Selecciona las lenguas que apliquen"
                searchPlaceholder="Buscar lengua indígena..."
                isOpen={openPopover === 'parentLanguages'}
                onOpenChange={(open) => setOpenPopover(open ? 'parentLanguages' : null)}
              />
            )}
          {isLenguasPadresObligatoria && (
            <p className="text-xs text-[#c0392b]">Selecciona al menos una lengua</p>
          )}

          {data.lenguasIndigenasPadres?.includes("otro") && (
            <div className="space-y-2">
              <Label htmlFor="lenguasIndigenasPadresOtra">
                Especifica las lenguas <span className="text-red-600">*</span>
              </Label>
              <Input
                id="lenguasIndigenasPadresOtra"
                value={data.lenguasIndigenasPadresOtra || ""}
                onChange={(e) => {
                  onChange({ ...data, lenguasIndigenasPadresOtra: e.target.value })
                  updateFieldState("lenguasIndigenasPadresOtra", e.target.value, { ...data, lenguasIndigenasPadresOtra: e.target.value })
                }}
                onBlur={() =>
                  updateFieldState("lenguasIndigenasPadresOtra", data.lenguasIndigenasPadresOtra, data)
                }
                placeholder="Especifica las lenguas indígenas"
                className={cn(
                  "transition-colors",
                  formState.lenguasIndigenasPadresOtra.touched
                    ? formState.lenguasIndigenasPadresOtra.valid
                      ? "border-green-500"
                      : "border-[#c0392b]"
                    : ""
                )}
              />
              {formState.lenguasIndigenasPadresOtra.touched && formState.lenguasIndigenasPadresOtra.error && (
                <p className="text-xs text-[#c0392b]">Este campo es obligatorio</p>
              )}
            </div>
          )}
        </div>

        {/* Lenguas indígenas personales */}
        <div className="space-y-3">
          <Label>
            ¿Hablas alguna lengua indígena? <span className="text-red-600">*</span>
          </Label>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Cargando lenguas indígenas...</span>
            </div>
          ) : error ? (
            <div className="text-[#c0392b] text-sm">{error}</div>
          ) : (
            <MultiSelect
              options={lenguasIndigenasAPI}
              selected={data.lenguasIndigenasPersonales || []}
              onSelectionChange={handleLenguasPersonalesChange}
              placeholder="Selecciona las lenguas que hablas"
              searchPlaceholder="Buscar lengua indígena..."
              isOpen={openPopover === 'personalLanguages'}
              onOpenChange={(open) => setOpenPopover(open ? 'personalLanguages' : null)}
            />
          )}
          {isLenguasPersonalesObligatoria && (
            <p className="text-xs text-[#c0392b]">Selecciona al menos una lengua</p>
          )}

          {data.lenguasIndigenasPersonales?.includes("otro") && (
            <div className="space-y-2">
              <Label htmlFor="lenguasIndigenasPersonalesOtra">
                Especifica las lenguas <span className="text-red-600">*</span>
              </Label>
              <Input
                id="lenguasIndigenasPersonalesOtra"
                value={data.lenguasIndigenasPersonalesOtra || ""}
                onChange={(e) => {
                  onChange({ ...data, lenguasIndigenasPersonalesOtra: e.target.value })
                  updateFieldState("lenguasIndigenasPersonalesOtra", e.target.value, { ...data, lenguasIndigenasPersonalesOtra: e.target.value })
                }}
                onBlur={() =>
                  updateFieldState("lenguasIndigenasPersonalesOtra", data.lenguasIndigenasPersonalesOtra, data)
                }
                placeholder="Especifica las lenguas indígenas que hablas"
                className={cn(
                  "transition-colors",
                  formState.lenguasIndigenasPersonalesOtra.touched
                    ? formState.lenguasIndigenasPersonalesOtra.valid
                      ? "border-green-500"
                      : "border-[#c0392b]"
                    : ""
                )}
              />
              {formState.lenguasIndigenasPersonalesOtra.touched && formState.lenguasIndigenasPersonalesOtra.error && (
                <p className="text-xs text-[#c0392b]">Este campo es obligatorio</p>
              )}
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  )
}
