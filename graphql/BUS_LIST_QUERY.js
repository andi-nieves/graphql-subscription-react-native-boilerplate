import {gql} from '@apollo/client';

export const BUS_LIST_QUERY = gql`
  query {
    allBus {
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
      createdAt
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

export const DELETE_BUS = gql`
mutation DeleteBus($bus_id:String!) {
    deleteBus(bus_id:$bus_id) {
      response
    }
  }
`

export const DELETE_SUB =gql`
subscription {
  deleteBus {
    bus_id
  }
}
`

export const BUS_ADDED = gql`
subscription {
  bus {
    id
    bus_id
    bus_name
    passenger_count
    departure
    departure_time
    arrival
    arrival_time
    driver_name
    driver_contact
    conductor_name
    conductor_contact
    createdAt
    updatedAt
  }
}`

export const NEW_BUS = gql`
    mutation CreateBus($bus_id:String!, $bus_name:String!, $departure:String!,$departure_time:String!, $arrival:String!,$arrival_time:String!, $bus_image:Upload, $driver_image: Upload, $driver_name:String!, $driver_contact:String!,$conductor_image: Upload, $conductor_name:String!, $conductor_contact:String!) {
        createBus(newBus:{
            bus_id:$bus_id,
            bus_name:$bus_name,
            departure:$departure,
            departure_time:$departure_time,
            arrival:$arrival,
            arrival_time:$arrival_time,
            bus_image:$bus_image,
            driver_image:$driver_image,
            driver_name:$driver_name,
            driver_contact:$driver_contact,
            conductor_image:$conductor_image,
            conductor_name:$conductor_name,
            conductor_contact:$conductor_contact,
        }) {
          id
          bus_id
          bus_name
          passenger_count
          departure
          departure_time
          arrival
          arrival_time
          driver_name
          driver_contact
          conductor_name
          conductor_contact
          createdAt
          updatedAt
        }
    }
`

export const UPDATE_BUS = gql`
    mutation UpdateSelected($id: Int!, $bus_id:String!, $bus_name:String!, $departure:String!,$departure_time:String!, $arrival:String!,$arrival_time:String!, $bus_image:Upload, $driver_image: Upload, $driver_name:String!, $driver_contact:String!,$conductor_image: Upload, $conductor_name:String!, $conductor_contact:String!) {
        updateSelected(
          id: $id
          bus:{
            bus_id:$bus_id,
            bus_name:$bus_name,
            departure:$departure,
            departure_time:$departure_time,
            arrival:$arrival,
            arrival_time:$arrival_time,
            bus_image:$bus_image,
            driver_image:$driver_image,
            driver_name:$driver_name,
            driver_contact:$driver_contact,
            conductor_image:$conductor_image,
            conductor_name:$conductor_name,
            conductor_contact:$conductor_contact,
        }) {
          id
          bus_id
          bus_name
          passenger_count
          departure
          departure_time
          arrival
          arrival_time
          driver_name
          driver_contact
          conductor_name
          conductor_contact
          createdAt
          updatedAt
        }
    }
`