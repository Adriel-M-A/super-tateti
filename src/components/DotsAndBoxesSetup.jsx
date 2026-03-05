import { useState } from 'react';
import { X, Circle, Triangle, Square, Hexagon, Users, LayoutGrid, ChevronRight, ChevronLeft } from 'lucide-react';

const ICON_OPTIONS = [
    { id: 'X', Icon: X, label: 'Cruz' },
    { id: 'Circle', Icon: Circle, label: 'Círculo' },
    { id: 'Triangle', Icon: Triangle, label: 'Triángulo' },
    { id: 'Square', Icon: Square, label: 'Cuadrado' },
    { id: 'Hexagon', Icon: Hexagon, label: 'Hexágono' },
];

const COLOR_OPTIONS = [
    { id: 'blue', hex: '#3b82f6', label: 'Azul', bg: 'bg-blue-500' },
    { id: 'red', hex: '#ef4444', label: 'Rojo', bg: 'bg-red-500' },
    { id: 'green', hex: '#22c55e', label: 'Verde', bg: 'bg-green-500' },
    { id: 'yellow', hex: '#eab308', label: 'Amarillo', bg: 'bg-yellow-500' },
    { id: 'orange', hex: '#f97316', label: 'Naranja', bg: 'bg-orange-500' },
    { id: 'purple', hex: '#a855f7', label: 'Púrpura', bg: 'bg-purple-500' },
    { id: 'pink', hex: '#ec4899', label: 'Rosa', bg: 'bg-pink-500' },
];

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

    const handleNumPlayersChange = (num) => {
        setNumPlayers(num);
    };

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

    const IconRenderer = ({ iconName, ...props }) => {
        const icons = { X, Circle, Triangle, Square, Hexagon };
        const Icon = icons[iconName];
        return Icon ? <Icon {...props} /> : null;
    };

    return (
        <div className="flex flex-col items-center gap-10 w-full max-w-5xl animate-in fade-in zoom-in duration-500 pb-10">
            {/* Cabecera de Configuración */}
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">Configuración de Partida</h2>
                <div className="h-1 w-24 bg-blue-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 w-full">
                {/* Sección Izquierda: Jugadores y Tamaño */}
                <div className="space-y-6">
                    {/* Selector de Cantidad de Jugadores */}
                    <div className="p-6 bg-cell-hover border border-board-border rounded-3xl backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Users className="text-blue-500" size={24} />
                            <h3 className="text-xl font-black uppercase tracking-tight">Jugadores</h3>
                        </div>
                        <div className="flex gap-2">
                            {[2, 3, 4, 5].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => handleNumPlayersChange(num)}
                                    className={`flex-1 py-4 rounded-2xl font-black text-xl transition-all ${numPlayers === num
                                            ? 'bg-page-text text-page-bg scale-105 shadow-lg'
                                            : 'bg-cell-hover hover:bg-page-text/10 text-slate-500'
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Selector de Tamaño del Tablero */}
                    <div className="p-6 bg-cell-hover border border-board-border rounded-3xl backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <LayoutGrid className="text-blue-500" size={24} />
                            <h3 className="text-xl font-black uppercase tracking-tight">Tamaño del Tablero</h3>
                        </div>
                        <div className="flex gap-2">
                            {BOARD_SIZES.map((size) => (
                                <button
                                    key={size.id}
                                    onClick={() => setBoardSize(size.id)}
                                    className={`flex-1 py-4 rounded-2xl font-black text-xl transition-all ${boardSize === size.id
                                            ? 'bg-page-text text-page-bg scale-105 shadow-lg'
                                            : 'bg-cell-hover hover:bg-page-text/10 text-slate-500'
                                        }`}
                                >
                                    {size.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sección Derecha: Detalle de Jugadores */}
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {players.slice(0, numPlayers).map((player, idx) => (
                        <div key={player.id} className="p-6 bg-cell-hover border border-board-border rounded-3xl animate-in slide-in-from-right duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-lg font-black uppercase tracking-tighter" style={{ color: player.color }}>
                                    {player.name}
                                </h4>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Símbolo */}
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Símbolo</p>
                                    <div className="flex flex-wrap gap-2">
                                        {ICON_OPTIONS.map(({ id, Icon }) => {
                                            const isSelected = player.icon === id;
                                            const isTaken = players.slice(0, numPlayers).some(p => p.id !== player.id && p.icon === id);
                                            return (
                                                <button
                                                    key={id}
                                                    disabled={isTaken}
                                                    onClick={() => updatePlayer(idx, { icon: id })}
                                                    className={`p-2 rounded-lg transition-all ${isSelected ? 'bg-page-text/10 ring-2 ring-page-text/20' : 'hover:bg-page-text/5'
                                                        } ${isTaken ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}`}
                                                >
                                                    <Icon size={20} color={isSelected ? player.color : 'currentColor'} strokeWidth={3} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Color */}
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Color</p>
                                    <div className="flex flex-wrap gap-2">
                                        {COLOR_OPTIONS.map(({ id, bg, hex }) => {
                                            const isSelected = player.color === hex;
                                            const isTaken = players.slice(0, numPlayers).some(p => p.id !== player.id && p.color === hex);
                                            return (
                                                <button
                                                    key={id}
                                                    disabled={isTaken}
                                                    onClick={() => updatePlayer(idx, { color: hex })}
                                                    className={`w-6 h-6 rounded-full transition-all ${bg} ${isSelected ? 'ring-2 ring-page-text scale-110 shadow-lg' : 'opacity-40 hover:opacity-100'
                                                        } ${isTaken ? 'scale-0 opacity-0 pointer-events-none' : 'block cursor-pointer'}`}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={handleStart}
                className="group relative px-16 py-5 bg-page-text text-page-bg font-black text-2xl rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl uppercase tracking-tighter"
            >
                <span className="relative z-10 flex items-center gap-3">
                    Comenzar Partida
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </span>
            </button>
        </div>
    );
};

export default DotsAndBoxesSetup;
