import { useState } from "react";
import { Timer } from "lucide-react";
import { COMPETITIVE_TIME_RANGE } from "../constants/gameConfig";

/**
 * Hook que encapsula toda la lógica del selector de Modo Competitivo en los setups.
 * Devuelve el estado y los props listos para pasar al SetupSelector.
 */
const useCompetitiveSetup = (
  initialCompetitiveMode = false,
  initialTurnTime = 0,
) => {
  const { min, max, step } = COMPETITIVE_TIME_RANGE;
  const initial = initialCompetitiveMode ? initialTurnTime : 0;
  const sanitizedInitial = Math.max(min, Math.min(max, initial));

  const [turnTime, setTurnTime] = useState(sanitizedInitial);
  const competitiveMode = turnTime > 0;

  const handleChange = (val) => {
    setTurnTime(Math.max(min, Math.min(max, val)));
  };

  // Props listos para pasarle directamente al SetupSelector con spread
  const competitiveSelectorProps = {
    icon: Timer,
    title: "Modo Competitivo",
    type: "range",
    min,
    max,
    step,
    value: turnTime,
    onChange: handleChange,
  };

  return { competitiveMode, turnTime, competitiveSelectorProps };
};

export default useCompetitiveSetup;
