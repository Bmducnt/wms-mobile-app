import { StatusBar } from "expo-status-bar";
import * as Localization from "expo-localization";
import * as Notifications from "expo-notifications";
import 'react-native-gesture-handler';
// import AppLoading from 'expo-app-loading';
import moment from "moment";
import "moment/min/locales";
import * as SplashScreen from "expo-splash-screen";

import React from "react";

import { I18n } from "i18n-js";

import { enableScreens } from "react-native-screens";

import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { func } from "./src/constants";
import translation from "./src/i18n";
import { getCachedUrlContent } from "./src/helpers/wrap-api";

// main navigation stack
import Stack from "./src/navigation/Stack";
import {Platform} from "react-native";
import {setI18nConfig, setI18nConfigChange} from "./src/i18n/locales/IMLocalized";

//i18n
const i18n = new I18n(translation);

SplashScreen.preventAutoHideAsync();
enableScreens(true);
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

//Get token
async function registerForPushNotificationsAsync() {
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    return;
  }
  token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "506d19a8-5a03-4fb0-8313-044210566166",
      })
  ).data;
  await AsyncStorage.setItem("staff_token_notify", token);
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  return token;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appIsReady: false,
      events: [],
      locale: "en",
      token: null,
      notification: false,
    };
    this.notificationListener = React.createRef();
    this.responseListener = React.createRef();
  }

  async componentDidMount() {
    try {
      await SplashScreen.preventAutoHideAsync();
    } catch (e) {
      console.warn(e);
    }
    this.prepareResources();
    registerForPushNotificationsAsync().then((token) =>
        this.setState({ token: token })
    );

    this.notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          this.setState({ notification: notification });
        });

    this.responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      Notifications.removeNotificationSubscription(
          this.notificationListener.current
      );
      Notifications.removeNotificationSubscription(
          this.notificationListenerresponseListener.current
      );
    };
  }

  UNSAFE_componentWillMount = async () => {
    const locale = Localization.getLocales();
    let lang = 'en'
    if (locale[0].languageCode === "en" || locale[0].languageCode === "vi") {
      lang = locale[0].languageCode
    }
    await this.setState({ locale: lang });
    moment.locale(lang);
    setI18nConfig(lang)
  };

  prepareResources = async () => {
    await getCachedUrlContent();
    await func.loadAssetsAsync();
    this.setState({ appIsReady: true }, async () => {
      await SplashScreen.hideAsync();
    });
  };



  translationApp = (scope, options) => {
    return i18n.t(scope, { locale: this.state.locale, ...options });
  };

  render() {
    const { appIsReady } = this.state;
    if (!appIsReady) {
      return null;
    }

    return (
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <NavigationContainer>
            <StatusBar style="light" />
            <Stack
                screenProps={{
                  t: this.translationApp,
                }}
            />
          </NavigationContainer>
        </SafeAreaProvider>
    );
  }
}

export default App;
