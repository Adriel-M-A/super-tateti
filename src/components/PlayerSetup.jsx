import { useState } from 'react';
import { X, Circle, Triangle, Square, Hexagon } from 'lucide-react';

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
];

const PlayerSetup = ({ onComplete }) => {
    const [p1, setP1] = useState({ icon: ICON_OPTIONS[0].id, color: COLOR_OPTIONS[0].hex });
    const [p2, setP2] = useState({ icon: ICON_OPTIONS[1].id, color: COLOR_OPTIONS[1].hex });

    const handleStart = () => {
        onComplete({ P1: p1, P2: p2 });
    };

    const renderSelector = (player, setPlayer, otherPlayer, label) => (
        <div className="flex flex-col gap-6 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-center">{label}</h3>

            <div>
                <p className="text-sm font-bold text-slate-500 uppercase mb-3 text-center">Simbolo</p>
                <div className="flex justify-center gap-3">
                    {ICON_OPTIONS.map(({ id, Icon }) => {
                        const isSelected = player.icon === id;
                        const isTaken = otherPlayer.icon === id;
                        return (
                            <button
                                key={id}
                                disabled={isTaken}
                                onClick={() => setPlayer({ ...player, icon: id })}
                                className={`p-3 rounded-xl transition-all ${isSelected ? 'bg-white/20 scale-110 shadow-lg' : 'hover:bg-white/10'
                                    } ${isTaken ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                <Icon size={32} color={isSelected ? player.color : 'currentColor'} strokeWidth={3} />
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <p className="text-sm font-bold text-slate-500 uppercase mb-3 text-center">Color</p>
                <div className="flex justify-center gap-3">
                    {COLOR_OPTIONS.map(({ id, bg, hex }) => {
                        const isSelected = player.color === hex;
                        const isTaken = otherPlayer.color === hex;
                        return (
                            <button
                                key={id}
                                disabled={isTaken}
                                onClick={() => setPlayer({ ...player, color: hex })}
                                className={`w-10 h-10 rounded-full transition-all ${bg} ${isSelected ? 'ring-4 ring-white scale-110 shadow-lg' : 'opacity-60 hover:opacity-100'
                                    } ${isTaken ? 'hidden' : 'block cursor-pointer'}`}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col items-center gap-12 w-full max-w-4xl animate-in fade-in zoom-in duration-500">
            <div className="grid md:grid-cols-2 gap-8 w-full">
                {renderSelector(p1, setP1, p2, "Jugador 1")}
                {renderSelector(p2, setP2, p1, "Jugador 2")}
            </div>

            <button
                onClick={handleStart}
                className="px-12 py-4 bg-white text-slate-950 font-black text-xl rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] uppercase"
            >
                Comenzar Batalla
            </button>
        </div>
    );
};

export default PlayerSetup;
