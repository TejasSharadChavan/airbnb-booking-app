import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export const MainPage = () => {
  const [places, setPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [filteredPlaces, setFilteredPlaces] = useState([]); // Filtered places
  const [searchParams] = useSearchParams(); // Get query from URL

  useEffect(() => {
    // Get search query from URL when component loads
    const query = searchParams.get("search") || "";
    setSearchQuery(query);
  }, [searchParams]); // Run when URL changes

  const getPlacesData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/data`);
      if (response.status === 200) {
        setPlaces(response.data);
        setFilteredPlaces(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPlacesData();
  }, []);
  // Filter places when searchQuery changes
  useEffect(() => {
    const filtered = places.filter(
      (place) =>
        place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPlaces(filtered);
  }, [searchQuery, places]);
  return (
    <>
      <div className="mx-6 mt-6 p-4">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPlaces.length > 0 &&
            filteredPlaces.map((place, key) => (
              <Link
                to={`/place/${place._id}`}
                className="p-3 rounded-xl shadow-sm "
                key={key}
              >
                <div className="w-full h-70 rounded-xl overflow-hidden flex">
                  {place.photos?.[0] && (
                    <img
                      className="w-full h-full object-cover"
                      src={`http://localhost:3000/uploads/${place.photos[0]}`}
                      alt={place.title}
                    />
                  )}
                </div>
                <h2 className="mt-2 font-bold text-lg">{place.title}</h2>
                <h3 className="text-gray-500">{place.address}</h3>
                <h3 className="font-semibold">
                  &#8377;{place.price}{" "}
                  <span className="text-gray-700">price per night</span>
                </h3>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};
