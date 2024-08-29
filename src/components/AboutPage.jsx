import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import Footer from './Footer';
import { ArrowRight, Globe, ShieldCheck, Headphones, Smartphone, ShoppingBag, Users } from 'lucide-react';

const Section = ({ children, backgroundColor, className = '' }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
      transition={{ duration: 0.8 }}
      className={`py-24 ${backgroundColor} ${className}`}
    >
      <div className="container mx-auto px-4">
        {children}
      </div>
    </motion.section>
  );
};

const AnimatedHeading = ({ children, color, className = '' }) => (
  <motion.h2
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className={`text-5xl font-bold mb-8 ${color} ${className}`}
  >
    {children}
  </motion.h2>
);

const Feature = ({ icon: Icon, title, description }) => (
  <motion.div
    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.2 }}
  >
    <Icon className="text-4xl mb-4 text-blue-600" size={48} />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const AboutPage = () => {
  return (
    <div className="about-page mt-20">
      <Section backgroundColor="bg-gradient-to-r from-blue-600 to-purple-700 text-white" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10">
          <AnimatedHeading color="text-white" className="text-center">Welcome to Our E-Marketplace</AnimatedHeading>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl mb-8 text-center max-w-3xl mx-auto"
          >
            Discover a world of possibilities in our innovative online marketplace. We connect buyers and sellers from around the globe, offering a seamless platform for all your e-commerce needs.
          </motion.p>
          <motion.img
            src="/contact.jpg"
            alt="E-Marketplace Banner"
            className="rounded-lg shadow-2xl mb-8 w-full max-w-4xl mx-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />
        </div>
      </Section>

      <Section backgroundColor="bg-gray-100">
        <AnimatedHeading color="text-gray-800" className="text-center">Our Mission</AnimatedHeading>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl mb-8 text-center max-w-3xl mx-auto"
        >
          We strive to revolutionize the e-commerce experience by providing a secure, user-friendly, and innovative platform that empowers both buyers and sellers. Our goal is to foster a global community of trade, built on trust, transparency, and cutting-edge technology.
        </motion.p>
      </Section>

      <Section backgroundColor="bg-white">
        <AnimatedHeading color="text-gray-800" className="text-center">What Sets Us Apart</AnimatedHeading>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Feature icon={Globe} title="Global Reach" description="Connect with buyers and sellers worldwide" />
          <Feature icon={ShieldCheck} title="Secure Transactions" description="State-of-the-art security for peace of mind" />
          <Feature icon={Headphones} title="24/7 Support" description="Round-the-clock assistance for all users" />
          <Feature icon={Smartphone} title="User-Friendly Interface" description="Intuitive design for seamless navigation" />
          <Feature icon={ShoppingBag} title="Diverse Product Range" description="From everyday items to unique finds" />
          <Feature icon={Users} title="Community-Driven" description="A platform built on user feedback and needs" />
        </motion.div>
      </Section>

      <Section backgroundColor="bg-gradient-to-r from-green-500 to-blue-600 text-white" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <AnimatedHeading color="text-white" className="text-center">Our Journey</AnimatedHeading>
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            {[
              { year: 2020, event: "Founded with a vision to transform online shopping" },
              { year: 2021, event: "Expanded to serve over 1 million users across 50 countries" },
              { year: 2022, event: "Introduced AI-powered product recommendations" },
              { year: 2023, event: "Launched our mobile app for on-the-go shopping" },
              { year: 2024, event: "Celebrating our growth and looking forward to the future" },
            ].map((milestone, index) => (
              <motion.li
                key={index}
                className="flex items-center space-x-6 bg-white bg-opacity-25 p-4 rounded-lg shadow-lg"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <span className="text-3xl font-bold text-yellow-300">{milestone.year}</span>
                <span className="text-xl text-white">{milestone.event}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </Section>

      <Section backgroundColor="bg-gray-900 text-white" className="text-center">
        <AnimatedHeading color="text-white">Join Our Community</AnimatedHeading>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl mb-10 max-w-3xl mx-auto"
        >
          Whether you're a savvy shopper or an ambitious seller, there's a place for you in our vibrant e-marketplace community. Join us today and experience the future of online trading!
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/register"
            className="bg-white text-gray-900 font-bold py-4 px-8 rounded-full text-xl inline-flex items-center hover:bg-gray-200 transition duration-300"
          >
            Sign Up Now
            <ArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </Section>

      <Footer />
    </div>
  );
};

export default AboutPage;