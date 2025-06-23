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
import { log } from "node:util"

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
      const estadoObj = estados.find(e => e.id === data.estadoNacimiento)  
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
        if (value.length < 3) {
          newErrors[name] = "Mínimo 3 caracteres"
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          newErrors[name] = "Solo letras, acentos y espacios"
        } else {
          delete newErrors[name]
        }
        break
      case "segundoApellido":
        if (value) {
          if (value.length < 3) {
            newErrors[name] = "Mínimo 3 caracteres"
          } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
            newErrors[name] = "Solo letras, acentos y espacios"
          } else {
            delete newErrors[name]
          }
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

  // --- Form State Management ---
  type FieldState = {
    touched: boolean
    valid: boolean
    error: boolean
    errorMessage?: string
  }
  type FormState = Record<string, FieldState>

  const initialFormState: FormState = {
    nombre: { touched: false, valid: false, error: false },
    primerApellido: { touched: false, valid: false, error: false },
    segundoApellido: { touched: false, valid: false, error: false }, // opcional
    curp: { touched: false, valid: false, error: false },
    fechaNacimiento: { touched: false, valid: false, error: false },
    sexo: { touched: false, valid: false, error: false },
    nacionalidad: { touched: false, valid: false, error: false },
    estadoNacimiento: { touched: false, valid: false, error: false },
    municipioNacimiento: { touched: false, valid: false, error: false },
    ciudadNacimiento: { touched: false, valid: false, error: false },
    paisNacimiento: { touched: false, valid: false, error: false },
    estadoNacimientoExtranjero: { touched: false, valid: false, error: false },
    estadoCivil: { touched: false, valid: false, error: false },
    lenguaNatal: { touched: false, valid: false, error: false },
    tieneHijos: { touched: false, valid: false, error: false },
  }

  const [formState, setFormState] = useState<FormState>(initialFormState)

  // Helper: campos obligatorios según nacionalidad
  const requiredFields = () => {
    if (data.nacionalidad === "1") {
      // mexicano
      return [
        "nombre",
        "primerApellido",
        "curp",
        "fechaNacimiento",
        "sexo",
        "nacionalidad",
        "estadoNacimiento",
        "municipioNacimiento",
        "ciudadNacimiento",
        "estadoCivil",
        "lenguaNatal",
        "tieneHijos",
      ]
    } else if (data.nacionalidad === "2") {
      // extranjero
      return [
        "nombre",
        "primerApellido",
        "curp",
        "fechaNacimiento",
        "sexo",
        "nacionalidad",
        "paisNacimiento",
        "estadoNacimientoExtranjero",
        "ciudadNacimiento",
        "estadoCivil",
        "lenguaNatal",
        "tieneHijos",
      ]
    }
    // Por default, los campos comunes
    return [
      "nombre",
      "primerApellido",
      "curp",
      "fechaNacimiento",
      "sexo",
      "nacionalidad",
      "estadoCivil",
      "lenguaNatal",
      "tieneHijos",
    ]
  }

  // Validación de un campo individual
  function validateFieldState(name: string, value: string): FieldState {
    let valid = false
    let error = false
    let errorMessage = ""

    switch (name) {
      case "nombre":
      case "primerApellido":
        if (!value) {
          error = true
          errorMessage = "Campo obligatorio"
        } else if (value.length < 3) {
          error = true
          errorMessage = "Mínimo 3 caracteres"
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          error = true
          errorMessage = "Solo letras, acentos y espacios"
        } else {
          valid = true
        }
        break
      case "segundoApellido":
        if (!value) {
          // opcional: neutro si vacío
          valid = false
          error = false
        } else if (value.length < 3) {
          error = true
          errorMessage = "Mínimo 3 caracteres"
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          error = true
          errorMessage = "Solo letras, acentos y espacios"
        } else {
          valid = true
        }
        break
      case "curp":
        if (!value) {
          error = true
          errorMessage = "Campo obligatorio"
        } else if (value.length !== 18) {
          error = true
          errorMessage = "Debe tener exactamente 18 caracteres"
        } else if (!/^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z][0-9]$/.test(value.toUpperCase())) {
          error = true
          errorMessage = "Formato de CURP inválido"
        } else {
          valid = true
        }
        break
      case "fechaNacimiento":
        if (!value) {
          error = true
          errorMessage = "Campo obligatorio"
        } else {
          const birthDate = new Date(value)
          const today = new Date()
          let age = today.getFullYear() - birthDate.getFullYear()
          const monthDiff = today.getMonth() - birthDate.getMonth()
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
          }
          if (age < 15) {
            error = true
            errorMessage = "Debe ser mayor de 15 años"
          } else {
            valid = true
          }
        }
        break
      case "sexo":
      case "nacionalidad":
      case "estadoNacimiento":
      case "municipioNacimiento":
      case "estadoCivil":
      case "lenguaNatal":
      case "tieneHijos":
        if (!value) {
          error = true
          errorMessage = "Campo obligatorio"
        } else {
          valid = true
        }
        break
      case "ciudadNacimiento":
      case "paisNacimiento":
      case "estadoNacimientoExtranjero":
        if (!value) {
          // obligatorio u opcional depende del contexto
          if (requiredFields().includes(name)) {
            error = true
            errorMessage = "Campo obligatorio"
          } else {
            valid = false
            error = false
          }
        } else if (value.length > 50 || /[0-9!@#$%^&*(),.?":{}|<>]/.test(value)) {
          error = true
          errorMessage = "Máximo 50 caracteres, solo letras"
        } else {
          valid = true
        }
        break
      default:
        valid = !!value
    }
    return { touched: true, valid, error, errorMessage }
  }

  // Handler para onBlur (marca touched y valida)
  function handleBlur(field: string) {
    setFormState((prev) => {
      const value = data[field] || ""
      const validated = validateFieldState(field, value)
      return {
        ...prev,
        [field]: { ...validated, touched: true },
      }
    })
  }

  // Handler para onChange (valida si ya fue tocado)
  function handleChange(field: string, value: string) {
    // Actualiza el dato
    onChange({ ...data, [field]: value })
    setFormState((prev) => {
      if (!prev[field]?.touched) {
        // No marcar nada si no ha sido tocado
        return prev
      }
      const validated = validateFieldState(field, value)
      return {
        ...prev,
        [field]: { ...validated, touched: true },
      }
    })
  }

  // Handler para onFocus (marca touched si no lo estaba)
  function handleFocus(field: string) {
    setFormState((prev) => {
      if (prev[field]?.touched) return prev
      return {
        ...prev,
        [field]: { ...prev[field], touched: true },
      }
    })
  }

  // Validar todos los campos requeridos al intentar enviar
  function validateAllOnSubmit() {
    const req = requiredFields()
    setFormState((prev) => {
      const next: FormState = { ...prev }
      req.forEach((field) => {
        const value = data[field] || ""
        const validated = validateFieldState(field, value)
        next[field] = { ...validated, touched: true }
      })
      return next
    })
  }

  // Helper para clases visuales
  function fieldClass(field: string) {
    const state = formState[field]
    if (!state?.touched) return "transition-colors"
    if (state.error) return "border-[#c0392b] focus:border-[#c0392b]"
    if (state.valid) return "border-green-500"
    return "transition-colors"
  }

  // Helper para mostrar mensaje de error
  function fieldError(field: string) {
    const state = formState[field]
    if (state?.touched && state?.error && state?.errorMessage) {
      return <p className="text-xs text-[#c0392b]">{state.errorMessage}</p>
    }
    return null
  }

  // --- Renderizado del formulario ---
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
            <Label htmlFor="nombre">
              Nombre <span className="text-red-600">*</span>
            </Label>
            <Input
              id="nombre"
              value={data.nombre || ""}
              onChange={(e) => handleChange("nombre", e.target.value)}
              onFocus={() => handleFocus("nombre")}
              onBlur={() => handleBlur("nombre")}
              className={fieldClass("nombre")}
              placeholder="Ingresa tu nombre"
            />
            {fieldError("nombre")}
          </div>

          <div className="space-y-2">
            <Label htmlFor="primerApellido">
              Primer Apellido <span className="text-red-600">*</span>
            </Label>
            <Input
              id="primerApellido"
              value={data.primerApellido || ""}
              onChange={(e) => handleChange("primerApellido", e.target.value)}
              onFocus={() => handleFocus("primerApellido")}
              onBlur={() => handleBlur("primerApellido")}
              className={fieldClass("primerApellido")}
              placeholder="Primer apellido"
            />
            {fieldError("primerApellido")}
          </div>

          <div className="space-y-2">
            <Label htmlFor="segundoApellido">Segundo Apellido</Label>
            <Input
              id="segundoApellido"
              value={data.segundoApellido || ""}
              onChange={(e) => handleChange("segundoApellido", e.target.value)}
              onFocus={() => handleFocus("segundoApellido")}
              onBlur={() => handleBlur("segundoApellido")}
              className={fieldClass("segundoApellido")}
              placeholder="Segundo apellido"
            />
            {fieldError("segundoApellido")}
          </div>
        </div>

        {/* CURP y Fecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="curp">
              CURP <span className="text-red-600">*</span>
            </Label>
            <Input
              id="curp"
              value={data.curp || ""}
              onChange={(e) => handleChange("curp", e.target.value.toUpperCase())}
              onFocus={() => handleFocus("curp")}
              onBlur={() => handleBlur("curp")}
              className={fieldClass("curp") + " uppercase"}
              placeholder="CURP (18 caracteres)"
              maxLength={18}
            />
            {fieldError("curp")}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaNacimiento">
                Fecha de Nacimiento <span className="text-red-600">*</span>
              </Label>
              <Input
                id="fechaNacimiento"
                type="date"
                value={data.fechaNacimiento || ""}
                onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
                onFocus={() => handleFocus("fechaNacimiento")}
                onBlur={() => handleBlur("fechaNacimiento")}
                className={fieldClass("fechaNacimiento")}
              />
              {fieldError("fechaNacimiento")}
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
          <Label>
            Sexo <span className="text-red-600">*</span>
          </Label>
          <RadioGroup
            value={data.sexo || ""}
            onValueChange={(value) => {
              handleChange("sexo", value)
              handleBlur("sexo")
            }}
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
          {fieldError("sexo")}
        </div>

        {/* Nacionalidad */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>
              Nacionalidad <span className="text-red-600">*</span>
            </Label>
            <Select
              value={data.nacionalidad || ""}
              onValueChange={(value) => {
                handleChange("nacionalidad", value)
                handleBlur("nacionalidad")
              }}
            >
              <SelectTrigger className={fieldClass("nacionalidad")}>
                <SelectValue placeholder="Selecciona tu nacionalidad" />
              </SelectTrigger>
              <SelectContent>
                {nacionalidades.length > 0 ? (
                  nacionalidades.map((n) => (
                    <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-disponible" disabled>No hay nacionalidades</SelectItem>
                )}
              </SelectContent>
            </Select>
            {fieldError("nacionalidad")}
          </div>

          {/* Lugar de nacimiento: país, estado/provincia, ciudad  para mexicanos*/}
          {data.nacionalidad == "1" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Estado de Nacimiento <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={data.estadoNacimiento || ""}
                  onValueChange={(value) => {
                    handleChange("estadoNacimiento", value)
                    handleBlur("estadoNacimiento")
                    onChange({ 
                      ...data, 
                      estadoNacimiento: value,
                      municipioNacimiento: "" 
                    })
                  }}
                >
                  <SelectTrigger className={fieldClass("estadoNacimiento")}>
                    <SelectValue placeholder="Selecciona el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {estados.length > 0 ? (
                      estados.map((estado) => (
                        <SelectItem key={estado.id} value={estado.id}>{estado.name}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-disponible" disabled>No hay estados</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {fieldError("estadoNacimiento")}
              </div>
              <div className="space-y-2">
                <Label>
                  Municipio de Nacimiento <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={data.municipioNacimiento || ""}
                  onValueChange={(value) => {
                    handleChange("municipioNacimiento", value)
                    handleBlur("municipioNacimiento")
                  }}
                  disabled={!data.estadoNacimiento}
                >
                  <SelectTrigger className={fieldClass("municipioNacimiento")}>
                    <SelectValue placeholder="Selecciona el municipio" />
                  </SelectTrigger>
                  <SelectContent>
                    {municipios.length > 0 ? (
                      municipios.map((municipio) => (
                        <SelectItem key={municipio.id} value={municipio.id}>
                          {municipio.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-disponible" disabled>No hay municipios</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {fieldError("municipioNacimiento")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="ciudadNacimiento">
                  Ciudad <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="ciudadNacimiento"
                  value={data.ciudadNacimiento || ""}
                  onChange={(e) => handleChange("ciudadNacimiento", e.target.value)}
                  onFocus={() => handleFocus("ciudadNacimiento")}
                  onBlur={() => handleBlur("ciudadNacimiento")}
                  className={fieldClass("ciudadNacimiento")}
                  placeholder="Ciudad de nacimiento"
                  maxLength={50}
                />
                {fieldError("ciudadNacimiento")}
              </div>
            </div>
          )}
        </div>

        {/* Lugar de nacimiento: país, estado/provincia, ciudad  para extranjeros*/}
        {data.nacionalidad == "2" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paisNacimiento">
                País de Nacimiento <span className="text-red-600">*</span>
              </Label>
              <Input
                id="paisNacimiento"
                value={data.paisNacimiento || ""}
                onChange={(e) => handleChange("paisNacimiento", e.target.value)}
                onFocus={() => handleFocus("paisNacimiento")}
                onBlur={() => handleBlur("paisNacimiento")}
                className={fieldClass("paisNacimiento")}
                placeholder="País de nacimiento"
                maxLength={50}
              />
              {fieldError("paisNacimiento")}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estadoNacimientoExtranjero">
                Estado/Provincia <span className="text-red-600">*</span>
              </Label>
              <Input
                id="estadoNacimientoExtranjero"
                value={data.estadoNacimientoExtranjero || ""}
                onChange={(e) => handleChange("estadoNacimientoExtranjero", e.target.value)}
                onFocus={() => handleFocus("estadoNacimientoExtranjero")}
                onBlur={() => handleBlur("estadoNacimientoExtranjero")}
                className={fieldClass("estadoNacimientoExtranjero")}
                placeholder="Estado o provincia"
                maxLength={50}
              />
              {fieldError("estadoNacimientoExtranjero")}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ciudadNacimiento">
                Ciudad <span className="text-red-600">*</span>
              </Label>
              <Input
                id="ciudadNacimiento"
                value={data.ciudadNacimiento || ""}
                onChange={(e) => handleChange("ciudadNacimiento", e.target.value)}
                onFocus={() => handleFocus("ciudadNacimiento")}
                onBlur={() => handleBlur("ciudadNacimiento")}
                className={fieldClass("ciudadNacimiento")}
                placeholder="Ciudad de nacimiento"
                maxLength={50}
              />
              {fieldError("ciudadNacimiento")}
            </div>
          </div>
        )}

        {/* Estado Civil y Lengua */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>
              Estado Civil <span className="text-red-600">*</span>
            </Label>
            <Select
              value={data.estadoCivil || ""}
              onValueChange={(value) => {
                handleChange("estadoCivil", value)
                handleBlur("estadoCivil")
              }}
            >
              <SelectTrigger className={fieldClass("estadoCivil")}>
                <SelectValue placeholder="Selecciona tu estado civil" />
              </SelectTrigger>
              <SelectContent>
                {estadosCiviles.length > 0 ? (
                  estadosCiviles.map((ec) => (
                    <SelectItem key={ec.id} value={ec.id}>{ec.name}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-disponible" disabled>No hay estados civiles</SelectItem>
                )}
              </SelectContent>
            </Select>
            {fieldError("estadoCivil")}
          </div>

          <div className="space-y-2">
            <Label>
              Lengua Natal <span className="text-red-600">*</span>
            </Label>
            <Select
              value={data.lenguaNatal || ""}
              onValueChange={(value) => {
                handleChange("lenguaNatal", value)
                handleBlur("lenguaNatal")
              }}
            >
              <SelectTrigger className={fieldClass("lenguaNatal")}>
                <SelectValue placeholder="Selecciona tu lengua natal" />
              </SelectTrigger>
              <SelectContent>
                {lenguasNatales.length > 0 ? (
                  lenguasNatales.map((ln) => (
                    <SelectItem key={ln.id} value={ln.id}>{ln.name}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-disponible" disabled>No hay lenguas</SelectItem>
                )}
              </SelectContent>
            </Select>
            {fieldError("lenguaNatal")}
          </div>
        </div>

        {/* Hijos */}
        <div className="space-y-3">
          <Label>
            ¿Tienes hijos? <span className="text-red-600">*</span>
          </Label>
          <RadioGroup
            value={data.tieneHijos || ""}
            onValueChange={(value) => {
              handleChange("tieneHijos", value)
              handleBlur("tieneHijos")
            }}
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
          {fieldError("tieneHijos")}
        </div>
      </CardContent>
    </Card>
  )
}
