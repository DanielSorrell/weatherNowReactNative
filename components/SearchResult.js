import { StatusBar } from 'expo-status-bar';
import { Dimensions, Button, StyleSheet, Text, View, SafeAreaView, Platform } from 'react-native';

export default function SearchResult({ result, setSelectedCity }) {
  return (
    <Text 
      style={styles.container} 
      onPress={() => setSelectedCity({
        city: result.name,
        state: result.state,
        zipcode: result.zipcode,
        country: result.country,
        latCoords: result.lat,
        longCoords: result.lon
      })}
    >
      {result.name}, {result.state && result.state} {result.zipcode && result.zipcode} {result.country}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});