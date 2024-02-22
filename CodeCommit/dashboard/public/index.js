
class Header extends HTMLElement {
    constructor() {
      super();
    }
  
  connectedCallback() {
    this.innerHTML = `
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap');
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
}
.wrapper{
  background: #4289fa;
  position: fixed;
  width: 100%;
}

.wrapper nav{
  position: relative;
  display: flex;
}

.links{
  display:flex;
  flex-flow: row nowrap;
  justify-content: center;
  position:absolute;
  top:8px;
  right: 0px;
}
.links div{
  margin-left: 10px;
  margin-right: 10px;
}
#logo{
    margin-left: 20px;
    max-height: 70px;
}
#logo h2{
  display:inline-block;
  position: relative;
  bottom:27px;
  right:10px;
  color:white;
}
#searchbar{
  position:absolute;
  display: flex;
  left:23%;
  top:20px;
}
#searchbar input{
  height:30px;
  min-width: 300px;
  padding-left: 5px;
}
#searchbar button{
  width: 30px;
}
#circle {
  position:absolute;
  z-index: -1;
  top: 0px;
  height: 50px;
  width: 50px;
  background-color: rgb(255, 255, 255);
  border-radius: 50%;
}
.tooltiptext {
  visibility: hidden;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  display:block;
}
#profile:hover #circle{
  transition: all 0.3s ease;
  background: #ff7300;
  
}
#profile:hover .tooltiptext{
  visibility: visible;
}

#cart:hover{
  background-color: #ff7300;
  border-radius: 5px;
  transition: all 0.3s ease;
}
#cart:hover .tooltiptext{
  visibility: visible;
}
#cart h3{
  display: inline-block;
  position: absolute;
  right: 115px;
  color: black;
}
#pointDiv{
  max-width: 100px;
  width:auto;
  height:50px;
  background-color: white;
  border-radius: 5px 5px;
  
}
#pointDiv p{
  text-align: center;
  color:white;
  background-color: #ff7300;
  border-radius: 5px 5px 0 0;
  padding-left: 5px;
  padding-right: 5px;

}
#points{
  text-align: center;
  padding-left: 5px;
  padding-right: 5px;
}
.navlinks{
  min-width: 78px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.navlinks h4{
  color: white;
}
.navlinks:hover{
  background-color: #ff7300;
  border-radius: 5px;
  transition: all 0.3s ease;
}


@media screen and (max-width: 1250px){

}

@media screen and (max-width: 900px){

}

@media screen and (max-width: 400px){

}

</style>
    <div class="wrapper">
        
    <nav>
      
      <div id="logo" onclick="window.location.href='/'">
      <img src="applogo.png" alt="Logo" width="70px" height="70px">
      <h2>company name</h2>      
      </div>
      <div id="searchbar">
        <input type="text" placeholder="Search..">
        <button type="submit"><i class="fa fa-search"></i></button>
      </div>

      <div class="links">

        <div class="navlinks">
          <h4 onclick="javascript:location.href='/about'">about</h4>
        </div>

        <div class="navlinks">
          <h4>returns <br> & orders</h4>
        </div>

        <div id="pointDiv">
          <p>points</p>
          <div id="points">0</div>
        </div>

        <div id="cart">
          <img src="emptyCart.png" alt="Cart" width="50px" height="50px">
          <h3 id="cartitems">4</h3>
          <span class="tooltiptext">Cart</span>
        </div>

        <div id="profile">
          <div><img id="userimg"  src="user.png" alt="user Profile" width="50px" height="50px"></div>
          <div id="circle"></div>
          <span class="tooltiptext">Profile</span>
        </div>

      </div>
    </nav>
  </div>
    `;
    
}
}
customElements.define('main-navbar', Header);
