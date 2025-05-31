import {
  FaCar,
  FaCloudUploadAlt,
  FaDog,
  FaPlus,
  FaTv,
  FaUpload,
  FaWifi,
} from "react-icons/fa";
import { MdOutlinePool, MdPool } from "react-icons/md";
import { RiProhibited2Line } from "react-icons/ri";

export const Perks = ({ selected, onChange }) => {
  const handleCbClick = (e) => {
    const { name, checked } = e.target;
    if (checked) {
      onChange([...selected, name]);
    } else {
      onChange([...selected.filter((selectedName) => selectedName !== name)]);
    }
  };
  return (
    <>
      <label className="border flex p-3 gap-2 rounded-lg border-gray-400 items-center">
        <input
          type="checkbox"
          name="wifi"
          id=""
          checked={selected.includes("wifi")}
          onChange={handleCbClick}
        />
        <FaWifi />
        <span>Wifi</span>
      </label>
      <label className="border flex p-3 gap-2 rounded-lg border-gray-400 items-center">
        <input type="checkbox" name="parking" id=""checked={selected.includes("parking")} onChange={handleCbClick} />
        <FaCar />
        <span>Free Parking spot</span>
      </label>
      <label className="border flex p-3 gap-2 rounded-lg border-gray-400 items-center">
        <input type="checkbox" name="tv" id=""checked={selected.includes("tv")} onChange={handleCbClick} />
        <FaTv />
        <span>TV</span>
      </label>
      <label className="border flex p-3 gap-2 rounded-lg border-gray-400 items-center">
        <input type="checkbox" name="pets" id=""checked={selected.includes("pets")} onChange={handleCbClick} />
        <FaDog />
        <span>Pets</span>
      </label>
      <label className="border flex p-3 gap-2 rounded-lg border-gray-400 items-center">
        <input type="checkbox" name="entrance" id=""checked={selected.includes("entrance")} onChange={handleCbClick} />
        <RiProhibited2Line />
        <span>Private Entrance</span>
      </label>
      <label className="border flex p-3 gap-2 rounded-lg border-gray-400 items-center">
        <input type="checkbox" name="pool" id=""checked={selected.includes("pool")} onChange={handleCbClick} />
        <MdPool />
        <span>Swimming pool</span>
      </label>
    </>
  );
};
