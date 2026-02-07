import { useState, useRef, useEffect } from 'react';
import { Github, ExternalLink, Box, Layout } from 'lucide-react';
import gsap from 'gsap';

import Card from './ui/Card'; // Import the new Card component

const ProjectCard = ({ project, index }) => {
    return (
        <Card className="h-[350px]">
            {/* Default Content (Description + Tags) - Hidden on Hover */}
            <div className="absolute inset-0 p-6 flex flex-col justify-center items-center text-center bg-transparent transition-opacity duration-300 opacity-100 group-hover:opacity-0 pointer-events-none group-hover:pointer-events-none z-0">
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">{project.description}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                    {project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 text-xs font-medium rounded-full text-gray-600 dark:text-gray-300">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="mt-8 text-primary font-medium text-sm animate-bounce">
                    Hover to Reveal
                </div>
            </div>

            {/* Hover Content (Image + Name + Links) - Visible on Hover */}
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-white/95 dark:bg-neutral-900 z-10">
                <div className="relative h-full w-full">
                    <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=' + project.name; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 dark:from-black/90 dark:via-black/50 to-transparent flex flex-col justify-end p-6">
                        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{project.name}</h3>
                        <div className="flex gap-4 mt-2">
                            <a href={project.repo} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm text-gray-900 dark:text-white rounded-full transition-all hover:scale-110 border border-gray-200 dark:border-white/10">
                                <Github size={20} />
                            </a>
                            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm text-gray-900 dark:text-white rounded-full transition-all hover:scale-110 border border-gray-200 dark:border-white/10">
                                <ExternalLink size={20} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const ModelCard = ({ model, className }) => {
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isHovered && model.frames) {
            intervalRef.current = setInterval(() => {
                setCurrentFrame(prev => (prev + 1) % model.frames);
            }, 100); // 10fps
        } else {
            clearInterval(intervalRef.current);
            setCurrentFrame(0);
        }
        return () => clearInterval(intervalRef.current);
    }, [isHovered, model.frames]);

    const getFrameSrc = () => {
        if (!model.sequencePath) return model.image;
        // Construct filename: 0000.png, 0001.png etc.
        const frameNum = currentFrame.toString().padStart(4, '0');
        return `${model.sequencePath}/${frameNum}.png`;
    };

    return (
        <div
            className={`h-full ${className || ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card className="h-full">
                <div className="relative h-full w-full flex flex-col">
                    <div className={`relative flex-grow bg-transparent overflow-hidden group`}>
                        <img
                            src={getFrameSrc()}
                            alt={model.name}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=' + model.name; }}
                        />
                        {model.frames && (
                            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity border border-white/10">
                                Hover to Animate
                            </div>
                        )}
                    </div>
                    <div className="p-6 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800">
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{model.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{model.description}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const Projects = () => {
    const [activeTab, setActiveTab] = useState('projects');
    const containerRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

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

    const models = [
        {
            id: 101,
            name: 'Pirate Ship',
            description: 'Animated sequence of a pirate ship model.',
            image: '/assets/3d%20models/pirate%20ship/0000.png',
            sequencePath: '/assets/3d%20models/pirate%20ship',
            frames: 36,
        },
        {
            id: 1,
            name: 'Glass & Perfume',
            description: 'Photorealistic render study.',
            image: '/assets/3d%20models/glass%20and%20perfume%20render.png',
        },
        {
            id: 2,
            name: 'Handgun',
            description: 'Game ready asset.',
            image: '/assets/3d%20models/handgun.png',
        },
        {
            id: 3,
            name: 'Low Poly World',
            description: 'Stylized environment.',
            image: '/assets/3d%20models/low%20poly%20world.jpg',
        },
        {
            id: 4,
            name: 'Sports Car',
            description: 'Automotive visualization.',
            image: '/assets/3d%20models/sportscar.jpg',
        }
    ];

    useEffect(() => {
        // Animate content change
        if (containerRef.current) {
            gsap.fromTo(containerRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5 }
            );
        }
    }, [activeTab]);

    return (
        <section id="projects" className="py-20">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">My Work</h2>

                {/* Toggle Bar */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white dark:bg-gray-700 p-1 rounded-full shadow-md inline-flex">
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${activeTab === 'projects'
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                }`}
                        >
                            <Layout size={18} />
                            Web Projects
                        </button>
                        <button
                            onClick={() => setActiveTab('models')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${activeTab === 'models'
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                }`}
                        >
                            <Box size={18} />
                            3D Models
                        </button>
                    </div>
                </div>

                {/* Content Container */}
                <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {activeTab === 'projects' && projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}

                    {activeTab === 'models' && models.map((model) => (
                        <ModelCard
                            key={model.id}
                            model={model}
                            className={model.name === 'Pirate Ship' ? 'md:col-span-2 md:row-span-2 h-[500px]' : 'h-64'}
                        />
                    ))}

                </div>
            </div>
        </section>
    );
};

export default Projects;
