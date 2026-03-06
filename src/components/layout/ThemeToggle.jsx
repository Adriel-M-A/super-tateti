import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ isDarkMode, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className="fixed top-6 right-6 z-50 p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:scale-110 active:scale-95 transition-all backdrop-blur-md shadow-xl group overflow-hidden"
            title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
            <div className="relative w-6 h-6 flex items-center justify-center">
                <Sun
                    size={22}
                    className={`absolute transition-all duration-500 transform ${isDarkMode ? 'translate-y-10 opacity-0 rotate-90' : 'translate-y-0 opacity-100 rotate-0'
                        } text-yellow-400`}
                />
                <Moon
                    size={22}
                    className={`absolute transition-all duration-500 transform ${isDarkMode ? 'translate-y-0 opacity-100 rotate-0' : '-translate-y-10 opacity-0 -rotate-90'
                        } text-blue-400`}
                />
            </div>

            {/* Texto sutil al hover */}
            <span className="sr-only">Toggle Theme</span>
            <div className="absolute inset-0 bg-page-text/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
    );
};

export default ThemeToggle;
