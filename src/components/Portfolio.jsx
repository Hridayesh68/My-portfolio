import { useState, useRef, useLayoutEffect, useEffect, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Projects from './Projects';
import Certificates from './Certificates';
import Models from './Models';

gsap.registerPlugin(ScrollTrigger);

const Portfolio = memo(() => {
    const [activeTab, setActiveTab] = useState('All');
    const tabs = ['All', '3D Models', 'Projects', 'Certificates'];
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
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 p-2 bg-[var(--bg-surface)] backdrop-blur-md rounded-2xl border border-[var(--border)] shadow-lg">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === tab
                                ? 'bg-[var(--primary)] text-[var(--bg-surface)] shadow-md scale-105'
                                : 'text-[var(--text-muted)] hover:bg-[var(--bg-elevated)]'
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
});

export default Portfolio;
