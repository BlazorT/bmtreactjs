/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useRef, useState } from 'react';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useSelector } from 'react-redux';
import Button from './Button';

const ImagePicker = (prop) => {
  dayjs.extend(utc);
  const { image, onChange, note } = prop; // ✅ added note prop

  const [selectedImage, setSelectedImage] = useState();
  const [userHasSelected, setUserHasSelected] = useState(false);

  const user = useSelector((state) => state.user);

  const [data, setData] = useState({
    name: '',
    fileName: 0,
    userId: '',
    lastUpdatedAt: dayjs().utc().format(),
    lastUpdatedBy: user.userId,
    createdAt: dayjs().utc().format(),
    createdBy: user.userId,
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (image && !userHasSelected && typeof image === 'string') {
      setSelectedImage(image);
    }
  }, [image, userHasSelected]);

  const handleImageChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setUserHasSelected(true);
        onChange(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-100 d-flex flex-column justify-content-center align-items-center">
      <div className="image-picker-container">
        <input
          type="file"
          accept="image/*"
          id="fileAvatar"
          name="fileAvatar"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="image-picker-input"
        />
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Selected"
            className="w-100 h-100 object-fit-cover rounded-circle"
          />
        ) : (
          <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
            <Button onClick={handleIconButtonClick} className="w-100 h-100 bg-primary">
              <img src="Profile-pic.jpg" className="w-100 h-100 object-fit-cover rounded-circle" />
            </Button>
          </label>
        )}
      </div>

      {/* ✅ Display note under the picker */}
      {note && <small className="form-text text-muted mt-2">{note}</small>}
    </div>
  );
};

export default ImagePicker;
