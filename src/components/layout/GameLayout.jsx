import { ArrowLeft, RotateCcw } from 'lucide-react';
import GameRules from '../game/GameRules';
import PlayerStatus from '../game/PlayerStatus';
import GameTacticalHint from '../game/GameTacticalHint';
import { useGame } from '../../contexts/GameContext';

const GameLayout = ({
    children,
    onExit,
    onReset,
    tacticalHint
}) => {
    const { gameTitle } = useGame();

    return (
        <div className="w-full max-w-7xl h-full flex flex-col items-center p-4 md:p-6 overflow-hidden">
            {/* Header Unificado (Solo Título y Acciones) */}
            <header className="w-full flex justify-between items-center mb-4 md:mb-6 gap-4 shrink-0">
                <button
                    onClick={onExit}
                    className="p-3 rounded-2xl bg-cell-hover border border-board-border text-slate-400 hover:text-white hover:scale-110 active:scale-95 transition-all backdrop-blur-md shadow-lg shrink-0"
                    title="Volver al Home"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="flex flex-col items-center flex-1 min-w-0 text-center">
                    <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-blue-500 truncate w-full">
                        {gameTitle}
                    </h2>
                </div>

                <button
                    onClick={onReset}
                    className="p-3 rounded-2xl bg-cell-hover border border-board-border text-slate-400 hover:text-white hover:scale-110 active:scale-95 transition-all backdrop-blur-md shadow-lg shrink-0"
                    title="Reiniciar Juego"
                >
                    <RotateCcw size={20} />
                </button>
            </header>

            {/* Main Layout: 3 Columnas (Optimizado para Viewport) */}
            <main className="w-full flex-1 grid grid-cols-1 lg:grid-cols-[1.2fr_2.5fr_1fr] gap-6 items-center overflow-hidden">

                {/* Columna 1: Estatus de Jugadores (Desktop Only) */}
                <aside className="hidden lg:flex h-full flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto px-4 custom-scrollbar py-4">
                        <PlayerStatus />
                    </div>
                </aside>

                {/* Columna 2: El Juego (Centro) */}
                <section className="flex flex-col items-center justify-center w-full h-full animate-in fade-in zoom-in duration-500 overflow-visible py-4 relative gap-6">
                    {tacticalHint && (
                        <div className="shrink-0">
                            <GameTacticalHint>{tacticalHint}</GameTacticalHint>
                        </div>
                    )}
                    <div className="w-full flex-1 flex justify-center items-center scale-90 md:scale-95 lg:scale-100 origin-center transition-transform overflow-hidden">
                        {children}
                    </div>
                </section>

                {/* Columna 3: Reglas del Juego (Scroll Independiente) */}
                <aside className="h-full flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar py-4">
                        <GameRules />
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default GameLayout;
