"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface IndigenousLanguage {
  id: number;
  nombre: string;
}

export default function IndigenousLanguagesSelect() {
  const [languages, setLanguages] = useState<IndigenousLanguage[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch("http://192.168.0.101:8080/api/fichas-utez/api/indigenous-languages")

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Validar que la respuesta sea un array
        if (!Array.isArray(data)) {
          throw new Error("La respuesta de la API no es un array válido");
        }

        // Validar y transformar cada elemento del array
        const transformedData = data.map((item, index) => {
          if (!item || typeof item !== "object" || !item.id || !item.name) {
            throw new Error(
              `Elemento inválido en el índice ${index}: faltan las propiedades 'id' o 'name'`,
            );
          }
          return {
            id: item.id,
            nombre: item.name,
          };
        });

        setLanguages(transformedData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar las lenguas indígenas",
        );
        console.error("Error fetching indigenous languages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="indigenous-language">Lengua indígena</Label>
      <Select
        value={selectedLanguage}
        onValueChange={setSelectedLanguage}
        disabled={loading}
      >
        <SelectTrigger id="indigenous-language" className="w-full">
          <SelectValue placeholder="Selecciona una lengua indígena" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.id} value={language.id.toString()}>
              {language.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {languages.length === 0 && !loading && !error && (
        <p className="text-sm text-yellow-500">
          No hay lenguas indígenas disponibles
        </p>
      )}
    </div>
  );
}
