import { useState, useRef, useLayoutEffect, memo } from 'react';
import emailjs from '@emailjs/browser';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';

gsap.registerPlugin(ScrollTrigger);

const Contact = memo(() => {
    const formRef = useRef(null);
    const sectionRef = useRef(null);
    const [status, setStatus] = useState('idle'); // idle | submitting | success | error

    // GSAP Scroll Reveal and Button Hover
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Section elements fade/slide in
            gsap.from('.contact-reveal', {
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

    const sendEmail = (e) => {
        e.preventDefault();
        setStatus('submitting');

        emailjs.sendForm(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            formRef.current,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )
            .then(() => {
                setStatus('success');
                formRef.current.reset();
                setTimeout(() => setStatus('idle'), 5000);
            })
            .catch((error) => {
                console.error("EmailJS Error:", error);
                setStatus('error');
                setTimeout(() => setStatus('idle'), 5000);
            });
    };

    return (
        <section id="contact" ref={sectionRef} className="py-20 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 z-10 relative">

                <div className="text-center mb-16 contact-reveal">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--text)]">Let&apos;s Connect</h2>
                    <p className="text-[var(--text-muted)]">Have a project in mind? I&apos;d love to hear from you.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-stretch max-w-5xl mx-auto">

                    {/* Contact Info */}
                    <div className="flex-1 w-full flex contact-reveal">
                        <Card className="w-full">
                            <div className="p-8 bg-[var(--bg-surface)] relative z-10 h-full flex flex-col justify-center">
                                <h3 className="text-2xl font-bold mb-8 text-[var(--text)]">Contact Info</h3>
                                <div className="space-y-8">
                                    <div className="flex items-center gap-5 group">
                                        <div className="w-12 h-12 flex items-center justify-center bg-[var(--bg-elevated)] rounded-xl group-hover:scale-110 transition-transform">
                                            <img src="/pngs/gmail-icon.png" alt="Gmail" className="w-6 h-6 object-contain" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-[var(--text-muted)]">Email Me</p>
                                            <a
                                                href="mailto:hridayeshdebsarm6@gmail.com"
                                                onClick={() => {
                                                    const emailInput = document.querySelector('form input[name="email"]');
                                                    if (emailInput) emailInput.focus();
                                                }}
                                                className="font-medium text-[var(--text)] hover:text-[var(--primary)] transition-colors"
                                            >
                                                hridayeshdebsarm6@gmail.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5 group">
                                        <div className="w-12 h-12 flex items-center justify-center bg-[var(--bg-elevated)] rounded-xl group-hover:scale-110 transition-transform">
                                            <img src="/pngs/linkedin-app-icon.png" alt="LinkedIn" className="w-6 h-6 object-contain filter dark:invert" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-[var(--text-muted)]">LinkedIn</p>
                                            <a href="https://www.linkedin.com/in/hridayesh-debsarma/" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--text)] hover:text-[var(--primary)] transition-colors">/in/hridayesh-debsarma</a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5 group">
                                        <div className="w-12 h-12 flex items-center justify-center bg-[var(--bg-elevated)] rounded-xl group-hover:scale-110 transition-transform">
                                            <img src="/pngs/address-icon.png" alt="Phone" className="w-6 h-6 object-contain" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-[var(--text-muted)]">Phone</p>
                                            <a href="tel:+919064048182" className="font-medium text-[var(--text)] hover:text-[var(--primary)] transition-colors">+91 9064048182</a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5 group">
                                        <div className="w-12 h-12 flex items-center justify-center bg-[var(--bg-elevated)] rounded-xl group-hover:scale-110 transition-transform">
                                            <img src="/pngs/address-icon.png" alt="Location" className="w-6 h-6 object-contain" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-[var(--text-muted)]">Location</p>
                                            <span className="font-medium text-[var(--text)]">India</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <div className="flex-[1.2] w-full flex contact-reveal">
                        <Card className="w-full">
                            <div className="p-8 bg-[var(--bg-surface)] relative z-10 h-full">
                                <form ref={formRef} onSubmit={sendEmail} className="space-y-6 h-full flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Name</label>
                                            <input
                                                name="name"
                                                type="text"
                                                required
                                                className="w-full px-4 py-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-[var(--text-dim)]"
                                                placeholder="Your Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Email</label>
                                            <input
                                                name="email"
                                                type="email"
                                                required
                                                className="w-full px-4 py-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-[var(--text-dim)]"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Message</label>
                                            <textarea
                                                name="message"
                                                rows="5"
                                                required
                                                className="w-full px-4 py-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none placeholder:text-[var(--text-dim)]"
                                                placeholder="Tell me about your project..."
                                            ></textarea>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'submitting'}
                                        className={`w-full py-4 font-bold rounded-lg transition-all shadow-md mt-6 flex justify-center items-center gap-2 group
                                            ${status === 'submitting' ? 'bg-indigo-400 cursor-wait text-[var(--bg-surface)]' :
                                                status === 'success' ? 'bg-emerald-500 text-[var(--bg-surface)]' :
                                                    status === 'error' ? 'bg-red-500 text-[var(--bg-surface)]' :
                                                        'bg-[var(--primary)] text-[var(--bg-surface)] hover:bg-[var(--primary-hi)] hover:shadow-lg hover:-translate-y-1'
                                            }`}
                                    >
                                        {status === 'idle' && (
                                            <>
                                                Send Message
                                                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                        {status === 'submitting' && (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Sending...
                                            </>
                                        )}
                                        {status === 'success' && (
                                            <>
                                                <CheckCircle2 size={18} />
                                                ✓ Message Sent
                                            </>
                                        )}
                                        {status === 'error' && (
                                            <>
                                                Failed to Send
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </Card>
                    </div>

                </div>
            </div>
        </section>
    );
});

export default Contact;
