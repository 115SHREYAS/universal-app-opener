import { DeepLinkHandler } from '../types';

/**
 * Regex patterns to detect supported Twitch URL types
 */
const PATTERNS: Array<[type: string, regex: RegExp]> = [
  ['login', /^twitch\.tv\/login\/?$/],
  ['game', /^twitch\.tv\/directory\/category\/([a-z0-9-]+)\/?$/],
  ['following', /^twitch\.tv\/directory\/following\/?$/],
  ['broadcast', /^twitch\.tv\/dashboard\/stream-manager\?game_id=(\d+)$/],
  ['stream', /^twitch\.tv\/([a-zA-Z0-9_]{4,25})\/?$/],
  // ['channel', /^twitch\.tv\/([a-zA-Z0-9_]{4,25})\/?$/],
  ['video', /^twitch\.tv\/videos\/(\d+)\/?$/],
  ['directory/tags', /^twitch\.tv\/directory\/tags\/([A-Za-z0-9_-]+)\/?$/],
  ['directory/all/tags', /^twitch\.tv\/directory\/all\/tags\/([A-Za-z0-9_-]+)\/?$/],
  [
    'clip',
    /^(?:https?:\/\/)?(?:(?:clips\.twitch\.tv\/)|(?:twitch\.tv\/[a-zA-Z0-9_]{4,25}\/clip\/))([A-Za-z0-9_-]+)\/?$/,
  ],
];

/**
 * Helper to get URL without protocols
 */
const getUrlWithoutProtocol = (url: string) =>
  url.replace(/^https?:\/\//, '').replace(/^www\./, '');

/**
 * Twitch DeepLinkHandler
 */
export const twitchHandler: DeepLinkHandler = {
  /**
   * Match a URL against the Twitch patterns
   *
   * @param url - The URL to match
   * @returns A match array if the URL matches a pattern, otherwise null
   *
   */
  match: (url) => {
    const urlWithoutProtocol = getUrlWithoutProtocol(url);

    for (const [type, pattern] of PATTERNS) {
      const match = urlWithoutProtocol.match(pattern);
      if (match) return [match[0], type, match[1]] as RegExpMatchArray;
    }

    return null;
  },

  /**
   * Build a deep link for the given URL and match
   *
   * @param webUrl - The URL to open in the browser
   * @param match - The match array returned by the match function
   * @returns A deep link object with webUrl, ios, android, and platform properties
   *
   */
  build: (webUrl, match) => {
    const matchUrl = match[0];
    const type = match[1];
    const id = match[2];

    if (!id) {
      return {
        webUrl,
        ios: `twitch://${type}`,
        android: `intent://${matchUrl}#Intent;scheme=https;package=tv.twitch.android.app;S.browser_fallback_url=${encodeURIComponent(webUrl)};end`,
        platform: 'twitch',
      };
    }

    return {
      webUrl,
      ios: `twitch://${type}/${id}`,
      android: `intent://${matchUrl}#Intent;scheme=https;package=tv.twitch.android.app;S.browser_fallback_url=${encodeURIComponent(webUrl)};end`,
      platform: 'twitch',
    };
  },
};
