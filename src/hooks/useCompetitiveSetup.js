import { useState } from 'react';
import { Timer } from 'lucide-react';
import { COMPETITIVE_TIME_OPTIONS } from '../constants/gameConfig';

/**
 * Hook que encapsula toda la lógica del selector de Modo Competitivo en los setups.
 * Devuelve el estado y los props listos para pasar al SetupSelector.
 */
const useCompetitiveSetup = (initialCompetitiveMode = false, initialTurnTime = 0) => {
    const [competitiveMode, setCompetitiveMode] = useState(initialCompetitiveMode);
    const [turnTime, setTurnTime] = useState(initialTurnTime);

    const handleChange = (val) => {
        if (val === "No") {
            setCompetitiveMode(false);
        } else {
            setCompetitiveMode(true);
            setTurnTime(val);
        }
    };

    // Props listos para pasarle directamente al SetupSelector con spread
    const competitiveSelectorProps = {
        icon: Timer,
        title: "Modo Competitivo",
        options: COMPETITIVE_TIME_OPTIONS,
        value: competitiveMode ? turnTime : "No",
        onChange: handleChange,
    };

    return { competitiveMode, turnTime, competitiveSelectorProps };
};

export default useCompetitiveSetup;
