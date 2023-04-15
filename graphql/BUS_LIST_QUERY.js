import {gql} from '@apollo/client';

export const BUS_LIST_QUERY = gql`
  query {
    allBus {
      bus_id
      bus_name
      coordinates
      passenger_count
      departure
      arrival
      createdAt
    }
  }
`;
