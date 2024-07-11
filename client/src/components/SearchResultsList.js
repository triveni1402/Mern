import "./SearchResultsList.css";
import { SearchResult } from "./SearchResult";

export const SearchResultsList = ({ results, setQueryName }) => {
  
  return (
    <div className="results-list">
      {results.map((result, id) => {
        return <SearchResult setQueryName={setQueryName} result={result.name} key={id} />;
      })}
    </div>
  );
};