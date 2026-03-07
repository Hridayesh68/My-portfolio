import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Projects from './Projects';
import Certificates from './Certificates';
import Models from './Models';

gsap.registerPlugin(ScrollTrigger);

const Portfolio = () => {
    const [activeTab, setActiveTab] = useState('Certificates');
    const tabs = ['All', 'Certificates', 'Projects', '3D Models'];
    const containerRef = useRef(null);

    useEffect(() => {
        const handleTab = (e) => setActiveTab(e.detail);
        window.addEventListener('portfolioTab', handleTab);
        return () => window.removeEventListener('portfolioTab', handleTab);
    }, []);

    // Refresh ScrollTrigger when layout changes
    useLayoutEffect(() => {
        // Small delay to let components mount and DOM update before refreshing
        const timeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);
        return () => clearTimeout(timeout);
    }, [activeTab]);

    return (
        <div ref={containerRef} className="pt-24 pb-12 w-full">
            <div className="max-w-7xl mx-auto px-4 relative z-20 mb-12 flex flex-col items-center">
                <div className="flex flex-wrapjustify-center gap-2 md:gap-4 p-2 bg-gray-100 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === tab
                                ? 'bg-primary text-white shadow-md scale-105'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full min-h-[50vh]">
                {(activeTab === 'All' || activeTab === 'Certificates') && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <Certificates />
                    </div>
                )}

                {(activeTab === 'All' || activeTab === 'Projects') && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <Projects />
                    </div>
                )}

                {(activeTab === 'All' || activeTab === '3D Models') && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <Models />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Portfolio;
