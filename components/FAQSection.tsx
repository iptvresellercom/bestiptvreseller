import React, { useState } from 'react';

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is IPTV and how does it work?",
      answer: "IPTV (Internet Protocol Television) delivers television content using signals based on the logical Internet protocol, rather than through traditional terrestrial, satellite signal, or cable television formats. It allows you to stream live TV channels and on-demand content directly to your device over the internet."
    },
    {
      question: "Do I need special equipment for IPTV?",
      answer: "No special equipment is required. You can watch IPTV on various devices including Smart TVs, smartphones, tablets, computers, and streaming devices like Amazon Fire Stick or Apple TV. All you need is a stable internet connection."
    },
    {
      question: "What internet speed do I need for IPTV?",
      answer: "For standard definition (SD) content, you need at least 3 Mbps. For high definition (HD) content, we recommend 8-10 Mbps. For 4K Ultra HD content, you'll need 15-25 Mbps. A wired connection is always preferred over Wi-Fi for the best experience."
    },
    {
      question: "Can I use IPTV on multiple devices?",
      answer: "Yes, most IPTV services allow you to use your subscription on multiple devices. However, you may have limits on how many devices can stream simultaneously. Check your specific plan for details."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards including Visa, MasterCard, and American Express. We also support payments through PayPal and bank transfers. All transactions are secure and encrypted."
    },
    {
      question: "How do I get technical support?",
      answer: "Our support team is available 24/7 through live chat on our website, email at support@yourcompany.com, or through our dedicated support app. We typically respond to all inquiries within 2 hours."
    }
  ];

  return (
    <section className="bg-black text-white py-28">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">Questions</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Everything you need to know about our IPTV service
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden transition-all duration-300"
            >
              <button
                className="flex justify-between items-center w-full p-6 text-left"
                onClick={() => toggleAccordion(index)}
              >
                <h3 className="text-lg md:text-xl font-semibold">{faq.question}</h3>
                <div className="ml-4 flex-shrink-0">
                  <svg 
                    className={`w-5 h-5 text-amber-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 text-gray-300">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 pt-8 border-t border-gray-800">
          <p className="text-lg text-white/80 mb-6">
            Still have questions? We're here to help.
          </p>
          <button className="bg-black text-white border border-amber-500 hover:bg-amber-900 font-bold py-3 px-6 rounded-xl transition duration-300">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;