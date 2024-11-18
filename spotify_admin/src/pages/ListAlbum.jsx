import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { url } from '../App'; // Correct import for named export

const ListAlbum = () => {
  const [data, setData] = useState([]);

  const fetchAlbums = async () => {
    try {
      console.log("API URL:", url); // Verify the URL value
      const response = await axios.get(`${url}/api/album/list`);
      
      if (response.data.success) {
        setData(response.data.albums);
      } else {
        toast.error("Failed to fetch albums.");
      }
    } catch (error) {
      console.error("Error occurred while fetching albums:", error);
      toast.error("Error occurred while fetching albums.");
    }
  };

  const removeAlbum = async (id) => {
    try {
      const response = await axios.post(`${url}/api/album/remove`, { id });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAlbums();
      }
    } catch (error) {
      console.error("Error occurred while removing album:", error);
      toast.error("Error occurred while removing album.");
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  // Debugging: Check if data is being populated
  console.log("Albums Data:", data);

  return (
    <div>
      <p>All Albums List</p>
      <br />
      <div>
        <div className='sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100'>
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Album Colour</b>
          <b>Action</b>
        </div>

        
        {data && data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className='grid grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5'>
              <img className='w-12' src={item.image} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.desc}</p>
              <input type="color" value={item.bgColour} />
              <p onClick={() => removeAlbum(item._id)} className='cursor-pointer'>x</p>
            </div>
          ))
        ) : (
          <p>No albums found</p> // Show a message if no albums are available
        )}
      </div>
    </div>
  );
};

export default ListAlbum;