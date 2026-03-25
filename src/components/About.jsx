import { useLayoutEffect, useRef, memo } from 'react';
import { Mail, Github, Linkedin, User, Code, Sparkles, GraduationCap } from 'lucide-react';
import Card from './ui/Card';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = memo(() => {
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.about-reveal', {
                y: 50,
                opacity: 0,
                stagger: 0.2,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const skills = ['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Three.js', 'GSAP', 'Framer Motion'];
    const interests = ['3D Web Development', 'Game Design', 'UI/UX Design', 'Open Source', 'Competitive Programming'];

    const education = [
        {
            institution: (
                <>
                    Lovely Professional University <span className="text-emerald-400 font-extrabold ml-1 bg-emerald-400/10 px-1.5 py-0.5 rounded">CGPA: 7.5</span>
                </>
            ),
            location: "Punjab, India",
            degree: "Bachelor of technology – Computer Science and Engineering",
            date: "Aug’ 23 - Present"
        },
        {
            institution: "Kendriya Vidyalaya, CoochBehar",
            location: "Cooch Behar, West Bengal",
            degree: "Intermediate; Percentage: 72%",
            date: "April 2020 - March 2022"
        },
        {
            institution: "Kendriya Vidyalaya, CoochBehar",
            location: "Cooch Behar, West Bengal",
            degree: "Matriculation; Percentage: 95%",
            date: "April 2018 - March 2020"
        }
    ];

    return (
        <section id="about" ref={sectionRef} className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 relative z-10">

                <div className="flex flex-col items-center mb-16 about-reveal">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--text)]" style={{ fontFamily: 'var(--font-accent)' }}>
                        About Me
                    </h2>
                    <p className="text-[var(--text-muted)] mt-4 text-center max-w-2xl" style={{ fontFamily: 'var(--font-ui)' }}>
                        A glimpse into who I am and what drives me.
                    </p>
                </div>

                <div className="about-reveal">
                    <Card className="w-full">
                        <div className="p-8 md:p-12 bg-[var(--bg-surface)]/50 backdrop-blur-md flex flex-col xl:flex-row gap-12 items-center xl:items-start">

                            {/* Profile Image & Quick Links */}
                            <div className="w-full xl:w-1/3 flex flex-col items-center shrink-0">
                                <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden border-4 border-[var(--border)] shadow-xl mb-6">
                                    <img
                                        src="/assets/hridayesh-pic.jpeg"
                                        alt="Hridayesh"
                                        onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Hridayesh&size=256&background=646cff&color=fff' }}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold text-[var(--text)] text-center">Hridayesh</h3>
                                <p className="text-primary font-medium text-center mb-6">Software Developer</p>

                                <div className="flex gap-4 border-t border-[var(--border)] pt-6 w-full justify-center">
                                    <a href="https://github.com/Hridayesh68" target="_blank" rel="noreferrer" className="p-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl hover:bg-[var(--primary)] hover:text-[var(--bg-surface)] text-[var(--text-muted)] transition-colors">
                                        <Github size={20} />
                                    </a>
                                    <a href="https://www.linkedin.com/in/hridayesh-debsarma/" target="_blank" rel="noreferrer" className="p-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl hover:bg-[var(--primary)] hover:text-[var(--bg-surface)] text-[var(--text-muted)] transition-colors">
                                        <Linkedin size={20} />
                                    </a>
                                    <a href="mailto:hridayeshdebsarm6@gmail.com" className="p-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl hover:bg-[var(--primary)] hover:text-[var(--bg-surface)] text-[var(--text-muted)] transition-colors">
                                        <Mail size={20} />
                                    </a>
                                </div>
                            </div>

                            {/* Bio & Details */}
                            <div className="w-full xl:w-2/3 space-y-8">
                                <div>
                                    <div className="text-[var(--text-muted)] space-y-4 leading-relaxed" style={{ fontFamily: 'var(--font-ui)' }}>
                                        <ul className="list-disc list-inside space-y-3">
                                            <li><strong className="text-[var(--text)]" style={{ fontFamily: 'var(--font-accent)' }}>CS Undergrad:</strong> Student at Lovely Professional University with a passion for building practical, impact-driven software. Currently maintaining a CGPA of 7.5.</li>
                                            <li><strong className="text-[var(--text)]">Full-Stack & ML:</strong> Building AI-powered web apps, interactive Power BI dashboards, and ML inference pipelines from scratch.</li>
                                            <li><strong className="text-[var(--text)]">Algorithm Enthusiast:</strong> Solved 200+ coding problems across LeetCode, CodeChef, and HackerRank to sharpen core engineering foundations.</li>
                                            <li><strong className="text-[var(--text)]">Always Exploring:</strong> Currently diving into generative AI workflows and always open to ambitious collaborations.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {/* Skills */}
                                    <div>
                                        <h4 className="text-xl font-bold mb-4 text-[var(--text)] flex items-center gap-2">
                                            <Code size={20} className="text-primary" /> Technical Skills
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map(skill => (
                                                <span key={skill} className="px-3 py-1.5 bg-primary/10 text-primary rounded-md text-sm font-medium border border-primary/20">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Interests */}
                                    <div>
                                        <h4 className="text-xl font-bold mb-4 text-[var(--text)] flex items-center gap-2">
                                            <Sparkles size={20} className="text-primary" /> Interests
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {interests.map(interest => (
                                                <span key={interest} className="px-3 py-1.5 bg-[var(--bg-surface)] text-[var(--text-muted)] rounded-md text-sm font-medium border border-[var(--border)]">
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Education */}
                                <div className="mt-8 pt-8 border-t border-[var(--border)]">
                                    <h4 className="text-xl font-bold mb-6 text-[var(--text)] flex items-center gap-2">
                                        <GraduationCap size={20} className="text-primary" /> Education
                                    </h4>
                                    <div className="space-y-6">
                                        {education.map((edu, i) => (
                                            <div key={i} className="relative pl-6 border-l-2 border-primary/30">
                                                <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 ring-4 ring-white dark:ring-neutral-900"></div>
                                                <h5 className="font-bold text-[var(--text)] text-lg">{edu.degree}</h5>
                                                <p className="text-primary font-medium">{edu.institution}</p>
                                                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-[var(--text-muted)]">
                                                    <span>{edu.date}</span>
                                                    <span className="opacity-50">•</span>
                                                    <span>{edu.location}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>


                        </div>

                        {/* Contact Info Footer */}
                        <div className="bg-[var(--bg-surface)] border-t border-[var(--border)] p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Mail size={24} />
                                </div>
                                <div className="text-center sm:text-left">
                                    <h4 className="text-lg font-bold text-[var(--text)]">Let&apos;s Connect</h4>
                                    <a href="mailto:hridayeshdebsarm6@gmail.com" className="text-[var(--text-muted)] hover:text-primary transition-colors">
                                        hridayeshdebsarm6@gmail.com
                                    </a>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <a href="https://github.com/Hridayesh68" target="_blank" rel="noreferrer" className="p-3 bg-transparent/10 rounded-xl hover:bg-[var(--primary)] hover:text-[var(--bg-surface)] text-[var(--text-muted)] transition-colors shadow-sm">
                                    <Github size={20} />
                                </a>
                                <a href="https://www.linkedin.com/in/hridayesh-debsarma/" target="_blank" rel="noreferrer" className="p-3 bg-transparent/10 rounded-xl hover:bg-[var(--primary)] hover:text-[var(--bg-surface)] text-[var(--text-muted)] transition-colors shadow-sm">
                                    <Linkedin size={20} />
                                </a>
                            </div>
                        </div>
                        <div className="p-4 text-center border-t border-[var(--border)] opacity-50">
                            <p className="text-xs text-[var(--text-muted)]">
                                Designed and developed by <span className="text-primary font-semibold">Hridayesh</span>
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
});

export default About;
