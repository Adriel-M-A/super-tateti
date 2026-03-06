import { Trophy, RefreshCcw, Settings, Users } from 'lucide-react';
import IconRenderer from './IconRenderer';
import { useGame } from '../../contexts/GameContext';

const GameResult = ({ winners, isDraw, onReplay, onSetup }) => {
    const { scores = {} } = useGame();

    return (
        <div className="flex flex-col items-center justify-center p-4 animate-in zoom-in duration-500 w-full max-w-lg mx-auto">
            <div className="w-full flex flex-col items-center gap-6 p-6 relative text-center">

                {isDraw ? (
                    <Users size={70} className="text-slate-400 animate-pulse" />
                ) : (
                    <Trophy size={70} className="text-yellow-500 animate-bounce" />
                )}

                <div className="space-y-1">
                    <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-page-text">
                        {isDraw ? '¡Empate!' : '¡Victoria!'}
                    </h3>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                        {isDraw
                            ? 'Nadie cedió terreno en esta batalla'
                            : winners.length > 1
                                ? 'Múltiples maestros dominan el tablero'
                                : `${winners[0].name} es el líder indiscutido`
                        }
                    </p>
                </div>

                {/* Winner Card(s) */}
                <div className="flex flex-wrap justify-center gap-6 w-full mt-2">
                    {winners.map((player) => {
                        const score = Array.isArray(scores)
                            ? scores[winners.findIndex(w => w.id === player.id)] // Esto es un poco frágil si scores es array
                            : scores[player.id];

                        return (
                            <div
                                key={player.id}
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div
                                    className="relative transition-transform group-hover:scale-110"
                                    style={{ color: player.color }}
                                >
                                    <IconRenderer
                                        iconName={player.icon}
                                        size={44}
                                        strokeWidth={3}
                                    />
                                    {score !== undefined && score !== null && (
                                        <div className="absolute -top-3 -right-3 bg-page-text text-page-bg w-7 h-7 rounded-full flex items-center justify-center font-black text-[10px] border-2 border-page-bg shadow-sm">
                                            {score}
                                        </div>
                                    )}
                                </div>
                                <span className="font-black uppercase tracking-tighter text-[10px] text-page-text/60">
                                    {player.name}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap justify-center gap-3 w-full mt-4">
                    <button
                        onClick={onReplay}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-page-text text-page-bg font-black text-xs rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md uppercase group"
                    >
                        <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                        Revancha
                    </button>
                    <button
                        onClick={onSetup}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-page-text/5 text-page-text font-black text-xs rounded-xl hover:scale-105 active:scale-95 transition-all uppercase border border-page-text/10 group"
                    >
                        <Settings size={14} className="group-hover:rotate-90 transition-transform duration-500" />
                        Ajustes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameResult;
