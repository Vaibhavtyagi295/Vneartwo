import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from "./components/Homepage/HomePage"
import NavBar from './components/Navbar/Navbar';
import Footer from './components/footer/footer';
import About from './Aboutus/Aboutus';
import Categories from './components/Categories/CategoriesPage';
import SubCategories from './components/SubCategories/SubCategories';
import WhatWeDoPage from './components/whatwedo/WhatWeDoPage';
import WQ from './Admin/papa'
import Login from "./components/login/login"
import SignUP from "./components/login/signup"
import Productc from './Admin/Create-product';
import Subd from './Admin/SubCategory';
import WorkerSignup from './components/worker/worker';
import WorkerLogin from './components/worker/WorkerLogIn';
import Workerpro from './components/worker/workerrpro';
import Displayworker from './components/worker/displayworker';
import Workerlog from './components/worker/workersprofile';
import mama from './mama';
import Shoplogin from "./Shop/Shopproduct/shoplogin"
import ShopProduct from "./Shop/Shopproduct/Product"
import ShopProductDetail from "./Shop/Shopproduct/ProductDetail"
import ShopDisplay from "./Shop/ShopDisplay/ShopDisplay"
import ShopUpdate from "./Shop/ShopDisplay/shopupdate"
import Food from "./food/food"
import Slider from "./Admin/Slider"
import Req from "./Admin/requi"
import 'bootstrap/dist/css/bootstrap.min.css';
import Sell from "./sellig/selling"
import Dashboard from "./Admin/Dashboard"
import WorkerProfile from './components/worker/workersprofile';
import Shopauth from "./Shop/shop-auth"
import Foodsignup from "./food/foodsignup"
import Sellersignup from "./sellig/Sellersignup"
import Sellerlogin from "./sellig/sellerlogin"
import Sellershop from "./sellig/sellershop"
import ProductDetailPage from './Shop/Shopproduct/ProductDetail';
import FoodProductPage from "./food/Foodproduct"
import Foodlogin from "./food/Foodlogin"
import Foodshop from "./food/foodshop"
 import  OldItemPage from "./sellig/SellingProduct.js"
 import ContactPage from './components/contact/contact';
 import joinus from './components/joinus/joinus.js';
 import WorkerDetail from "./Admin/workerdetail.js"
 import Shopofadmin from "./Admin/shopofadmin.js"
 import Foodshops from "./Admin/Foodshoop.js"
 import sellerradmin from "./Admin/sellerr.js"
 import Useradmin from "./Admin/UserDetails.js"
 import ProtectedRoute from './protectedRoute.js';




function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  
    const handleLogout = () => {
      // Perform any necessary actions to log out the user
      localStorage.removeItem('token');
      setIsLoggedIn(false);
    };


  return (
    <Router>
    <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Switch>
        <Route exact path="/" render={() => (
          <>
            <Home />
            <Categories/>
        <ShopProduct/>
        <Sell/>
         <Food/>
          </>
        )} />
        <Route path="/category/:categoryId/subcategories" component={SubCategories} />
        <Route path="/whatwedo" component={WhatWeDoPage} />
        <Route path="/mama" component={mama} />
        <Route path="/www" component={WQ} />
        <Route path="/create-product" component={Productc} />
        <Route path="/create-subproduct" component={Subd} />
        <Route path="/Login" component={Login}/>
        <Route path="/SignUP" component={SignUP} />
        <Route path="/WorkerSignup" component={WorkerSignup} />
        <Route path="/workerlog" component={Workerlog} />
        <Route path="/workerlogIN" component={WorkerLogin} />
        <Route path="/worker/:id" component={Workerpro} />
        <Route path="/work/:id" component={WorkerProfile} />
        <Route path="/WorkerDetail" component={WorkerDetail}/>
        <Route path="/req" component={Req} />
        <Route path="/dashboard/:id" component={ShopDisplay} />
        <Route path="/ShopUpdate/:id" component={ShopUpdate} />
        <Route path="/subcategory/:subcategoryId/workers" component={Displayworker} />
        <Route path="/api/products/:id" component={ProductDetailPage} />
        <Route path="/api/foodproducts/:id" component={FoodProductPage} />
        <Route path="/api/products-for-sell/:id" component={OldItemPage} />
        <Route path="/ContactPage" component={ContactPage} />
        <Route path="/Foodlogin" component={Foodlogin} />
        <Route path="/AboutUs" component={About} />
        <Route path="/Sellerlogin" component={Sellerlogin} />
        <Route path="/joinus" component={joinus} />
        <Route path="/Foodshop/:id" component={Foodshop} />
        <Route path="/sellershop/:id" component={Sellershop} />
        <Route path="/shopauth" component={Shopauth} />
        <Route path="/shopLogin" component={Shoplogin} />
        <Route path="/foodsignup" component={Foodsignup} />
        <Route path="/sellersignup" component={Sellersignup} />
        <Route path="/Foodshops" component={Foodshops} />
        <Route path="/Shopofadmin" component={Shopofadmin} />
        <Route path="/sellerradmin" component={sellerradmin} />

      
        <ProtectedRoute
          path="/Useradmin"
          component={Useradmin}
          isLoggedIn={isLoggedIn}
        />
        

        <Route exact path="/Adminpanel" render={() => (
          <>
          <Slider/>
            <Dashboard />
          </>
        )} />
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;
