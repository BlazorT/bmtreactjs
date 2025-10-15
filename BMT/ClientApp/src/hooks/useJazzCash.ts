/* eslint-disable @typescript-eslint/no-explicit-any */
import { SetStateAction, Dispatch, useState } from 'react';
import useApi from './useApi';
import dayjs from 'dayjs';
import { PAYMENT_GATEWAY } from 'src/components/utils/types';
import { keepOnlyAlphanumeric } from 'src/helpers/calculateColorStatus';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useShowToast } from './useShowToast';

export const SOCKET_URL = 'http://167.88.45.70:5000';

export function useJazzCash(
  isPopUp: boolean = false,
  gateway: PAYMENT_GATEWAY,
  toPay: string,
  ref: string = 'BMT',
  jazzCashNumber: string,
  jazzCashCNIC: string,
  setJazzCashTxnRef: Dispatch<SetStateAction<string>>,
  onSubmit: (ref: string) => void,
  setJazzCashResponse: Dispatch<SetStateAction<string>>,
) {
  const user = useSelector((state: any) => state.user);
  const showToast = useShowToast();
  const [isPaymentInitiated, setIsPaymentInitiated] = useState<boolean>(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState<boolean>(false);

  const { postData: initiateJazzCashPayment, loading: isPending } = useApi(
    SOCKET_URL + '/api/payment/jc-initiate',
  );

  const [loadingJC, setLoadingJC] = useState<boolean>(false);

  const triggerJazzCashPayment = async (amount?: string, ref?: string) => {
    try {
      setLoadingJC(true);
      const JAZZ_MERCHANT_ID = gateway?.merchantAccountId;
      const JAZZ_MERCHANT_PASSWORD = gateway?.secretKey;

      const TxnDateTime = dayjs().utc().local().format('YYYYMMDDHHmmss');
      const TxnExpiryDateTime = dayjs().utc().local().add(3, 'days').format('YYYYMMDDHHmmss');

      const TxnRefNumber = `BMT${TxnDateTime}`;
      setJazzCashTxnRef(TxnRefNumber);
      const pp_Amount = Math.round(Number(amount ?? toPay) * 100);
      const billRef = `${keepOnlyAlphanumeric(ref)}` + 'D' + dayjs().format('YYYYMMDDHHmmss');

      // console.log({ gateway });
      const transactionDetails = {
        pp_Amount,
        pp_BankID: '',
        pp_BillReference: billRef,
        pp_Description: `Payment for ${billRef}`,
        pp_Language: 'EN',
        pp_MerchantID: JAZZ_MERCHANT_ID,
        pp_Password: JAZZ_MERCHANT_PASSWORD,
        pp_ProductID: '',
        pp_ReturnURL:
          gateway?.callBackUri ??
          'https://hotmealzndealz.com/externalapi/ExternalPaymentsApi/jc-return-url',
        pp_TxnCurrency: 'PKR',
        pp_TxnDateTime: TxnDateTime,
        pp_TxnExpiryDateTime: TxnExpiryDateTime,
        pp_TxnRefNo: TxnRefNumber,
        pp_TxnType: 'MPAY',
        pp_Version: '1.1',
        ppmpf_1: keepOnlyAlphanumeric(user?.userInfo?.email ?? ''),
        ppmpf_2: keepOnlyAlphanumeric(''),
        ppmpf_3: 'web bmt',
      };
      // console.log(transactionDetails);
      const response = await axios.post(
        `${SOCKET_URL}/api/payment/jc-secure-hash`,
        transactionDetails,
      );
      const redirectUrl =
        response?.data?.redirectUrl ||
        'https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/';
      const secureHash = response?.data?.secureHash;
      const form = document.createElement('form');
      form.method = 'post';
      form.action = redirectUrl;
      if (!isPopUp) {
        Object.entries({
          ...transactionDetails,
          pp_SecureHash: secureHash,
        }).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
      } else {
        const popupWidth = Math.round(window.screen.width * 0.8);
        const popupHeight = Math.round(window.screen.height * 0.8);
        const left = (window.screen.width - popupWidth) / 3;
        const top = (window.screen.height - popupHeight) / 3;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formData: Record<string, any> = {};
        new FormData(form).forEach((value, key) => {
          formData[key] = value;
        });
        const paymentWindow = window.open(
          '',
          'JazzCashPayment',
          `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`,
        );

        if (paymentWindow) {
          paymentWindow.document.write(`
                  <html>
                    <body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;height:100vh;">
                      <div style="text-align:center;">
                        <p>Redirecting to JazzCash...</p>
                        <form method="post" action="${redirectUrl}" id="jazzCashForm">
                          ${Object.entries({
                            ...transactionDetails,
                            pp_SecureHash: secureHash,
                          })
                            .map(
                              ([key, value]) =>
                                `<input type="hidden" name="${key}" value="${value}" />`,
                            )
                            .join('\n')}
                        </form>
                        <script>
                          document.getElementById('jazzCashForm').submit();
                        </script>
                      </div>
                    </body>
                  </html>
                `);
          paymentWindow.document.close();
        }
      }

      // console.log(formData);
      // console.log(JSON.stringify(formData));
      // return;
    } catch (error) {
      console.error('JazzCash init error:', error);
    } finally {
      setLoadingJC(false);
    }
  };

  const initiateJCPayment = async (amount?: string, ref?: string) => {
    setIsPaymentInitiated(false);
    setIsPaymentSuccess(false);

    const jcBody = {
      amount: Math.round(Number(amount ?? toPay) * 100), // Directly calculate and round to integer
      mobile: jazzCashNumber,
      description: 'kiosk',
      billRef: `${keepOnlyAlphanumeric(ref)}` + 'D' + dayjs().format('YYYYMMDDHHmmss'),
      cnic: jazzCashCNIC,
      ppmpf_1: keepOnlyAlphanumeric(user?.userInfo?.email ?? ''),
      ppmpf_2: keepOnlyAlphanumeric(''),
      ppmpf_3: 'web bmt',
    };
    // console.log({ jcBody });
    const response = (await initiateJazzCashPayment(jcBody)) as any;
    console.log({ response });
    setJazzCashTxnRef(response?.pp_TxnRefNo || '');

    if (response.pp_ResponseCode === '157') {
      setIsPaymentInitiated(true);
    } else if (response.pp_ResponseCode === '000') {
      setIsPaymentSuccess(true);
      setJazzCashResponse(
        btoa(
          JSON.stringify({
            pp_TxnType: response?.pp_TxnType || '',
            pp_Amount: response?.pp_Amount || '',
            pp_BillReference: response?.pp_BillReference || '',
            pp_ResponseCode: response?.pp_ResponseCode || '',
            pp_RetreivalReferenceNo: response?.pp_RetreivalReferenceNo || '',
            pp_SubMerchantID: response?.pp_SubMerchantID || '',
            pp_TxnCurrency: response?.pp_TxnCurrency || '',
            pp_TxnDateTime: response?.pp_TxnDateTime || '',
            pp_TxnRefNo: response?.pp_TxnRefNo || '',
            pp_MobileNumber: response?.pp_MobileNumber || '',
            pp_CNIC: response?.pp_CNIC || '',
            pp_SecureHash: response?.pp_SecureHash || '',
          }),
        ),
      );
      onSubmit(
        btoa(
          JSON.stringify({
            pp_TxnType: response?.pp_TxnType || '',
            pp_Amount: response?.pp_Amount || '',
            pp_BillReference: response?.pp_BillReference || '',
            pp_ResponseCode: response?.pp_ResponseCode || '',
            pp_RetreivalReferenceNo: response?.pp_RetreivalReferenceNo || '',
            pp_SubMerchantID: response?.pp_SubMerchantID || '',
            pp_TxnCurrency: response?.pp_TxnCurrency || '',
            pp_TxnDateTime: response?.pp_TxnDateTime || '',
            pp_TxnRefNo: response?.pp_TxnRefNo || '',
            pp_MobileNumber: response?.pp_MobileNumber || '',
            pp_CNIC: response?.pp_CNIC || '',
            pp_SecureHash: response?.pp_SecureHash || '',
          }),
        ),
      );
    } else {
      showToast(
        response?.pp_ResponseMessage ||
          'JazzCash payment failed, please try again later. Make sure you have enough balance in your account.',
        'error',
      );
    }
  };

  return {
    triggerJazzCashPayment,
    initiateJCPayment,
    isPending,
    isPaymentInitiated,
    isPaymentSuccess,
    loadingJC,
  };
}
