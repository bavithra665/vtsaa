import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BrandIntro from './src/components/BrandIntro';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  const [showHome, setShowHome] = useState(false);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      {showHome ? <HomeScreen /> : <BrandIntro onComplete={() => setShowHome(true)} />}
    </SafeAreaProvider>
  );
}
