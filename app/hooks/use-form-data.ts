"use client"

import { useState, useCallback } from "react"

export interface FormData {
  datosGenerales: {
    nombre: string
    primerApellido: string
    segundoApellido: string
    curp: string
    fechaNacimiento: string
    edad: number
    sexo: string
    nacionalidad: string
    estadoNacimiento: string
    municipioNacimiento: string
    paisNacimiento: string
    estadoNacimientoExtranjero: string
    ciudadNacimiento: string
    estadoCivil: string
    lenguaNatal: string
    tieneHijos: string
  }
  domicilio: {
    calle: string
    numeroExterior: string
    numeroInterior: string
    colonia: string
    localidad: string
    estado: string
    municipio: string
    codigoPostal: string
    email: string
  }
  complementarios: {
    discapacidades: string[]
    discapacidadOtra: string
    lenguasIndigenasPadres: string[]
    lenguasIndigenasPadresOtra: string
    lenguasIndigenasPersonales: string[]
    lenguasIndigenasPersonalesOtra: string
  }
  ingresos: {
    ingresoFamiliar: string
    trabajas: string
    tipoTrabajo: string
    lada: string
    telefono: string
    ingresoMensual: string
    nombreEmpresa: string
    puesto: string
    horario: string
  }
  carrera: {
    carreraInteres: string
    medioDifusion: string
    medioDifusionOtro: string
    opcionUTEZ: string
    opcionUTEZOtra: string
  }
  antecedentes: {
    tipoPrepa: string
    tipoPrepaOtra: string
    nombrePrepa: string
    claveCCT: string
    claveCCTConfirmacion: string
    estado: string
    municipio: string
    estadoOtro: string
    municipioOtro: string
    promedio: string
    tieneBeca: string
    nombreBeca: string
  }
}

const initialFormData: FormData = {
  datosGenerales: {
    nombre: "",
    primerApellido: "",
    segundoApellido: "",
    curp: "",
    fechaNacimiento: "",
    edad: 0,
    sexo: "",
    nacionalidad: "",
    estadoNacimiento: "",
    municipioNacimiento: "",
    paisNacimiento: "",
    estadoNacimientoExtranjero: "",
    ciudadNacimiento: "",
    estadoCivil: "",
    lenguaNatal: "",
    tieneHijos: "",
  },
  domicilio: {
    calle: "",
    numeroExterior: "",
    numeroInterior: "",
    colonia: "",
    localidad: "",
    estado: "",
    municipio: "",
    codigoPostal: "",
    email: "",
  },
  complementarios: {
    discapacidades: [],
    discapacidadOtra: "",
    lenguasIndigenasPadres: [],
    lenguasIndigenasPadresOtra: "",
    lenguasIndigenasPersonales: [],
    lenguasIndigenasPersonalesOtra: "",
  },
  ingresos: {
    ingresoFamiliar: "",
    trabajas: "",
    tipoTrabajo: "",
    lada: "",
    telefono: "",
    ingresoMensual: "",
    nombreEmpresa: "",
    puesto: "",
    horario: "",
  },
  carrera: {
    carreraInteres: "",
    medioDifusion: "",
    medioDifusionOtro: "",
    opcionUTEZ: "",
    opcionUTEZOtra: "",
  },
  antecedentes: {
    tipoPrepa: "",
    tipoPrepaOtra: "",
    nombrePrepa: "",
    claveCCT: "",
    claveCCTConfirmacion: "",
    estado: "",
    municipio: "",
    estadoOtro: "",
    municipioOtro: "",
    promedio: "",
    tieneBeca: "",
    nombreBeca: "",
  },
}

type RequiredField = {
  value: string
  condition: boolean
  customCheck?: (v: string) => boolean
}

export function useFormData() {
  const [formData, setFormData] = useState<FormData>(initialFormData)

  const updateFormData = useCallback((section: keyof FormData, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }))
  }, [])

  const validateSection = useCallback(
    (section: string): boolean => {
      switch (section) {
        case "personal":
          const { datosGenerales, domicilio } = formData
          return !!(
            datosGenerales.nombre.length >= 3 &&
            datosGenerales.primerApellido.length >= 3 &&
            datosGenerales.segundoApellido.length >= 3 &&
            datosGenerales.curp.length === 18 &&
            datosGenerales.fechaNacimiento &&
            datosGenerales.sexo &&
            datosGenerales.nacionalidad &&
            datosGenerales.estadoCivil &&
            datosGenerales.lenguaNatal &&
            datosGenerales.tieneHijos &&
            domicilio.calle &&
            domicilio.numeroExterior &&
            domicilio.colonia &&
            domicilio.estado &&
            domicilio.municipio &&
            domicilio.codigoPostal.length === 5 &&
            domicilio.email.includes("@")
          )
        case "carrera":
          const { carrera } = formData
          return !!(carrera.carreraInteres && carrera.medioDifusion && carrera.opcionUTEZ)
        case "antecedentes":
          const { antecedentes } = formData
          return !!(
            antecedentes.tipoPrepa &&
            antecedentes.nombrePrepa &&
            antecedentes.claveCCT.length === 10 &&
            antecedentes.claveCCT === antecedentes.claveCCTConfirmacion &&
            antecedentes.estado &&
            antecedentes.municipio &&
            antecedentes.promedio &&
            Number.parseFloat(antecedentes.promedio) >= 6.0 &&
            Number.parseFloat(antecedentes.promedio) <= 10.0 &&
            antecedentes.tieneBeca
          )
        default:
          return false
      }
    },
    [formData],
  )

  const getProgress = useCallback((): number => {
    let completedFields = 0
    let totalRequired = 0

    const { datosGenerales, domicilio, ingresos, carrera, antecedentes } = formData

    const isExtranjero = datosGenerales.nacionalidad.toLowerCase() === "extranjero(a)"
    const trabaja = ingresos.trabajas.toLowerCase() === "sí" || ingresos.trabajas.toLowerCase() === "si"
    const tieneBeca = antecedentes.tieneBeca.toLowerCase() === "sí" || antecedentes.tieneBeca.toLowerCase() === "si"

    const allRequiredFields: RequiredField[] = [
      // Datos Generales
      { value: datosGenerales.nombre, condition: true, customCheck: (v) => v.length >= 3 },
      { value: datosGenerales.primerApellido, condition: true, customCheck: (v) => v.length >= 3 },
      { value: datosGenerales.curp, condition: true, customCheck: (v) => v.length === 18 },
      { value: datosGenerales.fechaNacimiento, condition: true, customCheck: (v) => v.length === 10 },
      { value: datosGenerales.sexo, condition: true, customCheck: (v) => ["masculino", "femenino", "otro"].includes(v.toLowerCase()) },
      { value: datosGenerales.nacionalidad, condition: true, customCheck: (v) => v.length >= 2 },
      { value: datosGenerales.estadoCivil, condition: true, customCheck: (v) => v.length >= 2 },
      { value: datosGenerales.lenguaNatal, condition: true, customCheck: (v) => v.length >= 2 },
      { value: datosGenerales.tieneHijos, condition: true, customCheck: (v) => ["si", "sí", "no"].includes(v.toLowerCase()) },
      { value: datosGenerales.paisNacimiento, condition: isExtranjero, customCheck: (v) => v.length >= 2 },
      { value: datosGenerales.estadoNacimientoExtranjero, condition: isExtranjero, customCheck: (v) => v.length >= 2 },
      { value: datosGenerales.ciudadNacimiento, condition: isExtranjero, customCheck: (v) => v.length >= 2 },

      // Domicilio
      { value: domicilio.calle, condition: true, customCheck: (v) => v.length >= 3 },
      { value: domicilio.numeroExterior, condition: true, customCheck: (v) => v.length >= 1 },
      { value: domicilio.colonia, condition: true, customCheck: (v) => v.length >= 3 },
      { value: domicilio.estado, condition: true, customCheck: (v) => v.length >= 2 },
      { value: domicilio.municipio, condition: true, customCheck: (v) => v.length >= 2 },
      { value: domicilio.codigoPostal, condition: true, customCheck: (v) => v.length === 5 },
      { value: domicilio.email, condition: true, customCheck: (v) => v.includes("@") && v.includes(".") && v.length >= 5 },

      // Ingresos
      { value: ingresos.ingresoFamiliar, condition: true, customCheck: (v) => v.length >= 1 },
      { value: ingresos.trabajas, condition: true, customCheck: (v) => ["si", "sí", "no"].includes(v.toLowerCase()) },
      { value: ingresos.tipoTrabajo, condition: trabaja, customCheck: (v) => v.length >= 2 },
      { value: ingresos.lada, condition: trabaja, customCheck: (v) => v.length >= 2 },
      { value: ingresos.telefono, condition: trabaja, customCheck: (v) => v.length >= 8 },
      { value: ingresos.ingresoMensual, condition: trabaja, customCheck: (v) => v.length >= 1 },
      { value: ingresos.nombreEmpresa, condition: trabaja, customCheck: (v) => v.length >= 3 },
      { value: ingresos.puesto, condition: trabaja, customCheck: (v) => v.length >= 2 },
      { value: ingresos.horario, condition: trabaja, customCheck: (v) => v.length >= 2 },

      // Carrera
      { value: carrera.carreraInteres, condition: true, customCheck: (v) => v.length >= 2 },
      { value: carrera.medioDifusion, condition: true, customCheck: (v) => v.length >= 2 },
      { value: carrera.opcionUTEZ, condition: true, customCheck: (v) => v.length >= 2 },

      // Antecedentes
      { value: antecedentes.tipoPrepa, condition: true, customCheck: (v) => v.length >= 2 },
      { value: antecedentes.nombrePrepa, condition: true, customCheck: (v) => v.length >= 3 },
      { value: antecedentes.claveCCT, condition: true, customCheck: (v) => v.length === 10 },
      { value: antecedentes.claveCCTConfirmacion, condition: true, customCheck: (v) => v === antecedentes.claveCCT && v.length === 10 },
      { value: antecedentes.estado, condition: true, customCheck: (v) => v.length >= 2 },
      { value: antecedentes.municipio, condition: true, customCheck: (v) => v.length >= 2 },
      {
        value: antecedentes.promedio,
        condition: true,
        customCheck: (v) => {
          const n = parseFloat(v)
          return !isNaN(n) && n >= 6.0 && n <= 10.0
        },
      },
      { value: antecedentes.tieneBeca, condition: true, customCheck: (v) => ["si", "sí", "no"].includes(v.toLowerCase()) },
      { value: antecedentes.nombreBeca, condition: tieneBeca, customCheck: (v) => v.length >= 2 },
    ]

    for (const field of allRequiredFields) {
      if (field.condition) {
        totalRequired++
        const isValid = field.customCheck ? field.customCheck(field.value) : field.value.length >= 1
        if (isValid) completedFields++
      }
    }

    return Math.round((completedFields / totalRequired) * 100)
  }, [formData])

  return {
    formData,
    updateFormData,
    validateSection,
    getProgress,
  }
}
