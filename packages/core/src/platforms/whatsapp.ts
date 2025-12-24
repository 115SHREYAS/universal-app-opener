import { DeepLinkHandler } from '../types';

export const whatsappHandler: DeepLinkHandler = {
  match: (url) =>
    url.match(/^(?:https?:\/\/)?(?:www\.)?wa\.me\/\+?(\d{1,3})(\d+)(?:\?text=([^&]+))?$/),

  build: (webUrl, match) => {
    const countryCode = match[1];
    const phoneNumber = match[2];
    const text = match[3];

    const fullNumber = `+${countryCode}${phoneNumber}`;

    const encodedText = text ? decodeURIComponent(text) : null;

    const query =
      `phone=${fullNumber}` + (encodedText ? `&text=${encodeURIComponent(encodedText)}` : '');

    return {
      webUrl: `https://web.whatsapp.com/send?${query}`,
      ios: `whatsapp://send?${query}`,
      android: `intent://send?${query}#Intent;scheme=whatsapp;package=com.whatsapp;end`,
      platform: 'whatsapp',
    };
  },
};
