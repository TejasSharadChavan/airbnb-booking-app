import { useEffect, useState } from "react";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

export const MyPlaces = ({ places }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (places.length > 0) {
      setIsLoading(false);
    }
  }, [places]);

  return (
    <>
      {isLoading ? (
        <h1 className="text-center text-lg font-semibold">Loading...</h1>
      ) : (
        <div className="mt-4 p-2 w-full md:w-1/2 mx-auto flex flex-col gap-4">
          {places.map((data, key) => (
            <div key={key} className="w-full">
              <Link
                to={`/account/places/${data._id}`}
                className="flex flex-col md:flex-row p-4 rounded-4xl gap-4 cursor-pointer border border-primary items-center md:items-start"
              >
                <div className="h-50 w-80 overflow-hidden grow shrink-0 justify-center rounded-4xl">
                  {data.photos.length > 0 && (
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${data.photos[0]}`}
                      alt="image 1"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="text-center md:text-left">
                  <h2 className="text-lg md:text-xl font-semibold underline mb-2">
                    {data.title.toUpperCase()}
                  </h2>
                  <p className="text-sm md:text-base">{data.description}</p>
                </div>
              </Link>
            </div>
          ))}

          <Link
            to={"/account"}
            className="w-12 h-12 mt-4 text-2xl flex justify-center items-center bg-primary text-white rounded-full self-center md:self-start"
          >
            <FaArrowAltCircleLeft />
          </Link>
        </div>
      )}
    </>
  );
};
