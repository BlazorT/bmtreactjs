import { useSelector } from 'react-redux';
import useFetch from '../useFetch';
import useEmailVerification from '../useEmailVerification';
import { useShowToast } from '../useShowToast';

export const useUserAvailability = () => {
  const showToast = useShowToast();
  const { fetchData: checkUser } = useFetch();

  const checkUserAvailability = async (
    email,
    userName,
    id,
    setEmailMessage,
    setUserNameMessage,
  ) => {
    const availBody = {
      email: email,
      userId: userName,
      dspid: '',
      name: '',
      roleId: '',
    };

    await checkUser(
      '/BlazorApi/userexists',
      { method: 'POST', body: JSON.stringify(availBody) },
      async (res) => {
        if (email !== '') {
          const emailInputElement = document.getElementById('email');
          if (res.status && res.data.length !== 0) {
            const isUserName = res.data.find((user) => user.email === email);

            if (isUserName && isUserName?.id !== id) {
              emailInputElement.setCustomValidity(
                `${email} already associated with existing account`,
              );
              setEmailMessage(`${email} already associated with existing account`);
              showToast(`${email} already associated with existing account`, 'warning');
            }
          } else {
            emailInputElement.setCustomValidity('');
          }
          const form = emailInputElement.closest('form');
          if (form) {
            form.addEventListener('submit', (event) => {
              if (!form.checkValidity()) {
                event.preventDefault();
              }
              form.classList.add('was-validated');
            });
          }
        } else if (userName !== '') {
          const userNameInputElement = document.getElementById('userName');

          if (res.status && res.data.length !== 0) {
            const isUserName = res.data.find((user) => user.userName === userName);

            if (isUserName && isUserName?.id !== id) {
              userNameInputElement.setCustomValidity(
                `${userName} already associated with existing account`,
              );
              showToast(`${userName} already associated with existing account`, 'warning');

              setUserNameMessage(`${userName} already associated with existing account`);
            }
          } else {
            userNameInputElement.setCustomValidity('');
          }
          const form = userNameInputElement.closest('form');
          if (form) {
            form.addEventListener('submit', (event) => {
              if (!form.checkValidity()) {
                event.preventDefault();
              }
              form.classList.add('was-validated');
            });
          }
        }
      },
    );
    //
  };

  return { checkUserAvailability };
};
