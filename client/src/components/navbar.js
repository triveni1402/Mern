import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./Navbar.css"
export const Navbar = () => {
  const [cookies, , removeCookie] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const logout = () => {
    removeCookie("access_token");
    window.localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <NavLink to="/" className="nav-item nav-link">
        Home
      </NavLink>
      

      {!cookies.access_token ? (
        <>
          <NavLink to="/login" className="nav-item nav-link">
            Login
          </NavLink>
          <NavLink to="/register" className="nav-item nav-link">
            Register
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to="/create-recipe" className="nav-item nav-link">
            Create Recipe
          </NavLink>
          
          <NavLink to="/saved-recipes" className="nav-item nav-link">
            Saved Recipes
          </NavLink>
          <button
            className="btn btn-danger"
            onClick={logout}
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
};
