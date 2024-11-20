import "./App.css";
import {BrowserRouter as Router,Routes,Route,NavLink} from "react-router-dom";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Cart from "./components/Cart";
import Login from "./components/Login";
import PayGateway from "./components/Payment";

function App() {

  return (
    <Router>
      <div>
      <nav>
          <ul>
            <li onClick={() => {window.location.href ='/SignUp' }} id="Logo">ShopVista</li>
            <li><NavLink to="/Home" activeClassName="active">Home</NavLink>
            </li>
            <li><NavLink to="/Cart" activeClassName="active">Cart</NavLink>
            </li>
            <li><NavLink to="/Payment" activeClassName="active">Payment</NavLink>
            </li>
            <li>
              <button><NavLink to="/SignUp" activeClassName="active">Sign Up</NavLink></button>
            </li>
            <li>
              <button><NavLink to="/Login" activeClassName="active">Login</NavLink></button>
            </li>
            <li>
              <input type="search" placeholder="Search For Item" />
            </li>
            <video autoPlay muted loop >
              <source src="/video/icons8-search.gif" type="video/gif" />
           </video>
          </ul>
        </nav>
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Payment" element={<PayGateway />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
