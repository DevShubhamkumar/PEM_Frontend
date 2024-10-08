import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart, FaCloudUploadAlt, FaUserTie, FaLaptop, FaHeart, FaMoneyBillAlt, FaShieldAlt, FaListAlt, FaStar, FaTruck, FaHeadset, FaGlobe, FaChevronDown, FaQuoteLeft } from "react-icons/fa";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useLoading } from '../context/LoadingContext';
import Footer from '../components/Footer';
import { useAppContext } from '../context/AppContext';

const HomePage = () => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const location = useLocation();
  const { isLoading } = useLoading();
  const { categories, fetchCategories } = useAppContext();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 8);

  const renderCategories = useCallback(() => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {displayedCategories.map((category) => (
        <div key={category._id} className="category-card bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 transform hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full">
          <div className="relative pb-[75%] overflow-hidden">
            <img 
              src={category.categoryImage || "https://via.placeholder.com/400x300"} 
              alt={category.name} 
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">{category.name}</h3>
            <Link to={`/categories/${category._id}`} className="text-indigo-600 hover:text-indigo-800 font-medium mt-auto">
              Explore {category.name} &raquo;
            </Link>
          </div>
        </div>
      ))}
    </div>
  ), [displayedCategories]);
  const TestimonialCard = ({ name, image, testimonial }) => (
    <div className="bg-white rounded-lg p-8 shadow-lg text-gray-800 mx-4 transition duration-300 flex flex-col items-center">
      <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-4 border-indigo-500">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <FaQuoteLeft className="text-4xl text-indigo-500 mb-4" />
      <p className="text-gray-600 italic text-center mb-6">{testimonial}</p>
      <h4 className="font-semibold text-xl text-gray-800">{name}</h4>
      <div className="flex text-yellow-400 mt-2">
        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
      </div>
    </div>
  );


  if (isLoading) {
    return null; 
  }

  return (
    <div className="home-page w-full">
      {/* Hero Section */}
      <section className="hero relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-32">
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-down">Welcome to Our E-Marketplace</h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">Discover amazing products and services from trusted sellers worldwide</p>
          <Link to="/categories" className="bg-white text-indigo-600 py-3 px-8 rounded-full font-semibold text-lg hover:bg-indigo-100 transition duration-300 animate-pulse inline-block">
            Start Exploring
          </Link>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="wave-bottom"></div>
      </section>

      {/* Featured Categories */}
      <section className="featured-categories py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Explore Popular Categories</h2>
          {renderCategories()}
          {categories.length > 8 && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="bg-indigo-600 text-white py-3 px-8 rounded-full font-semibold text-lg hover:bg-indigo-700 transition duration-300 inline-flex items-center"
              >
                {showAllCategories ? "Show Less" : "Show More"}
                <FaChevronDown className={`ml-2 transform ${showAllCategories ? "rotate-180" : ""} transition-transform duration-300`} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us py-20 bg-white">
        <div className="container mx-auto px-4 w-full">
          <h2 className="text-4xl font-bold mb-16 text-center text-gray-800">Why Choose Our E-Marketplace?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <FeatureCard icon={FaGlobe} title="Global Reach" color="indigo" description="Connect with sellers and buyers from around the world, expanding your market opportunities." />
            <FeatureCard icon={FaShieldAlt} title="Secure Transactions" color="green" description="Shop with confidence using our advanced security measures and buyer protection policies." />
            <FeatureCard icon={FaTruck} title="Fast Shipping" color="yellow" description="Enjoy quick and reliable shipping options to get your products delivered on time." />
            <FeatureCard icon={FaHeadset} title="24/7 Support" color="red" description="Our dedicated customer support team is always ready to assist you with any queries or concerns." />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center text-gray-800">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-12 md:space-y-0 md:space-x-8">
            <StepCard number={1} title="Browse Categories" description="Explore our wide range of product and service categories to find what you need." />
            <StepCard number={2} title="Choose & Purchase" description="Select your desired items and complete the secure checkout process." />
            <StepCard number={3} title="Receive & Enjoy" description="Get your products delivered to your doorstep and enjoy your purchase." />
          </div>
        </div>
      </section>

      {/* Testimonials */}
    
      {/* Testimonials */}
      <section className="testimonials py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center text-gray-800">What Our Customers Say</h2>
          <Carousel
            showArrows={true}
            infiniteLoop={true}
            showThumbs={false}
            showStatus={false}
            autoPlay={true}
            interval={6100}
            className="max-w-4xl mx-auto"
          >
            <TestimonialCard 
              name="Shubham Kumar" 
              image="/Shubham.jpg" 
              testimonial="Absolutely brilliant service and top-notch products! I'm thoroughly impressed with the quality and efficiency of this e-marketplace." 
            />
            <TestimonialCard 
              name="Priya Sharma" 
              image="/testimonial2.jpg" 
              testimonial="The procurement process was smooth and incredibly efficient. I highly recommend this platform for all your e-commerce needs." 
            />
            <TestimonialCard 
              name="Amit Patel" 
              image="/testimonial1.jpg" 
              testimonial="Fantastic platform for both buyers and sellers. The customer support is simply outstanding, always ready to assist!" 
            />
          </Carousel>
        </div>
      </section>


      {/* Location-based Content */}
      <section className="location-based py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Discover Local Treasures</h2>
          <p className="text-xl text-center text-gray-600 mb-8">
            Based on your location: {location.pathname === '/' ? 'Home' : location.pathname}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <LocationCard title="Local Sellers" description="Connect with top-rated sellers in your area for faster delivery and personalized service." />
            <LocationCard title="Upcoming Events" description="Discover trade shows, pop-up markets, and other exciting e-commerce events near you." />
            <LocationCard title="Regional Specialties" description="Explore unique products and services that are popular in your region." />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your E-Marketplace Journey?</h2>
          <p className="text-xl mb-10">Join our platform today and discover amazing deals from sellers worldwide!</p>
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

      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, color, description }) => (
  <div className="flex flex-col items-center text-center group">
    <div className={`bg-${color}-100 rounded-full p-6 mb-6 group-hover:bg-${color}-200 transition duration-300`}>
      <Icon className={`text-5xl text-${color}-600`} />
    </div>
    <h3 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }) => (
  <div className="step flex flex-col items-center text-center max-w-xs group">
    <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-6 group-hover:bg-blue-600 transition duration-300">{number}</div>
    <h3 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const TestimonialCard = ({ name, image, testimonial }) => (
  <div className="bg-white rounded-lg p-8 shadow-lg text-gray-800 mx-4 transform hover:scale-105 transition duration-300">
    <div className="flex items-center mb-6">
      <img src={image} alt={name} className="w-16 h-16 rounded-full mr-4 border-2 border-indigo-500" />
      <div>
        <h4 className="font-semibold text-xl">{name}</h4>
        <div className="flex text-yellow-400">
          <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
        </div>
      </div>
    </div>
    <p className="text-gray-600 italic">{testimonial}</p>
  </div>
);

const LocationCard = ({ title, description }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300">
    <h3 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default HomePage;