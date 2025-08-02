/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useDispatch } from 'react-redux';
import {
  ConfirmationDialogState,
  setConfirmation,
} from 'src/redux/confirmation_mdl/confirMdlSlice';
import { updateToast } from 'src/redux/toast/toastSlice';
import { useSnackbar, SnackbarMessage } from 'notistack';

interface NotificationHook {
  showConfirmation: (config: ConfirmationDialogState) => void;
  showToast: (message: string, variant?: string) => void;
  showSnackbar: (message: SnackbarMessage, variant?: string) => void;
}

export const useNotification = (): NotificationHook => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // Show confirmation dialog
  const showConfirmation = ({
    header,
    body,
    isOpen = true,
    loading,
    onYes,
    onNo,
  }: ConfirmationDialogState): void => {
    dispatch(setConfirmation({ header, body, isOpen, onYes, onNo, loading }));
  };

  // Show toast notification
  const showToast = (message: string, variant: string = 'success'): void => {
    dispatch(updateToast({ isToastOpen: true, toastMessage: message, toastVariant: variant }));
  };

  // Show snackbar notification
  const showSnackbar = (message: SnackbarMessage, variant?: any): void => {
    const messageType =
      typeof message === 'string' ? <div dangerouslySetInnerHTML={{ __html: message }} /> : message;
    enqueueSnackbar(messageType, { variant, autoHideDuration: 3000 });
  };

  return { showConfirmation, showToast, showSnackbar };
};
