import { BookOpen, ChevronRight } from 'lucide-react';

const GameRules = ({ rules = [] }) => {
    if (!rules || rules.length === 0) return null;

    return (
        <div className="w-full flex flex-col gap-6 animate-in slide-in-from-right duration-700">
            {/* Header del Panel */}
            <div className="flex items-center gap-3 px-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                    <BookOpen size={18} strokeWidth={2.5} />
                </div>
                <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-page-text/80">
                        Reglas del Juego
                    </h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 opacity-60">
                        Guía rápida
                    </p>
                </div>
            </div>

            {/* Lista de Reglas */}
            <ul className="space-y-3">
                {rules.map((rule, idx) => (
                    <li
                        key={idx}
                        className="group flex gap-4 p-4 rounded-3xl bg-cell-hover/30 border border-board-border/10 hover:border-blue-500/30 transition-all duration-300 hover:bg-cell-hover/50"
                    >
                        <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 font-black text-[10px] border border-blue-500/20 group-hover:scale-110 transition-transform">
                            {idx + 1}
                        </span>
                        <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed group-hover:text-page-text/90 transition-colors">
                            {rule}
                        </p>
                    </li>
                ))}
            </ul>

            {/* Footer sutil */}
            <div className="mt-2 px-2 flex items-center justify-between opacity-40">
                <div className="h-px flex-1 bg-linear-to-r from-blue-500/20 to-transparent"></div>
                <div className="flex items-center gap-1 mx-4 text-[9px] font-black uppercase text-blue-500 tracking-tighter italic">
                    ¡Buena batalla! <ChevronRight size={10} />
                </div>
            </div>
        </div>
    );
};

export default GameRules;
