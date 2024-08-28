import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';
import { BASE_URL } from '../api';

// Define colors
const primaryColor = '#1976d2';
const secondaryColor = '#607d8b';
const backgroundColor = '#f5f5f5';
const textColor = '#263238';

// Global Styles
const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${backgroundColor};
    color: ${textColor};
    font-family: 'Roboto', sans-serif;
  }
`;

// Styled components
const BuyerProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 40px;
`;

const WelcomeMessage = styled.div`
  text-align: center;
  margin-bottom: 40px;
  font-size: 28px;
  font-weight: bold;
  color: ${primaryColor};
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  justify-content: center;
`;

const ProfilePicture = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    margin-bottom: 20px;
    margin-right: 0;
  }
`;

const ProfileDetails = styled.div`
  flex: 1;
  text-align: center;
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const Name = styled.h2`
  color: ${primaryColor};
  margin-bottom: 10px;
`;

const Email = styled.p`
  color: ${secondaryColor};
  font-size: 16px;
`;

const OrdersContainer = styled.div`
  margin-top: 40px;
`;

const OrderCard = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  padding: 15px 30px;
  background-color: ${(props) => (props.active ? '#007bff' : '#f8f8f8')};
  color: ${(props) => (props.active ? '#fff' : '#333')};
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:not(:last-child) {
    margin-right: 20px;
  }

  @media (max-width: 768px) {
    margin-bottom: 10px;
    &:not(:last-child) {
      margin-right: 0;
    }
  }
`;

const TabContent = styled.div`
  padding: 40px;
  background-color: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const EditForm = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:not(:last-child) {
    margin-right: 10px;
  }
`;

const AddressContainer = styled.div`
  margin-top: 40px;
`;

const AddressCard = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AddressDetails = styled.div`
  flex: 1;
`;

const AddressActions = styled.div`
  display: flex;
  align-items: center;
`;

const EditButton = styled(Button)`
  background-color: ${primaryColor};
  margin-right: 10px;
`;

const DeleteButton = styled(Button)`
  background-color: #f44336;
`;

const BuyerProfile = () => {
  const [buyer, setBuyer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    address: '',
    contactNumber: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressMode, setAddressMode] = useState('view');
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phoneNumber: '',
    pinCode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    landmark: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Token not found');
        }
    
        // Decode the token to get the user ID
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.userId;
    
        console.log('Fetching user data for userId:', userId);
        console.log('Using token:', token);
    
        const profileResponse = await axios.get(`${BASE_URL}/api/users/${userId}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
    
        console.log('Profile response:', profileResponse);
    
        if (profileResponse && profileResponse.data) {
          console.log('Profile data received:', profileResponse.data);
          setBuyer(profileResponse.data);
          setProfileData({
            name: profileResponse.data.buyerFields?.name || '',
            email: profileResponse.data.email || '',
            address: profileResponse.data.buyerFields?.address || '',
            contactNumber: profileResponse.data.buyerFields?.contactNumber || '',
          });
          setImagePreview(profileResponse.data.profilePicture ? `${BASE_URL}/${profileResponse.data.profilePicture}` : null);
        } else {
          throw new Error('Profile response is missing data');
        }
    
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message || 'An unexpected error occurred');
        setLoading(false);
      }
    };
        
            fetchUserData();
          }, []);
        
          const handleEditMode = () => {
            setEditMode(!editMode);
            if (!editMode && buyer && buyer.buyerFields) {
              setProfileData({
                name: buyer.buyerFields.name || '',
                email: buyer.email || '',
                address: buyer.buyerFields.address || '',
                contactNumber: buyer.buyerFields.contactNumber || '',
              });
              const profilePictureUrl = buyer.profilePicture
                ? buyer.profilePicture.startsWith('http')
                  ? buyer.profilePicture
                  : `${BASE_URL}/${buyer.profilePicture}`
                : '';
              setImagePreview(profilePictureUrl);
            } else {
              setProfileData({
                name: '',
                email: '',
                address: '',
                contactNumber: '',
              });
              setImagePreview(null);
            }
          };
          
          const handleProfileImageChange = (e) => {
            const file = e.target.files[0];
            if (file) {
              setProfileImage(file);
              setImagePreview(URL.createObjectURL(file));
            }
          };
          
          const handleProfileSave = async (e) => {
            e.preventDefault();
          
            const token = localStorage.getItem('token');
            
            // Decode the token to get the userId
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userId = decodedToken.userId;
          
            console.log('Using userId from token:', userId);
          
            const formData = new FormData();
            formData.append('name', profileData.name);
            formData.append('email', profileData.email);
            formData.append('address', profileData.address);
            formData.append('contactNumber', profileData.contactNumber);
            if (profileImage) {
              formData.append('profilePicture', profileImage);
            }
          
            try {
              const response = await axios.put(
                `${BASE_URL}/api/users/${userId}/profile`,
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                  },
                }
              );
              console.log('Update response:', response.data);

          
          
              setBuyer(response.data);
              setEditMode(false);
              setProfileImage(null); // Reset profileImage state after successful save
            } catch (error) {
              setError(error.message || 'An unexpected error occurred');
            }
          };
          
          
          const handleAddressMode = (mode, address = null) => {
            setAddressMode(mode);
            setSelectedAddress(address);
            if (mode === 'edit' && address) {
              setNewAddress(address);
            } else {
              setNewAddress({
                fullName: '',
                phoneNumber: '',
                pinCode: '',
                locality: '',
                address: '',
                city: '',
                state: '',
                landmark: '',
              });
            }
          };
          
          const handleAddressSave = async (e) => {
            e.preventDefault();
          
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            try {
              if (addressMode === 'edit' && selectedAddress) {
                await axios.put(
                  `${BASE_URL}/api/users/${userId}/addresses/${selectedAddress._id}`,
                  newAddress,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
              } else {
                await axios.post(
                  `${BASE_URL}/api/users/${userId}/addresses`,
                  newAddress,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
              }
              const addressesResponse = await axios.get(
                `${BASE_URL}/api/users/${userId}/addresses`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              setAddresses(addressesResponse.data);
              setAddressMode('view');
            } catch (error) {
              setError(error.message || 'An unexpected error occurred');
            }
          };
          
          
          const handleAddressDelete = async (addressId) => {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            try {
              await axios.delete(
                `${BASE_URL}/api/users/${userId}/addresses/${addressId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              setAddresses(addresses.filter((address) => address._id !== addressId));
            } catch (error) {
              setError(error.message || 'An unexpected error occurred');
            }
          };
          
          if (loading) {
            return <div>Loading...</div>;
          }
          
          if (error) {
            return <div>Error: {error}</div>;
          }
          
          return (
            <BuyerProfileContainer>
              <GlobalStyles />
              <WelcomeMessage>Welcome to Your Profile</WelcomeMessage>
              <ProfileHeader>
                <ProfilePicture src={imagePreview || 'default-profile-picture.jpg'} alt="Profile" />
                <ProfileDetails>
                  <Name>{buyer.buyerFields?.name}</Name>
                  <Email>{buyer.email}</Email>
                  <Button onClick={handleEditMode}>
                    {editMode ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </ProfileDetails>
              </ProfileHeader>
              {editMode && (
                <EditForm onSubmit={handleProfileSave}>
                  <FormGroup>
                    <Label>Name:</Label>
                    <Input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Email:</Label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Address:</Label>
                    <Input
                      type="text"
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({ ...profileData, address: e.target.value })
                      }
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Contact Number:</Label>
                    <Input
                      type="text"
                      value={profileData.contactNumber}
                      onChange={(e) =>
                        setProfileData({ ...profileData, contactNumber: e.target.value })
                      }
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Profile Picture:</Label>
                    <Input type="file" onChange={handleProfileImageChange} />
                  </FormGroup>
                  <Button type="submit">Save Profile</Button>
                </EditForm>
              )}
              <Tabs>
                <Tab
                  active={activeTab === 'profile'}
                  onClick={() => setActiveTab('profile')}
                >
                  Profile
                </Tab>
                <Tab
                  active={activeTab === 'orders'}
                  onClick={() => setActiveTab('orders')}
                >
                  Orders
                </Tab>
                <Tab
                  active={activeTab === 'addresses'}
                  onClick={() => setActiveTab('addresses')}
                >
                  Addresses
                </Tab>
              </Tabs>
              <TabContent>
                {activeTab === 'profile' && (
                  <>
                    <h2>Profile Information</h2>
                    <p>Name: {buyer.buyerFields?.name}</p>
                    <p>Email: {buyer.email}</p>
                    <p>Address: {buyer.buyerFields?.address}</p>
                    <p>Contact Number: {buyer.buyerFields?.contactNumber}</p>
                  </>
                )}
                {activeTab === 'orders' && (
                  <OrdersContainer>
                    <h2>Your Orders</h2>
                    {orders.map((order) => (
                      <OrderCard key={order._id}>
                        <p>Order ID: {order._id}</p>
                        <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                        <p>Total Amount: ${order.totalAmount}</p>
                      </OrderCard>
                    ))}
                  </OrdersContainer>
                )}
                {activeTab === 'addresses' && (
                  <AddressContainer>
                    <h2>Your Addresses</h2>
                    {addresses.map((address) => (
                      <AddressCard key={address._id}>
                        <AddressDetails>
                          <p>Full Name: {address.fullName}</p>
                          <p>Phone Number: {address.phoneNumber}</p>
                          <p>Address: {address.address}</p>
                          <p>City: {address.city}</p>
                          <p>State: {address.state}</p>
                          <p>Pin Code: {address.pinCode}</p>
                          <p>Landmark: {address.landmark}</p>
                        </AddressDetails>
                        <AddressActions>
                          <EditButton onClick={() => handleAddressMode('edit', address)}>Edit</EditButton>
                          <DeleteButton onClick={() => handleAddressDelete(address._id)}>Delete</DeleteButton>
                        </AddressActions>
                      </AddressCard>
                    ))}
                    {addressMode === 'add' || (addressMode === 'edit' && selectedAddress) ? (
                      <EditForm onSubmit={handleAddressSave}>
                        <FormGroup>
                          <Label>Full Name:</Label>
                          <Input
                            type="text"
                            value={newAddress.fullName}
                            onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                            required
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label>Phone Number:</Label>
                          <Input
                            type="text"
                            value={newAddress.phoneNumber}
                            onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })}
                            required
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label>Pin Code:</Label>
                          <Input
                            type="text"
                            value={newAddress.pinCode}
                            onChange={(e) => setNewAddress({ ...newAddress, pinCode: e.target.value })}
                            required
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label>Locality:</Label>
                          <Input
                            type="text"
                            value={newAddress.locality}
                            onChange={(e) => setNewAddress({ ...newAddress, locality: e.target.value })}
                            required
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label>Address:</Label>
                          <Input
                            type="text"
                            value={newAddress.address}
                            onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                            required
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label>City:</Label>
                          <Input
                            type="text"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            required
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label>State:</Label>
                          <Input
                            type="text"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            required
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label>Landmark:</Label>
                          <Input
                            type="text"
                            value={newAddress.landmark}
                            onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                          />
                        </FormGroup>
                        <Button type="submit">Save Address</Button>
                      </EditForm>
                    ) : (
                      <Button onClick={() => handleAddressMode('add')}>Add New Address</Button>
                    )}
                  </AddressContainer>
                )}
              </TabContent>
            </BuyerProfileContainer>
          );
        }
        
        export default BuyerProfile;
