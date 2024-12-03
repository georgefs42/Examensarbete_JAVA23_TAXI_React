import React from 'react';
import { Link } from 'react-router-dom';
import "../css/style.css"

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Drivers</Link>
          </li>
          <li>
            <Link to="/driver-income">Driver Income</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
