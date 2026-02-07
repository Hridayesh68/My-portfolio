import Card from './ui/Card'; // Import Card component

const Contact = () => {
    return (
        <section id="contact" className="py-20 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Let's Connect</h2>
                    <p className="text-gray-400">Have a project in mind? I'd love to hear from you.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-12 items-start">

                    {/* Contact Info */}
                    <div className="flex-1 w-full space-y-8">
                        <Card>
                            <div className="p-8 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm relative z-10">
                                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Contact Info</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 flex items-center justify-center">
                                            <img src="/pngs/gmail-icon.png" alt="Gmail" className="w-8 h-8 object-contain" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email Me</p>
                                            <a href="mailto:contact@hridayesh.com" className="font-medium text-gray-900 dark:text-white hover:text-primary transition-colors">contact@hridayesh.com</a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 flex items-center justify-center">
                                            <img src="/pngs/linkedin-app-icon.png" alt="LinkedIn" className="w-8 h-8 object-contain" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">LinkedIn</p>
                                            <a href="#" className="font-medium text-gray-900 dark:text-white hover:text-primary transition-colors">/in/hridayesh</a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 flex items-center justify-center">
                                            <img src="/pngs/x-social-media-logo-icon.png" alt="X (Twitter)" className="w-8 h-8 object-contain" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Twitter</p>
                                            <a href="#" className="font-medium text-gray-900 dark:text-white hover:text-primary transition-colors">@hridayesh_dev</a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 flex items-center justify-center">
                                            <img src="/pngs/address-icon.png" alt="Location" className="w-8 h-8 object-contain" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Location</p>
                                            <span className="font-medium text-gray-900 dark:text-white">India</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <div className="flex-1 w-full">
                        <Card>
                            <form className="p-8 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm space-y-6 relative z-10">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                                    <textarea
                                        rows="4"
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                        placeholder="Tell me about your project..."
                                    ></textarea>
                                </div>
                                <button className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-secondary transition-colors shadow-md">
                                    Send Message
                                </button>
                            </form>
                        </Card>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Contact;
