import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowCircleLeft, FaCloudUploadAlt, FaCross, FaPlus } from "react-icons/fa";
import { MdDelete, MdStar } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { CiStar } from "react-icons/ci";
import { useEffect, useState } from "react";
import { Perks } from "./Perks";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth";
import { MyPlaces } from "./MyPlaces";
export const PlacesPage = () => {
  const { action } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photosLink, setPhotosLink] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const { token } = useAuth();
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);

  const getPlaces = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/places`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setPlaces(response.data);
        // console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addPhotosByLink = async (e) => {
    e.preventDefault();
    const response = await axios.post("/upload-by-link", { link: photosLink });
    if (response.status === 200) {
      setAddedPhotos((prev) => {
        return [...prev, response.data];
      });
      toast.success("Photo Added successfully");
      setPhotosLink("");
    }
  };

  const uploadPhoto = async (e) => {
    try {
      const files = e.target.files;
      const data = new FormData();

      for (let file of files) {
        data.append("photos", file);
      }

      const response = await axios.post("http://localhost:3000/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { data: filenames } = response;
      setAddedPhotos((prev) => [...prev, ...filenames]);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const removePhoto = (filename) => {
    setAddedPhotos([...addedPhotos.filter((photo) => photo !== filename)]);
  }

  const selectAsMainPhoto = (filename) => {
    const withoutSelected = addedPhotos.filter((photo) => photo !== filename);
    setAddedPhotos([filename, ...withoutSelected]);

  }

  const emptyStates = () => {
    setTitle("");
    setAddress("");
    setCheckin("");
    setCheckout("");
    setExtraInfo("");
    setPerks([]);
    setMaxGuests("");
    setAddedPhotos([]);
    setDescription("");
    setPrice("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3000/api/places`,
        {
          title,
          address,
          photos: addedPhotos,
          description,
          perks,
          extraInfo,
          checkin,
          checkout,
          maxGuests,
          price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success(response.data.message);
        emptyStates();
        navigate("/account/places");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateFormDetails = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/api/places/${action}`,
        {
          title,
          address,
          photos: addedPhotos,
          description,
          perks,
          extraInfo,
          checkin,
          checkout,
          maxGuests,
          price
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        toast.success(`Saved Changes Successfully !!`);
        navigate("/account/places");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formSubmission = (e, action) => {
    if (action === "new") {
      handleFormSubmit(e);
    } else {
      updateFormDetails(e);
    }
  };

  useEffect(() => {
    getPlaces();
  }, [action]);

  const actionChecker = (action) => {
    if (action === "new") {
      return true;
    } else if (action === undefined) {
      return false;
    } else if (action) {
      return places.some((place) => place._id === action);
    }
    return false;
  };

  const actionChecker2 = (action) => {
    if (action === "new") {
      return false;
    } else if (action === undefined) {
      return false;
    } else if (action) {
      return places.some((place) => place._id === action);
    }
    return false;
  };
  useEffect(() => {
    if (action && action !== "new") {
      axios
        .get(`http://localhost:3000/api/places/${action}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const data = response.data;
          setTitle(data.title);
          setAddress(data.address);
          setAddedPhotos(data.photos);
          setDescription(data.description);
          setPerks(data.perks);
          setExtraInfo(data.extraInfo);
          setCheckin(data.checkin);
          setCheckout(data.checkout);
          setMaxGuests(data.maxGuests);
          setPrice(data.price);
        })
        .catch((error) => console.error("Error fetching place details", error));
    } else {
      emptyStates();
    }
  }, [action, token]);

  const handleDelete = async (action) => {
    const confirm = window.confirm("Do you want to delete?");
    if (confirm) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/places/${action}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 200) {
          toast.success("Data deleted successfully!");
          navigate("/account/places");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
      <div className="p-2">
        {actionChecker(action) || (
          <>
            <div className="flex justify-center">
              <Link
                className="flex w-fit items-center gap-1 mt-4 bg-primary rounded-full px-4 py-3 text-white"
                to={"/account/places/new"}
              >
                <FaPlus />
                Add new Place
              </Link>
            </div>
            <MyPlaces places={places} />
          </>
        )}
  
        {actionChecker(action) && (
          <div className="p-4 w-full md:w-3/4 lg:w-1/2 mx-auto">
            <form onSubmit={(e) => formSubmission(e, action)}>
              {/* Action Buttons */}
              <div className="flex justify-between items-center mb-4">
                <Link
                  to={"/account/places"}
                  className="w-10 h-10 text-2xl flex justify-center items-center bg-primary text-white rounded-full"
                >
                  <FaArrowCircleLeft />
                </Link>
                <div
                  className="w-10 h-10 text-2xl flex justify-center items-center bg-primary text-white rounded-full cursor-pointer"
                  onClick={() => handleDelete(action)}
                >
                  <MdDelete />
                </div>
              </div>
  
              {/* Title */}
              <h2 className="text-xl md:text-2xl mt-4">Title</h2>
              <p className="text-gray-400 text-sm">Short & catchy title</p>
              <input
                type="text"
                placeholder="For eg:- My Lovely Apt"
                className="w-full p-2 border rounded-md"
                name="title"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
  
              {/* Address */}
              <h2 className="text-xl md:text-2xl mt-4">Address</h2>
              <input
                type="text"
                placeholder="Address"
                className="w-full p-2 border rounded-md"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
  
              {/* Photos */}
              <h2 className="text-xl md:text-2xl mt-4">Photos</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Add using a link"
                  className="w-full p-2 border rounded-md"
                  name="photos"
                  value={photosLink}
                  onChange={(e) => setPhotosLink(e.target.value)}
                />
                <button
                  onClick={addPhotosByLink}
                  className="bg-gray-200 px-4 py-2 rounded-md"
                >
                  Add Photo
                </button>
              </div>
  
              {/* Uploaded Photos Grid */}
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {addedPhotos.length > 0 &&
                  addedPhotos.map((link, key) => (
                    <div className="h-32 border rounded-md flex relative" key={key}>
                      <img
                        className="w-full h-full object-cover rounded-md"
                        src={`http://localhost:3000/uploads/${link}`}
                        alt=""
                      />
                      {/* Delete Button */}
                      <div
                        onClick={() => removePhoto(link)}
                        className="absolute top-1 right-1 text-xl cursor-pointer p-1 bg-black opacity-50 text-white rounded-full hover:bg-white hover:text-black"
                      >
                        <IoMdClose />
                      </div>
                      {/* Select as Main Photo */}
                      <div
                        onClick={() => selectAsMainPhoto(link)}
                        className="absolute bottom-1 left-1 text-xl cursor-pointer p-1 rounded-full text-white"
                      >
                        {link === addedPhotos[0] ? <MdStar /> : <CiStar />}
                      </div>
                    </div>
                  ))}
                <label className="h-32 flex justify-center items-center p-6 border rounded-md text-2xl text-gray-600 cursor-pointer">
                  <input type="file" className="hidden" multiple onChange={uploadPhoto} />
                  <FaCloudUploadAlt />
                  Upload
                </label>
              </div>
  
              {/* Description */}
              <h2 className="text-xl md:text-2xl mt-4">Description</h2>
              <textarea
                name="description"
                className="w-full p-2 border rounded-md"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
  
              {/* Perks */}
              <h2 className="text-xl md:text-2xl mt-4">Perks</h2>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                <Perks selected={perks} onChange={setPerks} />
              </div>
  
              {/* Extra Info */}
              <h2 className="text-xl md:text-2xl mt-4">Extra Info</h2>
              <textarea
                name="extraInfo"
                className="w-full p-2 border rounded-md"
                value={extraInfo}
                onChange={(e) => setExtraInfo(e.target.value)}
              />
  
              {/* Check-In, Check-Out, Guests & Price */}
              <h2 className="text-xl md:text-2xl mt-4">Check-In & Check-Out</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <h3>Check In</h3>
                  <input
                    type="text"
                    placeholder="12"
                    className="w-full p-2 border rounded-md"
                    name="checkin"
                    value={checkin}
                    onChange={(e) => setCheckin(e.target.value)}
                  />
                </div>
                <div>
                  <h3>Check Out</h3>
                  <input
                    type="text"
                    placeholder="14"
                    className="w-full p-2 border rounded-md"
                    name="checkout"
                    value={checkout}
                    onChange={(e) => setCheckout(e.target.value)}
                  />
                </div>
                <div>
                  <h3>Max Guests</h3>
                  <input
                    type="number"
                    placeholder="5"
                    className="w-full p-2 border rounded-md"
                    name="maxGuests"
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(e.target.value)}
                  />
                </div>
                <div>
                  <h3>Price Per Night</h3>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full p-2 border rounded-md"
                    name="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
  
              {/* Submit Button */}
              <div className="mt-4">
                <button className="w-full py-2 bg-primary text-white text-lg rounded-md">
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
  
};
