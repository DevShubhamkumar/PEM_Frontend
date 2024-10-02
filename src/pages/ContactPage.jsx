import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Phone, Mail, Clock, MapPin, ChevronDown, ShoppingCart, Globe, ShieldCheck, Truck, Headphones } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

// Assume we have a useAuth hook for checking user authentication status
import { useAppContext } from '../context/AppContext';


const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [activeAccordion, setActiveAccordion] = useState(null);
  const { isAuthenticated } = useAppContext();

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
    { icon: <Phone size={24} />, title: 'Phone', content: '+91 1800 123 4567' },
    { icon: <Mail size={24} />, title: 'Email', content: 'support@e-marketplace.in' },
    { icon: <Clock size={24} />, title: 'Business Hours', content: 'Mon-Sat: 9AM-6PM IST' },
  ];

  const officeLocations = [
    { city: 'Mumbai', address: '123 Marine Drive, Mumbai 400001', state: 'Maharashtra' },
    { city: 'Delhi', address: '456 Connaught Place, New Delhi 110001', state: 'Delhi' },
    { city: 'Bangalore', address: '789 MG Road, Bangalore 560001', state: 'Karnataka' },
  ];

  const faqs = [
    {
      question: 'Do you offer Cash on Delivery (COD)?',
      answer: 'Yes, we offer Cash on Delivery for eligible products in select locations across India. The COD option will be visible at checkout if available for your order.',
    },
    {
      question: 'How can I become a seller on the e-marketplace?',
      answer: 'To become a seller, create an account on our website and complete the seller verification process. Once approved, you can list your products and start selling to customers across India!',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept various payment methods including credit/debit cards, net banking, UPI, popular digital wallets, and Cash on Delivery (for eligible orders).',
    },
    {
      question: 'How is shipping handled?',
      answer: 'We work with trusted courier partners across India. Shipping costs and delivery times vary based on the product and your location. You can view the shipping options and costs at checkout before placing your order.',
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
    <div className="home-page w-full">
      {/* Hero Section */}
      <section className="hero relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-32">
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-down">Contact Us</h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">We're here to help with any questions about our Indian e-marketplace</p>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="wave-bottom"></div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contactMethods.map((method, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border-2 border-indigo-200 hover:border-indigo-400 transition-colors duration-300">
                <div className="text-indigo-500 mb-4">{method.icon}</div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{method.title}</h2>
                <p className="text-gray-600 text-center">{method.content}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <AnimatedSection delay={0.2}>
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-indigo-200 hover:border-indigo-400 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-indigo-600 mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-gray-700 font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  ></textarea>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
                >
                  Send Message
                </motion.button>
              </form>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-indigo-200 hover:border-indigo-400 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-indigo-600 mb-6">Our Offices in India</h2>
              <div className="space-y-6">
                {officeLocations.map((office, index) => (
                  <div key={index} className="flex items-start">
                    <MapPin size={24} className="text-indigo-500 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{office.city}</h3>
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
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-indigo-200 hover:border-indigo-400 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-indigo-600 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <button
                    className="flex justify-between items-center w-full p-4 bg-indigo-50 text-left focus:outline-none hover:bg-indigo-100 transition-colors duration-300"
                    onClick={() => toggleAccordion(index)}
                  >
                    <span className="text-lg font-medium text-gray-800">{faq.question}</span>
                    <motion.div
                      initial={false}
                      animate={{ rotate: activeAccordion === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={20} className="text-indigo-500" />
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

      {/* Why Choose Us */}
      <section className="why-choose-us py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center text-gray-800">Why Choose Our E-Marketplace?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <FeatureCard icon={Globe} title="Pan-India Reach" color="indigo" description="Connect with sellers and buyers from across India, expanding your market opportunities." />
            <FeatureCard icon={ShieldCheck} title="Secure Transactions" color="green" description="Shop with confidence using our advanced security measures and buyer protection policies." />
            <FeatureCard icon={Truck} title="Fast Shipping" color="yellow" description="Enjoy quick and reliable shipping options to get your products delivered on time." />
            <FeatureCard icon={Headphones} title="24/7 Support" color="red" description="Our dedicated customer support team is always ready to assist you with any queries or concerns." />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {!isAuthenticated && (
        <section className="cta bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Your E-Marketplace Journey in India?</h2>
            <p className="text-xl mb-10">Join our platform today and discover amazing deals from sellers across the country!</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/signup" className="bg-white text-indigo-600 py-3 px-8 rounded-full font-semibold text-lg hover:bg-indigo-100 transition duration-300">
                Sign Up Now
              </Link>
              <Link to="/about" className="border-2 border-white text-white py-3 px-8 rounded-full font-semibold text-lg hover:bg-white hover:text-indigo-600 transition duration-300">
                Learn More
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, color, description }) => (
  <div className="flex flex-col items-center text-center">
    <div className={`bg-${color}-100 rounded-full p-6 mb-6`}>
      <Icon className={`text-5xl text-${color}-600`} />
    </div>
    <h3 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default ContactUs;