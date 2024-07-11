import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { useState } from "react";
import { Navbar } from "./components/navbar";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { CreateRecipe } from "./pages/create-recipe";
import { Home } from "./pages/home";


import SavedRecipes from './pages/savedrecipes'; // Adjust the path and casing as per actual filename


import { SearchBar } from "./components/SearchBar";
import { SearchResultsList } from "./components/SearchResultsList";
import 'bootstrap/dist/css/bootstrap.min.css'
import CreateUser from "./CreateUser";
import UpdateUser from "./UpdateUser";
import Users from "./Users";  




function App() {
  const [results, setResults] = useState([]);
  return (
    <div className="App">
      <Router>
        <Navbar />
        {/* <div className="search-bar-container">
        <SearchBar setResults={setResults} />
        {results && results.length > 0 && <SearchResultsList results={results} />}
      </div> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-recipe" element={<CreateRecipe />} />
          <Route path="/saved-recipes" element={<SavedRecipes />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Users />} />
          <Route path="/create" element={<CreateUser />}></Route>
          <Route path="/update" element={<UpdateUser />}></Route>
        </Routes>
      </Router>
    </div>
  );
}






export default App;
