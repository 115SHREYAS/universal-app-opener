import { DeepLinkHandler } from '../types';

export const facebookHandler: DeepLinkHandler = {
  match: (url) => url.match(/(?:www\.)?facebook\.com\/([^#]+)/),

  build: (webUrl) => {
    const encodedUrl = webUrl.replace(/^https?:\/\//, '');

    return {
      webUrl,
      ios: `fb://facewebmodal/f?href=${encodedUrl}`,
      android: `intent://${encodedUrl}#Intent;scheme=https;package=com.facebook.katana;end`,
      platform: 'facebook',
    };
  },
};
