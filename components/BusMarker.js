import React, { useState, useEffect, useRef, useContext } from "react";
import { Image, View, Text } from "react-native";
import { Marker, Callout } from "react-native-maps";
import { map, groupBy, last } from "lodash";
import { useQuery, useSubscription } from "@apollo/client";
import moment from "moment";
import { BUS_QUERY } from "../graphql/BUS_LIST_QUERY";
import {
  UPDATE_SUBSCRIPTION,
  COORDINATE_ADDED_SUBSCRIPTION,
} from "../graphql/SUBSCRIPTION";
import busSvg from "../assets/marker.png";

import MapContext from "../config/Context";

const EXPIRE_INTERVAL = 1;
const isExpire = (dateStamp) => {
  return (
    moment
      .duration(
        moment(new Date()).diff(moment(dateStamp, "MM-DD-YYYY hh:mm A"))
      )
      .asMinutes() > EXPIRE_INTERVAL
  );
};

const resolver = (list) => [
  ...map(groupBy(list, "bus_id"), (item, key) => {
    const a = item.sort((d1, d2) => {
      // console.log('a', d1.createdAt, d2.createdAt)
      return (
        new Date(d1.createdAt).getTime() - new Date(d2.createdAt).getTime()
      );
    });

    return { [key]: a }; //orderBy(item, 'createdAt', 'desc')}
  }),
];

const ItemMarker = ({ item, onClick }) => {
  const markerRef = useRef();
  const [bus, setBus] = useState();
  // const [selected, setSelected] = useState();
  const [coordinate, setCoordinate] = useState();
  const { selected, setSelected, list, setList } = useContext(MapContext)
  const { data, loading, error } = useQuery(BUS_QUERY, {
    variables: { bus_id: item.bus_id },
  });
  const { data: subData } = useSubscription(UPDATE_SUBSCRIPTION, {
    variables: { bus_id: item.bus_id },
    onData: ({
      data: {
        data: { getBus },
      },
    }) => {
      if (getBus.bus_id == selected?.bus_id) setSelected(getBus)
      setBus(getBus);
      return;
    },
  });
  const { data: newCoordinate } = useSubscription(
    COORDINATE_ADDED_SUBSCRIPTION,
    {
      variables: { bus_id: item.bus_id },
      onData: ({
        data: {
          data: { coordinates },
        },
      }) => {
        if (item.bus_id == coordinates.bus_id) {
          setCoordinate(coordinates);
        }
        return;
      },
    }
  );
  // const [expire, setExpire] = useState();
  // const coordinate = item.coordinates.split(",");
  // console.log('data', bus)r
  useEffect(() => {
    // if (!bus) {
      setBus(item);
    // }
    
    // const interval = setInterval(() => {
    //   const age = isExpire(item.createdAt)
    //   if (age) {
    //     setExpire('tan')
    //     clearInterval(interval)
    //   } else {
    //     setExpire('red')
    //   }
    // }, 1000)
  }, []);
  // useEffect(() => {
  //   if (selected?.bus_id == bus?.bus_id) {
  //     onClick(bus)
  //   }
  // }, [bus])
  useEffect(() => {
    if (data?.coordinates[0]?.bus_id) {
      setCoordinate(data.coordinates[0]);
      // const index = list.findIndex(item => item.bus_id === data.coordinates[0].bus_id)
      // const listRes = list.map(item => {
      //   if (item.bus_id == data.coordinates[0].bus_id) {
      //     return { ...item, coordinates: data.coordinates[0]}
      //   } else {
      //     return item
      //   }
        
      // })
      // setList([...listRes])
    }
  }, [data]);
  // useEffect(() => {
  //   if (markerRef?.current?.showCallout) markerRef.current.showCallout()
  // }, [coordinate, markerRef, bus])
  if (!bus || !coordinate) return <></>;
  // console.log("bus", bus)
  return (
    <Marker
      ref={markerRef}
      key={`${bus.bus_id}-${coordinate?.id}-${bus.updatedAt}`}
      coordinate={{
        latitude: +coordinate.latitude,
        longitude: +coordinate.longitude,
      }}
      image={busSvg}
      // title={bus.bus_id}
      // description={`Passengers: ${bus.passenger_count}/45 - Destination: ${bus.departure}`}
      // pinColor={expire}
      onPress={() => {
        setSelected(bus);
        // onClick(bus);
      }}
    >
    </Marker>
  );
};

const BusMarker = ({ data }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    if (data) {
      setList(data);
    }
  }, [data]);

  return (list || []).map((item) => (
    <ItemMarker key={item.bus_id} item={{ ...item }} />
  ));
};

export default BusMarker;
