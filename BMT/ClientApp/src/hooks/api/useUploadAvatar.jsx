import useApi from '../useApi';

export const useUploadAvatar = () => {
  const { data, error, loading, postData } = useApi('/BlazorApi/uploadAttachment');
  const { postData: postMultiData } = useApi('/BlazorApi/uploadAttachments');

  const uploadAvatar = async (formBody) => {
    const response = await postData(formBody);
    return response;
  };

  const uploadAttachments = async (formBody) => {
    for (const entry of formBody.entries()) {
      console.log(entry[0], entry[1]);
    }

    const response = await postMultiData(formBody);
    return response;
  };

  return { data, error, loading, uploadAvatar, uploadAttachments };
};
