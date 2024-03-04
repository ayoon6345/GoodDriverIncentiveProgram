import React from 'react';
import './navbar.css';

function Navbar() {

  return (
    <div className="wrapper">
      
    <nav>
      
      <div id="logo" onClick={() => {window.location.href='/home'}}>
      <img src={require('./images/applogo.png')} alt="Logo" width="70px" height="70px" />
      <h2>company name</h2>      
      </div>
      <div id="searchbar">
        <input type="text" placeholder="Search.." />
        <button type="submit"><i className="fa fa-search"></i></button>
      </div>
  
      <div className="links">
  
        <div className="navlinks" onClick={() => {window.location.href='/about'}}>
          <h4>about</h4>
        </div>
  
        <div className="navlinks">
          <h4>returns <br /> & orders</h4>
        </div>
  
        <div id="pointDiv">
          <p>points</p>
          <div id="points">0</div>
        </div>
  
        <div id="cart">
          <img src={require('./images/emptyCart.png')} alt="Cart" width="50px" height="50px" />
          <h3 id="cartitems">4</h3>
          <span className="tooltiptext">Cart</span>
        </div>
  
        <div id="profile">
        <div><img id="userimg"  src={require('./images/user.png')} alt="user Profile" width="50px" height="50px" /></div>
          <div id="circle"></div>
          <span className="tooltiptext">Dashboard</span>
        </div>
  
      </div>
    </nav>
  </div>
  );
}

export default (Navbar);


