import { useState } from 'react';
import { Users, LayoutGrid, Hash, Swords } from 'lucide-react';
import SetupLayout from '../layout/SetupLayout';
import PlayerConfigRow, { COLOR_OPTIONS, ICON_OPTIONS } from './PlayerConfigRow';

const ExtendedTaTeTiSetup = ({ onComplete }) => {
    const [numPlayers, setNumPlayers] = useState(2);
    const [rows, setRows] = useState(7);
    const [cols, setCols] = useState(7);
    const [winCondition, setWinCondition] = useState(4);

    const [players, setPlayers] = useState([
        { id: 'P1', name: 'Jugador 1', icon: ICON_OPTIONS[0].id, color: COLOR_OPTIONS[0].hex },
        { id: 'P2', name: 'Jugador 2', icon: ICON_OPTIONS[1].id, color: COLOR_OPTIONS[1].hex },
        { id: 'P3', name: 'Jugador 3', icon: ICON_OPTIONS[2].id, color: COLOR_OPTIONS[2].hex },
        { id: 'P4', name: 'Jugador 4', icon: ICON_OPTIONS[3].id, color: COLOR_OPTIONS[3].hex },
        { id: 'P5', name: 'Jugador 5', icon: ICON_OPTIONS[4].id, color: COLOR_OPTIONS[4].hex },
    ]);

    const updatePlayer = (index, updates) => {
        const newPlayers = [...players];
        newPlayers[index] = { ...newPlayers[index], ...updates };
        setPlayers(newPlayers);
    };

    const handleStart = () => {
        onComplete({
            players: players.slice(0, numPlayers),
            rows,
            cols,
            winCondition
        });
    };

    const activePlayers = players.slice(0, numPlayers);
    const takenIcons = activePlayers.map(p => p.icon);
    const takenColors = activePlayers.map(p => p.color);

    return (
        <SetupLayout
            gameTitle="Ta-Te-Ti Extendido"
            onBack={() => window.location.reload()}
            onStart={handleStart}
        >
            <div className="space-y-8 w-full max-w-4xl mx-auto pb-10">
                {/* Configuración del Tablero y Reglas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Jugadores */}
                    <div className="p-4 bg-cell-hover border border-board-border rounded-3xl">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="text-blue-500" size={16} />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Jugadores</h3>
                        </div>
                        <div className="flex gap-1.5">
                            {[2, 3, 4, 5].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setNumPlayers(num)}
                                    className={`flex-1 py-2 rounded-xl font-black transition-all ${numPlayers === num
                                        ? 'bg-page-text text-page-bg scale-105 shadow-lg'
                                        : 'bg-page-text/5 hover:bg-page-text/10 text-slate-500'}`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filas */}
                    <div className="p-4 bg-cell-hover border border-board-border rounded-3xl">
                        <div className="flex items-center gap-2 mb-4">
                            <Hash className="text-blue-500" size={16} />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filas</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="range" min="5" max="15" value={rows}
                                onChange={(e) => setRows(parseInt(e.target.value))}
                                className="flex-1 accent-page-text"
                            />
                            <span className="text-xl font-black w-8 text-center">{rows}</span>
                        </div>
                    </div>

                    {/* Columnas */}
                    <div className="p-4 bg-cell-hover border border-board-border rounded-3xl">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="rotate-90"><Hash className="text-blue-500" size={16} /></div>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Columnas</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="range" min="5" max="15" value={cols}
                                onChange={(e) => setCols(parseInt(e.target.value))}
                                className="flex-1 accent-page-text"
                            />
                            <span className="text-xl font-black w-8 text-center">{cols}</span>
                        </div>
                    </div>

                    {/* Condición de Victoria */}
                    <div className="p-4 bg-cell-hover border border-board-border rounded-3xl">
                        <div className="flex items-center gap-2 mb-4">
                            <Swords className="text-blue-500" size={16} />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">En Línea</h3>
                        </div>
                        <div className="flex gap-1.5">
                            {[3, 4, 5].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setWinCondition(num)}
                                    className={`flex-1 py-2 rounded-xl font-black transition-all ${winCondition === num
                                        ? 'bg-page-text text-page-bg scale-105 shadow-lg'
                                        : 'bg-page-text/5 hover:bg-page-text/10 text-slate-500'}`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Jugadores */}
                <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
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
        </SetupLayout>
    );
};

export default ExtendedTaTeTiSetup;
