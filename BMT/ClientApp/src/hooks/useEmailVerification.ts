import { useEffect, useState } from 'react';
import { useShowToast } from './useShowToast';

interface EmailVerificationResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any; // Adjust this based on the actual response structure
}

interface ApiPostState {
  data: EmailVerificationResponse | null;
  error: Error | null;
  loading: boolean;
  checkEmailValidation: (email: string) => Promise<EmailVerificationResponse>;
}

const useEmailVerification = (): ApiPostState => {
  const [data, setData] = useState<EmailVerificationResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const showToast = useShowToast();

  const checkEmailValidation = async (email: string) => {
    // Create a new AbortController for this request
    const newAbortController = new AbortController();
    const { signal } = newAbortController;

    try {
      setLoading(true);
      showToast('Verifying email...', 'warning');

      const apiKey = 'ac14b02ca6915387d0b3a762684fe85b946bf864';
      const apiUrl = `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        redirect: 'follow',
        signal,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const responseData = await response.json();

      setData(responseData);
      return responseData.data.status;
    } catch (error) {
      setError(error as Error);
      //   showToast((error as Error).message, 'error');
      // Re-throw for error handling in components
    } finally {
      setLoading(false);
      setAbortController(newAbortController);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup function to abort any pending request on unmount
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  return { data, error, loading, checkEmailValidation };
};

export default useEmailVerification;
