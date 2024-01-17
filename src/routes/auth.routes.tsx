import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import SignIn from '../Pages/SignIn';
import SignUp from '../Pages/SignUp';

const Auth = createStackNavigator();

export type IAuthRoutes = {
  SignIn: undefined;
  SignUp: undefined;
};

function AuthRoutes() {
  return (
    <Auth.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#312e38' },
      }}
    >
      <Auth.Screen name="SignIn" component={SignIn} />
      <Auth.Screen name="SignUp" component={SignUp} />
    </Auth.Navigator>
  );
}

export default AuthRoutes;
