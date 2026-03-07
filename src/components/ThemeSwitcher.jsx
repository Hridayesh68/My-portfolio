import { Sun, Moon, Sparkles } from 'lucide-react';

const ThemeSwitcher = ({ theme, toggleTheme }) => {
    return (
        <button
            onClick={toggleTheme}
            className="fixed top-6 right-6 z-[100] p-3 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border border-gray-200 dark:border-white/10 hover:scale-110 transition-all duration-300"
            aria-label="Toggle Theme"
        >
            {theme === 'light' && <Sun size={22} className="text-yellow-500" />}
            {theme === 'dark' && <Moon size={22} className="text-blue-400" />}
            {theme === 'neon' && <Sparkles size={22} className="text-fuchsia-500" />}
        </button>
    );
};

export default ThemeSwitcher;
