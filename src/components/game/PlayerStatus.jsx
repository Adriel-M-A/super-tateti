import { Users } from 'lucide-react';
import IconRenderer from './IconRenderer';

const PlayerStatus = ({ players = [], currentPlayerIndex, scores = [], gameStatus = 'playing' }) => {
    if (players.length === 0) return null;

    return (
        <div className="w-full flex flex-col gap-6 animate-in slide-in-from-left duration-700 overflow-visible">
            {/* Header del Panel (Estilo unificado con reglas) */}
            <div className="flex items-center gap-3 px-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                    <Users size={18} strokeWidth={2.5} />
                </div>
                <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-page-text/80">
                        Estado de Jugadores
                    </h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 opacity-60">
                        Puntuación y turnos
                    </p>
                </div>
            </div>

            {/* Lista de Jugadores */}
            <div className="flex flex-col gap-3">
                {players.map((player, idx) => {
                    const isCurrent = idx === currentPlayerIndex && gameStatus === 'playing';
                    const score = scores[idx] !== undefined ? scores[idx] : null;

                    return (
                        <div
                            key={player.id || idx}
                            className={`relative flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-500 border ${isCurrent
                                ? 'bg-page-text/5 border-page-text/20 scale-[1.03] shadow-[0_15px_35px_-10px_rgba(0,0,0,0.3)] z-10'
                                : 'bg-cell-hover/10 border-transparent opacity-40 grayscale-[0.8] scale-100 hover:opacity-60'
                                }`}
                            style={{
                                borderColor: isCurrent ? `${player.color}40` : 'transparent',
                                boxShadow: isCurrent ? `0 12px 30px -10px ${player.color}25` : 'none'
                            }}
                        >
                            {/* Icono del Jugador */}
                            <div
                                className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-700 ${isCurrent ? 'bg-page-bg shadow-inner scale-110 rotate-3' : 'bg-page-text/5'
                                    }`}
                                style={{ color: player.color }}
                            >
                                <IconRenderer
                                    iconName={player.icon}
                                    size={isCurrent ? 24 : 18}
                                    strokeWidth={isCurrent ? 3 : 2}
                                />
                            </div>

                            {/* Info del Jugador */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className={`font-black uppercase tracking-tighter truncate ${isCurrent ? 'text-sm text-page-text' : 'text-[11px] text-slate-500'
                                        }`}>
                                        {player.name}
                                    </span>
                                    {isCurrent && (
                                        <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                                    )}
                                </div>

                                {isCurrent && (
                                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-500/50 italic leading-none">
                                        En combate
                                    </span>
                                )}
                            </div>

                            {/* Puntuación */}
                            {score !== null && (
                                <div className={`shrink-0 px-2.5 py-1 rounded-xl font-black text-sm tabular-nums transition-all ${isCurrent ? 'bg-page-text/10 text-page-text' : 'bg-transparent text-slate-600'
                                    }`}>
                                    {score}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PlayerStatus;
