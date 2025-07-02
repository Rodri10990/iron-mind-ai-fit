
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.ironmindaifit',
  appName: 'iron-mind-ai-fit',
  webDir: 'dist',
  server: {
    url: "https://1888d7de-9b71-4d73-bc45-eb558730394c.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#f97316",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
  ios: {
    scheme: "ironmindaifit"
  },
  android: {
    scheme: "https"
  }
};

export default config;
