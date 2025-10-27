import React, { useState } from 'react';
import Header from '../components/Header';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Default behavior: open mail client if no backend is configured.
      // If you have a backend (Formspree/Netlify functions etc.) replace this with a POST request.
  const subject = encodeURIComponent(`Contact from ${name || 'Website'}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:support@bestiptvreseller.com?subject=${subject}&body=${body}`;
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
        {/* Hero */}
        <div className="relative bg-gradient-to-r from-gray-900 to-black py-28 pt-36 overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
              <p className="text-white/70 max-w-2xl mx-auto">Have a question or need help? Send us a message and we'll get back to you as soon as possible.</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <div className="bg-[#0B0B0B] border border-white/6 rounded-2xl p-8">
                <h2 className="text-2xl font-semibold mb-4">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <label className="block">
                    <span className="text-sm text-white/80">Name</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md bg-[#0B0B0B] border border-white/10 px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-600"
                      placeholder="Your name"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm text-white/80">Email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md bg-[#0B0B0B] border border-white/10 px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-600"
                      placeholder="you@example.com"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm text-white/80">Message</span>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={6}
                      className="mt-1 block w-full rounded-md bg-[#0B0B0B] border border-white/10 px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-600"
                      placeholder="How can we help you?"
                    />
                  </label>

                  <div className="flex items-center gap-4">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-white hover:bg-white/90 text-black px-4 py-2 rounded-md font-semibold border border-white/10"
                      disabled={status === 'sending'}
                    >
                      {status === 'sending' ? 'Sending...' : 'Send Message'}
                    </button>

                    {status === 'success' && <span className="text-sm text-green-400">Message client opened</span>}
                    {status === 'error' && <span className="text-sm text-red-400">Failed to send. Try again later.</span>}
                  </div>
                </form>
              </div>

              {/* Contact info */}
              <div className="flex flex-col justify-between">
                <div className="bg-[#0B0B0B] border border-white/6 rounded-2xl p-8 mb-6">
                  <h3 className="text-xl font-semibold mb-3">Contact information</h3>
                  <p className="text-white/70 mb-4">Prefer email? Reach us at <a href="mailto:support@bestiptvreseller.com" className="underline">support@bestiptvreseller.com</a></p>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm text-white/80">Support</h4>
                      <p className="text-white/70">support@bestiptvreseller.com</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-white/80">Sales</h4>
                      <p className="text-white/70">support@bestiptvreseller.com</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-white/80">Phone</h4>
                      <p className="text-white/70">+1 467 8475 847</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0B0B0B] border border-white/6 rounded-2xl p-6">
                  <h4 className="text-sm text-white/80 mb-2">Office</h4>
                  <p className="text-white/70">3125 Loving Acres Road<br/>Ft Worth, Texas 76135<br/>Phone: 817-236-1975</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default ContactPage;
