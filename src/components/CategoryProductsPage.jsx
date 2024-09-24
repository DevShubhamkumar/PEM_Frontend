import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import ReactStars from "react-rating-stars-component";
import Footer from './Footer';
import { BASE_URL } from '../api';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const FilterButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    display: none;
  }
`;

const FilterContainer = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
  height: 100%;
  overflow-y: auto;
  transition: left 0.3s ease-in-out;
  z-index: 1000;

  @media (min-width: 768px) {
    width: 25%;
    position: sticky;
    top: 20px;
    left: 0;
    align-self: flex-start;
    height: auto;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;

  @media (min-width: 768px) {
    display: none;
  }
`;

const ProductContainer = styled.div`
  width: 100%;

  @media (min-width: 768px) {
    width: 75%;
    padding-left: 20px;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const FilterTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
`;

const FilterGroup = styled.div`
  margin-bottom: 20px;
`;

const PriceRangeFilter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PriceRangeInput = styled.input`
  width: 45%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

const CheckboxFilter = styled.div`
  margin-bottom: 5px;
  display: flex;
  align-items: center;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

const SearchButton = styled.button`
  padding: 5px 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-left: 10px;
`;

const ProductList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
`;

const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  @media (min-width: 768px) {
    flex-direction: row;
    height: 250px;
  }
`;

const ProductImageContainer = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;

  @media (min-width: 768px) {
    width: 250px;
    height: 100%;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 10px;
  transition: transform 0.3s ease;

  ${ProductCard}:hover & {
    transform: scale(1.05);
  }
`;

const ProductContent = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;

  @media (min-width: 768px) {
    width: calc(100% - 250px);
  }
`;

const ProductTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
`;

const DetailsParagraph = styled.p`
  margin-bottom: 5px;
  color: #666;
  &.price {
    color: #333;
    font-weight: bold;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  background-color: #f2f2f2;
  border: none;
  color: #333;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  margin: 0 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ddd;
  }

  &.active {
    background-color: #4caf50;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TruncatedDescription = styled(DetailsParagraph)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const CategoryProductsPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [brands, setBrands] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (categoryId) {
          const response = await axios.get(`${BASE_URL}/api/products?category=${categoryId}`);
          const fetchedProducts = await Promise.all(
            response.data.map(async (product) => {
              const commentsResponse = await axios.get(`${BASE_URL}/api/products/${product._id}/comments`);
              const comments = commentsResponse.data;
              const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length || 0;
              const totalRatingsCount = comments.length;
    
              // Ensure the image URL is complete and handle potential null values
              const images = product.images && product.images.length > 0
                ? product.images.map(image => 
                    image ? (image.startsWith('http') ? image : `${BASE_URL}/${image}`) : null
                  ).filter(Boolean)
                : [];
    
              return {
                ...product,
                images,
                totalRating,
                totalRatingsCount,
              };
            })
          );
    
          setProducts(fetchedProducts);


          const allBrands = [...new Set(fetchedProducts.map(product => product.brand.name))];
          setBrands(allBrands);

          const allRatings = [1, 2, 3, 4, 5];
          setRatings(allRatings);

          const allDiscounts = [10, 20, 30, 40, 50];
          setDiscounts(allDiscounts);

          const minPrice = Math.min(...fetchedProducts.map(product => product.price));
          const maxPrice = Math.max(...fetchedProducts.map(product => product.price));
          setPriceRange({ min: minPrice, max: maxPrice });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [categoryId]);

  const handlePriceRangeChange = (event) => {
    const { name, value } = event.target;
    setPriceRange((prevRange) => ({
      ...prevRange,
      [name]: value,
    }));
  };

  const handleBrandChange = (event) => {
    const { value, checked } = event.target;
    setSelectedBrands((prevBrands) =>
      checked
        ? [...prevBrands, value]
        : prevBrands.filter((brand) => brand !== value)
    );
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleRatingChange = (event) => {
    const { value, checked } = event.target;
    setSelectedRatings((prevRatings) =>
      checked
        ? [...prevRatings, parseInt(value)]
        : prevRatings.filter((rating) => rating !== parseInt(value))
    );
  };

  const handleDiscountChange = (event) => {
    const { value, checked } = event.target;
    setSelectedDiscounts((prevDiscounts) =>
      checked
        ? [...prevDiscounts, parseInt(value)]
        : prevDiscounts.filter((discount) => discount !== parseInt(value))
    );
  };

  const filteredProducts = products.filter((product) => {
    const isInPriceRange =
      product.price >= priceRange.min && product.price <= priceRange.max;
    const isBrandSelected =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand.name);
    const isRatingSelected =
      selectedRatings.length === 0 || selectedRatings.includes(Math.floor(product.totalRating));
    const isDiscountSelected =
      selectedDiscounts.length === 0 ||
      selectedDiscounts.some(discount => product.discount >= discount);
    const matchesSearchTerm =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      isInPriceRange &&
      isBrandSelected &&
      isRatingSelected &&
      isDiscountSelected &&
      matchesSearchTerm
    );
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const renderPaginationButtons = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <PaginationContainer>
        <PaginationButton
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </PaginationButton>
        {pageNumbers.map((number) => (
          <PaginationButton
            key={number}
            onClick={() => paginate(number)}
            className={currentPage === number ? 'active' : ''}
          >
            {number}
          </PaginationButton>
        ))}
        <PaginationButton
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </PaginationButton>
      </PaginationContainer>
    );
  };

  return (
    <>
      <Container>
        <FilterButton onClick={toggleFilter}>
          {isFilterOpen ? 'Close Filters' : 'Open Filters'}
        </FilterButton>
        <FilterContainer isOpen={isFilterOpen}>
          <CloseButton onClick={toggleFilter}>&times;</CloseButton>
          <Title>Filters</Title>
          <FilterGroup>
            <FilterTitle>Search</FilterTitle>
            <SearchContainer>
              <SearchInput
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <SearchButton onClick={handleSearch}>Search</SearchButton>
            </SearchContainer>
          </FilterGroup>
          <FilterGroup>
            <FilterTitle>Price Range</FilterTitle>
            <PriceRangeFilter>
              <PriceRangeInput
                type="number"
                name="min"
                placeholder="Min"
                value={priceRange.min}
                onChange={handlePriceRangeChange}
              />
              <span>-</span>
              <PriceRangeInput
                type="number"
                name="max"
                placeholder="Max"
                value={priceRange.max}
                onChange={handlePriceRangeChange}
              />
            </PriceRangeFilter>
          </FilterGroup>
          <FilterGroup>
            <FilterTitle>Brands</FilterTitle>
            {brands.map((brand) => (
              <CheckboxFilter key={brand}>
                <input
                  type="checkbox"
                  value={brand}
                  checked={selectedBrands.includes(brand)}
                  onChange={handleBrandChange}
                />
                <span>{brand}</span>
              </CheckboxFilter>
            ))}
          </FilterGroup>
          <FilterGroup>
            <FilterTitle>Ratings</FilterTitle>
            {ratings.map((rating) => (
              <CheckboxFilter key={rating}>
                <input
                  type="checkbox"
                  value={rating}
                  checked={selectedRatings.includes(rating)}
                  onChange={handleRatingChange}
                />
                <ReactStars value={rating} edit={false} />
              </CheckboxFilter>
            ))}
          </FilterGroup>
          <FilterGroup>
            <FilterTitle>Discounts</FilterTitle>
            {discounts.map((discount) => (
              <CheckboxFilter key={discount}>
                <input
                  type="checkbox"
                  value={discount}
                  checked={selectedDiscounts.includes(discount)}
                  onChange={handleDiscountChange}
                />
                <span>{discount}% or more</span>
              </CheckboxFilter>
            ))}
          </FilterGroup>
        </FilterContainer>
        <ProductContainer>
          <Title>Products</Title>
          {filteredProducts.length > 0 ? (
            <>
              <ProductList>
        {currentProducts.map((product) => (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            state={{ product }}
            style={{ textDecoration: 'none' }}
          >
            <ProductCard>
              <ProductImageContainer>
                <ProductImage
                  src={product.images[0]}
                  alt={product.name}
                />
              </ProductImageContainer>
                      <ProductContent>
                        <ProductTitle>{product.name}</ProductTitle>
                        <ProductDetails>
                          <TruncatedDescription>
                            {truncateText(product.description, 100)}
                          </TruncatedDescription>
                          <DetailsParagraph className="price">
                            Price: ₹{product.price}
                          </DetailsParagraph>
                          <RatingContainer>
                            <ReactStars
                              value={product.totalRating}
                              edit={false}
                            />
                            <span>({product.totalRatingsCount})</span>
                          </RatingContainer>
                          {product.discount > 0 && (
                            <DetailsParagraph>
                              Discount: {product.discount}%
                            </DetailsParagraph>
                          )}
                        </ProductDetails>
                      </ProductContent>
                    </ProductCard>
                  </Link>
                ))}
              </ProductList>
              {renderPaginationButtons()}
            </>
          ) : (
            <p>No products found.</p>
          )}
        </ProductContainer>
      </Container>
      <Footer />
    </>
  );
};

export default CategoryProductsPage;