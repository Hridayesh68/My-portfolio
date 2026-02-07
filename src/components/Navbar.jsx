import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

const Navbar = ({ theme, toggleTheme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

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
        { name: 'Home', id: '#hero' },
        { name: 'Tech Stack', id: '#tech-stack' },
        { name: 'Experience', id: '#experience' },
        { name: 'Achievements', id: '#achievements' },
        { name: 'Projects', id: '#projects' },
        { name: 'Contact', id: '#contact' },
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

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => scrollToSection(link.id)}
                                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium"
                            >
                                {link.name}
                            </button>
                        ))}

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <a
                            href="/GeneralCV-Hridayesh.pdf"
                            download="GeneralCV-Hridayesh.pdf"
                            className="px-4 py-2 bg-primary text-white rounded-full hover:bg-secondary transition-colors shadow-md flex items-center"
                        >
                            Download CV
                        </a>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 dark:text-gray-300">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 absolute w-full shadow-xl">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => scrollToSection(link.id)}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                {link.name}
                            </button>
                        ))}
                        <a
                            href="/GeneralCV-Hridayesh.pdf"
                            download="GeneralCV-Hridayesh.pdf"
                            className="w-full text-center mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary block"
                        >
                            Download CV
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
