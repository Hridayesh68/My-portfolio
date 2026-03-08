import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Palette, Home, Code2, Briefcase, Award, Folder, Mail } from 'lucide-react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

const Navbar = ({ theme, setTheme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
    const themeMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
                setIsThemeMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const themes = [
        { id: 'dark', name: 'Dark Theme' },
        { id: 'neon-pink', name: 'Neon Pink' },
        { id: 'matrix', name: 'Matrix' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        gsap.to(window, { duration: 1, scrollTo: id, ease: "power2.out" });
        setIsOpen(false);
    };

    const navLinks = [
        { name: 'Home', id: '#hero', icon: Home },
        { name: 'Tech Stack', id: '#tech-stack', icon: Code2 },
        { name: 'Experience', id: '#experience', icon: Briefcase },
        { name: 'Achievements', id: '#achievements', icon: Award },
        { name: 'Projects', id: '#projects', icon: Folder },
        { name: 'Contact', id: '#contact', icon: Mail },
    ];

    return (
        <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 cursor-pointer" onClick={() => scrollToSection('#hero')}>
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Hridayesh
                        </span>
                    </div>

                    {/* Top Right Controls (Theme & CV) */}
                    <div className="flex items-center space-x-4">
                        <div className="relative" ref={themeMenuRef}>
                            <button
                                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                                className="flex items-center justify-center p-2 md:px-4 md:py-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 font-medium gap-2"
                            >
                                <Palette size={18} />
                                <span className="hidden md:inline">Theme</span>
                                <ChevronDown size={16} className={`hidden md:block transition-transform duration-200 ${isThemeMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isThemeMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden py-1 z-50">
                                    {themes.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => {
                                                setTheme(t.id);
                                                setIsThemeMenuOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${theme === t.id ? 'text-primary font-medium bg-primary/5' : 'text-gray-700 dark:text-gray-300'}`}
                                        >
                                            {t.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <a
                            href="/GeneralCV-Hridayesh.pdf"
                            download="GeneralCV-Hridayesh.pdf"
                            className="hidden md:flex px-4 py-2 bg-primary text-white rounded-full hover:bg-secondary transition-colors shadow-md items-center"
                        >
                            Download CV
                        </a>
                    </div>
                </div>
            </div>

            {/* Global Bottom Navigation Bar / Floating Dock */}
            <div className="fixed bottom-0 left-0 w-full md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-auto md:rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 md:border md:border-gray-200 md:dark:border-gray-800 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)] md:shadow-2xl">
                <div className="flex justify-around md:justify-center items-center h-16 px-2 md:px-8 md:gap-8">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <button
                                key={link.name}
                                onClick={() => scrollToSection(link.id)}
                                className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors gap-1"
                            >
                                <Icon size={20} />
                                <span className="text-[10px] font-medium mt-1 md:hidden">{link.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
