import { useDispatch } from 'react-redux';
import {
  ConfirmationDialogState,
  setConfirmation,
} from 'src/redux/confirmation_mdl/confirMdlSlice';

export const useShowConfirmation = () => {
  const dispatch = useDispatch();

  const showConfirmation = ({
    header,
    body,
    isOpen = true,
    onYes,
    onNo,
  }: ConfirmationDialogState) => {
    dispatch(setConfirmation({ header, body, isOpen, onYes, onNo }));
  };

  return showConfirmation;
};
