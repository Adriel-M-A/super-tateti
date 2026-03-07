import React, { useState, useEffect, useRef } from 'react';
import { Timer, AlertCircle } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

const GameTimer = () => {
    const { competitiveMode, turnTime, currentPlayerIndex, gameStatus, onTimeOut } = useGame();
    const [timeLeft, setTimeLeft] = useState(turnTime);
    const timerRef = useRef(null);
    const timeoutFiredRef = useRef(false); // Evita disparar onTimeOut más de una vez por turno

    // Reiniciar temporizador y flag cuando cambia el turno
    useEffect(() => {
        if (competitiveMode && gameStatus === 'playing') {
            setTimeLeft(turnTime);
            timeoutFiredRef.current = false;
        }
    }, [currentPlayerIndex, turnTime, competitiveMode, gameStatus]);

    // Lógica de cuenta regresiva
    useEffect(() => {
        if (!competitiveMode || gameStatus !== 'playing') return;

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1 && !timeoutFiredRef.current) {
                    // Marcar como disparado antes de llamar para evitar doble ejecución
                    timeoutFiredRef.current = true;
                    // Diferir al siguiente tick para no llamar setState dentro de setState
                    if (onTimeOut) setTimeout(onTimeOut, 0);
                    return 0;
                }
                return prev <= 0 ? 0 : prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [competitiveMode, gameStatus, currentPlayerIndex, onTimeOut]); // Se reinicia el efecto al cambiar de turno

    if (!competitiveMode) return null;

    const percentage = (timeLeft / turnTime) * 100;
    const isLowTime = timeLeft <= 3;

    return (
        <div className="w-full flex flex-col gap-4 animate-in slide-in-from-left duration-700 overflow-visible">
            {/* Header del Temporizador (Mismo estilo que PlayerStatus) */}
            <div className="flex items-center gap-3 px-2">
                <div className={`p-2 rounded-xl shrink-0 transition-colors duration-500 ${isLowTime ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                    <Timer size={18} strokeWidth={2.5} className={isLowTime ? "animate-pulse" : ""} />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-page-text/80">
                        Tiempo Restante
                    </h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 opacity-60">
                        Modo Competitivo
                    </p>
                </div>
                <div className={`text-xl font-black tabular-nums transition-all duration-300 ${isLowTime ? 'text-red-500 scale-110' : 'text-page-text/90'
                    }`}>
                    {timeLeft}<span className="text-xs ml-1 opacity-50">s</span>
                </div>
            </div>

            {/* Card del Temporizador */}
            <div className={`relative p-1.5 rounded-2xl border transition-all duration-500 bg-page-text/5 border-page-text/10 shadow-sm ${isLowTime ? 'border-red-500/30' : ''}`}>
                {/* Barra de Progreso */}
                <div className="h-2 w-full bg-page-text/5 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ease-linear rounded-full ${isLowTime
                            ? "bg-linear-to-r from-red-600 to-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                            : "bg-linear-to-r from-blue-600 to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                            }`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {timeLeft === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 rounded-2xl backdrop-blur-[2px] animate-in fade-in duration-300">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-red-500 uppercase tracking-tighter">
                            <AlertCircle size={12} strokeWidth={3} />
                            <span>Tiempo Agotado</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameTimer;
