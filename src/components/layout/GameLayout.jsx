import { ArrowLeft, RotateCcw } from 'lucide-react';
import GameRules from '../game/GameRules';

const GameLayout = ({
    children,
    gameTitle,
    onExit,
    onReset,
    players = [],
    currentPlayerIndex,
    scores = [],
    rules = [],
    gameStatus = 'playing'
}) => {
    return (
        <div className="w-full max-w-7xl flex flex-col items-center min-h-screen p-4 md:p-8">
            {/* Header Unificado */}
            <header className="w-full flex justify-between items-center mb-8 gap-4">
                <button
                    onClick={onExit}
                    className="p-3 rounded-2xl bg-cell-hover border border-board-border text-slate-400 hover:text-white hover:scale-110 active:scale-95 transition-all backdrop-blur-md shrink-0 shadow-lg"
                    title="Volver al Home"
                >
                    <ArrowLeft size={24} />
                </button>

                <div className="flex flex-col items-center flex-1 min-w-0 text-center">
                    <h2 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter text-blue-500 truncate w-full">
                        {gameTitle}
                    </h2>

                    {gameStatus === 'playing' && players.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-3">
                            {players.map((p, i) => (
                                <div
                                    key={p.id || i}
                                    className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-500 ${i === currentPlayerIndex
                                        ? 'bg-page-text/10 border-page-text scale-110 shadow-[0_0_15px_-5px_currentColor]'
                                        : 'border-board-border opacity-40 grayscale-[0.5]'
                                        }`}
                                    style={{ color: p.color }}
                                >
                                    <span className="font-black text-[10px] md:text-xs uppercase whitespace-nowrap">
                                        {p.name}
                                        {scores.length > 0 && `: ${scores[i]}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={onReset}
                    className="p-3 rounded-2xl bg-cell-hover border border-board-border text-slate-400 hover:text-white hover:scale-110 active:scale-95 transition-all backdrop-blur-md shrink-0 shadow-lg"
                    title="Reiniciar Juego"
                >
                    <RotateCcw size={24} />
                </button>
            </header>

            {/* Main Layout: 3 Columnas (Equilibrado para pantallas grandes) */}
            <main className="w-full grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-8 items-start">

                {/* Columna 1: Vacía (Balance visual) o Info Extra en el futuro */}
                <aside className="hidden lg:block order-2 lg:order-1"></aside>

                {/* Columna 2: El Juego (Centro) */}
                <section className="flex flex-col items-center justify-center order-1 lg:order-2 w-full animate-in fade-in zoom-in duration-500">
                    {children}
                </section>

                {/* Columna 3: Reglas del Juego */}
                <aside className="order-3 w-full">
                    <GameRules rules={rules} />
                </aside>
            </main>
        </div>
    );
};

export default GameLayout;
