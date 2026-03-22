import { useRef, useEffect, useLayoutEffect, memo } from 'react';
import { Github, ExternalLink } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';

gsap.registerPlugin(ScrollTrigger);

const ProjectCard = memo(({ project }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const onEnter = () => gsap.to(el, { scale: 1.03, boxShadow: "0px 0px 30px rgba(138, 43, 226, 0.4)", duration: 0.4, ease: 'power2.out' });
        const onLeave = () => gsap.to(el, { scale: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)", duration: 0.4, ease: 'power2.out' });
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
        return () => { el.removeEventListener('mouseenter', onEnter); el.removeEventListener('mouseleave', onLeave); };
    }, []);

    return (
        <div ref={cardRef} className="w-[85vw] md:w-[60vw] lg:w-[40vw] flex-shrink-0 h-[450px] group" style={{ willChange: 'transform' }}>
            <div className="relative h-full w-full rounded-xl overflow-hidden cursor-pointer bg-[var(--bg-surface)]/60 backdrop-blur-md border border-[var(--border)] shadow-lg">

                {/* ── Default: Project Image ── */}
                <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0">
                    <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=' + project.name; }}
                    />
                    {/* Always-visible project name at bottom when not hovering */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10">
                        <h3 className="text-2xl font-bold text-[var(--text)] drop-shadow-md">{project.name}</h3>
                    </div>
                </div>

                {/* ── Hover Overlay: Info Panel ── */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 bg-[var(--bg-surface)]/90 backdrop-blur-md
                    opacity-0 group-hover:opacity-100
                    transition-all duration-500 ease-out z-20">

                    <h3 className="text-3xl font-bold text-[var(--text)] mb-6 drop-shadow-md">{project.name}</h3>

                    {/* Description */}
                    <p className="text-gray-300 text-lg font-medium mb-6 leading-relaxed max-w-sm">
                        {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 justify-center mb-8">
                        {project.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--border)] text-sm font-medium rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <a
                            href={project.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--bg-elevated)] hover:bg-[var(--bg-surface)] text-[var(--text)] rounded-full transition-all hover:scale-105 border border-[var(--border-glow)] text-sm font-semibold"
                        >
                            <Github size={18} /> Code
                        </a>
                        <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hi text-[var(--text)] rounded-full transition-all hover:scale-105 shadow-lg text-sm font-semibold"
                        >
                            <ExternalLink size={18} /> Live Demo
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
});

const Projects = memo(() => {
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
        },
        {
            id: 4,
            name: 'Flight Route Optimizer',
            description: 'Interactive tool calculates optimal flight paths based on distance and price using Dijkstra\'s algorithm.',
            image: '/assets/projects/flight route optimizer.png',
            repo: 'https://github.com/Hridayesh68/Flight-Optimizer-DSA',
            demo: 'https://flight-route-optimizer-ten.vercel.app/',
            tags: ['React', 'Algorithms', 'Leaflet']
        },
        {
            id: 5,
            name: 'Organizo',
            description: 'Modern task management app featuring a clean UI for organizing daily workflows and team collaborations.',
            image: 'public/assets/projects/organizo.png',
            repo: 'https://github.com/Hridayesh68/Taskmanagement-web-app',
            demo: 'https://taskmanagement-web-app.vercel.app/',
            tags: ['React', 'Tailwind CSS', 'Productivity']
        }
    ];

    useLayoutEffect(() => {
        let animation;
        const ctx = gsap.context(() => {
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

            // Continuous rolling marquee animation
            animation = gsap.to('.marquee-track', {
                xPercent: -50, // scroll half of the track (which is duplicated)
                ease: 'none',
                duration: 15, // halved duration to double the speed
                repeat: -1
            });
        }, sectionRef);

        const container = scrollContainerRef.current;
        const handleEnter = () => animation?.pause();
        const handleLeave = () => animation?.play();

        if (container) {
            container.addEventListener('mouseenter', handleEnter);
            container.addEventListener('mouseleave', handleLeave);
        }

        return () => {
            if (container) {
                container.removeEventListener('mouseenter', handleEnter);
                container.removeEventListener('mouseleave', handleLeave);
            }
            ctx.revert();
        };
    }, []);

    // Duplicate projects to create a seamless infinite loop
    const doubledProjects = [...projects, ...projects];

    return (
        <section id="projects" ref={sectionRef} className="py-24 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 mb-16 relative z-10">
                <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-[var(--text)] tracking-tight">
                    Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Works</span>
                </h2>
                <div className="w-20 h-1.5 bg-primary mt-6 rounded-full" />
            </div>

            {/* Continuous Marquee Track */}
            <div className="relative z-10 w-full mb-12">
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-hidden group/track"
                >
                    <div className="marquee-track flex gap-8 px-4 w-max shrink-0">
                        {doubledProjects.map((project, index) => (
                            <div key={`${project.id}-${index}`} className="project-card-wrapper shrink-0">
                                <ProjectCard project={project} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Background blobs */}
            <div className="absolute inset-0 bg-transparent pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-1/4 -right-64 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
            </div>
        </section>
    );
});

export default Projects;