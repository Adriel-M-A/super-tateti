import React from 'react';
import { ArrowLeft, Swords } from 'lucide-react';

const SetupLayout = ({
    children,
    gameTitle,
    onBack,
    onStart,
    isStartDisabled = false,
    startLabel = "Comenzar Batalla"
}) => {
    return (
        <div className="w-full max-w-5xl flex flex-col items-center min-h-[80vh] animate-in fade-in zoom-in duration-500">
            {/* Header de Configuración */}
            <header className="w-full flex justify-between items-center mb-12 border-b border-board-border pb-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all hover:-translate-x-1"
                >
                    <ArrowLeft size={18} /> Volver al Home
                </button>

                <div className="text-right">
                    <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-page-text">
                        Configuración
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500/50">
                        {gameTitle}
                    </p>
                </div>
            </header>

            {/* Contenido Principal (Selectores) */}
            <main className="w-full flex-1">
                {children}
            </main>

            {/* Footer con Botón de Acción */}
            <footer className="w-full flex justify-center mt-12 pt-8 border-t border-board-border/30">
                <button
                    onClick={onStart}
                    disabled={isStartDisabled}
                    className={`
                        group relative flex items-center gap-4 px-12 py-5 rounded-2xl font-black text-2xl uppercase tracking-tighter transition-all shadow-2xl
                        ${isStartDisabled
                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                            : 'bg-page-text text-page-bg hover:scale-105 active:scale-95 hover:shadow-blue-500/20'
                        }
                    `}
                >
                    <Swords className={`transition-transform duration-500 ${isStartDisabled ? '' : 'group-hover:rotate-12'}`} size={28} />
                    {startLabel}
                </button>
            </footer>
        </div>
    );
};

export default SetupLayout;
