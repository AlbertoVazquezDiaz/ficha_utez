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
  options: string[]
  selected: string[]
  onSelectionChange: (selected: string[]) => void
  placeholder: string
  searchPlaceholder: string
}

function MultiSelect({ options, selected, onSelectionChange, placeholder, searchPlaceholder }: MultiSelectProps) {
  const [open, setOpen] = useState(false)

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
    setOpen(true) // Keep the popover open after selection
  }

  const removeItem = (item: string) => {
    onSelectionChange(selected.filter((s) => s !== item))
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-[40px] p-2"
          >
            <div className="flex flex-wrap gap-1">
              {selected.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                selected.map((item) => (
                  <Badge
                    key={item}
                    className="bg-[#70785b] text-white hover:bg-[#70785b]/90"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeItem(item)
                    }}
                  >
                    {item}
                    <X className="ml-1 h-3 w-3 cursor-pointer" />
                  </Badge>
                ))
              )}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>No se encontraron opciones.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <div 
                    key={option}
                    onClick={() => handleSelect(option)}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <Check className={cn("mr-2 h-4 w-4", selected.includes(option) ? "opacity-100" : "opacity-0")} />
                    {option}
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
}

function DisabilityMultiSelect({
  selected,
  onSelectionChange,
  placeholder,
  searchPlaceholder,
}: DisabilityMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const { disabilities, loading, error, refetch, isUsingFallback } = useDisabilities()

  const handleSelect = (disabilityName: string) => {
    if (disabilityName === "Ninguna") {
      onSelectionChange(["Ninguna"])
    } else {
      const newSelected = selected.includes("Ninguna") ? [] : [...selected]
      if (newSelected.includes(disabilityName)) {
        onSelectionChange(newSelected.filter((item) => item !== disabilityName))
      } else {
        onSelectionChange([...newSelected, disabilityName])
      }
    }
    setOpen(true) // Keep the popover open after selection
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

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
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
                selected.map((item) => (
                  <Badge
                    key={item}
                    className="bg-[#70785b] text-white hover:bg-[#70785b]/90"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeItem(item)
                    }}
                  >
                    {item}
                    <X className="ml-1 h-3 w-3 cursor-pointer" />
                  </Badge>
                ))
              )}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{loading ? "Cargando..." : "No se encontraron opciones."}</CommandEmpty>
              <CommandGroup>
                {disabilities.map((disability) => (
                  <div 
                    key={disability.id}
                    onClick={() => handleSelect(disability.nombre)}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", selected.includes(disability.nombre) ? "opacity-100" : "opacity-0")}
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

export default function ComplementariosComponent({ data, onChange }: ComplementariosProps) {
  const [lenguasIndigenasAPI, setLenguasIndigenasAPI] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        
        // Validar que la respuesta sea un array
        if (!Array.isArray(data)) {
          throw new Error("La respuesta de la API no es un array válido")
        }

        // Validar y transformar cada elemento del array
        const languages = data.map((item, index) => {
          if (!item || typeof item !== "object" || !item.name) {
            throw new Error(`Elemento inválido en el índice ${index}: falta la propiedad 'name'`)
          }
          return item.name
        })

        setLenguasIndigenasAPI(['Ninguna', ...languages, 'Otro o varias'])
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
          <Label>¿Tienes alguna discapacidad?</Label>
          <DisabilityMultiSelect
            selected={data.discapacidades || []}
            onSelectionChange={handleDiscapacidadesChange}
            placeholder="Selecciona las opciones que apliquen"
            searchPlaceholder="Buscar discapacidad..."
          />

          {data.discapacidades?.includes("Otro") && (
            <div className="space-y-2">
              <Label htmlFor="discapacidadOtra">Especifica la discapacidad *</Label>
              <Input
                id="discapacidadOtra"
                value={data.discapacidadOtra || ""}
                onChange={(e) => onChange({ ...data, discapacidadOtra: e.target.value })}
                placeholder="Describe la discapacidad"
                className={cn("transition-colors", data.discapacidadOtra ? "border-green-500" : "border-[#c0392b]")}
              />
            </div>
          )}
        </div>

        {/* Lenguas indígenas de los padres */}
        <div className="space-y-3">
          <Label>¿Qué lenguas indígenas hablan tus padres?</Label>
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
            />
          )}

          {data.lenguasIndigenasPadres?.includes("Otro o varias") && (
            <div className="space-y-2">
              <Label htmlFor="lenguasIndigenasPadresOtra">Especifica las lenguas *</Label>
              <Input
                id="lenguasIndigenasPadresOtra"
                value={data.lenguasIndigenasPadresOtra || ""}
                onChange={(e) => onChange({ ...data, lenguasIndigenasPadresOtra: e.target.value })}
                placeholder="Especifica las lenguas indígenas"
                className={cn(
                  "transition-colors",
                  data.lenguasIndigenasPadresOtra ? "border-green-500" : "border-[#c0392b]",
                )}
              />
            </div>
          )}
        </div>

        {/* Lenguas indígenas personales */}
        <div className="space-y-3">
          <Label>¿Hablas alguna lengua indígena?</Label>
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
            />
          )}

          {data.lenguasIndigenasPersonales?.includes("Otro o varias") && (
            <div className="space-y-2">
              <Label htmlFor="lenguasIndigenasPersonalesOtra">Especifica las lenguas *</Label>
              <Input
                id="lenguasIndigenasPersonalesOtra"
                value={data.lenguasIndigenasPersonalesOtra || ""}
                onChange={(e) => onChange({ ...data, lenguasIndigenasPersonalesOtra: e.target.value })}
                placeholder="Especifica las lenguas indígenas que hablas"
                className={cn(
                  "transition-colors",
                  data.lenguasIndigenasPersonalesOtra ? "border-green-500" : "border-[#c0392b]",
                )}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
