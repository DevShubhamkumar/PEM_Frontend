import React, { useState, useEffect } from "react";
import axios from "axios";
import { Carousel } from "react-bootstrap";
import {
  FaShoppingCart,
  FaCloudUploadAlt,
  FaUserTie,
  FaLaptop,
  FaHeart,
  FaMoneyBillAlt,
  FaShieldAlt,
  FaListAlt,
  FaUserCircle,
} from "react-icons/fa";
import "./HomePage.css";
import { Link } from "react-router-dom";
import Footer from './Footer';
import { BASE_URL } from '../api';

const HomePage = () => {
  const [buyerData, setBuyerData] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get(
          `${BASE_URL}/api/categories`
        );
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* Buyer Details Section */}
      {buyerData && (
        <div className="buyer-details">
          <h2>Buyer Details</h2>
          <div className="buyer-info">
            <div>
              <h4>Name:</h4>
              <p>{buyerData.name}</p>
            </div>
            <div>
              <h4>Email:</h4>
              <p>{buyerData.email}</p>
            </div>
            {buyerData.company && (
              <div>
                <h4>Company:</h4>
                <p>{buyerData.company}</p>
              </div>
            )}
            {buyerData.jobTitle && (
              <div>
                <h4>Job Title:</h4>
                <p>{buyerData.jobTitle}</p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Carousel Section */}
      <div className="carousel-section">
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="./first.jpg"
              alt="Featured Product"
            />
            <Carousel.Caption>
              <h3>Featured Product</h3>
              <p>Discover our latest product offerings with amazing discounts.</p>
              <a href="/">Learn More &raquo;</a>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="./second.jpg"
              alt="Promotional Services"
            />
            <Carousel.Caption>
              <h3>Promotional Services</h3>
              <p>Check out our special service deals tailored for your needs.</p>
              <a href="/">Explore Services &raquo;</a>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="./third.jpg"
              alt="Platform Features"
            />
            <Carousel.Caption>
              <h3>PEM Highlights</h3>
              <p>Learn more about our platform features and benefits.</p>
              <a href="/">Discover PEM &raquo;</a>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>

      {/* Product Categories Section */}
      <div className="popular-categories">
        <h2>Product Categories</h2>
        <div className="category-grid">
          {categories.slice(0, 7).map((category) => (
            <div key={category._id} className="category-card">
              {category.categoryImage ? (
                <img src={category.categoryImage} alt={category.name} />
              ) : (
                <div>No image available</div>
              )}
              <h3>{category.name}</h3>
              <Link to={`/categories/${category._id}`}>
                Explore {category.name} &raquo;
              </Link>
            </div>
          ))}
          <div className="category-card">
            <img src="exploremore.jpg" alt="Explore More" />
            <h3>Explore More</h3>
            <Link to="/AllCategoriesPage">Explore More &raquo;</Link>
          </div>
        </div>
      </div>

      {/* Popular Service Categories */}
      <div className="popular-services">
        <h2>Popular Service Categories</h2>
        <div className="service-grid">
          <div className="service-card">
            <div className="service-card-content">
              <FaShoppingCart className="service-icon" />
              <h3>Procurement</h3>
              <a href="/">Explore Procurement &raquo;</a>
            </div>
            <div className="service-card-background"></div>
          </div>
          <div className="service-card">
            <div className="service-card-content">
              <FaCloudUploadAlt className="service-icon" />
              <h3>Cloud Services</h3>
              <a href="/">Explore Cloud Services &raquo;</a>
            </div>
            <div className="service-card-background"></div>
          </div>
          <div className="service-card">
            <div className="service-card-content">
              <FaUserTie className="service-icon" />
              <h3>Human Resource</h3>
              <a href="/">Explore Human Resource &raquo;</a>
            </div>
            <div className="service-card-background"></div>
          </div>
          <div className="service-card">
            <div className="service-card-content">
              <FaLaptop className="service-icon" />
              <h3>IT Services</h3>
              <a href="/">Explore IT Services &raquo;</a>
            </div>
            <div className="service-card-background"></div>
          </div>
        </div>
      </div>

      {/* Why Choose PEM */}
      <div className="why-choose-pem">
        <h2>Why Choose PEM?</h2>
        <div className="why-choose-pem-content">
          <div className="why-choose-pem-item">
            <FaHeart className="why-choose-icon" />
            <h3>Rich Listing of Products / Services</h3>
            <p>
              Explore a wide range of products and services on our platform.
            </p>
          </div>
          <div className="why-choose-pem-item">
            <FaMoneyBillAlt className="why-choose-icon" />
            <h3>Integrated Payment System</h3>
            <p>Secure and seamless payment options for your convenience.</p>
          </div>
          <div className="why-choose-pem-item">
            <FaShieldAlt className="why-choose-icon" />
            <h3>Multiple Procurement Modes</h3>
            <p>Choose from direct purchase, bidding, or reverse auction.</p>
          </div>
          <div className="why-choose-pem-item">
            <FaListAlt className="why-choose-icon" />
            <h3>Great Transparency and Speed</h3>
            <p>Experience a transparent and efficient procurement process.</p>
          </div>
        </div>
      </div>

      {/* Customer Feedback */}
      <div className="customer-feedback">
        <h2>What Our Customers Say</h2>
        <div className="feedback-grid">
          <div className="feedback-card">
            <div className="feedback-header">
              <img src="testimonial1.jpg" alt="Customer 1" />
              <div>
                <h4>Ravi Kumar</h4>
                <div className="feedback-rating">
                  <i>&#9733;</i>
                  <i>&#9733;</i>
                  <i>&#9733;</i>
                  <i>&#9733;</i>
                  <i>&#9733;</i>
                </div>
              </div>
            </div>
            <p>
              "I had a fantastic experience using PEM. The platform was user-friendly, and I quickly found the products I needed. Delivery was prompt and reliable."
            </p>
          </div>
          <div className="feedback-card">
            <div className="feedback-header">
              <img src="testimonial2.jpg" alt="Customer 2" />
              <div>
                <h4>Anita Sharma</h4>
                <div className="feedback-rating">
                  <i>&#9733;</i>
                  <i>&#9733;</i>
                  <i>&#9733;</i>
                  <i>&#9733;</i>
                  <i>&#9733;</i>
                </div>
              </div>
            </div>
            <p>
              "PEM has revolutionized my business operations. The extensive range of services and the smooth procurement process have saved me significant time and effort."
            </p>
          </div>
          <div className="feedback-card">
            <div className="feedback-header">
              <img src="testimonial3.jpg" alt="Customer 3" />
              <div>
                <h4>Vikram Mehta</h4>
                <div className="feedback-rating">
                  <i>&#9733;</i>
                  <i>&#9733;</i>
                  <i>&#9733;</i>
                  <i>&#9733;</i>
                  <i>&#9733;</i>
                </div>
              </div>
            </div>
            <p>
              "I highly recommend PEM to anyone seeking a dependable and efficient procurement platform. Their customer support team has been incredibly responsive and helpful."
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact-section">
        <div className="container">
          <h2>Get in Touch</h2>
          <form>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <textarea placeholder="Message"></textarea>
            <button type="submit">Submit</button>
          </form>
          
        </div>
      </div>
      <Footer/>
    </div>

  );
};


export default HomePage;
