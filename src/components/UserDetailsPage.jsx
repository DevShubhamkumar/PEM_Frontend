import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import Footer from './Footer';
import { BASE_URL } from '../api';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f4f8;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  padding: 2rem;
`;

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const Header = styled.h2`
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #34495e;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
`;

const Button = styled.button`
  background-color: #3498db;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  grid-column: 1 / -1;

  &:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const AddressGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const AddressCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const AddressActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  background-color: transparent;
  color: #3498db;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #2980b9;
    text-decoration: underline;
  }
`;

const UserDetailsPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    pinCode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    landmark: '',
  });
  const [addresses, setAddresses] = useState([]);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Decoded payload:', payload);
      return payload.userId;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };
  
  

  const fetchUserAddresses = async () => {
    try {
      const userId = getUserIdFromToken();
console.log('UserId from token:', userId);



      if (!userId) {
        console.error('User ID not found in token');
        toast.error('User ID not found');
        return;
      }

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${BASE_URL}/api/users/${userId}/profile`, config);
      console.log('Fetched addresses:', response.data);
      setAddresses(response.data.addresses);
    } catch (error) {
      console.error('Error fetching addresses:', error.response || error);
      toast.error('Error fetching addresses');
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();

    if (!validateInput()) {
      return;
    }

    try {
      const userId = getUserIdFromToken();

      if (!userId) {
        console.error('User ID not found in token');
        toast.error('User ID not found');
        return;
      }

      const addressData = {
        ...formData,
      };

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      let response;
      if (editingAddressId) {
        response = await axios.put(
          `${BASE_URL}/api/users/${userId}/addresses/${editingAddressId}`,
          addressData,
          config
        );
        console.log('Address update response:', response.data);
        toast.success('Address updated successfully');
      } else {
        response = await axios.post(
          `${BASE_URL}/api/users/${userId}/addresses`,
          addressData,
          config
        );
        console.log('New address response:', response.data);
        toast.success('Address saved successfully');
      }

      fetchUserAddresses();
      resetForm();
      setEditingAddressId(null);
    } catch (error) {
      console.error('Error saving/updating address:', error.response ? error.response.data : error.message);
      toast.error('Error saving/updating address: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  const handleEditAddress = (addressId) => {
    console.log('Editing address:', addressId);
    const addressToEdit = addresses.find((address) => address._id === addressId);
    if (addressToEdit) {
      console.log('Address to edit:', addressToEdit);
      setFormData(addressToEdit);
      setEditingAddressId(addressId);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const userId = getUserIdFromToken();

      if (!userId) {
        console.error('User ID not found in token');
        toast.error('User ID not found');
        return;
      }

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.delete(`${BASE_URL}/api/users/${userId}/addresses/${addressId}`, config);
      console.log('Delete response:', response.data);
      
      if (response.data.message === "Address deleted successfully") {
        toast.success('Address deleted successfully');
        fetchUserAddresses(); // Refresh the address list
      } else {
        toast.error('Error deleting address');
      }
    } catch (error) {
      console.error('Error deleting address:', error.response ? error.response.data : error.message);
      toast.error('Error deleting address: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  const handleDeliverHere = (address) => {
    localStorage.setItem('selectedAddress', JSON.stringify(address));
    navigate('/OrderSummaryPage');
  };

  const validateInput = () => {
    const { fullName, phoneNumber, pinCode, locality, address, city, state } = formData;
    
    if (!fullName || !phoneNumber || !pinCode || !locality || !address || !city || !state) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (!/^[A-Za-z\s]+$/.test(fullName)) {
      toast.error('Full name should contain only letters and spaces');
      return false;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      toast.error('Phone number should be 10 digits');
      return false;
    }

    if (!/^\d{6}$/.test(pinCode)) {
      toast.error('Pin code should be 6 digits');
      return false;
    }

    if (!/^[A-Za-z\s.,'-]+$/.test(locality) || !/^[A-Za-z\s.,'-]+$/.test(city)) {
      toast.error('Locality and city should contain only letters, spaces, and common punctuation');
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      phoneNumber: '',
      pinCode: '',
      locality: '',
      address: '',
      city: '',
      state: '',
      landmark: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    switch (name) {
      case 'fullName':
        newValue = value.replace(/[^A-Za-z\s]/g, '');
        break;
      case 'phoneNumber':
      case 'pinCode':
        newValue = value.replace(/\D/g, '');
        break;
      case 'locality':
      case 'city':
        newValue = value.replace(/[^A-Za-z\s.,'-]/g, '');
        break;
      default:
        break;
    }

    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [name]: newValue,
      };
      console.log('Updated form data:', newData);
      return newData;
    });
  };

  return (
    <PageContainer>
      <Toaster />
      <ContentWrapper>
        <Card>
          <Header>{editingAddressId ? 'Edit Address' : 'Add New Address'}</Header>
          <Form onSubmit={handleSaveAddress}>
            <FormGroup>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                maxLength={50}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                maxLength={10}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="pinCode">Pin Code</Label>
              <Input
                id="pinCode"
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleInputChange}
                maxLength={6}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="locality">Locality</Label>
              <Input
                id="locality"
                type="text"
                name="locality"
                value={formData.locality}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="address">Full Address</Label>
              <Input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="city">City/District/Town</Label>
              <Input
                id="city"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="state">State</Label>
              <Select id="state" name="state" value={formData.state} onChange={handleInputChange} required>
                <option value="">Select State</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jharkhand">J&K</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="landmark">Landmark (Optional)</Label>
              <Input
                id="landmark"
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
              />
            </FormGroup>
            <Button type="submit">{editingAddressId ? 'Update Address' : 'Save Address'}</Button>
          </Form>
        </Card>

        <Card>
          <Header>Saved Addresses</Header>
          <AddressGrid>
            {addresses.map((address) => (
              <AddressCard key={address._id}>
                <div>
                  <p><strong>{address.fullName}</strong></p>
                  <p>{address.address}</p>
                  <p>{address.city}, {address.state} - {address.pinCode}</p>
                  <p>Phone: {address.phoneNumber}</p>
                  {address.landmark && <p>Landmark: {address.landmark}</p>}
                </div>
                <AddressActions>
                  <ActionButton onClick={() => handleEditAddress(address._id)}>Edit</ActionButton>
                  <ActionButton onClick={() => handleDeleteAddress(address._id)}>Delete</ActionButton>
                  <ActionButton onClick={() => handleDeliverHere(address)}>Deliver Here</ActionButton>
                </AddressActions>
              </AddressCard>
            ))}
          </AddressGrid>
          {addresses.length === 0 && <p>No addresses found. Use the form above to add a new address.</p>}
        </Card>
      </ContentWrapper>
      <Footer />
    </PageContainer>
  );
};

export default UserDetailsPage;