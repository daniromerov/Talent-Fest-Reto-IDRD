import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Modal, Alert } from 'react-native';
import { Picker, Container, Content, CardItem, Left, Body, Button, Card, Title } from "native-base";
import Calendar from '../components/calendarHome';
import swal from '@sweetalert/with-react';
import data from '../../data/events.json'

const dataEvents = data.events;
const header = require('../../assets/Header.png');



const storeData = async (value) => {
  try {
    const jsonValue = await AsyncStorage.getItem("@storage_Key");
    const eventsValues = JSON.parse(jsonValue);

    let eventsList = []
    if (eventsValues == null) {
      eventsList = [value]
    } else {
      eventsList = [...eventsValues, value]
    }
    console.log(eventsValues);

    const newJsonValue = JSON.stringify(eventsList)
    console.log(newJsonValue);
    await AsyncStorage.setItem('@storage_Key', newJsonValue)

  } catch (e) {
  }
}

const handlePressButton = async (newEvent) => {
  storeData(newEvent)
  swal(
    <View style={styles.modal}>
      <Text style={styles.title}>Te esperamos</Text>
      <Text style={styles.container}>{newEvent.name}</Text>
      <Text style={styles.spot}>{newEvent.date}</Text>
    </View>,
    {
      icon: "success",
    }
  )
}

 
const CardEvent = ({ objNavigate, selectCategoria, selectUbicacion }) => {
    console.log(selectCategoria, selectUbicacion)
  const [currCategoria, setCurrCategoria] = useState()

  const filterUbicacion = dataEvents.filter((option)=> option.locality.includes(selectUbicacion))
    console.log(filterUbicacion) 
  
    const filterCategoria = dataEvents.filter((option) => option.category === selectCategoria)
    console.log(filterCategoria);

    const filterCategoria2 = filterUbicacion.filter((option) => option.category === selectCategoria)
    console.log(filterCategoria2);

    let dataEventsFilter;

if(selectCategoria !== null && selectUbicacion !== null){
      dataEventsFilter = filterCategoria2
}/* else if (selectCategoria !== null || currCategoria !== selectCategoria) {
  dataEventsFilter = filterCategoria
}*/ else {
    dataEventsFilter = dataEvents
}

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@storage_Date')
   return jsonValue != null ? JSON.parse(jsonValue) : null;
    
  } catch(e) {
    // error reading value
  }
  
}
console.log(currCategoria)
useEffect( async () => {
    const date= await getData();
    setCurrCategoria(date)

}, [])



  return (
    <ScrollView contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Content padder>
        {dataEvents.length > 0 ? ( dataEvents.map((events, index) => {
          console.log(events.place);
          return (
            <ScrollView>
              <Card style={{ flex: 1, flexDirection: 'row', borderRadius: 20, border: 0 }}>
                <CardItem>
                  <Left>
                    <Body>
                      <Image source={{ uri: events.img }} style={{ height: 100, width: 100, flex: 1, borderRadius: 5 }} />
                    </Body>
                  </Left>
                </CardItem>
                <CardItem style={{ flex: 2, flexDirection: 'column' }}>
                  <Body>
                    <Text style={{ color: '#584799', fontWeight: 600, fontSize: 20 }}>{events.name}</Text>
                    <Text style={{ textAlign: 'justify', fontSize: 12, marginRight: 10, marginBottom: 10, marginTop: 10 }}>{events.details}</Text>
                  </Body>
                  <Body style={{ flex: 2, flexDirection: 'row' }}>
                    <TouchableOpacity style={stylesHome.boton} onPress={() => objNavigate.navigate('Evento', { index })}>
                      <Text style={{ textAlign: 'center', color: '#584799', fontWeight: 'bold', alignItems: 'center' }} >Ver más</Text></TouchableOpacity>
                    <TouchableOpacity style={stylesHome.boton} onPress={() => objNavigate.navigate('Mi agenda')}>
                      <Text style={{ textAlign: 'center', color: '#584799', fontWeight: 'bold' }} onPress={() => handlePressButton({
                        date: events.date,
                        dateName: events.dateName,
                        name: events.name,
                        place: events.place,
                        audience: events.audience,
                        hour1: events.hour1
                      })}>Asistir</Text>
                    </TouchableOpacity>
                  </Body>
                </CardItem>
              </Card>
            </ScrollView>
          )
        }
        )): null}

      </Content>
    </ScrollView>
  )
}



export default function Home({navigation}) {
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedValues, setSelectedValues] = useState(null);
  let mapCategory = dataEvents.map((element) => element.category);
  let unicoCategory = [...new Set(mapCategory)];

 const localidades = ()=>{
    let arrayLocality = [];
    console.log(arrayLocality);
    for ( let i= 0; i < dataEvents.length; i++) {
    let localidad = dataEvents[i].locality;
    for (let j= 0; j < localidad.length; j++){
      let allLocality = localidad[j];
      console.log(allLocality);
      arrayLocality.push(allLocality);
    }
    }
    return arrayLocality
  }
  let unicaUbicacion = [...new Set(localidades())]; 


    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', headerTitleAlign: "center"}}>
        <Image source={header} style={stylesHome.imagen} />
      </View>
{/* //       <Container style={{ flex: 1 , justifyContent:'center', alignItems: 'center' }} >
// <Content> */}

      <View style={stylesHome.containerSelect} >
      <Picker
        selectedValue={selectedValues}
        style={stylesHome.select} 
        onValueChange={(itemValue, itemIndex) => setSelectedValues(itemValue)}>
          
        <Picker.Item label="Ubicación" value="localidad" padder/>{
          unicaUbicacion.map((element)=>
          <Picker.Item label={element} value={element} /> 
          ) 
        } 
      </Picker>
      <Picker
        selectedValue={selectedValue}
        style= {stylesHome.select} 
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)} >
        <Picker.Item label="Categorias" value="java" padder/>{
          unicoCategory.map((event) => 
          <Picker.Item label={event} value={event}/>
            )}
      </Picker>
      </View>
      <View>
      <Calendar>        
      </Calendar>
      </View>
      <Content>
      <CardEvent objNavigate={navigation} selectUbicacion={selectedValues} selectCategoria={selectedValue}  />            
      </Content>
{/* //       </Container> */}
     {/* </View> */}
    </ScrollView>
  
        
    ) }

const stylesHome = StyleSheet.create({
  select: {
    borderRadius: 10,
    width: 10,
    height: 30,
    margin: 10,
    cursor: 'pointer',
    borderRadius: 30,
    textAlign: 'center',
    borderColor: '#584799',
    alignItems: 'center',
    color: '#584799',
    fontWeight: '600'
  },
  boton: {
    backgroundColor: "rgba(89, 251, 218, 1)",
    width: 80,
    height: 30,
    margin: 10,
    textAlign: 'center',
    padding: 2,
    borderRadius: 15,
    justifyContent: 'center'
  },
  imagen: {
    width: 330,
    height: 130,
    marginTop: 20,

  },
  containerSelect: {
    flex: 1,
    flexDirection: 'row',
//     marginTop: 20
//   },
//   textBoton: {
//     color: '#584799',
//     fontSize: 17,
//     fontWeight:'600'
//   },
//   textName:{
//     color: '#584799', 
//     fontWeight: '600', 
//     fontSize: 20
//   },
//   textDate :{ 
//     textAlign: 'justify',
//     fontSize: 15 },
//   textDetails: {
//     width: 190,
//     textAlign: 'justify',
//     marginBottom: 5
  }
});

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    padding: 6,
    fontFamily: "Arial",
    textAlign: "center",
    fontSize: 30,
  },
  title: {
    margin: 4,
    padding: 4,
    color: "#584799",
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
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
  }
});
