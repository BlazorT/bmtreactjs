import {
  cibFacebook,
  cibGmail,
  cibInstagram,
  cibLinkedin,
  cibSnapchat,
  cibTiktok,
  cibTwitter,
  cibWhatsapp,
  cilShortText,
} from '@coreui/icons';

export const availableInterests = [
  // Existing
  'Technology',
  'Sports',
  'Music',
  'Travel',
  'Cooking',
  'Fitness',
  'Gaming',
  'Movies',

  // New additions
  'Photography',
  'Art & Design',
  'Entrepreneurship',
  'Fashion',
  'Reading',
  'Education',
  'History',
  'Science',
  'Health & Wellness',
  'Politics',
  'Nature',
  'Gardening',
  'Volunteering',
  'Business & Finance',
  'Self-Improvement',
  'Spirituality',
  'Food & Drinks',
  'Automobiles',
  'Home Decor',
];
export const icons = {
  Tiktock: cibTiktok,
  Snapchat: cibSnapchat,
  Facebook: cibFacebook,
  Sms: cilShortText,
  Linkedin: cibLinkedin,
  Twitter: cibTwitter,
  Instagram: cibInstagram,
  Whatsapp: cibWhatsapp, // Assuming WhatsApp is your component for WhatsApp icon
  Email: cibGmail, // Assuming Email is your component for Email icon
};
export const daysList = [
  { id: 1, name: 'Sunday' },
  { id: 2, name: 'Monday' },
  { id: 3, name: 'Tuesday' },
  { id: 4, name: 'Wednesday' },
  { id: 5, name: 'Thursday' },
  { id: 6, name: 'Friday' },
  { id: 7, name: 'Saturday' },
];
export const packageUnits = [
  { id: 1, name: 'Day' },
  { id: 2, name: 'Week' },
  { id: 3, name: 'Month' },
  { id: 4, name: '3 Month' },
  { id: 5, name: '6 Month' },
  { id: 6, name: 'Year' },
  { id: 7, name: '2 Year' },
  { id: 8, name: '3 Year' },
  { id: 9, name: 'No Of Messages' },
];
