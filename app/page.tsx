"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// Componentes modulares
import DatosGeneralesComponent from "../components/datos-generales"
import DomicilioComponent from "../components/domicilio"
import ComplementariosComponent from "../components/complementarios"
import IngresosComponent from "../components/ingresos"
import CarreraComponent from "../components/carrera"
import AntecedentesEscolaresComponent from "../components/antecedentes-escolares"

// Hook personalizado para el estado del formulario
import { useFormData } from "./hooks/use-form-data"

const tabs = [
  { id: "personal", label: "Información Personal", icon: "👤" },
  { id: "carrera", label: "Elección de Carrera", icon: "🎓" },
  { id: "antecedentes", label: "Antecedentes Escolares", icon: "📚" },
]

export default function AdmissionForm() {
  const [activeTab, setActiveTab] = useState("personal")
  const [isMobile, setIsMobile] = useState(false)
  const { formData, updateFormData, validateSection, getProgress } = useFormData()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const progress = getProgress()
  const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab)
  const canNavigateNext = validateSection(activeTab)

  const handleNext = () => {
    if (currentTabIndex < tabs.length - 1 && canNavigateNext) {
      setActiveTab(tabs[currentTabIndex + 1].id)
    }
  }

  const handlePrevious = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1].id)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <div className="space-y-8">
            <DatosGeneralesComponent
              data={formData.datosGenerales}
              onChange={(data) => updateFormData("datosGenerales", data)}
            />
            <DomicilioComponent data={formData.domicilio} onChange={(data) => updateFormData("domicilio", data)} />
            <ComplementariosComponent
              data={formData.complementarios}
              onChange={(data) => updateFormData("complementarios", data)}
            />
            <IngresosComponent data={formData.ingresos} onChange={(data) => updateFormData("ingresos", data)} />
          </div>
        )
      case "carrera":
        return <CarreraComponent data={formData.carrera} onChange={(data) => updateFormData("carrera", data)} />
      case "antecedentes":
        return (
          <AntecedentesEscolaresComponent
            data={formData.antecedentes}
            onChange={(data) => updateFormData("antecedentes", data)}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#70785b] text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center">Ficha de Admisión UTEZ</h1>
          <p className="text-center mt-2 text-[#cfd4c1]">
            Universidad Tecnológica Emiliano Zapata del Estado de Morelos
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-[#cfd4c1] py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#888888]">Progreso del formulario</span>
            <span className="text-sm font-medium text-[#70785b]">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardContent className="p-0">
            {/* Navigation */}
            <div className="border-b border-gray-200">
              {isMobile ? (
                // Mobile dropdown
                <div className="p-4">
                  <Select value={activeTab} onValueChange={setActiveTab}>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <span>{tabs.find((tab) => tab.id === activeTab)?.icon}</span>
                          <span>{tabs.find((tab) => tab.id === activeTab)?.label}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {tabs.map((tab) => (
                        <SelectItem key={tab.id} value={tab.id}>
                          <div className="flex items-center gap-2">
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                // Desktop tabs
                <div className="flex">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors",
                        activeTab === tab.id
                          ? "border-[#70785b] text-[#70785b] bg-[#cfd4c1]/20"
                          : "border-transparent text-[#888888] hover:text-[#70785b] hover:border-[#cfd4c1]",
                      )}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-lg">{tab.icon}</span>
                        <span className="hidden sm:inline">{tab.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">{renderTabContent()}</div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentTabIndex === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>

              <div className="flex items-center gap-2 text-sm text-[#888888]">
                <span>
                  {currentTabIndex + 1} de {tabs.length}
                </span>
              </div>

              {currentTabIndex === tabs.length - 1 ? (
                <Button className="bg-[#70785b] hover:bg-[#70785b]/90 text-white" disabled={!canNavigateNext}>
                  Enviar Solicitud
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canNavigateNext}
                  className="flex items-center gap-2 bg-[#70785b] hover:bg-[#70785b]/90 text-white"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
