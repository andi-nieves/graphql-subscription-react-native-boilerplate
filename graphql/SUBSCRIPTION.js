import {gql} from '@apollo/client';

export const SUBSCRIPTION = gql`
  subscription {
    bus {
      id
      bus_id
      bus_name
      passenger_count
      departure
      arrival
      createdAt
      updatedAt
      driver_name
      driver_contact
      conductor_name
      conductor_contact
    }
  }
`;

export const UPDATE_SUBSCRIPTION = gql`
  subscription GetBus($bus_id:String!) {
    getBus(bus_id:$bus_id) {
      id
      bus_id
      bus_name
      passenger_count
      departure
      departure_time
      arrival
      arrival_time
      createdAt
      updatedAt
      driver_name
      driver_contact
      conductor_name
      conductor_contact
    }
  }
`;
export const DELETE_SUBSCRIPTION = gql`
  subscription {
    deleteBus {
      bus_id
    }
  }
`;

export const COORDINATE_ADDED_SUBSCRIPTION = gql`
  subscription Coordinates($bus_id:String!) {
    coordinates(bus_id:$bus_id) {
      id
      bus_id
      latitude
      longitude
      createdAt
    }
  }
`;
