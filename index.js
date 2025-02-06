import { registerRootComponent } from 'expo';
import { View, Text, StyleSheet, FlatList, Button, TextInput, DateTimePicker } from 'react-native';

import App from './App';
// function Test() {
//     return (
//         <Text>{new Date()}</Text>
//     )
// }
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
