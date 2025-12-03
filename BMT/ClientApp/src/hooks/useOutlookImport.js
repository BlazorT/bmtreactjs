/* eslint-disable no-async-promise-executor */
// src/hooks/useOutlookImport.js
import { useState, useEffect, useCallback } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import axios from 'axios';

const STORAGE_KEY = 'outlook_auth_data';

// MSAL Configuration
const msalConfig = {
  auth: {
    // eslint-disable-next-line no-undef
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID, // Replace with your Azure App Client ID
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

const loginRequest = {
  scopes: ['User.Read', 'Contacts.Read', 'Mail.Read'],
};

const msalInstance = new PublicClientApplication(msalConfig);

const saveToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save to localStorage', e);
  }
};

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Failed to load from localStorage', e);
    return null;
  }
};

const clearStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const useOutlookImport = () => {
  const [profile, setProfile] = useState(null);
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const isSignedIn = !!profile;

  // Initialize MSAL
  useEffect(() => {
    msalInstance.initialize();
  }, []);

  // Load saved session on mount
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved?.profile && saved?.accessToken) {
      setProfile(saved.profile);
      setAccessToken(saved.accessToken);
      setCombinedData(saved.data || []);
    }
  }, []);

  // Save to localStorage whenever profile/data changes
  useEffect(() => {
    if (profile && accessToken) {
      saveToStorage({
        profile,
        accessToken,
        data: combinedData,
        timestamp: Date.now(),
      });
    }
  }, [profile, accessToken, combinedData]);

  const extractEmail = (emailStr) => {
    if (!emailStr) return '';
    const match =
      emailStr.match(/<([^>]+)>/) ||
      emailStr.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    return match ? match[1] || match[0] : '';
  };

  const extractName = (fromStr) => {
    if (!fromStr) return 'Unknown';

    const emailMatch = fromStr.match(/<([^>]+)>/);
    if (emailMatch) {
      let namePart = fromStr.substring(0, fromStr.indexOf('<')).trim();
      namePart = namePart.replace(/^["""'"]+|["""'"]+$/g, '');
      return namePart || 'Unknown';
    }

    if (fromStr.includes('@')) {
      return 'Unknown';
    }

    return fromStr.trim();
  };

  const mergeData = (contacts = [], emails = []) => {
    const contactItems = contacts
      .filter((c) => c.phone)
      .map((c) => ({
        content: c.phone.replace(/\D/g, ''),
        name: c.name || 'No Name',
        type: 1, // phone
      }));

    const emailItems = emails
      .filter((e) => e.from)
      .map((e) => {
        const email = extractEmail(e.from);
        return {
          content: email,
          name: extractName(e.from),
          type: 2, // email
          subject: e.subject || '(no subject)',
          date: e.date || '',
        };
      })
      .filter((item) => item.content);

    const map = new Map();

    [...contactItems, ...emailItems].forEach((item) => {
      const key = item.type === 1 ? item.content.replace(/\D/g, '') : item.content.toLowerCase();

      if (!key) return;

      const existing = map.get(key);

      if (!existing) {
        map.set(key, item);
      } else if (
        item.type === 1 ||
        (existing.type !== 1 && (!existing.name || existing.name === 'Unknown'))
      ) {
        map.set(key, { ...item, type: existing.type === 1 ? 1 : item.type });
      }
    });

    return Array.from(map.values());
  };

  const fetchAllEmails = async (token, onProgress) => {
    return new Promise(async (resolve, reject) => {
      let allEmails = [];
      let skipToken = null;
      let totalFetched = 0;

      try {
        do {
          const url = skipToken
            ? skipToken
            : 'https://graph.microsoft.com/v1.0/me/messages?$top=500&$select=id,subject,from,toRecipients,receivedDateTime,bodyPreview';

          const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const messages = response.data.value || [];
          const batchSize = messages.length;

          if (batchSize === 0) break;

          const formatted = messages.map((msg) => ({
            id: msg.id,
            from: msg.from?.emailAddress?.address
              ? `${msg.from.emailAddress.name || ''} <${msg.from.emailAddress.address}>`
              : '',
            to: msg.toRecipients?.[0]?.emailAddress?.address || '',
            subject: msg.subject || '',
            date: msg.receivedDateTime || '',
            snippet: msg.bodyPreview || '',
          }));

          allEmails.push(...formatted);
          totalFetched += batchSize;
          skipToken = response.data['@odata.nextLink'] || null;

          if (onProgress) {
            onProgress({
              fetched: totalFetched,
              emails: allEmails,
              hasMore: !!skipToken,
            });
          }

          await new Promise((r) => setTimeout(r, 100));
        } while (skipToken);

        resolve(allEmails);
      } catch (error) {
        console.error('Error fetching all emails:', error);
        reject(error);
      }
    });
  };

  const fetchAllData = async (token) => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      // 1. User Info
      const { data: userInfo } = await axios.get('https://graph.microsoft.com/v1.0/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile({
        name: userInfo.displayName,
        email: userInfo.mail || userInfo.userPrincipalName,
        picture: null, // Microsoft Graph requires separate call for photo
      });

      // 2. Contacts
      const contactsRes = await axios.get(
        'https://graph.microsoft.com/v1.0/me/contacts?$top=1000',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const contacts = (contactsRes.data.value || []).map((c) => ({
        name: c.displayName || 'No Name',
        email: c.emailAddresses?.[0]?.address || '',
        phone: c.mobilePhone || c.homePhones?.[0] || c.businessPhones?.[0] || '',
      }));

      // 3. Emails
      const allEmails = await fetchAllEmails(token, (progress) => {
        console.log(`Fetched ${progress.fetched} emails so far...`);
      });

      const merged = mergeData(contacts, allEmails);
      setCombinedData(merged);
      setAccessToken(token);
    } catch (err) {
      console.log({ err });
      setError(err.response?.data?.error?.message || 'Failed to fetch data');
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async () => {
    try {
      const response = await msalInstance.loginPopup(loginRequest);
      const token = response.accessToken;
      setAccessToken(token);
      fetchAllData(token);
    } catch (err) {
      setError('Login failed: ' + (err.message || 'Unknown error'));
      console.error('Login error:', err);
    }
  }, []);

  const refetch = useCallback(() => {
    if (accessToken) {
      fetchAllData(accessToken);
    }
  }, [accessToken]);

  const logout = useCallback(async () => {
    try {
      await msalInstance.logoutPopup();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setProfile(null);
    setAccessToken(null);
    setCombinedData([]);
    clearStorage();
  }, []);

  return {
    data: combinedData,
    profile,
    loading,
    error,
    isSignedIn,
    login,
    refetch,
    logout,
  };
};
