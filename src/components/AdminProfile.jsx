import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';
import { BASE_URL } from '../api';

// Define colors
const primaryColor = '#1976d2'; // Blue
const secondaryColor = '#607d8b'; // Grey
const backgroundColor = '#f5f5f5'; // Light Grey
const textColor = '#263238'; // Dark Grey

// Global Styles
const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${backgroundColor};
    color: ${textColor};
    font-family: 'Roboto', sans-serif;
  }
`;

// Styled components
const Container = styled.div`
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
  font-size: 24px;
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

const UsersContainer = styled.div`
 margin-top: 40px;
`;

const UserCard = styled.div`
 background-color: #fff;
 border-radius: 10px;
 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
 padding: 20px;
 margin-bottom: 20px;
`;

const AdminProfile = () => {
 const [admin, setAdmin] = useState(null);
 const [users, setUsers] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [activeTab, setActiveTab] = useState('profile');
 const [editMode, setEditMode] = useState(false);
 const [adminProfileData, setAdminProfileData] = useState({
   name: '',
   email: '',
 });
 const [profileImage, setProfileImage] = useState(null);
 const [imagePreview, setImagePreview] = useState(null);

 useEffect(() => {
   const fetchUserData = async () => {
     try {
       const userId = localStorage.getItem('userId');
       const token = localStorage.getItem('token');
       if (!userId || !token) {
         throw new Error('User ID or token not found');
       }

       const [profileResponse, usersResponse] = await Promise.all([
         axios.get(`${BASE_URL}/api/admins/${userId}/profile`, {
           headers: { Authorization: `Bearer ${token}` },
         }),
         axios.get(`${BASE_URL}/api/admin_users`, {
           headers: { Authorization: `Bearer ${token}` },
         }),
       ]);

       const profileData = profileResponse.data || {};
       const usersData = usersResponse.data || {};

       setAdmin(profileData);
       setAdminProfileData({
         name: profileData.name || '',
         email: profileData.email || '',
       });
       const profilePictureUrl = profileResponse.data.profilePicture
         ? profileResponse.data.profilePicture.startsWith('http')
           ? profileResponse.data.profilePicture
           : `${BASE_URL}/${profileResponse.data.profilePicture}`
         : '';

       setImagePreview(profilePictureUrl);
       setUsers(usersResponse.data);

       setLoading(false);
     } catch (error) {
       setError(error.message || 'An unexpected error occurred');
       setLoading(false);
     }
   };

   fetchUserData();
 }, []);

 const handleEditMode = async () => {
   setEditMode(!editMode);

   if (!editMode) {
     try {
       const userId = localStorage.getItem('userId');
       const token = localStorage.getItem('token');
       if (!userId || !token) {
         throw new Error('User ID or token not found');
       }

       const profileResponse = await axios.get(
         `${BASE_URL}/api/admins/${userId}/profile`,
         {
           headers: { Authorization: `Bearer ${token}` },
         }
       );

       const profileData = profileResponse.data || {};
       setAdmin(profileData);
       setAdminProfileData({
         name: profileData.name || '',
         email: profileData.email || '',
       });

       const profilePictureUrl = profileResponse.data.profilePicture
         ? profileResponse.data.profilePicture.startsWith('http')
           ? profileResponse.data.profilePicture
           : `${BASE_URL}/${profileResponse.data.profilePicture}`
         : '';

       setImagePreview(profilePictureUrl);
     } catch (error) {
       setError(error.message || 'An unexpected error occurred');
     }
   } else {
     setAdminProfileData({
       name: '',
       email: '',
     });
   }
 };

 const handleAdminProfileUpdate = async (e) => {
  e.preventDefault();

  try {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const formData = new FormData();

    // Append data to formData
    formData.append('name', adminProfileData.name);
    formData.append('email', adminProfileData.email);

    if (profileImage) {
      formData.append('profilePicture', profileImage);
    }

    const response = await axios.put(
      `${BASE_URL}/api/admin/profile`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('Response data:', response.data);

    setAdmin(response.data);
    setEditMode(false);

    // Update the imagePreview state
    const updatedProfilePictureUrl = response.data.profilePicture
      ? response.data.profilePicture.startsWith('http')
        ? response.data.profilePicture
        : `${BASE_URL}/${response.data.profilePicture}`
      : '';
    setImagePreview(updatedProfilePictureUrl);
  } catch (error) {
    setError(error.response?.data?.message || 'An error occurred while updating the profile');
  }
};
   
   const handleImageChange = (e) => {
   const file = e.target.files[0];
   if (file) {
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
   }
   };
   
   const handleTabChange = (tab) => {
   setActiveTab(tab);
   };
   
   if (loading) {
   return <div>Loading...</div>;
   }
   
   if (error) {
   return <div>Error: {error}</div>;
   }
   
   return (
   <Container>
    <WelcomeMessage>
    Greetings once more, respected Administrator {admin?.name || 'Admin'}!
    </WelcomeMessage>
    <ProfileHeader>
      {imagePreview && (
        <ProfilePicture src={imagePreview} alt="Profile" />
      )}
      <ProfileDetails>
        {editMode ? (
          <EditForm onSubmit={handleAdminProfileUpdate}>
            <FormGroup>
              <Label>Profile Picture:</Label>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
            </FormGroup>
            <FormGroup>
              <Label>Name:</Label>
              <Input
                type="text"
                value={adminProfileData.name}
                onChange={(e) =>
                  setAdminProfileData({ ...adminProfileData, name: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label>Email:</Label>
              <Input
                type="email"
                value={adminProfileData.email}
                onChange={(e) =>
                  setAdminProfileData({ ...adminProfileData, email: e.target.value })
                }
              />
            </FormGroup>
            <Button type="submit">Save</Button>
            <Button type="button" onClick={handleEditMode}>
              Cancel
            </Button>
          </EditForm>
        ) : (
          <>
            <h2>{admin?.name || ''}</h2>
            <p>
              <strong>Email:</strong> {admin?.email || ''}
            </p>
          </>
        )}
      </ProfileDetails>
    </ProfileHeader>
    <Tabs>
      <Tab active={activeTab === 'profile'} onClick={() => handleTabChange('profile')}>
        Profile
      </Tab>
      <Tab active={activeTab === 'users'} onClick={() => handleTabChange('users')}>
        Users
      </Tab>
      <Tab active={activeTab === 'settings'} onClick={() => handleTabChange('settings')}>
        Settings
      </Tab>
    </Tabs>
   
    <TabContent>
      {activeTab === 'profile' && (
        <>
          <Button onClick={handleEditMode}>Edit Profile</Button>
        </>
      )}
      {activeTab === 'users' && (
        <UsersContainer>
          <h3>Registered Users</h3>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            users.map((user) => (
              <UserCard key={user._id}>
                <h4>{user.name}</h4>
                <p>Email: {user.email}</p>
                <p>Role: {user.userType}</p>
              </UserCard>
            ))
          )}
        </UsersContainer>
      )}
      {activeTab === 'settings' && (
        <div>
          <h3>Settings</h3>
          <Button>Change Password</Button>
          <Button>Notification Preferences</Button>
          <Button>Privacy Settings</Button>
        </div>
      )}
    </TabContent>
   </Container>
   );
   };
   
   export default AdminProfile;