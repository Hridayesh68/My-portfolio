import { useRef, useLayoutEffect, memo } from 'react';
import { ExternalLink } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';

gsap.registerPlugin(ScrollTrigger);

const certificates = [
    {
        id: 1,
        title: 'FreeCodeCamp',
        image: '/assets/certificates/freecode camp.png',
        link: 'https://drive.google.com/file/d/1Wkzg2AwOVRt4JTNFtVniQWA2KydSJK7T/view?usp=sharing'
    },
    {
        id: 2,
        title: 'Mastering DSA',
        image: '/assets/certificates/Mastering DSA.png',
        link: 'https://drive.google.com/file/d/19cUZg4e1Gd2sHRkSYMwDrRXpQoH8VZcG/view?usp=sharing'
    },
    {
        id: 3,
        title: 'Cloud Computing (NPTEL)',
        image: '/assets/certificates/Cloud_computing.png',
        link: 'https://drive.google.com/file/d/1_9oPMONZ7iU4BtZbqNoBeF0d69CfWVh0/view?usp=sharing'
    },
    {
        id: 4,
        title: 'MBA Certificate',
        image: '/assets/certificates/certificate mba.png',
        link: 'https://drive.google.com/file/d/1TFcQsbhKjdjcG_l7bREtfajAwh41_Itw/view?usp=sharing'
    }
];

const CertCard = memo(({ cert }) => {
    return (
        <a href={cert.link} target="_blank" rel="noopener noreferrer" className="group cursor-pointer h-full animate-float block" style={{ animationDelay: `${cert.id * 0.2}s` }}>
            <Card className="h-full border-2 border-transparent group-hover:border-primary/50 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_10px_30px_rgba(138,43,226,0.3)]">
                <div className="relative h-64 overflow-hidden rounded-t-xl bg-[var(--bg-surface)]/50">
                    <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                        onError={(e) => { e.target.src = `https://via.placeholder.com/400x300?text=${encodeURIComponent(cert.title)}`; }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-[var(--primary)]/20 p-3 rounded-full backdrop-blur-md text-[var(--text)] transform scale-50 group-hover:scale-100 transition-transform duration-300 delay-100">
                            <ExternalLink size={24} />
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-[var(--bg-surface)]">
                    <h3 className="text-xl font-bold mb-2 text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">{cert.title}</h3>
                </div>
            </Card>
        </a>
    );
});

const Certificates = memo(() => {
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from('.cert-header', {
                y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
            });
            gsap.from('.cert-card-item', {
                y: 60, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'back.out(1.2)',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="certificates" ref={sectionRef} className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 z-10 relative">

                <div className="cert-header text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--text)]">Certifications</h2>
                    <div className="w-16 h-1.5 bg-primary mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificates.map((cert) => (
                        <div key={cert.id} className="cert-card-item">
                            <CertCard cert={cert} />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
});

export default Certificates;
