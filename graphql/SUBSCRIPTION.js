import {gql} from '@apollo/client';

export const SUBSCRIPTION = gql`
  subscription {
    bus {
      bus_id
      bus_name
      passenger_count
    }
  }
`;
