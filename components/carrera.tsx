"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface CarreraProps {
  data: any;
  onChange: (data: any) => void;
  showValidationErrors?: boolean;
}

const opcionesUTEZ = ["Primera opción", "Segunda opción"];

export default function CarreraComponent({
  data,
  onChange,
  showValidationErrors = false,
}: CarreraProps) {
  const [carreras, setCarreras] = useState([]);
  const [mediosDifusion, setMediosDifusion] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/school-careers`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Carreras recibidas:", data); // 🐞 Debug
        setCarreras(Array.isArray(data.data) ? data.data : []);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Error fetching carreras:", err);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/media-channels`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) =>
        setMediosDifusion(Array.isArray(data.data) ? data.data : []),
      )
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Error fetching medios de difusión:", err);
        }
      });

    return () => controller.abort();
  }, []);

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
            onValueChange={(value) =>
              onChange({ ...data, carreraInteres: value })
            }
          >
            <SelectTrigger
              className={cn(
                "transition-colors",
                data.carreraInteres
                  ? "border-green-500"
                  : showValidationErrors
                    ? "border-[#c0392b]"
                    : "",
              )}
            >
              <SelectValue placeholder="Selecciona la carrera de tu interés" />
            </SelectTrigger>
            <SelectContent>
              {carreras.length > 0 ? (
                carreras.map((carrera) => (
                  <SelectItem key={carrera.id} value={carrera.name}>
                    {carrera.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-disponible" disabled>
                  Cargando carreras...
                </SelectItem>
              )}
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
              })
            }
          >
            <SelectTrigger
              className={cn(
                "transition-colors",
                data.medioDifusion
                  ? "border-green-500"
                  : showValidationErrors
                    ? "border-[#c0392b]"
                    : "",
              )}
            >
              <SelectValue placeholder="Selecciona el medio por el cual conociste la UTEZ" />
            </SelectTrigger>
            <SelectContent>
              {mediosDifusion.length > 0 ? (
                mediosDifusion.map((medio) => (
                  <SelectItem key={medio.id} value={medio.name}>
                    {medio.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-disponible" disabled>
                  Cargando medios...
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Opción UTEZ */}
        <div className="space-y-3">
          <Label>¿La UTEZ es tu...? *</Label>
          <Select
            value={data.opcionUTEZ || ""}
            onValueChange={(value) =>
              onChange({
                ...data,
                opcionUTEZ: value,
              })
            }
          >
            <SelectTrigger
              className={cn(
                "transition-colors",
                data.opcionUTEZ
                  ? "border-green-500"
                  : showValidationErrors
                    ? "border-[#c0392b]"
                    : "",
              )}
            >
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
        </div>

        {/* Información adicional */}
        <div className="bg-[#cfd4c1]/20 p-4 rounded-lg">
          <h3 className="font-medium text-[#70785b] mb-2">
            Información sobre tu carrera seleccionada
          </h3>
          {data.carreraInteres && (
            <div className="text-sm text-[#888888]">
              <p>
                <strong>Carrera seleccionada:</strong> {data.carreraInteres}
              </p>
              <p className="mt-2">
                Una vez completado el formulario, recibirás información
                detallada sobre el plan de estudios, requisitos de ingreso y
                fechas importantes para el proceso de admisión.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
