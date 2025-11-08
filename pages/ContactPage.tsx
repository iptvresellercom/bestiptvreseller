import React, { useState } from 'react';
import Header from '../components/Header';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Default behavior: open mail client if no backend is configured.
      // If you have a backend (Formspree/Netlify functions etc.) replace this with a POST request.
      const emailSubject = encodeURIComponent(subject || `Contact from ${name || 'Website'}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`);
      window.location.href = `mailto:support@bestiptvreseller.com?subject=${emailSubject}&body=${body}`;
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      <main>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 py-32 pt-64 overflow-hidden -mt-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/30 to-transparent"></div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-0">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Contact Us
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Have a question or need help? Our IPTV reseller support team is here to assist you 24/7. 
                Send us a message and we'll get back to you as soon as possible.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
                <div className="flex items-center gap-2 bg-green-900/30 border border-green-500/50 rounded-full px-5 py-2 backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-400 text-sm font-semibold">24/7 Support Available</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-900/30 border border-blue-500/50 rounded-full px-5 py-2 backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-400 text-sm font-semibold">Expert IPTV Solutions</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-10 border border-gray-700/50 backdrop-blur-sm">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Send us a message
                </h2>
                <p className="text-gray-300 text-lg">
                  Get in touch with our IPTV reseller experts. We're here to help you succeed.
                </p>
        </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="block">
                  <span className="text-sm font-semibold text-white mb-2 block">Full Name</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    className="w-full bg-gray-900/80 border-2 border-gray-600/50 rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your full name"
                    />
                  </label>

                  <label className="block">
                  <span className="text-sm font-semibold text-white mb-2 block">Email Address</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    className="w-full bg-gray-900/80 border-2 border-gray-600/50 rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-300 backdrop-blur-sm"
                      placeholder="you@example.com"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-semibold text-white mb-2 block">Subject</span>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-gray-900/80 border-2 border-gray-600/50 rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-300 backdrop-blur-sm"
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Sales Question">Sales Question</option>
                    <option value="Partnership">Partnership</option>
                    <option value="WhatsApp Payment">WhatsApp Payment</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Other">Other</option>
                  </select>
                  </label>

                  <label className="block">
                  <span className="text-sm font-semibold text-white mb-2 block">Message</span>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    rows={5}
                    className="w-full bg-gray-900/80 border-2 border-gray-600/50 rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-300 backdrop-blur-sm resize-none"
                    placeholder="Tell us how we can help you with your IPTV reseller business..."
                    />
                  </label>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <button
                      type="submit"
                    className="bg-white text-black hover:bg-gray-100 font-bold py-3 px-6 rounded-lg text-base transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      disabled={status === 'sending'}
                    >
                    {status === 'sending' ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Send Message
                      </div>
                    )}
                    </button>

                  <div className="flex-1">
                    {status === 'success' && (
                      <div className="flex items-center gap-2 text-green-400 text-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Message client opened successfully!
                      </div>
                    )}
                    {status === 'error' && (
                      <div className="flex items-center gap-2 text-red-400 text-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Failed to send. Please try again later.
                      </div>
                    )}
                  </div>
                  </div>
                </form>
              </div>

            {/* Contact Information & Additional Sections */}
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-8 border border-gray-700/50 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Contact Information
                </h3>
                <p className="text-gray-300 mb-8 text-lg">
                  Prefer direct communication? Reach out to our IPTV reseller experts through any of these channels.
                </p>

                <div className="space-y-6">
                  <div className="group flex items-center gap-5 p-4 bg-gray-900/40 rounded-2xl hover:bg-gray-800/50 transition-all duration-300">
                    <div className="bg-white/20 p-4 rounded-xl group-hover:bg-white/30 transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Support Email</h4>
                      <p className="text-gray-400">support@bestiptvreseller.com</p>
                    </div>
                  </div>

                  <div className="group flex items-center gap-5 p-4 bg-gray-900/40 rounded-2xl hover:bg-gray-800/50 transition-all duration-300">
                    <div className="bg-white/20 p-4 rounded-xl group-hover:bg-white/30 transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Sales Email</h4>
                      <p className="text-gray-400">sales@bestiptvreseller.com</p>
                    </div>
                  </div>

                  <div className="group flex items-center gap-5 p-4 bg-gray-900/40 rounded-2xl hover:bg-gray-800/50 transition-all duration-300">
                    <div className="bg-white/20 p-4 rounded-xl group-hover:bg-white/30 transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Phone Support</h4>
                      <p className="text-gray-400">+1 (800) 123-4567</p>
                    </div>
                  </div>

                  <div className="group flex items-center gap-5 p-4 bg-gray-900/40 rounded-2xl hover:bg-gray-800/50 transition-all duration-300">
                    <div className="bg-white/20 p-4 rounded-xl group-hover:bg-white/30 transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Business Hours</h4>
                      <p className="text-gray-400">24/7 Support Available</p>
                    </div>
                    </div>
                  </div>
                </div>

              {/* Office Location */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-8 border border-gray-700/50 backdrop-blur-sm">
                <h4 className="text-xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Office Location</h4>
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-4 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      3125 Loving Acres Road<br/>
                      Ft Worth, Texas 76135<br/>
                      <span className="text-white font-semibold">Phone:</span> 817-236-1975
                    </p>
                    </div>
                  </div>
                </div>

            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Find quick answers to common questions about our IPTV reseller services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "How quickly can I get started as an IPTV reseller?",
                answer: "You can start your IPTV reseller business within 24 hours. Our setup process is streamlined and our support team will guide you through every step."
              },
              {
                question: "What kind of support do you provide?",
                answer: "We offer 24/7 technical support, marketing materials, training resources, and dedicated account managers to help you succeed."
              },
              {
                question: "How do I make payments?",
                answer: "We accept payments via WhatsApp. Simply contact us through WhatsApp and we'll provide you with payment instructions and process your order quickly."
              },
              {
                question: "Can I customize my reseller panel?",
                answer: "Yes! Our panels are fully customizable with your branding, pricing, and features. You can create a unique experience for your customers."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm group hover:border-white/30 transition-all duration-300">
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-gray-200 transition-colors duration-300">
                  {faq.question}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
