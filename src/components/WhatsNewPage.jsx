import React from 'react';
import { FaTag, FaShoppingCart } from 'react-icons/fa';
import styled from 'styled-components';
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const ProductCard = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px; // Fixed height instead of padding-top
  background-color: #f0f0f0; // Light background for images with transparency
`;

const ProductImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain; // Changed from cover to contain
  padding: 10px; // Add some padding around the image
  transition: transform 0.3s ease;

  ${ProductCard}:hover & {
    transform: scale(1.05);
  }
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #343a40;
`;

const ProductPrice = styled.p`
  font-size: 1.125rem;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 0.5rem;
`;

const ProductDescription = styled.p`
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 1rem;
  flex-grow: 1;
`;

const NewTag = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #28a745;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  z-index: 1;
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

const WhatsNewPage = () => {
  const newProducts = [
    {
      id: 1,
      name: '8K QLED Smart TV',
      price: 299999,
      description: 'Experience stunning visuals with our latest 8K QLED Smart TV.',
      imageUrl: '/tv.webp',
    },
    {
      id: 2,
      name: 'Noise-Cancelling Headphones',
      price: 24999,
      description: 'Immerse yourself in pure audio with these premium noise-cancelling headphones.',
      imageUrl: '/headphones.webp',
    },
    {
      id: 3,
      name: 'Ultra-Thin Laptop',
      price: 149999,
      description: 'Powerful performance in an incredibly slim and lightweight design.',
      imageUrl: '/laptop.webp',
    },
    {
      id: 4,
      name: 'Smart Home Hub',
      price: 15999,
      description: 'Control your entire smart home ecosystem with this advanced hub.',
      imageUrl: '/smarthub.webp',
    },
    {
      id: 5,
      name: 'Foldable Smartphone',
      price: 179999,
      description: 'Experience the future of mobile with this innovative foldable smartphone.',
      imageUrl: '/foldablephone.webp',
    },
    {
      id: 6,
      name: 'AI-Powered Robot Vacuum',
      price: 49999,
      description: 'Keep your home clean effortlessly with this smart robot vacuum.',
      imageUrl: '/robotvacuum.webp',
    },
    {
      id: 7,
      name: 'Virtual Reality Headset',
      price: 59999,
      description: 'Dive into immersive virtual worlds with our latest VR headset.',
      imageUrl: '/vrheadset.webp',
    },
    {
      id: 8,
      name: 'Smart Fitness Watch',
      price: 29999,
      description: 'Track your health and fitness with precision using this advanced smartwatch.',
      imageUrl: '/smartwatch.webp',
    },
    {
      id: 9,
      name: 'Wireless Earbuds',
      price: 18999,
      description: 'Experience true wireless freedom with these high-quality earbuds.',
      imageUrl: '/earbuds.webp',
    },
    {
      id: 10,
      name: 'Gaming Console',
      price: 49999,
      description: 'Next-gen gaming with stunning graphics and lightning-fast performance.',
      imageUrl: '/gamingconsole.webp',
    },
    {
      id: 11,
      name: 'Smart Thermostat',
      price: 12999,
      description: 'Optimize your homes climate and save energy with this smart thermostat.',
      imageUrl: '/thermostat.webp',
    },
    {
      id: 12,
      name: 'Portable SSD',
      price: 14999,
      description: 'Ultra-fast storage in a compact, durable design for on-the-go professionals.',
      imageUrl: '/ssd.webp',
    },
    {
      id: 13,
      name: 'Drone with 4K Camera',
      price: 89999,
      description: 'Capture stunning aerial footage with this advanced 4K camera drone.',
      imageUrl: '/drone.webp',
    },
    {
      id: 14,
      name: 'Smart Doorbell',
      price: 9999,
      description: 'Enhance your home security with this HD video doorbell.',
      imageUrl: '/doorbell.webp',
    },
    {
      id: 15,
      name: 'Wireless Charging Pad',
      price: 4999,
      description: 'Control and monitor your homes temperature with this smart thermostat.',
      imageUrl: '/WirelessChargingPad.webp',
    },
    {
      id: 16,
      name: 'Mobile Case',
      price: 6999,
      description: 'Trending case for your device .',
      imageUrl: '/MobileCase.webp',
    },
  ] 
   return (
    <PageContainer>
      <Heading>Discover Our Latest Innovations</Heading>
      <ProductGrid>
        {newProducts.map((product) => (
          <ProductCard key={product.id}>
            <ProductImageContainer>
              <NewTag>
                <FaTag /> New
              </NewTag>
              <ProductImage src={product.imageUrl} alt={product.name} />
            </ProductImageContainer>
            <ProductInfo>
              <ProductName>{product.name}</ProductName>
              <ProductPrice>₹{product.price.toLocaleString()}</ProductPrice>
              <ProductDescription>{product.description}</ProductDescription>
              <AddToCartButton>
                <FaShoppingCart /> Add to Cart
              </AddToCartButton>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>
    </PageContainer>
  );
};

export default WhatsNewPage;