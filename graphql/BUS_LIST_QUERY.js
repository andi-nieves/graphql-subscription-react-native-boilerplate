import {gql} from '@apollo/client';

export const BUS_LIST_QUERY = gql`
  query {
    allBus {
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

export const BUS_QUERY = gql`
  query Coordinates($bus_id: String!) {
    coordinates(bus_id:$bus_id) {
      id
      bus_id
      latitude
      longitude
      createdAt
    }
  }
`;