import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styl.css';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`sidebar${isSidebarOpen ? '' : ' collapsed'}`}>
      <div className="toggle-btn" onClick={handleToggleSidebar}>
        <i className={`fas fa-chevron-${isSidebarOpen ? 'left' : 'right'}`}></i>
      </div>
      <ul className="nav flex-column sticky-top pl-0 pt-5 p-3 mt-3">
        <li className="nav-item mb-2 mt-3">
          <a className="nav-link" href="#">
            <h5>VNear</h5>
          </a>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link" to="/create-product">
            <i className="fas fa-user font-weight-bold"></i> <span className="ml-3">CREATE PRODUCT</span>
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link" to="/create-subproduct">
            <i className="far fa-file-word font-weight-bold"></i> <span className="ml-3">CREATE SUBPRODUCT</span>
          </Link>
          
          <ul className="list-unstyled flex-column pl-3 collapse" id="submenu1" aria-expanded="false">
            <li className="nav-item mb-2">
              <a className="nav-link" href=""><i className="fas fa-book-reader"></i> Data Report </a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link" href=""> <i className="fas fa-book-medical"></i> File Report </a>
            </li>
          </ul>
        </li>
        <li className="nav-item mb-2">
        <Link className="nav-link" to="/Req">
            <i className="fas fa-user font-weight-bold"></i> <span className="ml-3">Request</span>
          </Link>
        </li>
        <li className="nav-item mb-2">
          <a className="nav-link" href="#">
            <i className="fas fa-file-export font-weight-bold"></i><span className="ml-3">Export</span>
          </a>
        </li>
        <li className="nav-item mb-2">
          <a className="nav-link" href="#">
            <i className="fas fa-tablet-alt font-weight-bold"></i><span className="ml-3">Snippets</span>
          </a>
        </li>
        <li className="nav-item mb-2">
          <a className="nav-link" href="#">
            <i className="fas fa-atom font-weight-bold"></i> <span className="ml-3">Flex</span>
          </a>
        </li>
        <li className="nav-item mb-2">
          <a className="nav-link" href="#">
            <i className="far fa-folder font-weight-bold"></i> <span className="ml-3">Layouts</span>
          </a>
        </li>
        <li className="nav-item mb-2">
          <a className="nav-link" href="#">Templates</a>
        </li>
        <li className="nav-item mb-2">
          <a className="nav-link" href="#">Themes</a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
