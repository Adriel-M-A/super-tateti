import React from 'react';
import { ArrowLeft, RotateCcw, BookOpen } from 'lucide-react';

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
                <aside className="order-3 w-full animate-in slide-in-from-right duration-700 delay-300">
                    <div className="p-6 bg-cell-hover border border-board-border rounded-4xl backdrop-blur-sm shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <BookOpen size={48} />
                        </div>

                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                            <BookOpen size={14} className="text-blue-500" /> Reglas del Juego
                        </h3>

                        <ul className="space-y-4">
                            {rules.map((rule, idx) => (
                                <li key={idx} className="flex gap-3 text-xs md:text-sm">
                                    <span className="shrink-0 w-5 h-5 rounded-full bg-page-text/5 border border-board-border flex items-center justify-center font-black text-[10px] text-blue-500">
                                        {idx + 1}
                                    </span>
                                    <p className="text-slate-400 font-medium leading-relaxed">
                                        {rule}
                                    </p>
                                </li>
                            ))}
                        </ul>

                        {gameStatus === 'playing' && (
                            <div className="mt-8 pt-6 border-t border-board-border/30">
                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500/50 italic text-center">
                                    ¡Mucha suerte!
                                </p>
                            </div>
                        )}
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default GameLayout;
