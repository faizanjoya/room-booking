import { gql } from '@apollo/client';

export const GET_AVAILABLE_ROOMS_QUERY = gql`
  query GetAvailableRooms($checkIn: DateTime!, $checkOut: DateTime!) {
    availableRooms(checkIn: $checkIn, checkOut: $checkOut) {
      id
      title
      description
      number
      type
      sleeps
      cost
    }
  }
`;
