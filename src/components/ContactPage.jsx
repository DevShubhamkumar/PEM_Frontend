import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Phone, Mail, Clock, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import Footer from './Footer';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [activeAccordion, setActiveAccordion] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const contactMethods = [
    { icon: <Phone size={24} />, title: 'Phone', content: '+91 191 2546789' },
    { icon: <Mail size={24} />, title: 'Email', content: 'info@jammubazaar.com' },
    { icon: <Clock size={24} />, title: 'Business Hours', content: 'Mon-Sat: 10AM-8PM IST' },
  ];

  const officeLocations = [
    { city: 'Jammu', address: '123 Residency Road, Jammu Tawi, 180001', state: 'Jammu & Kashmir' },
    { city: 'Katra', address: '456 Vaishno Devi Marg, Katra, 182301', state: 'Jammu & Kashmir' },
    { city: 'Udhampur', address: '789 Dhar Road, Udhampur, 182101', state: 'Jammu & Kashmir' },
  ];

  const faqs = [
    {
      question: 'Do you offer Cash on Delivery?',
      answer: 'Yes, we offer Cash on Delivery (COD) for orders within Jammu city limits.',
    },
    {
      question: 'Can I return products purchased during festive sales?',
      answer: 'Yes, our standard 15-day return policy applies to all purchases, including those made during festive sales like Diwali and Eid.',
    },
    {
      question: 'Do you sell authentic Kashmiri handicrafts?',
      answer: 'Absolutely! We pride ourselves on offering genuine Kashmiri handicrafts, including papier-mâché items, pashmina shawls, and walnut wood carvings.',
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order is shipped, you will receive a tracking number via SMS and email. You can use this number on our website to track your package in real-time.',
    },
  ];

  const AnimatedSection = ({ children, delay = 0 }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    useEffect(() => {
      if (inView) {
        controls.start('visible');
      }
    }, [controls, inView]);

    return (
      <motion.div
        ref={ref}
        animate={controls}
        initial="hidden"
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 }
        }}
        transition={{ duration: 0.5, delay }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedSection>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-orange-600 text-center mb-12">
            संपर्क करें
            <span className="block text-2xl sm:text-3xl text-green-600 mt-2">Contact Us</span>
          </h1>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contactMethods.map((method, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border-2 border-orange-200 hover:border-orange-400 transition-colors duration-300">
                <div className="text-orange-500 mb-4">{method.icon}</div>
                <h2 className="text-xl font-semibold text-green-700 mb-2">{method.title}</h2>
                <p className="text-gray-600 text-center">{method.content}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <AnimatedSection delay={0.2}>
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-green-200 hover:border-green-400 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-orange-600 mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-green-700 font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-green-700 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-green-700 font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-green-700 font-semibold mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                  ></textarea>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition duration-300"
                >
                  Send Message
                </motion.button>
              </form>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-orange-200 hover:border-orange-400 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-green-600 mb-6">Our Offices</h2>
              <div className="space-y-6">
                {officeLocations.map((office, index) => (
                  <div key={index} className="flex items-start">
                    <MapPin size={24} className="text-orange-500 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-700">{office.city}</h3>
                      <p className="text-gray-600">{office.address}</p>
                      <p className="text-gray-600">{office.state}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.4}>
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-green-200 hover:border-green-400 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-orange-600 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <button
                    className="flex justify-between items-center w-full p-4 bg-orange-50 text-left focus:outline-none hover:bg-orange-100 transition-colors duration-300"
                    onClick={() => toggleAccordion(index)}
                  >
                    <span className="text-lg font-medium text-green-700">{faq.question}</span>
                    <motion.div
                      initial={false}
                      animate={{ rotate: activeAccordion === index ? 180 : 0 }}
               transition={{ duration: 0.3 }}
>
            <ChevronDown size={20} className="text-orange-500" />
              </motion.div>


                  </button>
                  <AnimatePresence initial={false}>
                    {activeAccordion === index && (
                      <motion.div
                      key={`content-${index}`}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      variants={{
                        expanded: { opacity: 1, height: "auto" },
                        collapsed: { opacity: 0, height: 0 }
                      }}
                      transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div className="p-4 bg-white text-gray-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                    
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;
