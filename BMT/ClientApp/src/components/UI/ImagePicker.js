import React, { useEffect, useRef, useState } from 'react';

import IconButton from '@mui/material/IconButton';
import CIcon from '@coreui/icons-react';
import { cilUser } from '@coreui/icons';
import useFetch from 'src/hooks/useFetch';
import moment from 'moment';
import { updateToast } from 'src/redux/toast/toastSlice';
import { useDispatch, useSelector } from 'react-redux';
import { logo } from '../../assets/brand/logo';

const ImagePicker = (prop) => {
  const { image, onChange } = prop;
  const [selectedImage, setSelectedImage] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const [logoAvatar, setLogoAvatar] = useState();
  const [previewImage, setPreviewImage] = useState([]);
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
    lastUpdatedAt: moment().utc().format(),
    lastUpdatedBy: user.userId,
    createdAt: moment().utc().format(),
    createdBy: user.userId,
  });

  const uploadimageData = async () => {
    //alert('uploadimageData');
    const form = new FormData();
    if (selectedImage[0] && logoAvatar) {
      form.append('file', logoAvatar);
    }
    //  }
    form.append('name', data.name);
    form.append('fileName', data.fileName);
    form.append('createdBy', user.userId); // need to put using cookie user id

    const res = await fetch('/BlazorApi/uploadAttachment', {
      method: 'POST',
      body: form,
    }).then((res) => res.json());
    // console.log(res, 'image');
    setData({
      id: 0,
      name: '',
      fileName: '',
      remarks: '',
      createdBy: user.userId,
      lastUpdatedAt: moment().utc().format(),
      lastUpdatedBy: user.userId,
    });

    const fileInputs = document.querySelectorAll('[id^="fileInput"]');
    fileInputs.forEach((fileInput) => {
      fileInput.value = null; // Clear all file input values
    });
    dispatch(
      updateToast({
        isToastOpen: true,
        toastMessage: 'image uploaded successfully',
        toastVariant: 'success',
      }),
    );
    //  indexArray.splice(0, indexArray.length);
    setIsLoading(false);
    /* clearFormData();*/
  };
  //};
  useEffect(() => {
    setSelectedImage(image);
  }, []);

  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
    const file = event.target.files[0];
    setLogoAvatar(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        //setSelectedImage(e.target.value);

        setSelectedImage(reader.result);
        onChange(file.name);
        //
      };
      reader.readAsDataURL(file);
    }
  };
  const handleIconButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-100 d-flex justify-content-center  align-items-center ">
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
            // eslint-disable-next-line no-undef
            src={selectedImage} //../../../../wwwroot/productimages/1f45c509-1137-46a5-a3a0-3aa23215a5ef_.avif
            alt="Selected"
            className="w-100 h-100 object-fit-cover rounded-circle "
          />
        ) : (
          <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
            <IconButton component="span" onClick={handleIconButtonClick}>
              <img src="Profile-pic.jpg" className="w-100 h-100 object-fit-cover rounded-circle" />
              <CIcon className="stock-toggle-icon mandatory-control" icon={cilUser}></CIcon>
            </IconButton>
          </label>
        )}
      </div>
      {/*  <div><button onClick={uploadimageData}>upload</button></div>*/}
    </div>
  );
};

export default ImagePicker;
