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
    const totalFields = 50 // Aproximado total de campos obligatorios
    let completedFields = 0

    // Datos Generales
    const { datosGenerales } = formData
    if (datosGenerales.nombre.length >= 3) completedFields++
    if (datosGenerales.primerApellido.length >= 3) completedFields++
    if (datosGenerales.segundoApellido.length >= 3) completedFields++
    if (datosGenerales.curp.length === 18) completedFields++
    if (datosGenerales.fechaNacimiento) completedFields++
    if (datosGenerales.sexo) completedFields++
    if (datosGenerales.nacionalidad) completedFields++
    if (datosGenerales.estadoCivil) completedFields++
    if (datosGenerales.lenguaNatal) completedFields++
    if (datosGenerales.tieneHijos) completedFields++

    // Domicilio
    const { domicilio } = formData
    if (domicilio.calle) completedFields++
    if (domicilio.numeroExterior) completedFields++
    if (domicilio.colonia) completedFields++
    if (domicilio.estado) completedFields++
    if (domicilio.municipio) completedFields++
    if (domicilio.codigoPostal.length === 5) completedFields++
    if (domicilio.email.includes("@")) completedFields++

    // Ingresos
    const { ingresos } = formData
    if (ingresos.ingresoFamiliar) completedFields++
    if (ingresos.trabajas) completedFields++

    // Carrera
    const { carrera } = formData
    if (carrera.carreraInteres) completedFields++
    if (carrera.medioDifusion) completedFields++
    if (carrera.opcionUTEZ) completedFields++

    // Antecedentes
    const { antecedentes } = formData
    if (antecedentes.tipoPrepa) completedFields++
    if (antecedentes.nombrePrepa) completedFields++
    if (antecedentes.claveCCT.length === 10) completedFields++
    if (antecedentes.estado) completedFields++
    if (antecedentes.municipio) completedFields++
    if (antecedentes.promedio) completedFields++
    if (antecedentes.tieneBeca) completedFields++

    return Math.min((completedFields / totalFields) * 100, 100)
  }, [formData])

  return {
    formData,
    updateFormData,
    validateSection,
    getProgress,
  }
}
