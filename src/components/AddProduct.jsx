import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { toast, Toaster } from 'react-hot-toast';
import { BASE_URL } from '../api';


const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  gap: 20px;
`;

const LeftColumn = styled.div`
  flex: 1;
`;

const RightColumn = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
`;

const SectionTitle = styled.h3`
  margin-bottom: 20px;
  color: #007bff;
  font-size: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: bold;
  color: #555;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: vertical;
  min-height: 100px;
  font-size: 16px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const Error = styled.span`
  color: #d9534f;
  font-size: 14px;
`;

const ProductSection = styled.div`
  margin-bottom: 40px;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
`;

const ItemList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const ItemCard = styled.div`
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const DeleteButton = styled(Button)`
  background-color: #d9534f;
  padding: 5px 10px;
  font-size: 14px;

  &:hover {
    background-color: #c9302c;
  }
`;

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    discount: '',
    images: [],
    category: '',
    itemType: '',
    brand: '',
    status: 'pending',
  });

  const [categories, setCategories] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newItemType, setNewItemType] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [categoriesResponse, itemTypesResponse, brandsResponse] = await Promise.all([
        axios.get('${BASE_URL}/api/categories', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('${BASE_URL}/api/itemTypes', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('${BASE_URL}/api/brands', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setCategories(categoriesResponse.data);
      setItemTypes(itemTypesResponse.data);
      setBrands(brandsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setProduct({ ...product, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs(product);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        Object.keys(product).forEach(key => {
          if (key !== 'images') {
            formData.append(key, product[key]);
          }
        });
        product.images.forEach(image => {
          formData.append('images', image);
        });

        await axios.post('${BASE_URL}/api/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success('Product added successfully');
        resetForm();
      } catch (error) {
        console.error('Error adding product:', error);
        toast.error('Failed to add product');
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const resetForm = () => {
    setProduct({
      name: '',
      description: '',
      price: '',
      stock: '',
      discount: '',
      images: [],
      category: '',
      itemType: '',
      brand: '',
      status: 'pending',
    });
    setErrors({});
  };

  const validateInputs = (values) => {
    let errors = {};
    if (!values.name.trim()) errors.name = 'Name is required';
    if (!values.description.trim()) errors.description = 'Description is required';
    if (!values.price || values.price <= 0) errors.price = 'Price must be greater than zero';
    if (!values.stock || values.stock < 0) errors.stock = 'Stock cannot be negative';
    if (!values.category) errors.category = 'Category is required';
    if (!values.itemType) errors.itemType = 'Item Type is required';
    if (!values.brand) errors.brand = 'Brand is required';
    return errors;
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('${BASE_URL}/api/categories', 
        { name: newCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Category creation response:', response.data);
      setCategories([...categories, response.data]);
      setNewCategory('');
      toast.success('Category created successfully');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    }
  };

  const handleCreateItemType = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('${BASE_URL}/api/itemTypes', { name: newItemType }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Item Type creation response:', response.data);
      setItemTypes(prevItemTypes => [...prevItemTypes, response.data.itemType || response.data]);
      setNewItemType('');
      toast.success('Item type created successfully');
    } catch (error) {
      console.error('Error creating item type:', error);
      toast.error('Failed to create item type');
    }
  };
  
  const handleCreateBrand = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('${BASE_URL}/api/brands', { name: newBrand }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Brand creation response:', response.data);
      setBrands(prevBrands => [...prevBrands, response.data.brand || response.data]);
      setNewBrand('');
      toast.success('Brand created successfully');
    } catch (error) {
      console.error('Error creating brand:', error);
      toast.error('Failed to create brand');
    }
  };

  const handleDelete = async (type, id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/api/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (type === 'categories') {
        setCategories(categories.filter(item => item._id !== id));
      } else if (type === 'itemTypes') {
        setItemTypes(itemTypes.filter(item => item._id !== id));
      } else if (type === 'brands') {
        setBrands(brands.filter(item => item._id !== id));
      }
      toast.success(`${type.slice(0, -1)} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting ${type.slice(0, -1)}:`, error);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error(`Failed to delete ${type.slice(0, -1)}`);
      }
    }
  };

  return (
    <Container>
      <Toaster position="top-right" />
      <LeftColumn>
        <Title>Product Management</Title>

        <ProductSection>
          <SectionTitle>Categories</SectionTitle>
          <ItemList>
            {categories.map((category) => (
              <ItemCard key={category._id}>
                <span>{category.name}</span>
                <DeleteButton onClick={() => handleDelete('categories', category._id)}>Delete</DeleteButton>
              </ItemCard>
            ))}
          </ItemList>
          <Form onSubmit={handleCreateCategory}>
            <FormGroup>
              <Label>Add new category</Label>
              <Input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
              />
              <Button type="submit">Create Category</Button>
            </FormGroup>
          </Form>
        </ProductSection>

        <ProductSection>
          <SectionTitle>Item Types</SectionTitle>
          <ItemList>
            {itemTypes.map((itemType) => (
              <ItemCard key={itemType._id}>
                <span>{itemType.name}</span>
                <DeleteButton onClick={() => handleDelete('itemTypes', itemType._id)}>Delete</DeleteButton>
              </ItemCard>
            ))}
          </ItemList>
          <Form onSubmit={handleCreateItemType}>
            <FormGroup>
              <Label>Add new item type</Label>
              <Input
                type="text"
                value={newItemType}
                onChange={(e) => setNewItemType(e.target.value)}
                placeholder="Item type name"
              />
              <Button type="submit">Create Item Type</Button>
            </FormGroup>
          </Form>
        </ProductSection>

        <ProductSection>
          <SectionTitle>Brands</SectionTitle>
          <ItemList>
            {brands.map((brand) => (
              <ItemCard key={brand._id}>
                <span>{brand.name}</span>
                <DeleteButton onClick={() => handleDelete('brands', brand._id)}>Delete</DeleteButton>
              </ItemCard>
            ))}
          </ItemList>
          <Form onSubmit={handleCreateBrand}>
            <FormGroup>
              <Label>Add new brand</Label>
              <Input
                type="text"
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                placeholder="Brand name"
              />
              <Button type="submit">Create Brand</Button>
            </FormGroup>
          </Form>
        </ProductSection>
      </LeftColumn>

      <RightColumn>
        <ProductSection>
          <SectionTitle>Add New Product</SectionTitle>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Name:</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
              />
              {errors.name && <Error>{errors.name}</Error>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="description">Description:</Label>
              <TextArea
                id="description"
                name="description"
                value={product.description}
                onChange={handleChange}
                required
              ></TextArea>
              {errors.description && <Error>{errors.description}</Error>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="price">Price:</Label>
              <Input
                type="number"
                id="price"
                name="price"
                value={product.price}
                onChange={handleChange}
                required
              />
              {errors.price && <Error>{errors.price}</Error>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="stock">Stock:</Label>
              <Input
                type="number"
                id="stock"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                required
              />
              {errors.stock && <Error>{errors.stock}</Error>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="discount">Discount (%):</Label>
              <Input
                type="number"
                id="discount"
                name="discount"
                value={product.discount}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="category">Category:</Label>
              <Select
                id="category"
                name="category"
                value={product.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Select>
              {errors.category && <Error>{errors.category}</Error>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="itemType">Item Type:</Label>
              <Select
                id="itemType"
                name="itemType"
                value={product.itemType}
                onChange={handleChange}
                required
              >
                <option value="">Select an item type</option>
                {itemTypes.map((itemType) => (
                  <option key={itemType._id} value={itemType._id}>
                    {itemType.name}
                  </option>
                ))}
              </Select>
              {errors.itemType && <Error>{errors.itemType}</Error>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="brand">Brand:</Label>
              <Select
               id="brand"
               name="brand"
               value={product.brand}
               onChange={handleChange}
               required
             >
               <option value="">Select a brand</option>
               {brands.map((brand) => (
                 <option key={brand._id} value={brand._id}>
                   {brand.name}
                 </option>
               ))}
             </Select>
             {errors.brand && <Error>{errors.brand}</Error>}
           </FormGroup>
           <FormGroup>
             <Label htmlFor="images">Images:</Label>
             <Input
               type="file"
               id="images"
               name="images"
               multiple
               onChange={handleImageUpload}
             />
           </FormGroup>
           <Button type="submit">Add Product</Button>
         </Form>
       </ProductSection>
     </RightColumn>
   </Container>
 );
};

export default AddProduct;