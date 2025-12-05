import React, { useEffect, useRef, useState } from 'react';

import CIcon from '@coreui/icons-react';
import { cilUser } from '@coreui/icons';
import useFetch from 'src/hooks/useFetch';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { updateToast } from 'src/redux/toast/toastSlice';
import { useDispatch, useSelector } from 'react-redux';
import { logo } from '../../assets/brand/logo';
import Button from './Button';

const ImagePicker = (prop) => {
  dayjs.extend(utc);
  const { image, onChange, note } = prop; // ✅ added note prop

  const [selectedImage, setSelectedImage] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const [logoAvatar, setLogoAvatar] = useState();
  const [previewImage, setPreviewImage] = useState([]);
  const [userHasSelected, setUserHasSelected] = useState(false);

  const user = useSelector((state) => state.user);
  const {
    response: createImageRes,
    loading: createImageLoading,
    error: createImageError,
    fetchData: uploadImages,
  } = useFetch();
  const [data, setData] = useState({
    name: '',
    fileName: 0,
    userId: '',
    lastUpdatedAt: dayjs().utc().format(),
    lastUpdatedBy: user.userId,
    createdAt: dayjs().utc().format(),
    createdBy: user.userId,
  });

  const uploadimageData = async () => {
    const form = new FormData();
    if (selectedImage[0] && logoAvatar) {
      form.append('file', logoAvatar);
    }
    form.append('name', data.name);
    form.append('fileName', data.fileName);
    form.append('createdBy', user.userId);

    const res = await fetch('/BlazorApi/uploadAttachment', {
      method: 'POST',
      body: form,
    }).then((res) => res.json());

    setData({
      id: 0,
      name: '',
      fileName: '',
      remarks: '',
      createdBy: user.userId,
      lastUpdatedAt: dayjs().utc().format(),
      lastUpdatedBy: user.userId,
    });

    const fileInputs = document.querySelectorAll('[id^="fileInput"]');
    fileInputs.forEach((fileInput) => {
      fileInput.value = null;
    });

    dispatch(
      updateToast({
        isToastOpen: true,
        toastMessage: 'image uploaded successfully',
        toastVariant: 'success',
      }),
    );

    setIsLoading(false);
  };

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (image && !userHasSelected && typeof image === 'string') {
      setSelectedImage(image);
    }
  }, [image, userHasSelected]);

  const handleImageChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
    const file = event.target.files[0];
    setLogoAvatar(file);

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
              <img
                src="Profile-pic.jpg"
                className="w-100 h-100 object-fit-cover rounded-circle"
              />
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
