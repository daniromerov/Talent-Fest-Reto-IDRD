import React from 'react';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Button, View, Text } from 'react-native';
import swal from '@sweetalert/with-react';

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    padding: 6,
    fontFamily: "Lato",
  },
  title: {
    margin: 4,
    padding: 4,
    color: "#584799",
    fontSize: 24,
    fontWeight: "bold",
  },
  contents: {
    margin: 2,
    padding: 4,
    color: "000000",
    fontSize: 20,
    fontWeight: "regular",
  },
  spot: {
    margin: 2,
    padding: 4,
    color: "000000",
    fontSize: 18,
    fontWeight: "regular",
  },
});

const event = {
  name: "Recorrido bicicleta",
  date: "2021-02-23"
}
const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@storage_Key', jsonValue)
  } catch (e) {
    // saving error
  }
}

const handlePressButton = () => {
  storeData(event);
  swal(
    <View style={styles.modal}>
      <Text style={styles.title}>Te esperamos</Text>
      <Text style={styles.contents}>{event.name}</Text>
      <Text style={styles.spot}>{event.date}</Text>
    </View>,
    {
      icon: "success",
    }
  )
}
export default function Home({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
      title="Ver más"
      onPress={() => navigation.navigate('Evento')}
      />
      <Button title="crear recordatorio" onPress={handlePressButton}/>
    </View>
  )
};