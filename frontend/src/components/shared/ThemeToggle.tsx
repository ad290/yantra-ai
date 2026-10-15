import { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(true);
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const theme = window.localStorage.getItem('theme');
        const dark = theme ? theme === 'dark' : true;
        document.documentElement.classList.toggle('dark', dark);
        setIsDark(dark);
    }, [isDark])

    const toggleTheme = () => {
        const newTheme = !isDark
        setIsDark(newTheme);
        document.documentElement.classList.toggle('dark', newTheme);
        window.localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    }
    return (
        <button onClick={toggleTheme}
            className="size-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/6 transition-colors duration-150 "
        >
            {isDark ? (
                <FiMoon size={18} />
            ) : (
                <FiSun size={18} />
            )}
        </button>
    )
}

export default ThemeToggle