import { useState } from "react";
import { FaSearch } from "react-icons/fa";

import "./SearchBar.css";

export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");

  const fetchData = (value) => {
    fetch("http://localhost:3001/recipes")
      .then((response) => response.json())
      .then((json) => {
        const results = json.filter((recipe) => {
          return (
            value &&
            recipe &&
            recipe.name &&
            recipe.name.toLowerCase().includes(value.toLowerCase())
          );
        });
        setResults(results);
      });
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        placeholder="Type to search..."
        value={input}
        style={{border:"none"}}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};
