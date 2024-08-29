/* // Seller.css */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
body {
  font-family: 'Poppins', sans-serif !important;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.seller-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.seller-navbar {
  background-color: #333;
  color: #fff;
  padding: 1rem;
}

.seller-navbar ul {
  display: flex;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.seller-navbar li {
  margin-right: 1rem;
}

.seller-navbar a {
  color: #fff;
  text-decoration: none;
}

.seller-navbar a:hover {
  color: #ccc;
}

.seller-profile,
.manage-products,
.add-product,
.reviews {
  padding: 2rem;
}
.seller-profile-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.seller-profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.seller-profile-header img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 1.5rem;
}

.seller-profile-info h2 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.seller-profile-info h3 {
  font-size: 1.4rem;
  color: #666;
  margin-bottom: 0;
}

.seller-profile-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2rem;
}

.seller-profile-section {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1.5rem;
}

.seller-profile-section h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.seller-profile-section p {
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.5rem;
}

.profile-info {
  background-color: #fff;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
}

button {
  background-color: #333;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #555;
}

.review {
  background-color: #fff;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}
/* before login Navbar.css================================================================ */
/* Navbar styles */
.navbar {
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Logo styles */
.navbar-brand {
  flex: 0 0 auto;
}

.navbar-brand a {
  text-decoration: none;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.logo-text {
  font-size: 2rem;
  font-weight: 700;
  color: #3498db;
  letter-spacing: -1px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.logo-subtext {
  font-size: 0.8rem;
  color: #7f8c8d;
  font-weight: 500;
  margin-top: -5px;
}

/* Search bar styles */
.navbar-search {
  flex: 1 1 auto;
  max-width: 600px;
  margin: 0 2rem;
  position: relative;
}

.search-input-container {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.search-input-container:focus-within {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.navbar-search input {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  font-size: 1rem;
  background-color: transparent;
  color: #333;
}

.navbar-search input::placeholder {
  color: #95a5a6;
}

.navbar-search button {
  background-color: #3498db;
  border: none;
  padding: 0.875rem 1.5rem;
  cursor: pointer;
  color: #ffffff;
  transition: background-color 0.3s ease;
  border-radius: 0 50px 50px 0;
}

.navbar-search button:hover {
  background-color: #2980b9;
}

/* Search suggestions styles */
.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-top: none;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}

.search-suggestions li {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-suggestions li:hover {
  background-color: #f8f9fa;
}

/* Navigation menu styles */
.navbar-nav ul {
  display: flex;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.navbar-nav .nav-item {
  margin-left: 1.5rem;
  position: relative;
}

.navbar-nav a {
  color: #34495e;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
}

.navbar-nav a:hover {
  color: #3498db;
}

.navbar-nav a svg {
  margin-right: 0.5rem;
}

/* Dropdown styles */
.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0.5rem 0;
  min-width: 180px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

/* Show dropdown on hover for non-mobile devices */
@media (min-width: 769px) {
  .nav-item:hover .dropdown-menu {
    display: block;
  }
}

.dropdown-menu li {
  margin: 0;
}

.dropdown-menu a {
  display: block;
  padding: 0.5rem 1rem;
  color: #34495e;
  font-weight: 400;
}

.dropdown-menu a:hover {
  background-color: #f8f9fa;
}

/* Mobile toggle button styles */
.navbar-toggle {
  display: none;
}

.search-toggle, .menu-toggle {
  background: none;
  border: none;
  color: #3498db;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 1rem;
  padding: 0.5rem;
}

/* Responsive styles */
@media (max-width: 1024px) {
  .navbar-container {
    padding: 0.75rem 1rem;
  }

  .navbar-search {
    max-width: 400px;
    margin: 0 1rem;
  }
}

@media (max-width: 768px) {
  .navbar-container {
    flex-wrap: wrap;
  }

  .navbar-brand {
    flex: 0 0 auto;
    margin-right: auto;
  }

  .navbar-search {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #ffffff;
    padding: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1001;
  }

  .navbar-search.visible {
    display: block;
  }

  .search-input-container {
    display: flex;
    width: 100%;
  }

  .navbar-search input {
    flex: 1;
    width: 100%;
  }

  .navbar-nav {
    display: none;
    flex: 1 1 100%;
    order: 3;
  }

  .navbar-nav.open {
    display: block;
  }

  .navbar-nav ul {
    flex-direction: column;
  }

  .navbar-nav .nav-item {
    margin: 0.75rem 0;
  }

  .dropdown-menu {
    position: static;
    display: none;
    background-color: #f8f9fa;
    border: none;
    padding: 0.5rem 0 0.5rem 1rem;
    box-shadow: none;
  }

  /* Toggle dropdown on click for mobile */
  .nav-item.active .dropdown-menu {
    display: block;
  }

  .navbar-toggle {
    display: flex;
    align-items: center;
    order: 2;
  }
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.navbar-search.visible,
.search-suggestions,
.navbar-nav.open,
.dropdown-menu {
  animation: fadeIn 0.3s ease-out;
}

/* Cart shake animation */
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}

.shake {
  animation: shake 0.5s ease-in-out;
}