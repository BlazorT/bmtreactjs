import { closeSnackbar, useSnackbar } from 'notistack';
import React from 'react'; // Note: import React directly is not necessary with React 17+

// Define the types for variant options
type SnackbarVariant = 'default' | 'error' | 'success' | 'warning' | 'info';

export const useShowSnackbar = () => {
  const { enqueueSnackbar } = useSnackbar();

  const action = (snackbarId: number) => (
    <>
      <button
        onClick={() => {
          closeSnackbar(snackbarId);
        }}
      >
        Dismiss
      </button>
    </>
  );

  const showSnackbar = (
    message: React.ReactNode | string,
    variant: SnackbarVariant = 'success',
  ) => {
    // Enqueue the snackbar with the specified message and variant
    // console.log({ message });
    const htmlMessage =
      typeof message !== 'string' ? (
        message ?? ''
      ) : (
        <div dangerouslySetInnerHTML={{ __html: message ?? '' }} />
      );
    enqueueSnackbar(htmlMessage, { variant, autoHideDuration: variant == 'error' ? 10000 : 15000 });
  };

  return showSnackbar;
};
