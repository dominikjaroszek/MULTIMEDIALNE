import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

import AuthStackNav from './navigation/AuthStack'

export default function App() {
  return (
    <NavigationContainer>
      <AuthStackNav/>
      
    </NavigationContainer>
  );
}
