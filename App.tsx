/* eslint-disable global-require */
import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { StatusBar, View } from 'react-native';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import AppProvider from './src/hooks';

import Routes from './src/routes';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'RobotoSlab-Regular': require('./assets/fonts/RobotoSlab-Regular.ttf'),
    'RobotoSlab-Medium': require('./assets/fonts/RobotoSlab-Medium.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#312e38"
        translucent
      />
      <AppProvider>
        <View
          style={{ flex: 1, backgroundColor: '#312e38' }}
          onLayout={onLayoutRootView}
        >
          <Routes />
        </View>
      </AppProvider>
    </NavigationContainer>
  );
}
