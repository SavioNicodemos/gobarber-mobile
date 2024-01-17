import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import AppointmentCreated from '../Pages/AppointmentCreated';
import CreateAppointment from '../Pages/CreateAppointment';
import Dashboard from '../Pages/Dashboard';
import Profile from '../Pages/Profile';

export type IAppRoutes = {
  Dashboard: undefined;
  CreateAppointment: { providerId: string };
  AppointmentCreated: { date: number };
  Profile: undefined;
};

const App = createStackNavigator<IAppRoutes>();

const AppRoutes = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#312e38' },
    }}
  >
    <App.Screen name="Dashboard" component={Dashboard} />
    <App.Screen name="CreateAppointment" component={CreateAppointment} />
    <App.Screen name="AppointmentCreated" component={AppointmentCreated} />

    <App.Screen name="Profile" component={Profile} />
  </App.Navigator>
);

export default AppRoutes;
