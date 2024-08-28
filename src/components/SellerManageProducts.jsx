import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { BASE_URL } from '../api';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const Header = styled.h1`
  text-align: center;
  margin-bottom: 40px;
  color: #2c3e50;
  font-size: 2.8rem;
  font-weight: 700;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
`;

const ActionLink = styled(Link)`
  background-color: #3498db;
  color: white;
  padding: 14px 24px;
  text-decoration: none;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
  }
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  background-color: #ffffff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
`;

const Label = styled.label`
  margin-bottom: 10px;
  font-weight: 600;
  color: #34495e;
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 40px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
`;

const TableHeader = styled.th`
  padding: 18px;
  background-color: #3498db;
  color: white;
  font-weight: 600;
  text-align: left;
  text-transform: uppercase;
  font-size: 0.9rem;
`;

const TableCell = styled.td`
  padding: 18px;
  border-bottom: 1px solid #ecf0f1;
  color: #34495e;
`;

const Button = styled.button`
  background-color: ${(props) => (props.danger ? '#e74c3c' : '#2ecc71')};
  color: white;
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.danger ? '#c0392b' : '#27ae60')};
    transform: translateY(-2px);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 40px;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const Textarea = styled.textarea`
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin-right: 8px;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ExpandableText = styled.span`
  color: #3498db;
  cursor: pointer;
  font-size: 0.9rem;
  margin-left: 5px;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #2980b9;
    text-decoration: underline;
  }
`;
const SellerManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filters, setFilters] = useState({ category: '', itemType: '', brand: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    discount: '',
    category: '',
    itemType: '',
    brand: '',
    images: [],
  });
  const [expandedFields, setExpandedFields] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/seller/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(response.data.products || []);
      setCategories(response.data.categories || []);
      setItemTypes(response.data.itemTypes || []);
      setBrands(response.data.brands || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product. Please try again.');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
      discount: product.discount || '',
      category: product.category?._id || '',
      itemType: product.itemType?._id || '',
      brand: product.brand?._id || '',
      images: product.images || [],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const handleUpdate = async () => {
    try {
      const formDataWithImages = new FormData();
      for (const key in formData) {
        if (key === 'images') {
          for (const image of formData.images) {
            formDataWithImages.append('images', image);
          }
        } else {
          formDataWithImages.append(key, formData[key]);
        }
      }

      const token = localStorage.getItem('token');
      await axios.put(`${BASE_URL}/api/products/${editingProduct._id}`, formDataWithImages, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setEditingProduct(null);
      fetchData();
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      discount: '',
      category: '',
      itemType: '',
      brand: '',
      images: [],
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredProducts = products.filter(product => (
    (!filters.category || product.category?._id === filters.category) &&
    (!filters.itemType || product.itemType?._id === filters.itemType) &&
    (!filters.brand || product.brand?._id === filters.brand)
  ));

  const truncateString = (str, maxLength) => {
    if (!str) return '';
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + '...';
    }
    return str;
  };

  const toggleExpand = (id, field) => {
    setExpandedFields(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: !prev[id]?.[field]
      }
    }));
  };

  const renderExpandableText = (text, maxLength, id, field) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    return expandedFields[id]?.[field] ? (
      <>
        {text}{' '}
        <ExpandableText onClick={() => toggleExpand(id, field)}>
          (Show less)
        </ExpandableText>
      </>
    ) : (
      <>
        {truncateString(text, maxLength)}{' '}
        <ExpandableText onClick={() => toggleExpand(id, field)}>
          (Show more)
        </ExpandableText>
      </>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
      <Header>Manage Products</Header>
      <Actions>
        <ActionLink to="/seller/add-product">Add Product</ActionLink>
        <ActionLink to="/seller/manage-categories">Manage Categories</ActionLink>
      </Actions>
      <FilterSection>
        <FilterGroup>
          <Label htmlFor="category">Category:</Label>
          <Select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </Select>
        </FilterGroup>
        <FilterGroup>
          <Label htmlFor="itemType">Item Type:</Label>
          <Select
            id="itemType"
            name="itemType"
            value={filters.itemType}
            onChange={handleFilterChange}
          >
            <option value="">All Item Types</option>
            {itemTypes.map((itemType) => (
              <option key={itemType._id} value={itemType._id}>
                {itemType.name}
              </option>
            ))}
          </Select>
        </FilterGroup>
        <FilterGroup>
          <Label htmlFor="brand">Brand:</Label>
          <Select
            id="brand"
            name="brand"
            value={filters.brand}
            onChange={handleFilterChange}
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </Select>
        </FilterGroup>
      </FilterSection>

      {editingProduct ? (
        <Form>
          <h2>Edit Product</h2>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
          />
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
          />
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Price"
          />
          <Input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            placeholder="Stock"
          />
          <Input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleInputChange}
            placeholder="Discount"
          />
          <Select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Select
            name="itemType"
            value={formData.itemType}
            onChange={handleInputChange}
          >
            <option value="">Select Item Type</option>
            {itemTypes.map((itemType) => (
              <option key={itemType._id} value={itemType._id}>
                {itemType.name}
              </option>
            ))}
          </Select>
          <Select
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </Select>
          <Input
            type="file"
            name="images"
            multiple
            onChange={handleImageChange}
          />
          <ButtonGroup>
            <Button onClick={handleUpdate}>Update</Button>
            <Button onClick={handleCancelEdit}>Cancel</Button>
          </ButtonGroup>
        </Form>
      ) : (
        <Table>
          <thead>
            <tr>
              <TableHeader>Name</TableHeader>
              <TableHeader>Description</TableHeader>
              <TableHeader>Price</TableHeader>
              <TableHeader>Stock</TableHeader>
              <TableHeader>Discount</TableHeader>
              <TableHeader>Images</TableHeader>
              <TableHeader>Category</TableHeader>
              <TableHeader>Item Type</TableHeader>
              <TableHeader>Brand</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <TableCell>
                  {renderExpandableText(product.name, 50, product._id, 'name')}
                </TableCell>
                <TableCell>
                  {renderExpandableText(product.description, 50, product._id, 'description')}
                </TableCell>
                <TableCell>
                  ₹{(product.price || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell>{product.stock || 0}</TableCell>
                <TableCell>{product.discount || 0}%</TableCell>
                <TableCell>
  {(product.images || []).map((imagePath, index) => (
    <ProductImage
      key={index}
      src={`${BASE_URL}/${imagePath}`}
      alt={`Product ${index + 1}`}
    />
  ))}
</TableCell>
                <TableCell>{product.category?.name || 'N/A'}</TableCell>
                <TableCell>{product.itemType?.name || 'N/A'}</TableCell>
                <TableCell>{product.brand?.name || 'N/A'}</TableCell>
                <TableCell>
                  <ButtonGroup>
                    <Button danger onClick={() => handleDelete(product._id)}>
                      Delete
                    </Button>
                    <Button onClick={() => handleEdit(product)}>Edit</Button>
                  </ButtonGroup>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default SellerManageProducts;