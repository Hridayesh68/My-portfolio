import { useState, useRef, useEffect } from 'react';
import { Github, ExternalLink, Box, Layout } from 'lucide-react';
import gsap from 'gsap';

const ProjectCard = ({ project, index }) => {
    return (
        <div
            className={`group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${index === 0 ? 'md:col-span-2' : ''}`}
        >
            <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-800 ${index === 0 ? 'h-64 md:h-80' : 'h-48'}`}>
                <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=' + project.name; }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <a href={project.repo} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-black rounded-full hover:bg-primary hover:text-white transition-colors"><Github size={20} /></a>
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-black rounded-full hover:bg-primary hover:text-white transition-colors"><ExternalLink size={20} /></a>
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-medium rounded-full text-gray-600 dark:text-gray-300">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ModelCard = ({ model }) => {
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
            className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative h-64 bg-gray-800 cursor-pointer overflow-hidden group">
                <img
                    src={getFrameSrc()}
                    alt={model.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=' + model.name; }}
                />
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-xs">
                    {model.frames ? 'Hover to Animate' : 'Hover to Interact'}
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{model.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{model.description}</p>
            </div>
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
        <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800/50">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">My Work</h2>

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
                        <ModelCard key={model.id} model={model} />
                    ))}

                </div>
            </div>
        </section>
    );
};

export default Projects;
