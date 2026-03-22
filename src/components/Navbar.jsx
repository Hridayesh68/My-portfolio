import { useState, useEffect, useRef } from 'react';
import { Palette, Home, Code2, Briefcase, Award, Folder, Mail, User, ChevronRight, Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

const Navbar = ({ theme, setTheme }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
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
        { id: 'dark', name: 'Dark' },
        { id: 'neon-pink', name: 'Neon' },
        { id: 'matrix', name: 'Matrix' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 150);
            setIsOpen(false);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setIsOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const scrollToSection = (id) => {
        gsap.to(window, { duration: 1, scrollTo: id, ease: "power2.out" });
    };

    const navLinks = [
        { name: 'Home', id: '#hero', icon: Home },
        { name: 'Tech', id: '#tech-stack', icon: Code2 },
        { name: 'Exp', id: '#experience', icon: Briefcase },
        { name: 'Awards', id: '#achievements', icon: Award },
        { name: 'Work', id: '#projects', icon: Folder },
        { name: 'About', id: '#about', icon: User },
    ];

    return (
        <div className="fixed inset-0 pointer-events-none z-[60]">
            {/* Dynamic Dock Container */}
            <div
                className={`pointer-events-auto fixed transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] 
                ${scrolled
                        ? `right-4 top-1/2 -translate-y-1/2 flex-col rounded-2xl md:right-8 ${isMinimized ? 'hidden md:flex md:w-12 md:h-12 overflow-hidden' : `w-16 ${isOpen ? 'h-auto py-4' : 'h-16 md:h-auto'}`}`
                        : `bottom-6 right-4 flex-row rounded-full h-16 md:bottom-8 md:right-8 ${isOpen ? 'flex-wrap justify-center h-auto py-2 w-[90%] max-w-[20rem] right-1/2 translate-x-1/2 md:right-8 md:translate-x-0 md:w-auto' : 'w-16 md:w-auto md:px-2'}`
                    } 
                bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border)] shadow-2xl flex items-center justify-around md:justify-center p-2 md:gap-4`}
            >
                {/* Mobile Hamburger Button */}
                {!isMinimized && (
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden flex items-center justify-center p-3 text-[var(--text-muted)] hover:text-[var(--primary)] transition-all hover:scale-110"
                        title="Menu"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                )}

                {/* Minimize/Expand Toggle (Side state only) */}
                {scrolled && (
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="hidden md:flex p-3 text-[var(--text-muted)] hover:text-[var(--primary)] transition-all hover:scale-110 mb-2"
                        title={isMinimized ? "Expand" : "Minimize"}
                    >
                        <ChevronRight
                            size={20}
                            className={`transition-transform duration-500 ${isMinimized ? 'rotate-180' : 'rotate-0'}`}
                        />
                    </button>
                )}

                {!isMinimized && (
                    <>
                        {/* Nav Links */}
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <button
                                    key={link.name}
                                    onClick={() => { scrollToSection(link.id); setIsOpen(false); }}
                                    className={`${isOpen ? 'flex' : 'hidden'} md:flex group relative items-center justify-center p-3 text-[var(--text-muted)] hover:text-[var(--primary)] transition-all hover:scale-110 active:scale-95`}
                                    title={link.name}
                                >
                                    <Icon size={20} className="relative z-10" />
                                    {/* Tooltip for side state */}
                                    {scrolled && (
                                        <span className="absolute right-full mr-4 px-2 py-1 rounded bg-[var(--bg-elevated)] text-[var(--text)] text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                            {link.name}
                                        </span>
                                    )}
                                </button>
                            );
                        })}

                        {/* Divider (only in side state) */}
                        {scrolled && <div className="w-8 h-[1px] bg-[var(--border)] my-2" />}

                        {/* Theme Toggle */}
                        <div className="relative" ref={themeMenuRef}>
                            <button
                                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                                className="p-3 text-[var(--text-muted)] hover:text-[var(--primary)] transition-all hover:scale-110"
                                title="Theme"
                            >
                                <Palette size={20} />
                            </button>

                            {isThemeMenuOpen && (
                                <div className={`absolute ${scrolled ? 'bottom-0 right-full mr-4' : 'bottom-full left-1/2 -translate-x-1/2 mb-4'} w-32 bg-[var(--bg-elevated)] rounded-xl shadow-2xl border border-[var(--border)] py-1 overflow-hidden transition-all duration-300`}>
                                    {themes.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => {
                                                setTheme(t.id);
                                                setIsThemeMenuOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-xs transition-colors hover:bg-primary/10 ${theme === t.id ? 'text-primary font-bold bg-primary/5' : 'text-[var(--text-muted)]'}`}
                                        >
                                            {t.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Contact Button */}
                        <button
                            onClick={() => { scrollToSection('#contact'); setIsOpen(false); }}
                            className={`${isOpen ? 'block' : 'hidden'} md:block p-3 text-[var(--text)] bg-[var(--bg-surface)] border border-[var(--border)] rounded-full hover:bg-[var(--bg-elevated)] hover:border-[var(--border-glow)] transition-all hover:scale-110 shadow-lg ${scrolled ? 'mt-0 md:mt-2' : ''}`}
                            title="Contact Me"
                        >
                            <Mail size={20} />
                        </button>
                    </>
                )}
            </div>

            {/* Logo/Name (Visible only when not scrolled or integrated into dock?) 
                User said "remove navbar completely", so I'll keep it minimalist.
            */}
        </div>
    );
};

export default Navbar;
