import { useEffect, useRef, useState } from 'react';
import { 
    MapContainer, TileLayer, 
    Marker, Popup, 
} from "react-leaflet";
//import L from "leaflet";
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import 'leaflet/dist/leaflet.css';

import Loading from '../Loading';
import { USER_ADDRESS_MAP_CONFIRM } from '../../constants/userConstants';
/* const markerIcon = new L.Icon({
    iconUrl: require("./marker.png"),
    iconSize: [40, 40],
    iconAnchor: [17, 46], //[left/right, top/bottom]
    popupAnchor: [0, -46], //[left/right, top/bottom]
  }); */
const defaultLocation =  [-4.057914, 39.675326];//-4.0579141120772615, 39.675326243724804

export default function MapScreen(props) {
  const [maptilerUrl, setmaptilerUrl] = useState('');
  const [center, setCenter] = useState(defaultLocation);
  const [location, setLocation] = useState({
    loaded: false,
    lat: center[0],
    lng: center[1],
  });
  const ZOOM_LEVEL = 15; //15
  const mapRef = useRef(null);
  const maptilerAttribution = '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

  useEffect(() => {
    const fetch = async () => {
      const { data } = await Axios('/api/config/maptiler');
      setmaptilerUrl(data);
      getUserCurrentLocation();
    };
    fetch();
  }, []);

  const dispatch = useDispatch();
  const onConfirm = () => {
    if (location.loaded && !location.error) {
      // dispatch select action
      dispatch({
        type: USER_ADDRESS_MAP_CONFIRM,
        payload: {
          lat: location.lat,
          lng: location.lng,
          //address: places[0].formatted_address,
          //name: places[0].name,
          //vicinity: places[0].vicinity,
          //googleAddressId: places[0].id,
        },
      });
      alert('location selected successfully.');
      props.history.push('/shipping');
    } else {
      alert('Please enter your address.(An error occcured.Refresh page)');
    }
  };

  const getUserCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation os not supported by this browser');
      setLocation({
        loaded: true,
        error:{
            code: 0,
            message:"Geolocation not Supported.",
        },
      });
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter([position.coords.latitude,position.coords.longitude]);
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          loaded: true,
        });
      });
    }
  };

  return maptilerUrl ? (
    <div className="full-container">
        <MapContainer center={center} zoom={ZOOM_LEVEL} ref={mapRef}>
            <TileLayer
                url={maptilerUrl}
                attribution={maptilerAttribution}
            />
            {location.loaded && !location.error && (
            <Marker
                position={[
                    location.lat,
                    location.lng
                ]}
            >
                <Popup>Delivery Point</Popup>
            </Marker>
            )}
        </MapContainer>
        <div className="map-input-box">
            <button type="button" className="primary" onClick={onConfirm}>
            Confirm
            </button>
        </div>
    </div>
  ) : (
    <Loading></Loading>
  );
}