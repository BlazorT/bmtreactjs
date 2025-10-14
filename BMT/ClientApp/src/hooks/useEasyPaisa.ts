/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import AesJs from 'aes-js';
import { Buffer } from 'buffer';
import dayjs from 'dayjs';
import queryString from 'query-string';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PAYMENT_GATEWAY } from 'src/components/utils/types';
import { keepOnlyAlphanumeric } from 'src/helpers/calculateColorStatus';

function pkcs5Pad(text: string, blockSize: number): string {
  const pad = blockSize - (text.length % blockSize);
  return text + String.fromCharCode(pad).repeat(pad);
}

function encryptRequestFields(fields: Record<string, string>, key: string): string {
  const sortedKeys = Object.keys(fields).sort();
  const concatenated = sortedKeys.map((k) => `${k}=${fields[k]}`).join('&');
  const padded = pkcs5Pad(concatenated, 16);
  const aes = new AesJs.ModeOfOperation.ecb(AesJs.utils.utf8.toBytes(key));
  const encryptedBytes = aes.encrypt(AesJs.utils.utf8.toBytes(padded));
  return Buffer.from(encryptedBytes).toString('base64');
}

export const useEasyPaisa = (
  isPopUp: boolean = false,
  totalOrderAmount: number,
  paymentGateway: PAYMENT_GATEWAY,
  orderRef: string,
) => {
  const user = useSelector((state: any) => state.user);

  const [postData, setPostData] = useState<{
    uri: string;
    body: string;
  } | null>(null);

  const prepareRequest = useCallback(
    (amount?: string, ref?: string) => {
      const orderNumber = ref
        ? keepOnlyAlphanumeric(ref)
        : `${keepOnlyAlphanumeric(orderRef)}` + 'D' + dayjs().format('YYYYMMDDHHmmss');
      const fields: Record<string, string> = {
        amount: amount ? amount : totalOrderAmount.toFixed(1),
        //   amount: "1.0",
        ...(user?.userInfo?.email && { emailAddr: user?.userInfo?.email }),
        storeId: paymentGateway?.profileId,
        autoRedirect: '1',
        orderRefNum: orderNumber,
        paymentMethod: 'MA_PAYMENT_METHOD',
        postBackURL: `${window.location.origin}/ep-token`, // update in production
        // postBackURL: `http://167.88.45.70:5000/api/payment/ep-callback`, // update in production
      };

      const encryptedValue = encryptRequestFields(fields, paymentGateway?.cert || '');
      const requestBody = { ...fields, merchantHashedReq: encryptedValue };
      const formBody = queryString.stringify(requestBody);
      setPostData({
        uri: paymentGateway?.callBackUri || '',
        body: formBody,
      });
    },
    [
      paymentGateway?.callBackUri,
      paymentGateway?.cert,
      paymentGateway?.profileId,
      totalOrderAmount,
      orderRef,
      user,
    ],
  );

  const redirectWithPost = useCallback(() => {
    if (!postData) return;

    if (isPopUp) {
      // Open popup window
      const popupWidth = Math.round(window.screen.width * 0.5);
      const popupHeight = Math.round(window.screen.height * 0.8);
      const left = (window.screen.width - popupWidth) / 3;
      const top = (window.screen.height - popupHeight) / 3;
      const popup = window.open(
        '',
        'paymentPopup',
        `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`,
      );

      if (!popup) {
        // alert("Popup blocked. Please allow popups for this site.");
        return;
      }

      // Create form inside popup
      const popupDoc = popup.document;
      const form = popupDoc.createElement('form');
      form.method = 'POST';
      form.action = postData.uri;

      postData.body.split('&').forEach((pair) => {
        const [key, value] = pair.split('=');
        const input = popupDoc.createElement('input');
        input.type = 'hidden';
        input.name = decodeURIComponent(key);
        input.value = decodeURIComponent(value);
        form.appendChild(input);
      });

      popupDoc.body.appendChild(form);
      form.submit();
    } else {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = postData.uri;

      postData.body.split('&').forEach((pair) => {
        const [key, value] = pair.split('=');
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = decodeURIComponent(key);
        input.value = decodeURIComponent(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      form.remove();
    }
  }, [postData, isPopUp]);

  useEffect(() => {
    if (postData) redirectWithPost();
  }, [postData, redirectWithPost]);

  return { prepareRequest };
};
