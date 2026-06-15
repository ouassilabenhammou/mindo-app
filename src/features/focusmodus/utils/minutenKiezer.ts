// utils/minutenKiezer.ts

import {
  MAX_MINUTEN,
  MIN_MINUTEN,
} from "@/features/focusmodus/constants/minutenKiezer";

export function formatTijd(seconden: number): string {
  const minuten = Math.floor(seconden / 60);
  const rest = seconden % 60;

  return `${minuten.toString().padStart(2, "0")}:${rest
    .toString()
    .padStart(2, "0")}`;
}

export function minutenNaarHoek(minuten: number): number {
  return (minuten / MAX_MINUTEN) * 360 - 90;
}

export function hoekNaarMinuten(hoek: number): number {
  const genormaliseerd = (((hoek + 90) % 360) + 360) % 360;
  const ruw = (genormaliseerd / 360) * MAX_MINUTEN;

  return Math.max(MIN_MINUTEN, Math.min(MAX_MINUTEN, Math.round(ruw)));
}

export function positieOpCirkel(
  hoekGraden: number,
  straal: number,
  midden: number,
) {
  const hoekRad = (hoekGraden * Math.PI) / 180;

  return {
    x: midden + straal * Math.cos(hoekRad),
    y: midden + straal * Math.sin(hoekRad),
  };
}
