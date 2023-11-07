import axios from "axios";
import React, { useEffect, useState } from "react";

//This hook takes query and pageNumber parameter to return array of photos that is fetched from flickr api.
const usePhotoSearch = (query, pageNumber) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  // This useEffect is used to set the photos back to empty state whenever the query is changed.
  useEffect(() => {
    setPhotos([]);
  }, [query]);
  //This useEffect is used to fetch the photos from the flickr API.
  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    //If the query is empty, it will fetch the photos from flickr.photos.getRecent which will be the default case.
    if (query == "") {
      axios({
        method: "GET",
        url: `https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=a856b9dec52b4f412babb3c0575f68d7&format=json&nojsoncallback=1`,
        params: { page: pageNumber, per_page: 10 },
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
        .then((res) => {
          console.log(res.data);
          setPhotos((prev) => {
            return [
              ...prev,
              ...res.data.photos.photo.map((item) => {
                return {
                  image: `http://farm${item.farm}.static.flickr.com/${item.server}/${item.id}_${item.secret}.jpg`,
                  title: item.title,
                };
              }),
            ];
          });
          setHasMore(res.data.photos.photo.length > 0);
          setLoading(false);
          console.log(res.data);
        })
        .catch((err) => {
          if (axios.isCancel(err)) return;
          setError(true);
        });
    }
    //If the query is not empty, it will fetch the photos from flickr.photos.search according to the query.
    else {
      axios({
        method: "GET",
        url: `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=a856b9dec52b4f412babb3c0575f68d7&format=json&nojsoncallback=1`,
        params: { tags: query, page: pageNumber, per_page: 10 },
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
        .then((res) => {
          console.log(res.data);
          setPhotos((prev) => {
            return [
              ...prev,
              ...res.data.photos.photo.map((item) => {
                return {
                  image: `http://farm${item.farm}.static.flickr.com/${item.server}/${item.id}_${item.secret}.jpg`,
                  title: item.title,
                };
              }),
            ];
          });
          setHasMore(res.data.photos.photo.length > 0);
          setLoading(false);
          console.log(res.data);
        })
        .catch((err) => {
          if (axios.isCancel(err)) return;
          setError(true);
        });
    }
    return () => cancel();
  }, [query, pageNumber]);
  // Returning all the variables
  return { loading, error, photos, hasMore };
};

export default usePhotoSearch;
