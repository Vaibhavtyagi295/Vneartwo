import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { FaCode, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import { NavDropdown } from 'react-bootstrap';
import axios from 'axios'; // Make sure to install axios: npm install axios
import './Navbar.css';


const searchApis = [
    '/api/products',
    '/api/foodproducts',
    '/api/products-for-sell'
  ];
function NavBar({ isLoggedIn, handleLogout }) {
  const [click, setClick] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const history = useHistory();

  const dropdownItems = [
    { title: 'User', link: '/signUP' },
    { title: 'Worker', link: '/WorkerSignup' },
    { title: 'Shopkeeper', link: '/shopauth' },
    { title: 'Restaurant', link: '/foodsignup' },
    { title: 'Old Product', link: '/sellersignup' },
  ];
  const loog = [
    { title: 'User', link: '/Login' },
    { title: 'Worker', link: '/workerlogIN' },
    { title: 'Shopkeeper', link: '/shopLogin' },
    { title: 'Restaurant', link: '/Foodlogin' },
    { title: 'Old Product', link: '/Sellerlogin' },
  ];

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const requests = searchApis.map((api) => axios.get(`${api}?query=${searchQuery}`));
        const responses = await Promise.all(requests);
        const allResults = responses.map((response) => response.data.flat());
        const mergedResults = allResults.flat();
        setSearchResults(mergedResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
      }
    };

    if (searchQuery.trim() !== '') {
      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchApis]);

  const handleClick = () => setClick(!click);

  const handleLogoutClick = () => {
    handleLogout();
    history.push('/login');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(''); // Clear the search query
    // Navigate to the search results page
    history.push(`/search?query=${searchQuery}`);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink exact to="/" className="nav-logo">
          VNEAR.IN <FaCode />
        </NavLink>

        <form className={click ? 'nav-search active' : 'nav-search'} onSubmit={handleSearchSubmit}>
  <div className="search-bar-container">
    <input
      type="text"
      className="search-bar"
      placeholder="Search..."
      value={searchQuery}
      onChange={handleSearch}
    />
    <button type="submit" className="search-button">
      <FaSearch />
    </button>
  </div>
</form>



        <div className={`nav-menu ${click ? 'active' : ''}`}>
          <ul className="nav-menu-items">
            <li className="nav-item">
              <NavLink exact to="/" activeClassName="active" className="nav-link" onClick={handleClick}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              {!isLoggedIn ? (
                // <NavLink exact to="/login" activeClassName="active" className="nav-link" onClick={handleClick}>
                //   Login
                // </NavLink>
                <NavDropdown title="login"  className="nav-link">
                {loog.map((item, index) => (
                  <li key={index}>
                    <NavLink exact to={item.link} activeClassName="active" className="nav-link" onClick={handleClick}>
                      {item.title}
                    </NavLink>
                  </li>
                ))}
              </NavDropdown>
              ) : (
                <span onClick={handleLogoutClick} className="nav-link">
                  Logout
                </span>
              )}
            </li>
            {!isLoggedIn ? (
              <NavDropdown title="Sign Up" id="signup-dropdown" className="signup-dropdown">
              {dropdownItems.map((item, index) => (
                <li key={index}>
                  <NavLink exact to={item.link} activeClassName="active" className="nav-link" onClick={handleClick}>
                    {item.title}
                  </NavLink>
                </li>
              ))}
            </NavDropdown>
            ) : null}
            <li className="nav-item">
              <NavLink exact to="/Contactpage" activeClassName="active" className="nav-link" onClick={handleClick}>
                Contact Us
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="nav-icon" onClick={handleClick}>
          {click ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;