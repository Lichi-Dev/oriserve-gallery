import React, { useEffect, useState, useRef, useCallback } from "react";
import ModalImage from "react-modal-image";
import usePhotoSearch from "../hooks/usePhotoSearch";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { ThreeCircles } from "react-loader-spinner";
import "./gallery.css";

const Gallery = () => {
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [suggestion, setSuggestion] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const { loading, error, photos, hasMore } = usePhotoSearch(query, pageNumber);
  const observer = useRef();
  useEffect(() => {
    const search = localStorage.getItem("search");
    if (search) {
      setSuggestion(JSON.parse(search));
    } else {
      setSuggestion(["dog", "cat", "tree", "football", "computer"]);
      localStorage.setItem(
        "search",
        JSON.stringify(["dog", "cat", "tree", "football", "computer"])
      );
    }
  }, []);
  // callback function for detecting the last element
  const lastPhotoElRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );
  //Triggers whenever there is change in search input.
  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    setPageNumber(1);
  };
  //Triggers when the submit button is clicked.
  const submitSearch = (e) => {
    e.preventDefault();
    const newArray = suggestion;
    const notInArray = newArray.find((item) => item == searchInput);
    if (newArray.length < 5 && !notInArray) {
      newArray.push(searchInput);
    } else if (!notInArray) {
      newArray.shift();
      newArray.push(searchInput);
    }
    setSuggestion(newArray);
    localStorage.setItem("search", JSON.stringify(suggestion));
    setQuery(searchInput);
  };
  return (
    <div>
      <div className="search-container">
        <h1 className="main-heading">Search Photos</h1>
        <form onSubmit={submitSearch}>
          <div className="form">
            <input
              type="text"
              value={searchInput}
              onChange={handleSearch}
              className="input"
            />
            <button type="submit">Search</button>
          </div>
        </form>
        {suggestion.length > 0 && (
          <>
            <div className="suggestion-box">
              <h1 className="suggestion-heading">Suggestions</h1>
              {suggestion.map((item, i) => (
                <button
                  key={i}
                  onClick={(e) => setSearchInput(item)}
                  className="suggestion-button"
                >
                  {item}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="gallery-container">
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 4 }}>
          {photos.length == 0 && !loading ? (
            <div className="no-result-container">
              <h1>No Result</h1>
            </div>
          ) : (
            <Masonry columnsCount={4} gutter={"20px"}>
              {photos?.map((eachItem, index) => {
                if (photos.length === index + 1) {
                  return (
                    <div key={index} ref={lastPhotoElRef}>
                      <ModalImage
                        small={eachItem.image}
                        large={eachItem.image}
                        alt={eachItem.title}
                        hideDownload
                        hideZoom
                      />
                    </div>
                  );
                } else {
                  return (
                    <div key={index}>
                      <ModalImage
                        small={eachItem.image}
                        large={eachItem.image}
                        alt={eachItem.title}
                        hideDownload
                        hideZoom
                      />
                    </div>
                  );
                }
              })}
            </Masonry>
          )}
        </ResponsiveMasonry>
      </div>
      <div className="loader-container">
        {loading && (
          <ThreeCircles
            height="100"
            width="100"
            color="#4fa94d"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="three-circles-rotating"
            outerCircleColor=""
            innerCircleColor=""
            middleCircleColor=""
          />
        )}
      </div>
    </div>
  );
};

export default Gallery;
