import React from 'react';
import { X, Circle, Triangle, Square, Hexagon, User } from 'lucide-react';

const ICON_MAP = { X, Circle, Triangle, Square, Hexagon };

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

const PlayerConfigRow = ({
    index,
    player,
    onUpdate,
    takenIcons = [],
    takenColors = []
}) => {
    return (
        <div className="w-full flex flex-col md:flex-row items-center gap-4 md:gap-8 p-4 md:p-6 bg-cell-hover border border-board-border rounded-2xl md:rounded-3xl hover:bg-page-text/5 transition-all group animate-in slide-in-from-right duration-300" style={{ animationDelay: `${index * 50}ms` }}>

            {/* Cabecera del Jugador (Icono actual + Nombre) */}
            <div className="flex items-center gap-4 w-full md:w-32 shrink-0">
                <div
                    className="w-12 h-12 flex items-center justify-center transition-all"
                    style={{ color: player.color }}
                >
                    {ICON_MAP[player.icon] ?
                        React.createElement(ICON_MAP[player.icon], { size: 40, strokeWidth: 3 }) :
                        <User size={40} />
                    }
                </div>
                <h4 className="font-black uppercase italic tracking-tighter text-sm md:text-base whitespace-nowrap" style={{ color: player.color }}>
                    {player.name || `Jugador ${index + 1}`}
                </h4>
            </div>

            {/* Separador vertical (solo desktop) */}
            <div className="hidden md:block w-px h-12 bg-board-border"></div>

            {/* Selector de Iconos */}
            <div className="flex-1 flex flex-col items-center md:items-start gap-2 w-full">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic opacity-50">Símbolo</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {ICON_OPTIONS.map(({ id, Icon }) => {
                        const isSelected = player.icon === id;
                        const isTaken = takenIcons.includes(id) && !isSelected;
                        return (
                            <button
                                key={id}
                                disabled={isTaken}
                                onClick={() => onUpdate({ icon: id })}
                                className={`
                                    p-2 rounded-lg transition-all
                                    ${isSelected ? 'bg-page-text/10 ring-2 ring-page-text/20 scale-110 shadow-md' : 'opacity-30 hover:opacity-100 grayscale-[0.8] hover:grayscale-0'}
                                    ${isTaken ? 'opacity-10 grayscale cursor-not-allowed scale-90' : 'cursor-pointer'}
                                `}
                            >
                                <Icon size={20} color={isSelected ? player.color : 'currentColor'} strokeWidth={3} />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selector de Colores */}
            <div className="flex-1 flex flex-col items-center md:items-start gap-2 w-full">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic opacity-50">Color</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {COLOR_OPTIONS.map(({ id, hex, bg }) => {
                        const isSelected = player.color === hex;
                        const isTaken = takenColors.includes(hex) && !isSelected;
                        return (
                            <button
                                key={id}
                                disabled={isTaken}
                                onClick={() => onUpdate({ color: hex })}
                                className={`
                                    w-7 h-7 rounded-full transition-all border-4 border-transparent
                                    ${bg}
                                    ${isSelected ? 'scale-125 ring-2 ring-page-text shadow-xl' : 'opacity-40 hover:opacity-100 hover:scale-110'}
                                    ${isTaken ? 'opacity-10 scale-90 cursor-not-allowed grayscale' : 'cursor-pointer'}
                                `}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PlayerConfigRow;
export { ICON_OPTIONS, COLOR_OPTIONS };
