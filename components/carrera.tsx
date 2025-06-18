"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface CarreraProps {
  data: any
  onChange: (data: any) => void
}

const carreras = [
  "Ingeniería en Sistemas Computacionales",
  "Ingeniería en Tecnologías de la Información",
  "Ingeniería en Mecatrónica",
  "Ingeniería en Energías Renovables",
  "Ingeniería en Biotecnología",
  "Ingeniería Industrial",
  "Licenciatura en Administración",
  "Licenciatura en Contaduría Pública",
  "Licenciatura en Turismo",
  "Licenciatura en Gastronomía",
  "Técnico Superior Universitario en Desarrollo de Software Multiplataforma",
  "Técnico Superior Universitario en Infraestructura de Redes Digitales",
  "Técnico Superior Universitario en Mecatrónica",
  "Técnico Superior Universitario en Energías Renovables",
  "Técnico Superior Universitario en Biotecnología",
  "Técnico Superior Universitario en Procesos Industriales",
  "Técnico Superior Universitario en Administración",
  "Técnico Superior Universitario en Contaduría",
  "Técnico Superior Universitario en Turismo",
  "Técnico Superior Universitario en Gastronomía",
]

const mediosDifusion = [
  "Redes sociales (Facebook, Instagram, TikTok)",
  "Página web oficial de UTEZ",
  "Recomendación de familiares o amigos",
  "Ferias educativas",
  "Visita a preparatoria",
  "Radio",
  "Televisión",
  "Periódico o revista",
  "Volantes o carteles",
  "Otro",
]

const opcionesUTEZ = ["Primera opción", "Segunda opción", "Tercera opción", "Cuarta opción", "Quinta opción", "Otra"]

export default function CarreraComponent({ data, onChange }: CarreraProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#70785b]">
          <span>🎓</span>
          Elección de Carrera
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Carrera de interés */}
        <div className="space-y-2">
          <Label>Carrera de Interés *</Label>
          <Select
            value={data.carreraInteres || ""}
            onValueChange={(value) => onChange({ ...data, carreraInteres: value })}
          >
            <SelectTrigger className={cn("transition-colors", data.carreraInteres ? "border-green-500" : "")}>
              <SelectValue placeholder="Selecciona la carrera de tu interés" />
            </SelectTrigger>
            <SelectContent>
              {carreras.map((carrera) => (
                <SelectItem key={carrera} value={carrera}>
                  {carrera}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Medio de difusión */}
        <div className="space-y-3">
          <Label>¿Por qué medio te enteraste de la UTEZ? *</Label>
          <Select
            value={data.medioDifusion || ""}
            onValueChange={(value) =>
              onChange({
                ...data,
                medioDifusion: value,
                medioDifusionOtro: value === "Otro" ? data.medioDifusionOtro : "",
              })
            }
          >
            <SelectTrigger className={cn("transition-colors", data.medioDifusion ? "border-green-500" : "")}>
              <SelectValue placeholder="Selecciona el medio por el cual conociste la UTEZ" />
            </SelectTrigger>
            <SelectContent>
              {mediosDifusion.map((medio) => (
                <SelectItem key={medio} value={medio}>
                  {medio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {data.medioDifusion === "Otro" && (
            <div className="space-y-2">
              <Label htmlFor="medioDifusionOtro">Especifica el medio *</Label>
              <Input
                id="medioDifusionOtro"
                value={data.medioDifusionOtro || ""}
                onChange={(e) => onChange({ ...data, medioDifusionOtro: e.target.value })}
                className={cn("transition-colors", data.medioDifusionOtro ? "border-green-500" : "border-[#c0392b]")}
                placeholder="Especifica por qué medio te enteraste"
              />
            </div>
          )}
        </div>

        {/* Opción UTEZ */}
        <div className="space-y-3">
          <Label>¿La UTEZ es tu...? *</Label>
          <Select
            value={data.opcionUTEZ || ""}
            onValueChange={(value) =>
              onChange({ ...data, opcionUTEZ: value, opcionUTEZOtra: value === "Otra" ? data.opcionUTEZOtra : "" })
            }
          >
            <SelectTrigger className={cn("transition-colors", data.opcionUTEZ ? "border-green-500" : "")}>
              <SelectValue placeholder="Selecciona qué opción representa la UTEZ para ti" />
            </SelectTrigger>
            <SelectContent>
              {opcionesUTEZ.map((opcion) => (
                <SelectItem key={opcion} value={opcion}>
                  {opcion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {data.opcionUTEZ === "Otra" && (
            <div className="space-y-2">
              <Label htmlFor="opcionUTEZOtra">Especifica la opción *</Label>
              <Input
                id="opcionUTEZOtra"
                value={data.opcionUTEZOtra || ""}
                onChange={(e) => onChange({ ...data, opcionUTEZOtra: e.target.value })}
                className={cn("transition-colors", data.opcionUTEZOtra ? "border-green-500" : "border-[#c0392b]")}
                placeholder="Especifica qué opción es la UTEZ para ti"
              />
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="bg-[#cfd4c1]/20 p-4 rounded-lg">
          <h3 className="font-medium text-[#70785b] mb-2">Información sobre tu carrera seleccionada</h3>
          {data.carreraInteres && (
            <div className="text-sm text-[#888888]">
              <p>
                <strong>Carrera seleccionada:</strong> {data.carreraInteres}
              </p>
              <p className="mt-2">
                Una vez completado el formulario, recibirás información detallada sobre el plan de estudios, requisitos
                de ingreso y fechas importantes para el proceso de admisión.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
