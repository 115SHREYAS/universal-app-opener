export interface DeepLinkResult {
  webUrl: string;
  ios: string | null;
  android: string | null;
  platform: 'youtube' | 'linkedin' | 'instagram' | 'unknown';
} 

export function generateDeepLink(url: string): DeepLinkResult {
  const webUrl = url.trim();
  
  const youtubeWatchMatch = webUrl.match(/youtube\.com\/watch\?v=([^&]+)/);
  const youtubeShortMatch = webUrl.match(/youtu\.be\/([^?]+)/);
  
  if (youtubeWatchMatch || youtubeShortMatch) {
    const videoId = youtubeWatchMatch ? youtubeWatchMatch[1] : youtubeShortMatch![1];
    return {
      webUrl,
      ios: `vnd.youtube://watch?v=${videoId}`,
      android: `intent://watch?v=${videoId}#Intent;scheme=vnd.youtube;package=com.google.android.youtube;end`,
      platform: 'youtube'
    };
  }
  
  const linkedinMatch = webUrl.match(/linkedin\.com\/in\/([^/?]+)/);
  if (linkedinMatch) {
    const profileId = linkedinMatch[1];
    return {
      webUrl,
      ios: `linkedin://in/${profileId}`,
      android: `intent://in/${profileId}#Intent;scheme=linkedin;package=com.linkedin.android;end`,
      platform: 'linkedin'
    };
  }

  const isInstagramMatch = webUrl.match(/instagram\.com\/([^/?]+)/);
  if (isInstagramMatch) {
    const profileId = isInstagramMatch[1];
    return {
      webUrl,
      ios: `instagram://user?username=${profileId}`,
      android: `intent://user?username=${profileId}#Intent;scheme=instagram;package=com.instagram.android;end`,
      platform: 'instagram'
    };
  }
  
  return {
    webUrl,
    ios: null,
    android: null,
    platform: 'unknown'
  };
}

export function detectOS(): 'ios' | 'android' | 'desktop' {
  if (typeof window === 'undefined') {
    return 'desktop';
  }
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios';
  }
  
  if (/android/.test(userAgent)) {
    return 'android';
  }
  
  return 'desktop';
}

export interface OpenLinkOptions {
  fallbackToWeb?: boolean;
  fallbackDelay?: number;
  openInNewTab?: boolean;
}

export function openLink(url: string, options: OpenLinkOptions = {}): void {
  const {
    fallbackToWeb = true,
    fallbackDelay = 2500,
    openInNewTab = false
  } = options;
  
  const os = detectOS();
  const result = generateDeepLink(url);
  
  let deepLink: string | null = null;
  
  if (os === 'ios' && result.ios) {
    deepLink = result.ios;
  } else if (os === 'android' && result.android) {
    deepLink = result.android;
  }
  
  if (deepLink && (os === 'ios' || os === 'android')) {
    window.location.href = deepLink;
    
    if (fallbackToWeb) {
      setTimeout(() => {
        if (openInNewTab) {
          window.open(result.webUrl, '_blank');
        } else {
          window.location.href = result.webUrl;
        }
      }, fallbackDelay);
    }
  } else {
    if (openInNewTab) {
      window.open(result.webUrl, '_blank');
    } else {
      window.location.href = result.webUrl;
    }
  }
}

