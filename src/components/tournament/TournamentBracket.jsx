import { X, Trophy, Sword } from 'lucide-react';
import IconRenderer from '../game/IconRenderer';

// ────── Mejor de N ──────────────────────────────
const BestOfView = ({ tournament }) => {
    const { allPlayers, winsP1, winsP2, targetWins, matchHistory, isComplete, champion } = tournament;
    const p1 = allPlayers[0];
    const p2 = allPlayers[1];
    const played = matchHistory.filter(m => !m.isDraw).length;
    const maxGames = targetWins * 2 - 1;

    const pipFor = (playerIdx) => matchHistory
        .filter(m => !m.isDraw)
        .map(m => m.winner?.id === allPlayers[playerIdx].id);

    return (
        <div className="flex flex-col items-center gap-6 w-full">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                {isComplete ? '¡Torneo finalizado!' : `Partida ${played + 1} de máx. ${maxGames}`}
            </p>

            {/* Marcador */}
            <div className="flex items-center gap-6 w-full justify-center">
                {[p1, p2].map((p, idx) => {
                    const wins = idx === 0 ? winsP1 : winsP2;
                    const isChampion = champion?.id === p.id;
                    return (
                        <div key={p.id} className={`flex flex-col items-center gap-2 transition-all ${isComplete && !isChampion ? 'opacity-40' : ''}`}>
                            <div style={{ color: p.color }} className={`transition-all ${isChampion ? 'drop-shadow-[0_0_12px_currentColor] scale-110' : ''}`}>
                                <IconRenderer iconName={p.icon} size={44} strokeWidth={3} />
                            </div>
                            <span className="font-black text-xs uppercase tracking-tighter" style={{ color: p.color }}>{p.name}</span>
                            <span className="text-4xl font-black text-page-text">{wins}</span>
                            {isChampion && <Trophy size={16} className="text-yellow-400" />}
                        </div>
                    );
                })}
            </div>

            {/* Historial de partidas */}
            {matchHistory.length > 0 && (
                <div className="flex flex-col gap-2 w-full">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 text-center opacity-60">Historial</p>
                    <div className="flex gap-2 justify-center flex-wrap">
                        {matchHistory.map((m, i) => {
                            const label = m.isDraw ? '=' : (m.winner?.id === p1.id ? '1' : '2');
                            const color = m.isDraw ? 'text-slate-400 bg-page-text/10' : (m.winner?.id === p1.id ? 'text-white bg-blue-500/80' : 'text-white bg-red-500/80');
                            return (
                                <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${color}`}>
                                    {label}
                                </div>
                            );
                        })}
                        {Array.from({ length: Math.max(0, maxGames - matchHistory.length) }).map((_, i) => (
                            <div key={`empty-${i}`} className="w-8 h-8 rounded-lg border border-board-border" />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ────── Eliminación ─────────────────────────────
const EliminationView = ({ tournament }) => {
    const { rounds, currentRound, currentMatchInRound, isComplete, champion } = tournament;

    return (
        <div className="w-full flex gap-4 overflow-x-auto pb-2">
            {rounds.map((round, ri) => (
                <div key={ri} className="flex flex-col gap-3 shrink-0">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 text-center opacity-60">
                        {ri === rounds.length - 1 && rounds[ri].filter(m => !m.isBye).length === 1 ? 'Final' : `Ronda ${ri + 1}`}
                    </p>
                    <div className="flex flex-col justify-around h-full gap-4">
                        {round.map((match, mi) => {
                            const isCurrent = ri === currentRound && mi === currentMatchInRound && !isComplete;
                            if (match.isBye) return (
                                <div key={match.id} className="flex flex-col gap-1 w-36 opacity-50">
                                    <MatchPlayer player={match.p1} isWinner={true} small />
                                    <div className="text-[8px] text-center text-slate-500 uppercase tracking-wider font-bold">BYE</div>
                                </div>
                            );
                            return (
                                <div key={match.id} className={`flex flex-col gap-1 w-36 p-2 rounded-xl border transition-all ${isCurrent ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-board-border bg-cell-hover'}`}>
                                    <MatchPlayer player={match.p1} isWinner={match.winner?.id === match.p1?.id && !match.isDraw} small />
                                    <div className="h-px bg-board-border my-0.5" />
                                    <MatchPlayer player={match.p2} isWinner={match.winner?.id === match.p2?.id && !match.isDraw} small />
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
            {/* Campeón */}
            {isComplete && champion && (
                <div className="flex flex-col items-center justify-center gap-2 ml-2 shrink-0">
                    <Trophy size={22} className="text-yellow-400" />
                    <div style={{ color: champion.color }}>
                        <IconRenderer iconName={champion.icon} size={28} strokeWidth={3} />
                    </div>
                    <span className="text-[10px] font-black uppercase text-yellow-400">{champion.name}</span>
                </div>
            )}
        </div>
    );
};

const MatchPlayer = ({ player, isWinner, small }) => {
    if (!player) return <div className="h-6" />;
    return (
        <div className={`flex items-center gap-2 transition-all ${isWinner ? 'opacity-100' : player ? 'opacity-50' : 'opacity-20'}`}>
            <div style={{ color: player.color }} className={isWinner ? 'drop-shadow-[0_0_6px_currentColor]' : ''}>
                <IconRenderer iconName={player.icon} size={small ? 14 : 20} strokeWidth={3} />
            </div>
            <span className={`font-black uppercase tracking-tighter truncate max-w-[80px] ${small ? 'text-[9px]' : 'text-xs'}`} style={{ color: player.color }}>
                {player.name}
            </span>
            {isWinner && <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />}
        </div>
    );
};

// ────── Round-Robin ────────────────────────────
const RoundRobinView = ({ tournament }) => {
    const { allPlayers, standings, isComplete, champion } = tournament;
    const sorted = [...allPlayers].sort((a, b) => (standings[b.id]?.points ?? 0) - (standings[a.id]?.points ?? 0));

    return (
        <div className="w-full flex flex-col gap-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 text-center opacity-60">Posiciones</p>
            <div className="w-full rounded-xl overflow-hidden border border-board-border">
                {/* Header */}
                <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-2 px-3 py-2 bg-page-text/5 border-b border-board-border">
                    {['#', 'Jugador', 'G', 'E', 'P', 'Pts'].map(h => (
                        <span key={h} className="text-[9px] font-black uppercase tracking-widest text-slate-500 text-center">{h}</span>
                    ))}
                </div>
                {sorted.map((player, rank) => {
                    const s = standings[player.id] ?? { wins: 0, draws: 0, losses: 0, points: 0 };
                    const isLeader = champion?.id === player.id || (rank === 0 && !isComplete);
                    return (
                        <div key={player.id} className={`grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-2 px-3 py-2.5 items-center border-b border-board-border/40 transition-all ${isLeader ? 'bg-yellow-500/5' : rank % 2 === 0 ? 'bg-page-text/3' : ''}`}>
                            <span className="text-xs font-black text-slate-500 text-center w-4">{rank + 1}</span>
                            <div className="flex items-center gap-2 min-w-0">
                                <div style={{ color: player.color }}><IconRenderer iconName={player.icon} size={14} strokeWidth={3} /></div>
                                <span className="text-xs font-black uppercase tracking-tighter truncate" style={{ color: player.color }}>{player.name}</span>
                                {isLeader && isComplete && <Trophy size={10} className="text-yellow-400 shrink-0" />}
                            </div>
                            {[s.wins, s.draws, s.losses, s.points].map((v, i) => (
                                <span key={i} className={`text-xs font-black text-center ${i === 3 ? 'text-yellow-400' : 'text-page-text/70'}`}>{v}</span>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ────── Contenedor principal ─────────────────────
const TournamentBracket = ({ tournament, onClose }) => {
    if (!tournament) return null;
    const { format, isComplete, champion } = tournament;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-page-bg border border-board-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-board-border shrink-0">
                    <div className="flex items-center gap-3">
                        <Trophy size={20} className="text-yellow-400" />
                        <div>
                            <h3 className="font-black uppercase italic tracking-tighter text-page-text text-lg">Torneo</h3>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                                {format === 'best-of-3' ? 'Mejor de 3' : format === 'best-of-5' ? 'Mejor de 5' : format === 'elimination' ? 'Eliminación directa' : 'Round-Robin'}
                                {isComplete && ' · ¡Finalizado!'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-page-text/10 text-slate-400 hover:text-white transition-all">
                        <X size={18} />
                    </button>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto p-5">
                    {(format === 'best-of-3' || format === 'best-of-5') && <BestOfView tournament={tournament} />}
                    {format === 'elimination' && <EliminationView tournament={tournament} />}
                    {format === 'round-robin' && <RoundRobinView tournament={tournament} />}
                </div>

                {/* Footer campeón */}
                {isComplete && champion && (
                    <div className="shrink-0 border-t border-board-border px-5 py-4 flex items-center gap-3 bg-yellow-500/5">
                        <Trophy size={18} className="text-yellow-400" />
                        <div style={{ color: champion.color }}>
                            <IconRenderer iconName={champion.icon} size={20} strokeWidth={3} />
                        </div>
                        <span className="font-black uppercase tracking-tighter text-sm" style={{ color: champion.color }}>
                            {champion.name}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-400/70 ml-auto">Campeón 🏆</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TournamentBracket;
