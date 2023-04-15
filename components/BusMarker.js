import React, { useState, useEffect } from "react";
import { Marker } from "react-native-maps";
import { map, groupBy, last } from 'lodash'
import moment from "moment";

const EXPIRE_INTERVAL = 1;
const isExpire = (dateStamp) => {
  return moment.duration(moment(new Date()).diff(moment(dateStamp, "MM-DD-YYYY hh:mm A"))).asMinutes() > EXPIRE_INTERVAL;}

const resolver = (list) => [...map(groupBy(list, 'bus_id'), (item, key) => {
  const a = item.sort((d1, d2) => {
    // console.log('a', d1.createdAt, d2.createdAt)
    return new Date(d1.createdAt).getTime() - new Date(d2.createdAt).getTime()}
    );

  return {[key]: a}//orderBy(item, 'createdAt', 'desc')}
})]

const ItemMarker = ({ item, onClick }) => {
  const [expire, setExpire] = useState();
  const coordinate = item.coordinates.split(",");

  useEffect(() => {
    const interval = setInterval(() => {
      const age = isExpire(item.createdAt)
      if (age) {
        setExpire('tan')
        clearInterval(interval)
      } else {
        setExpire('red')
      }
    }, 1000)
    
  }, [item])
  // if (item.bus_id === '2725') console.log('item', item)
  return (
    <Marker
      key={`${item.bus_id}-${item.createdAt}-${expire}`}
      coordinate={{
        latitude: +coordinate[0],
        longitude: +coordinate[1],
      }}
      pinColor={expire}
      onPress={() => onClick(item)}
    />
  );
};

const BusMarker = ({ data, setSelected }) => {
  const [list, setList] = useState([])

  useEffect(() => {
    if (data) {
      setList(resolver(data))
    }
  }, [data])

  return (list || []).map((item, key) => {
    const bus = last(item[Object.keys(item)[0]])
    return <ItemMarker key={`${bus.bus_id}-${bus.createdAt}`} item={{...bus}} onClick={setSelected} />
  });
};

export default BusMarker;
