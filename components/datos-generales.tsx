"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { useDisabilities } from "@/hooks/use-disabilities"
import { 
  fetchNacionalidades, 
  fetchEstadosPorPais, 
  fetchEstadosCiviles, 
  fetchLenguasNatales,
  type Nacionalidad,
  type EstadoCivil,
  type LenguaNatal
} from "@/lib/api-datos-generales"
import { type Estado, type Municipio, fetchMunicipiosPorEstado } from "@/lib/api-estados"

interface DatosGeneralesProps {
  data: any
  onChange: (data: any) => void
}


export default function DatosGeneralesComponent({ data, onChange }: DatosGeneralesProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Estados para datos dinámicos
  const [nacionalidades, setNacionalidades] = useState<Nacionalidad[]>([])
  const [estados, setEstados] = useState<Estado[]>([])
  const [municipios, setMunicipios] = useState<Municipio[]>([])
  const [estadosCiviles, setEstadosCiviles] = useState<EstadoCivil[]>([])
  const [lenguasNatales, setLenguasNatales] = useState<LenguaNatal[]>([])


  // Fetch inicial de catálogos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nacionalidadesData, estadosData, estadosCivilesData, lenguasNatalesData] = await Promise.all([
          fetchNacionalidades(),
          fetchEstadosPorPais(),
          fetchEstadosCiviles(),
          fetchLenguasNatales()
        ])

        setNacionalidades(nacionalidadesData)
        setEstados(estadosData)
        setEstadosCiviles(estadosCivilesData)
        setLenguasNatales(lenguasNatalesData)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Mantener los arrays vacíos en caso de error
        setNacionalidades([])
        setEstados([])
        setEstadosCiviles([])
        setLenguasNatales([])
      }
    }

    fetchData()
  }, [])

  // Fetch de municipios cuando cambia el estado
  useEffect(() => {
    const fetchMunicipios = async () => {
      if (data.estadoNacimiento) {
        const estadoObj = estados.find(e => e.name === data.estadoNacimiento)
        if (estadoObj) {
          try {
            const municipiosData = await fetchMunicipiosPorEstado(estadoObj.id)
            setMunicipios(municipiosData)
          } catch (error) {
            console.error("Error fetching municipios:", error)
            setMunicipios([])
          }
        } else {
          setMunicipios([])
        }
      } else {
        setMunicipios([])
      }
    }

    fetchMunicipios()
  }, [data.estadoNacimiento, estados])

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }

    switch (name) {
      case "nombre":
      case "primerApellido":
      case "segundoApellido":
        if (value.length < 3) {
          newErrors[name] = "Mínimo 3 caracteres"
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          newErrors[name] = "Solo letras, acentos y espacios"
        } else {
          delete newErrors[name]
        }
        break
      case "curp":
        const curpUpper = value.toUpperCase()
        if (curpUpper.length !== 18) {
          newErrors[name] = "Debe tener exactamente 18 caracteres"
        } else if (!/^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z][0-9]$/.test(curpUpper)) {
          newErrors[name] = "Formato de CURP inválido"
        } else {
          delete newErrors[name]
        }
        onChange({ ...data, [name]: curpUpper })
        return
      case "fechaNacimiento":
        const birthDate = new Date(value)
        const today = new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          const finalAge = age - 1
          if (finalAge < 15) {
            newErrors[name] = "Debe ser mayor de 15 años"
          } else {
            delete newErrors[name]
            onChange({ ...data, [name]: value, edad: finalAge })
            return
          }
        } else {
          if (age < 15) {
            newErrors[name] = "Debe ser mayor de 15 años"
          } else {
            delete newErrors[name]
            onChange({ ...data, [name]: value, edad: age })
            return
          }
        }
        break
      case "paisNacimiento":
      case "estadoNacimientoExtranjero":
      case "ciudadNacimiento":
        if (value && (value.length > 50 || /[0-9!@#$%^&*(),.?":{}|<>]/.test(value))) {
          newErrors[name] = "Máximo 50 caracteres, solo letras"
        } else {
          delete newErrors[name]
        }
        break
    }

    setErrors(newErrors)
    onChange({ ...data, [name]: value })
  }

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0
    const birth = new Date(birthDate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age
  }

  useEffect(() => {
    const age = calculateAge(data.fechaNacimiento)
    if (age !== data.edad) {
      onChange({ ...data, edad: age })
    }
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#70785b]">
          <span>👤</span>
          Datos Generales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nombres */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              value={data.nombre || ""}
              onChange={(e) => validateField("nombre", e.target.value)}
              className={cn(
                "transition-colors",
                errors.nombre
                  ? "border-[#c0392b] focus:border-[#c0392b]"
                  : data.nombre && data.nombre.length >= 3
                    ? "border-green-500"
                    : "",
              )}
              placeholder="Ingresa tu nombre"
            />
            {errors.nombre && <p className="text-xs text-[#c0392b]">{errors.nombre}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="primerApellido">Primer Apellido *</Label>
            <Input
              id="primerApellido"
              value={data.primerApellido || ""}
              onChange={(e) => validateField("primerApellido", e.target.value)}
              className={cn(
                "transition-colors",
                errors.primerApellido
                  ? "border-[#c0392b] focus:border-[#c0392b]"
                  : data.primerApellido && data.primerApellido.length >= 3
                    ? "border-green-500"
                    : "",
              )}
              placeholder="Primer apellido"
            />
            {errors.primerApellido && <p className="text-xs text-[#c0392b]">{errors.primerApellido}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="segundoApellido">Segundo Apellido</Label>
            <Input
              id="segundoApellido"
              value={data.segundoApellido || ""}
              onChange={(e) => validateField("segundoApellido", e.target.value)}
              className={cn(
                "transition-colors",
                errors.segundoApellido
                  ? "border-[#c0392b] focus:border-[#c0392b]"
                  : data.segundoApellido && data.segundoApellido.length >= 3
                    ? "border-green-500"
                    : "",
              )}
              placeholder="Segundo apellido"
            />
            {errors.segundoApellido && <p className="text-xs text-[#c0392b]">{errors.segundoApellido}</p>}
          </div>
        </div>

        {/* CURP y Fecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="curp">CURP *</Label>
            <Input
              id="curp"
              value={data.curp || ""}
              onChange={(e) => validateField("curp", e.target.value)}
              className={cn(
                "transition-colors uppercase",
                errors.curp
                  ? "border-[#c0392b] focus:border-[#c0392b]"
                  : data.curp && data.curp.length === 18
                    ? "border-green-500"
                    : "",
              )}
              placeholder="CURP (18 caracteres)"
              maxLength={18}
            />
            {errors.curp && <p className="text-xs text-[#c0392b]">{errors.curp}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
              <Input
                id="fechaNacimiento"
                type="date"
                value={data.fechaNacimiento || ""}
                onChange={(e) => validateField("fechaNacimiento", e.target.value)}
                className={cn(
                  "transition-colors",
                  errors.fechaNacimiento
                    ? "border-[#c0392b] focus:border-[#c0392b]"
                    : data.fechaNacimiento && calculateAge(data.fechaNacimiento) >= 15
                      ? "border-green-500"
                      : "",
                )}
              />
              {errors.fechaNacimiento && <p className="text-xs text-[#c0392b]">{errors.fechaNacimiento}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edad">Edad</Label>
              <Input
                id="edad"
                value={data.edad || 0}
                readOnly
                className="bg-gray-50 text-[#888888]"
                placeholder="Calculada automáticamente"
              />
            </div>
          </div>
        </div>

        {/* Sexo */}
        <div className="space-y-3">
          <Label>Sexo *</Label>
          <RadioGroup
            value={data.sexo || ""}
            onValueChange={(value) => onChange({ ...data, sexo: value })}
            className="flex flex-wrap gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="masculino" id="masculino" />
              <Label htmlFor="masculino">Masculino</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="femenino" id="femenino" />
              <Label htmlFor="femenino">Femenino</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="otro" id="otro" />
              <Label htmlFor="otro">Otro</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Nacionalidad */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nacionalidad *</Label>
            <Select
              value={data.nacionalidad || ""}
              onValueChange={(value) => onChange({ ...data, nacionalidad: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu nacionalidad" />
              </SelectTrigger>
              <SelectContent>
                {nacionalidades.length > 0 ? (
                  nacionalidades.map((n) => (
                    <SelectItem key={n.id} value={n.name}>{n.name}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-disponible" disabled>No hay nacionalidades</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {data.nacionalidad === "mexicana" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estado de Nacimiento *</Label>
                <Select
                  value={data.estadoNacimiento || ""}
                  onValueChange={(value) => onChange({ ...data, estadoNacimiento: value, municipioNacimiento: "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {estados.length > 0 ? (
                      estados.map((estado) => (
                        <SelectItem key={estado.id} value={estado.name}>{estado.name}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-disponible" disabled>No hay estados</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Municipio de Nacimiento *</Label>
                <Select
                  value={data.municipioNacimiento || ""}
                  onValueChange={(value) => onChange({ ...data, municipioNacimiento: value })}
                  disabled={!data.estadoNacimiento}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el municipio" />
                  </SelectTrigger>
                  <SelectContent>
                    {municipios.length > 0 ? (
                      municipios.map((municipio) => (
                        <SelectItem key={municipio.id} value={municipio.name}>{municipio.name}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-disponible" disabled>No hay municipios</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {data.nacionalidad === "Extranjero(a)" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paisNacimiento">País de Nacimiento *</Label>
                <Input
                  id="paisNacimiento"
                  value={data.paisNacimiento || ""}
                  onChange={(e) => validateField("paisNacimiento", e.target.value)}
                  className={cn(
                    "transition-colors",
                    errors.paisNacimiento ? "border-[#c0392b] focus:border-[#c0392b]" : "",
                  )}
                  placeholder="País de nacimiento"
                  maxLength={50}
                />
                {errors.paisNacimiento && <p className="text-xs text-[#c0392b]">{errors.paisNacimiento}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estadoNacimientoExtranjero">Estado/Provincia *</Label>
                <Input
                  id="estadoNacimientoExtranjero"
                  value={data.estadoNacimientoExtranjero || ""}
                  onChange={(e) => validateField("estadoNacimientoExtranjero", e.target.value)}
                  className={cn(
                    "transition-colors",
                    errors.estadoNacimientoExtranjero ? "border-[#c0392b] focus:border-[#c0392b]" : "",
                  )}
                  placeholder="Estado o provincia"
                  maxLength={50}
                />
                {errors.estadoNacimientoExtranjero && (
                  <p className="text-xs text-[#c0392b]">{errors.estadoNacimientoExtranjero}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ciudadNacimiento">Ciudad *</Label>
                <Input
                  id="ciudadNacimiento"
                  value={data.ciudadNacimiento || ""}
                  onChange={(e) => validateField("ciudadNacimiento", e.target.value)}
                  className={cn(
                    "transition-colors",
                    errors.ciudadNacimiento ? "border-[#c0392b] focus:border-[#c0392b]" : "",
                  )}
                  placeholder="Ciudad de nacimiento"
                  maxLength={50}
                />
                {errors.ciudadNacimiento && <p className="text-xs text-[#c0392b]">{errors.ciudadNacimiento}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Estado Civil y Lengua */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Estado Civil *</Label>
            <Select value={data.estadoCivil || ""} onValueChange={(value) => onChange({ ...data, estadoCivil: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu estado civil" />
              </SelectTrigger>
              <SelectContent>
                {estadosCiviles.length > 0 ? (
                  estadosCiviles.map((ec) => (
                    <SelectItem key={ec.id} value={ec.name}>{ec.name}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-disponible" disabled>No hay estados civiles</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Lengua Natal *</Label>
            <Select value={data.lenguaNatal || ""} onValueChange={(value) => onChange({ ...data, lenguaNatal: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu lengua natal" />
              </SelectTrigger>
              <SelectContent>
                {lenguasNatales.length > 0 ? (
                  lenguasNatales.map((ln) => (
                    <SelectItem key={ln.id} value={ln.name}>{ln.name}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-disponible" disabled>No hay lenguas</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Hijos */}
        <div className="space-y-3">
          <Label>¿Tienes hijos? *</Label>
          <RadioGroup
            value={data.tieneHijos || ""}
            onValueChange={(value) => onChange({ ...data, tieneHijos: value })}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="si" id="hijos-si" />
              <Label htmlFor="hijos-si">Sí</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="hijos-no" />
              <Label htmlFor="hijos-no">No</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}
