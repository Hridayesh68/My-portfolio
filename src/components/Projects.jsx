import { useRef, useEffect, useLayoutEffect } from 'react';
import { Github, ExternalLink } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';

gsap.registerPlugin(ScrollTrigger);

const ProjectCard = ({ project }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const onEnter = () => gsap.to(el, { scale: 1.05, boxShadow: "0px 0px 30px rgba(138, 43, 226, 0.4)", duration: 0.4, ease: 'power2.out' });
        const onLeave = () => gsap.to(el, { scale: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)", duration: 0.4, ease: 'power2.out' });
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
        return () => { el.removeEventListener('mouseenter', onEnter); el.removeEventListener('mouseleave', onLeave); };
    }, []);

    return (
        <div ref={cardRef} className="w-[85vw] md:w-[60vw] lg:w-[40vw] flex-shrink-0 h-[450px]" style={{ willChange: 'transform' }}>
            <Card className="h-full">
                {/* Default Content (Description + Tags) - Hidden on Hover */}
                <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center bg-transparent transition-opacity duration-300 opacity-100 group-hover:opacity-0 z-0">
                    <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg lg:text-xl font-medium">{project.description}</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {project.tags.map(tag => (
                            <span key={tag} className="px-4 py-1.5 bg-gray-100 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 text-sm font-medium rounded-full text-gray-700 dark:text-gray-200">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="mt-10 text-primary font-bold text-sm tracking-widest uppercase animate-bounce drop-shadow-lg">
                        Hover to Reveal
                    </div>
                </div>

                {/* Hover Content (Image + Name + Links) - Visible on Hover */}
                <div className="absolute inset-0 transition-all duration-500 opacity-0 group-hover:opacity-100 bg-white/95 dark:bg-neutral-900 z-10 rounded-xl overflow-hidden">
                    <div className="relative h-full w-full">
                        <img
                            src={project.image}
                            alt={project.name}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-110"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=' + project.name; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 dark:from-black/90 dark:via-black/40 to-transparent flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white drop-shadow-md">{project.name}</h3>
                            <div className="flex gap-4 mt-2">
                                <a href={project.repo} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-100 hover:bg-white dark:bg-white/20 dark:hover:bg-white/30 backdrop-blur-md text-gray-900 dark:text-white rounded-full transition-all hover:scale-110 border border-gray-200 dark:border-white/20 shadow-lg">
                                    <Github size={24} />
                                </a>
                                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-100 hover:bg-white dark:bg-white/20 dark:hover:bg-white/30 backdrop-blur-md text-gray-900 dark:text-white rounded-full transition-all hover:scale-110 border border-gray-200 dark:border-white/20 shadow-lg">
                                    <ExternalLink size={24} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const Projects = () => {
    const sectionRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const titleRef = useRef(null);

    const projects = [
        {
            id: 1,
            name: 'EV Analysis Dashboard',
            description: 'A full-featured analytics dashboard for EV data using PowerBI.',
            image: '/assets/projects/EV%20analysis%20dashboard.jpg',
            repo: 'https://github.com/Hridayesh68/EV-analysis-dashboard-power-bi',
            demo: 'https://app.powerbi.com/reportEmbed?reportId=c63f9256-abc8-41ed-9b1f-0e77f8575242&autoAuth=true&ctid=e14e73eb-5251-4388-8d67-8f9f2e2d5a46',
            tags: ['PowerBI', 'Data Analysis']
        },
        {
            id: 2,
            name: 'Placement Prediction',
            description: 'ML model to predict student placement chances with high accuracy.',
            image: '/assets/projects/placement_prediction.jpg',
            repo: 'https://github.com/Hridayesh68/Placement-prediction-app',
            demo: 'https://placement-prediction-app-mg6jqjlvvnkpwkuxk27nw8.streamlit.app/',
            tags: ['Python', 'ML', 'Streamlit']
        },
        {
            id: 3,
            name: 'Resume Analyzer',
            description: 'Smart tool to parse and analyze resumes against job descriptions.',
            image: '/assets/projects/resume_analyzer.jpg',
            repo: 'https://github.com/Hridayesh68',
            demo: 'https://resume-analyzer-three-beige.vercel.app/',
            tags: ['NLP', 'React', 'Python']
        }
    ];

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Title reveal
            gsap.from(titleRef.current, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                }
            });

            // Card stagger entrance
            gsap.from('.project-card-wrapper', {
                y: 100,
                opacity: 0,
                stagger: 0.15,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="projects" ref={sectionRef} className="py-24 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 mb-16 relative z-10">
                <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Works</span>
                </h2>
                <div className="w-20 h-1.5 bg-primary mt-6 rounded-full"></div>
            </div>

            {/* Horizontal Scroll Track */}
            <div className="relative z-10 w-full mb-12">
                <div ref={scrollContainerRef} className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory hide-scroll-bar gap-8 px-4 md:px-16 pb-8" style={{ scrollBehavior: 'smooth' }}>
                    {projects.map((project) => (
                        <div key={project.id} className="project-card-wrapper snap-center shrink-0">
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Background elements to maintain glass look visually */}
            <div className="absolute inset-0 bg-transparent pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-1/4 -right-64 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
            </div>
        </section>
    );
};

export default Projects;
