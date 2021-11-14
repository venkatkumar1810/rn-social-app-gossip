import React from 'react';
import Providers from './navigation';
import { StatusBar } from 'expo-status-bar';
// import StaffList from './screens/StaffList';
import OnboardingScreen from './screens/OnboardingScreen';

const App = () => {
  return (
    <>
      {/* <OnboardingScreen /> */}
      <Providers />
      <StatusBar style="auto" />
    </>
  );
}

export default App;
