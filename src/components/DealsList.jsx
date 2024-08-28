import React from 'react';
import { FaTag, FaShoppingCart } from 'react-icons/fa';
import styled from 'styled-components';
import { toast, Toaster } from 'react-hot-toast';
import { BASE_URL } from '../api';

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #f8f9fa;

  @media (max-width: 768px) {
    padding: 20px 10px;
  }
`;

const Heading = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: #343a40;
  text-transform: uppercase;
  letter-spacing: 2px;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const ProductCard = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px; // Increased height
  object-fit: contain; // Changed to 'contain' to show full image
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #343a40;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const OriginalPrice = styled.span`
  font-size: 1rem;
  color: #6c757d;
  text-decoration: line-through;
  margin-right: 0.5rem;
`;

const DiscountedPrice = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #28a745;
`;

const ProductDescription = styled.p`
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 1rem;
`;

const DealTag = styled.span`
  display: inline-block;
  background-color: #ffc107;
  color: #212529;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

const AddToCartButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const DealsPage = () => {
  const dealsProducts = [
    {
      id: 1,
      name: '4K Smart TV',
      originalPrice: 79999,
      discountedPrice: 59999,
      description: 'Immerse yourself in stunning 4K resolution with this feature-packed Smart TV.',
      imageUrl: '/4ktv.webp',
    },
    {
      id: 2,
      name: 'Wireless Earbuds',
      originalPrice: 14999,
      discountedPrice: 9999,
      description: 'Experience true wireless freedom with these high-quality earbuds.',
      imageUrl: '/earbuds.webp',
    },
    {
      id: 3,
      name: 'Gaming Laptop',
      originalPrice: 129999,
      discountedPrice: 99999,
      description: 'Dominate your games with this powerful and sleek gaming laptop.',
      imageUrl: '/gaminglaptop.webp',
    },
    {
      id: 4,
      name: 'Smartwatch',
      originalPrice: 24999,
      discountedPrice: 19999,
      description: 'Stay connected and track your fitness with this versatile smartwatch.',
      imageUrl: '/smartwatch.webp',
    },
    {
      id: 5,
      name: 'Bluetooth Speaker',
      originalPrice: 9999,
      discountedPrice: 6999,
      description: 'Fill your space with rich, immersive sound from this portable Bluetooth speaker.',
      imageUrl: '/speaker.webp',
    },
    {
      id: 6,
      name: 'Electric Scooter',
      originalPrice: 39999,
      discountedPrice: 29999,
      description: 'Zip around town effortlessly with this eco-friendly electric scooter.',
      imageUrl: '/escooter.webp',
    },
    {
      id: 7,
      name: 'Robotic Vacuum Cleaner',
      originalPrice: 34999,
      discountedPrice: 24999,
      description: 'Keep your floors spotless with minimal effort using this smart robot vacuum.',
      imageUrl: '/robotvacuum.webp',
    },
    {
      id: 8,
      name: 'Noise-Cancelling Headphones',
      originalPrice: 29999,
      discountedPrice: 22999,
      description: 'Immerse yourself in your music with these premium noise-cancelling headphones.',
      imageUrl: '/headphones.webp',
    },
    {
      id: 9,
      name: 'Instant Pot',
      originalPrice: 12999,
      discountedPrice: 8999,
      description: 'Cook delicious meals quickly and easily with this versatile Instant Pot.',
      imageUrl: '/instantpot.webp',
    },
    {
      id: 10,
      name: 'Fitness Tracker',
      originalPrice: 9999,
      discountedPrice: 6999,
      description: 'Achieve your fitness goals with this feature-packed activity tracker.',
      imageUrl: '/fitnesstracker.webp',
    },
    {
      id: 11,
      name: 'Portable Charger',
      originalPrice: 4999,
      discountedPrice: 2999,
      description: 'Never run out of battery with this high-capacity portable charger.',
      imageUrl: '/powerbank.webp',
    },
    {
      id: 12,
      name: 'Smart Home Security Camera',
      originalPrice: 14999,
      discountedPrice: 11999,
      description: 'Keep an eye on your home from anywhere with this smart security camera.',
      imageUrl: '/securitycamera.webp',
    },
    {
      id: 13,
      name: 'Air Purifier',
      originalPrice: 19999,
      discountedPrice: 15999,
      description: 'Breathe cleaner, fresher air with this advanced air purifier.',
      imageUrl: '/airpurifier.webp',
    },
    {
      id: 14,
      name: 'Digital Camera',
      originalPrice: 54999,
      discountedPrice: 44999,
      description: 'Capture life moments in stunning detail with this high-quality digital camera.',
      imageUrl: '/camera.webp',
    },
    {
      id: 15,
      name: 'Smart Doorbell',
      originalPrice: 12999,
      discountedPrice: 9999,
      description: 'Enhance your home security with this HD video doorbell.',
      imageUrl: '/doorbell.webp',
    },
    {
      id: 16,
      name: 'Smart Lock',
      originalPrice: 10999,
      discountedPrice: 8999,
      description: 'Secure your home with this smart lock that offers keyless entry and remote access.',
      imageUrl: '/lock.webp',
    },
  ];

  const handleAddToCart = (product) => {
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <PageContainer>
      <Toaster position="top-center" reverseOrder={false} />
      <Heading>Unbeatable Deals</Heading>
      <ProductGrid>
        {dealsProducts.map((product) => (
          <ProductCard key={product.id}>
            <ProductImage src={product.imageUrl} alt={product.name} />
            <ProductInfo>
              <DealTag>
                <FaTag /> Deal
              </DealTag>
              <ProductName>{product.name}</ProductName>
              <PriceContainer>
                <OriginalPrice>₹{product.originalPrice.toLocaleString()}</OriginalPrice>
                <DiscountedPrice>₹{product.discountedPrice.toLocaleString()}</DiscountedPrice>
              </PriceContainer>
              <ProductDescription>{product.description}</ProductDescription>
              <AddToCartButton onClick={() => handleAddToCart(product)}>
                <FaShoppingCart /> Add to Cart
              </AddToCartButton>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>
    </PageContainer>
  );
};

export default DealsPage;