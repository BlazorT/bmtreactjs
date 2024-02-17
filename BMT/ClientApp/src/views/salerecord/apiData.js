
import React, { useState } from 'react';
import { useData } from './DataContext';

const apiData = () => {
  const { data, setData } = useData();
  React.useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {

    try {
      const response = await fetch('/BlazorApi/storeLOVS', {
        headers: {
          'Authorization': `cVQ-h9G7QPCs3ErRdmsGNE:APA91bGlsWbE6ouc9jbIskdJOSF0SqwWq-9HXGGeewcs5ESpH-ryhoKYgcYIx19Iay_geMmufvWNb0M6woPo1jYNvIS0tiGZjXluSDuDbLeHyDeHJJ1ZGL_eq06EVb_0AyfsVeCjHND8`,

        },
      });
      const jsonData = await response.json();
      const data = jsonData.data;
      /* 
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  };

  return
};

export default apiData;
