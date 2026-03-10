import { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, Swords, RefreshCcw } from 'lucide-react';
import usePlayerSetup from '../../hooks/usePlayerSetup';
import useCompetitiveSetup from '../../hooks/useCompetitiveSetup';
import PlayerConfigRow from '../setup/PlayerConfigRow';
import SetupSelector from '../setup/SetupSelector';
import { ICON_OPTIONS, COLOR_OPTIONS } from '../../constants/playerConfig';

const FORMATS_2P = [
    { id: 'best-of-3', label: 'Mejor de 3', desc: 'Primero en ganar 2 partidas' },
    { id: 'best-of-5', label: 'Mejor de 5', desc: 'Primero en ganar 3 partidas' },
];
const FORMATS_NP = [
    { id: 'elimination', label: 'Eliminación', desc: 'Bracket por rondas' },
    { id: 'round-robin', label: 'Round-Robin', desc: 'Todos contra todos' },
];

const TournamentSection = ({ gameType, onTournamentChange }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [numPlayers, setNumPlayers] = useState(3);
    const [format, setFormat] = useState('elimination');
    const [drawResolution, setDrawResolution] = useState('replay');

    const { players, updatePlayer, getVisiblePlayers, getTakenResources } = usePlayerSetup(3, 6, null);
    const { competitiveMode, turnTime, competitiveSelectorProps } = useCompetitiveSetup(false, 0);
    // Orden shuffleado de jugadores (estable, solo se recalcula cuando cambian los jugadores o el formato)
    const shuffledPlayersRef = useRef([]);

    const activePlayers = getVisiblePlayers(numPlayers);
    const { takenIcons, takenColors } = getTakenResources(activePlayers);

    // Recalcular el shuffle cuando cambian las dependencias relevantes
    const stableChange = useCallback((config) => onTournamentChange(config), [onTournamentChange]);

    // Notificar al padre cuando cambia cualquier parte de la config
    useEffect(() => {
        if (!isEnabled) { stableChange(null); return; }
        // Shufflear jugadores solo para eliminación — el orden ya es aleatorio para los demás formatos
        const currentPlayers = players.slice(0, numPlayers);
        if (format === 'elimination') {
            shuffledPlayersRef.current = [...currentPlayers].sort(() => Math.random() - 0.5);
        } else {
            shuffledPlayersRef.current = currentPlayers;
        }
        stableChange({
            gameType,
            format,
            drawResolution,
            allPlayers: shuffledPlayersRef.current,
            competitiveMode,
            turnTime: competitiveMode ? turnTime : 0
        });
    }, [isEnabled, numPlayers, format, drawResolution, gameType, competitiveMode, turnTime, stableChange]);

    const handleToggle = () => setIsEnabled(v => !v);

    const handleNumPlayersChange = (n) => {
        // Auto-asignar icono/color único al nuevo jugador
        if (n > numPlayers) {
            const currentActive = getVisiblePlayers(numPlayers);
            const taken = getTakenResources(currentActive);
            const newPlayer = players[n - 1];
            const updates = {};
            if (taken.takenIcons.includes(newPlayer.icon)) {
                const free = ICON_OPTIONS.find(o => !taken.takenIcons.includes(o.id));
                if (free) updates.icon = free.id;
            }
            if (taken.takenColors.includes(newPlayer.color)) {
                const free = COLOR_OPTIONS.find(o => !taken.takenColors.includes(o.hex));
                if (free) updates.color = free.hex;
            }
            if (Object.keys(updates).length > 0) updatePlayer(n - 1, updates);
        }
        // Ajustar formato si cambia el grupo de jugadores
        const newFormats = n === 2 ? FORMATS_2P : FORMATS_NP;
        if (!newFormats.some(f => f.id === format)) setFormat(newFormats[0].id);
        setNumPlayers(n);
    };

    const formats = numPlayers === 2 ? FORMATS_2P : FORMATS_NP;
    const btnBase = 'p-3 rounded-xl text-left transition-all border text-xs font-black uppercase tracking-tight';
    const btnActive = 'border-yellow-500/60 bg-yellow-500/10 text-yellow-400';
    const btnInactive = 'border-board-border bg-page-text/5 text-slate-400 hover:text-page-text';

    return (
        <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isEnabled ? 'border-yellow-500/40 bg-yellow-500/5' : 'border-board-border bg-cell-hover'}`}>
            {/* Toggle header */}
            <button onClick={handleToggle} className="w-full flex items-center justify-between p-5 gap-4 text-left hover:bg-page-text/5 transition-colors">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl transition-colors ${isEnabled ? 'bg-yellow-500/20 text-yellow-400' : 'bg-page-text/10 text-slate-400'}`}>
                        <Trophy size={18} />
                    </div>
                    <div>
                        <p className="font-black uppercase tracking-tighter text-sm text-page-text">Modo Torneo</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            {isEnabled ? 'Activo · ' + (formats.find(f => f.id === format)?.label ?? format) : 'Desactivado'}
                        </p>
                    </div>
                </div>
                {/* Toggle switch */}
                <div className={`w-11 h-6 rounded-full transition-all duration-300 relative shrink-0 ${isEnabled ? 'bg-yellow-500' : 'bg-page-text/20'}`}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${isEnabled ? 'left-5' : 'left-0.5'}`} />
                </div>
            </button>

            {/* Panel expandible */}
            {isEnabled && (
                <div className="flex flex-col gap-5 px-5 pb-5 animate-in slide-in-from-top duration-300">
                    <div className="h-px bg-board-border" />

                    {/* Nº de jugadores */}
                    <div className="flex flex-col gap-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic opacity-70">Jugadores</p>
                        <div className="flex gap-2 flex-wrap">
                            {[2, 3, 4, 5, 6].map(n => (
                                <button key={n} onClick={() => handleNumPlayersChange(n)}
                                    className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${numPlayers === n ? 'bg-yellow-500 text-black scale-110 shadow-lg' : 'bg-page-text/10 hover:bg-page-text/20 text-page-text'}`}>
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Formato */}
                    <div className="flex flex-col gap-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic opacity-70">Formato</p>
                        <div className="grid grid-cols-2 gap-2">
                            {formats.map(f => (
                                <button key={f.id} onClick={() => setFormat(f.id)}
                                    className={`${btnBase} ${format === f.id ? btnActive : btnInactive}`}>
                                    <p className="font-black text-xs uppercase tracking-tight">{f.label}</p>
                                    <p className="text-[9px] opacity-60 mt-0.5 normal-case font-normal">{f.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Resolución de empate — solo eliminación directa */}
                    {format === 'elimination' && (
                        <div className="flex flex-col gap-2">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic opacity-70">En caso de empate</p>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { id: 'replay', label: 'Re-jugar', Icon: RefreshCcw },
                                    { id: 'random', label: 'Aleatorio', Icon: Swords },
                                ].map(({ id, label, Icon }) => (
                                    <button key={id} onClick={() => setDrawResolution(id)}
                                        className={`flex items-center gap-2 ${btnBase} ${drawResolution === id ? btnActive : btnInactive}`}>
                                        <Icon size={13} />
                                        <span>{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Modo Competitivo (temporizador por turno) */}
                    <div className="flex flex-col gap-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic opacity-70">Tiempo por turno</p>
                        <SetupSelector {...competitiveSelectorProps} />
                    </div>

                    {/* Jugadores del torneo */}
                    <div className="flex flex-col gap-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic opacity-70">
                            Jugadores del torneo
                        </p>
                        <div className="flex flex-col gap-3 overflow-y-auto max-h-96 pr-1">
                            {activePlayers.map((player, idx) => (
                                <PlayerConfigRow
                                    key={player.id}
                                    index={idx}
                                    player={player}
                                    onUpdate={(updates) => updatePlayer(idx, updates)}
                                    takenIcons={takenIcons}
                                    takenColors={takenColors}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TournamentSection;
