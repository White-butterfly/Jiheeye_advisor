import React, {useState, useEffect} from 'react';
import {CssBaseline, Grid} from "@material-ui/core";
import axios from 'axios';
import { getPlacesData , getWeatherData} from './api';

import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';


const App = () => {
const [places, setPlaces] = useState([]);
const [WeatherData, setWeatherData] = useState([]);

const [childClicked, setChildClicked]= useState(null);

const [filterdPlaces, setFilterdPlaces] = useState([]);

const [coordinates, setCoordinates] = useState({});
const [bounds, setBounds] = useState({});
const [isLoading, setIsLoading] = useState(false);

const [type, setType]= useState('restaurants');
const [rating, setRating]= useState('');

useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setCoordinates({ lat: latitude, lng: longitude });
    });
  }, []);

useEffect(()=>{
const filterdPlaces= places.filter((place)=>place.rating > rating);
setFilterdPlaces(filterdPlaces);
},[rating]);  


    useEffect(()=> { 
    
      if(bounds.sw && bounds.ne) {
        setIsLoading(true);

        getWeatherData(coordinates.lat, coordinates.lng)
        .then((data) => setWeatherData(data));


        getPlacesData(type, bounds.sw, bounds.ne)
        .then((data)=> {
            setPlaces(data?.filter((place)=> place.name && place.num_reviews > 0 ));
            setFilterdPlaces([])
            setIsLoading(false);
        })
      }
    },[type, bounds]);

    console.log(places)
console.log(filterdPlaces)

return (
    <>
<CssBaseline/>
<Header setCoordinates={setCoordinates}/>
<Grid container spacing={3} style={{width:'100%'}}>
<Grid item xs={12} md={4}>

<List 
places={filterdPlaces.length ? filterdPlaces : places}
childClicked={childClicked}
isLoading={isLoading}
type={type}
setType={setType}
rating={rating}
setRating={setRating}

/>
</Grid>

<Grid item xs={12} md= {8}>
<Map 
setCoordinates={setCoordinates}
setBounds={setBounds}
coordinates={coordinates}
places={filterdPlaces.length ? filterdPlaces : places}
setChildClicked={setChildClicked}
WeatherData={WeatherData}
/>
</Grid>

</Grid>
      

    </>
);

}


export default App;
