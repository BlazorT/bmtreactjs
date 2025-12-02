/* eslint-disable no-async-promise-executor */
// src/hooks/useGmailImport.js
import { useState, useEffect, useCallback } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';

const STORAGE_KEY = 'gmail_auth_data';

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

// Helper: extract email from "John Doe <john@example.com>"
const extractEmail = (fromHeader) => {
  if (!fromHeader) return '';
  const match = fromHeader.match(/<(.+?)>/);
  return match ? match[1] : fromHeader.trim();
};

export const useGmailImport = () => {
  const [profile, setProfile] = useState(null);
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const isSignedIn = !!profile;

  // Load saved session on mount
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved?.profile && saved?.accessToken) {
      setProfile(saved.profile);
      setAccessToken(saved.accessToken);
      setCombinedData(saved.data || []);
      // Optionally auto-refresh data on load
      // fetchAllData(saved.accessToken); // uncomment if you want fresh data on every visit
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
      // Remove surrounding quotes (", “, ”, ')
      namePart = namePart.replace(/^["“”'"]+|["“”'"]+$/g, '');
      return namePart || 'Unknown';
    }

    // No <...> bracket — maybe just an email
    if (fromStr.includes('@')) {
      return 'Unknown'; // or try to extract name from email if you want
    }

    return fromStr.trim();
  };

  const mergeData = (contacts = [], emails = []) => {
    const contactItems = contacts
      .filter((c) => c.phone)
      .map((c) => ({
        content: c.phone.replace(/\D/g, ''), // normalize phone
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
      .filter((item) => item.content); // only valid emails

    const map = new Map();

    [...contactItems, ...emailItems].forEach((item) => {
      const key =
        item.type === 1
          ? item.content.replace(/\D/g, '') // normalize phone as key
          : item.content.toLowerCase(); // normalize email

      if (!key) return;

      // Prefer contacts (type 1) over emails, or keep the one with better name
      const existing = map.get(key);

      if (!existing) {
        map.set(key, item);
      } else if (
        item.type === 1 ||
        (existing.type !== 1 && (!existing.name || existing.name === 'Unknown'))
      ) {
        // Upgrade: prefer phone contact, or better name
        map.set(key, { ...item, type: existing.type === 1 ? 1 : item.type });
      }
    });

    return Array.from(map.values());
  };

  const fetchAllEmails = async (token, onProgress) => {
    return new Promise(async (resolve, reject) => {
      let allEmails = [];
      let pageToken = null;
      let totalFetched = 0;

      try {
        do {
          // Step 1: List messages (lightweight)
          const listResponse = await axios.get(
            'https://gmail.googleapis.com/gmail/v1/users/me/messages',
            {
              headers: { Authorization: `Bearer ${token}` },
              params: {
                maxResults: 500, // Max allowed per page
                pageToken: pageToken,
                // Optional: filter with q= 'label:inbox' or 'from:someone@example.com'
                // q: 'in:inbox',
              },
            },
          );

          const messages = listResponse.data.messages || [];
          const batchSize = messages.length;

          if (batchSize === 0) break;

          // Step 2: Batch fetch message details (only headers we need)
          const messageDetails = await Promise.all(
            messages.map(
              (msg) =>
                axios
                  .get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                      format: 'metadata',
                      metadataHeaders: ['From', 'To', 'Subject', 'Date'],
                    },
                  })
                  .catch(() => null), // silently skip failed ones
            ),
          );

          // Extract useful data
          const formatted = messageDetails.filter(Boolean).map((detail) => {
            const headers = detail.data.payload.headers;
            const getHeader = (name) => headers.find((h) => h.name === name)?.value || '';

            return {
              id: detail.data.id,
              threadId: detail.data.threadId,
              from: getHeader('From'),
              to: getHeader('To'),
              subject: getHeader('Subject'),
              date: getHeader('Date'),
              snippet: detail.data.snippet,
              labelIds: detail.data.labelIds || [],
            };
          });

          allEmails.push(...formatted);
          totalFetched += batchSize;
          pageToken = listResponse.data.nextPageToken;

          // Optional: report progress
          if (onProgress) {
            onProgress({
              fetched: totalFetched,
              emails: allEmails,
              hasMore: !!pageToken,
            });
          }

          // Respect rate limits – small delay
          await new Promise((r) => setTimeout(r, 100)); // 100ms delay
        } while (pageToken);

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
      const { data: userInfo } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(userInfo);

      // 2. Contacts
      const contactsRes = await axios.get(
        'https://people.googleapis.com/v1/people/me/connections',
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            personFields: 'names,emailAddresses,phoneNumbers',
            pageSize: 1000,
          },
        },
      );
      const contacts = (contactsRes.data.connections || []).map((p) => ({
        name: p.names?.[0]?.displayName || 'No Name',
        email: p.emailAddresses?.[0]?.value || '',
        phone: p.phoneNumbers?.[0]?.value || '',
      }));

      // 3. Emails – safe batching
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
        logout(); // token expired
      }
    } finally {
      setLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: (res) => {
      const token = res.access_token;
      setAccessToken(token);
      fetchAllData(token);
    },
    onError: (err) => {
      setError('Login failed: ' + err.error_description);
    },
    scope: [
      'https://www.googleapis.com/auth/contacts.readonly',
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    flow: 'implicit',
  });

  const refetch = useCallback(() => {
    if (accessToken) {
      fetchAllData(accessToken);
    }
  }, [accessToken]);

  const logout = useCallback(() => {
    googleLogout();
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
    login, // first time: login + fetch
    refetch, // already logged in: just refresh data
    logout,
  };
};
