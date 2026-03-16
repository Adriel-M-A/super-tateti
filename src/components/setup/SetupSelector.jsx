import React from "react";

/**
 * Componente genérico para selectores en las pantallas de configuración.
 * Soporta selección de botones únicos o una cuadrícula de opciones.
 */
import SetupCard from './SetupCard';

const SetupSelector = ({
  icon: Icon,
  title,
  options = [],
  value,
  onChange,
  type = 'buttons', // 'buttons' | 'range'
  min = 0,
  max = 10,
  enabled,
  onToggle,
  className = '',
  iconContainerClassName = '',
}) => {
  return (
    <SetupCard className={className}>
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className={iconContainerClassName}>
              <Icon className="text-blue-500" size={16} />
            </div>
          )}
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {title}
          </h3>
        </div>

        {type === 'range' &&
          typeof enabled === 'boolean' &&
          typeof onToggle === 'function' && (
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span>Activo</span>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => onToggle(e.target.checked)}
                className="h-4 w-4 accent-page-text"
              />
            </label>
          )}
      </div>

      {type === 'buttons' ? (
        <div className="flex gap-1.5">
          {options.map((option) => {
            const isSelected = value === option;
            return (
              <button
                key={option}
                onClick={() => onChange(option)}
                className={`flex-1 py-2.5 rounded-xl font-black text-sm transition-all ${
                  isSelected
                    ? 'bg-page-text text-page-bg scale-105 shadow-lg z-10'
                    : 'bg-page-text/5 hover:bg-page-text/10 text-slate-500'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="flex-1 accent-page-text h-1.5 bg-page-text/10 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xl font-black w-12 text-center text-page-text">
            {value === 0 ? 'OFF' : value}
          </span>
        </div>
      )}
    </SetupCard>
  );
};

export default SetupSelector;
