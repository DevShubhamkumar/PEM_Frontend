// UserDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import { FaUser, FaPhone, FaMapMarkerAlt, FaCity, FaGlobeAmericas, FaLandmark, FaEdit, FaTrash, FaTruck, FaHome, FaPlus, FaLocationArrow } from 'react-icons/fa';
import Footer from '../components/Footer';
import { BASE_URL } from '../api';

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
  const [showForm, setShowForm] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const fetchUserAddresses = async () => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        toast.error('User ID not found');
        return;
      }

      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await axios.get(`${BASE_URL}/api/users/${userId}/profile`, config);

      setAddresses(response.data.addresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Error fetching addresses');
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();

    if (!validateInput()) return;

    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        toast.error('User ID not found');
        return;
      }

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = editingAddressId
        ? await axios.put(`${BASE_URL}/api/users/${userId}/addresses/${editingAddressId}`, formData, config)
        : await axios.post(`${BASE_URL}/api/users/${userId}/addresses`, formData, config);

      toast.success(editingAddressId ? 'Address updated successfully' : 'Address saved successfully');
      fetchUserAddresses();
      resetForm();
      setEditingAddressId(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving/updating address:', error);
      toast.error(`Error ${editingAddressId ? 'updating' : 'saving'} address: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEditAddress = (addressId) => {
    const addressToEdit = addresses.find((address) => address._id === addressId);
    if (addressToEdit) {
      setFormData(addressToEdit);
      setEditingAddressId(addressId);
      setShowForm(true);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        toast.error('User ID not found');
        return;
      }

      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`${BASE_URL}/api/users/${userId}/addresses/${addressId}`, config);
      toast.success('Address deleted successfully');
      fetchUserAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error(`Error deleting address: ${error.response?.data?.message || error.message}`);
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
      default:
        break;
    }

    setFormData((prevData) => ({ ...prevData, [name]: newValue }));
  };
  const fetchUserLocation = () => {
    setIsLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          reverseGeocodeIndia(latitude, longitude);
        },
        error => {
          console.error("Error getting location:", error);
          setIsLoadingLocation(false);
          handleLocationError(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setIsLoadingLocation(false);
      toast.error("Geolocation is not supported by your browser. Please enter your address manually.", {
        duration: 4000,
      });
    }
  };
  
  const handleLocationError = (error) => {
    let message;
    switch(error.code) {
      case error.PERMISSION_DENIED:
        message = "Location access was denied. You can enter your address manually.";
        break;
      case error.POSITION_UNAVAILABLE:
        message = "Location information is unavailable. Please enter your address manually.";
        break;
      case error.TIMEOUT:
        message = "The request to get user location timed out. Please try again or enter your address manually.";
        break;
      default:
        message = "An unknown error occurred. Please enter your address manually.";
    }
    toast.error(message, { duration: 5000 });
  };
  
  const reverseGeocodeIndia = async (latitude, longitude) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/reverse-geocode?latitude=${latitude}&longitude=${longitude}`);
      const result = response.data;
      setFormData(prevData => ({
        ...prevData,
        pinCode: result.pinCode || '',
        locality: result.locality || '',
        address: result.address || '',
        city: result.city || '',
        state: result.state || '',
      }));
      toast.success("Location fetched. Please verify and adjust if needed.");
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Error fetching address details: ${errorMessage}. Please enter manually.`);
    } finally {
      setIsLoadingLocation(false);
    }
  };
  
  // New function to search by PIN code
  const searchByPinCode = async (pincode) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/pincode-search?pincode=${pincode}`);
      const results = response.data;
      if (results.length > 0) {
        const result = results[0]; // Use the first result
        setFormData(prevData => ({
          ...prevData,
          pinCode: result.pinCode || '',
          locality: result.locality || '',
          city: result.city || '',
          state: result.state || '',
        }));
        toast.success("Address details fetched based on PIN code. Please verify and adjust if needed.");
      } else {
        toast.error("No results found for the given PIN code.");
      }
    } catch (error) {
      console.error("Error in PIN code search:", error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Error fetching address details: ${errorMessage}. Please enter manually.`);
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen">
      <Toaster />
      
      {/* Hero Section */}
      <section className="hero relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Manage Your Addresses</h1>
          <p className="text-xl mb-8">Keep your delivery information up to date for a seamless shopping experience.</p>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="wave-bottom"></div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Address Form Section */}
        <section className={`bg-white rounded-lg shadow-lg p-6 mb-12 ${showForm ? '' : 'hidden'}`}>
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h2>
          <button 
            onClick={fetchUserLocation}
            disabled={isLoadingLocation}
            className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-full font-semibold hover:bg-blue-600 transition duration-300 flex items-center justify-center w-full md:w-auto"
          >
            <FaLocationArrow className="mr-2" />
            {isLoadingLocation ? 'Fetching Location...' : 'Use My Current Location'}
          </button>
          <p className="text-sm text-gray-600 mb-4">
            Or <button onClick={() => setShowForm(true)} className="text-blue-500 underline">enter your address manually</button>
          </p>
          <form onSubmit={handleSaveAddress} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input icon={FaUser} name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" required />
            <Input icon={FaPhone} name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="Phone Number" required maxLength={10} />
            <Input icon={FaMapMarkerAlt} name="pinCode" value={formData.pinCode} onChange={handleInputChange} onBlur={() => { if (formData.pinCode.length === 6) { searchByPinCode(formData.pinCode); } }} placeholder="Pin Code" required maxLength={6}/>            <Input icon={FaCity} name="locality" value={formData.locality} onChange={handleInputChange} placeholder="Locality" required />
            <Input icon={FaMapMarkerAlt} name="address" value={formData.address} onChange={handleInputChange} placeholder="Full Address" required className="md:col-span-2" />
            <Input icon={FaCity} name="city" value={formData.city} onChange={handleInputChange} placeholder="City/District/Town" required />
            <Select icon={FaGlobeAmericas} name="state" value={formData.state} onChange={handleInputChange} required />
            <Input icon={FaLandmark} name="landmark" value={formData.landmark} onChange={handleInputChange} placeholder="Landmark (Optional)" className="md:col-span-2" />
            <button type="submit" className="bg-indigo-600 text-white py-3 px-6 rounded-full font-semibold text-lg hover:bg-indigo-700 transition duration-300 md:col-span-2">
              {editingAddressId ? 'Update Address' : 'Save Address'}
            </button>
          </form>
        </section>

        {/* Saved Addresses Section */}
        <section className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Your Addresses</h2>
            <button 
              onClick={() => setShowForm(!showForm)} 
              className="bg-indigo-600 text-white py-2 px-4 rounded-full font-semibold text-lg hover:bg-indigo-700 transition duration-300 flex items-center"
            >
              <FaPlus className="mr-2" /> {showForm ? 'Hide Form' : 'Add New Address'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((address) => (
              <AddressCard 
                key={address._id} 
                address={address} 
                onEdit={handleEditAddress} 
                onDelete={handleDeleteAddress} 
                onDeliverHere={handleDeliverHere} 
              />
            ))}
          </div>
          {addresses.length === 0 && (
            <div className="text-center py-12">
              <FaHome className="text-6xl text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">You haven't added any addresses yet.</p>
              <button 
                onClick={() => setShowForm(true)} 
                className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-full font-semibold hover:bg-indigo-700 transition duration-300"
              >
                Add Your First Address
              </button>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
};

const Input = ({ icon: Icon, name, value, onChange, placeholder, required, maxLength, className }) => (
  <div className={`relative ${className}`}>
    <Icon className="absolute top-3 left-3 text-gray-400" />
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      maxLength={maxLength}
      className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

const Select = ({ icon: Icon, name, value, onChange, required }) => (
  <div className="relative">
    <Icon className="absolute top-3 left-3 text-gray-400" />
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="">Select State</option>
      {['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'J&K', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'].map((state) => (
        <option key={state} value={state}>{state}</option>
      ))}
    </select>
  </div>
);

const AddressCard = ({ address, onEdit, onDelete, onDeliverHere }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition duration-300 hover:shadow-md">
    <h3 className="font-semibold text-lg mb-2 text-gray-800">{address.fullName}</h3>
    <p className="text-gray-600 mb-1">{address.address}</p>
    <p className="text-gray-600 mb-1">{address.city}, {address.state} - {address.pinCode}</p>
    <p className="text-gray-600 mb-2">Phone: {address.phoneNumber}</p>
    {address.landmark && <p className="text-gray-600 mb-2">Landmark: {address.landmark}</p>}
    <div className="flex justify-end space-x-2 mt-4">
      <button onClick={() => onEdit(address._id)} className="text-blue-600 hover:text-blue-800 transition duration-300">
        <FaEdit className="text-xl" />
      </button>
      <button onClick={() => onDelete(address._id)} className="text-red-600 hover:text-red-800 transition duration-300">
        <FaTrash className="text-xl" />
      </button>
      <button 
        onClick={() => onDeliverHere(address)} 
        className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition duration-300 flex items-center"
      >
        <FaTruck className="mr-1" /> Deliver Here
      </button>
    </div>
  </div>
);

export default UserDetailsPage;