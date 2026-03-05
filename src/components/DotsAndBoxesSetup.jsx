import { useState } from 'react';
import { Users, LayoutGrid } from 'lucide-react';
import SetupLayout from './SetupLayout';
import PlayerConfigRow, { COLOR_OPTIONS, ICON_OPTIONS } from './PlayerConfigRow';

const BOARD_SIZES = [
    { id: 5, label: '5x5' },
    { id: 7, label: '7x7' },
    { id: 9, label: '9x9' },
];

const DotsAndBoxesSetup = ({ onComplete }) => {
    const [numPlayers, setNumPlayers] = useState(2);
    const [boardSize, setBoardSize] = useState(5);
    const [players, setPlayers] = useState([
        { id: 0, icon: ICON_OPTIONS[0].id, color: COLOR_OPTIONS[0].hex, name: 'Jugador 1' },
        { id: 1, icon: ICON_OPTIONS[1].id, color: COLOR_OPTIONS[1].hex, name: 'Jugador 2' },
        { id: 2, icon: ICON_OPTIONS[2].id, color: COLOR_OPTIONS[2].hex, name: 'Jugador 3' },
        { id: 3, icon: ICON_OPTIONS[3].id, color: COLOR_OPTIONS[3].hex, name: 'Jugador 4' },
        { id: 4, icon: ICON_OPTIONS[4].id, color: COLOR_OPTIONS[4].hex, name: 'Jugador 5' },
    ]);

    const updatePlayer = (index, updates) => {
        const newPlayers = [...players];
        newPlayers[index] = { ...newPlayers[index], ...updates };
        setPlayers(newPlayers);
    };

    const handleStart = () => {
        onComplete({
            players: players.slice(0, numPlayers),
            boardSize,
        });
    };

    const activePlayers = players.slice(0, numPlayers);
    const takenIcons = activePlayers.map(p => p.icon);
    const takenColors = activePlayers.map(p => p.color);

    return (
        <SetupLayout
            gameTitle="Puntos y Cajas"
            onBack={() => window.location.reload()}
            onStart={handleStart}
        >
            <div className="space-y-8 w-full max-w-4xl mx-auto">
                {/* Opciones Superiores: Jugadores y Tamaño */}
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Cantidad de Jugadores */}
                    <div className="p-4 bg-cell-hover border border-board-border rounded-2xl md:rounded-3xl">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="text-blue-500" size={18} />
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Jugadores</h3>
                        </div>
                        <div className="flex gap-2">
                            {[2, 3, 4, 5].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setNumPlayers(num)}
                                    className={`flex-1 py-3 rounded-xl font-black text-lg transition-all ${numPlayers === num
                                        ? 'bg-page-text text-page-bg scale-105 shadow-lg'
                                        : 'bg-page-text/5 hover:bg-page-text/10 text-slate-500'
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tamaño del Tablero */}
                    <div className="p-4 bg-cell-hover border border-board-border rounded-2xl md:rounded-3xl">
                        <div className="flex items-center gap-2 mb-4">
                            <LayoutGrid className="text-blue-500" size={18} />
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Tablero</h3>
                        </div>
                        <div className="flex gap-2">
                            {BOARD_SIZES.map((size) => (
                                <button
                                    key={size.id}
                                    onClick={() => setBoardSize(size.id)}
                                    className={`flex-1 py-3 rounded-xl font-black text-lg transition-all ${boardSize === size.id
                                        ? 'bg-page-text text-page-bg scale-105 shadow-lg'
                                        : 'bg-page-text/5 hover:bg-page-text/10 text-slate-500'
                                        }`}
                                >
                                    {size.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Filas de Jugadores */}
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

export default DotsAndBoxesSetup;
