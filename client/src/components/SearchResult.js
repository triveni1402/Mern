import "./SearchResult.css";
import * as queryUtils from './../hooks/getQueryName';

export const SearchResult = ({ result, setQueryName }) => {
  setQueryName(result);
  queryUtils.setQueryName(result);
  
  
};