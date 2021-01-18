import React from 'react';
import { SafeAreaView, Button } from 'react-native';

import { useAuth } from '../../hooks/auth';
// import { Container } from './styles';

const Dashboard: React.FC = () => {
  const { signOut } = useAuth();
  return (
    <SafeAreaView>
      <Button title="Sair" onPress={signOut} />
    </SafeAreaView>
  );
};

export default Dashboard;
