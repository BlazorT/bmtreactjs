/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch } from 'react-redux';
import {
  ConfirmationDialogState,
  setConfirmation,
} from 'src/redux/confirmation_mdl/confirMdlSlice';
import { updateToast } from 'src/redux/toast/toastSlice';

interface NotificationHook {
  showConfirmation: (config: ConfirmationDialogState) => void;
  showToast: (message: string, variant?: string) => void;
}

export const useNotification = (): NotificationHook => {
  const dispatch = useDispatch();

  // Show confirmation dialog
  const showConfirmation = ({
    header,
    body,
    isOpen = true,
    onYes,
    onNo,
  }: ConfirmationDialogState): void => {
    dispatch(setConfirmation({ header, body, isOpen, onYes, onNo }));
  };

  // Show toast notification
  const showToast = (message: string, variant: string = 'success'): void => {
    dispatch(updateToast({ isToastOpen: true, toastMessage: message, toastVariant: variant }));
  };
  // Show snackbar notification

  return {
    showConfirmation,
    showToast,
  };
};
