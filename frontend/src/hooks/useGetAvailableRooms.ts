import { gql, useQuery } from '@apollo/client';
import { Room } from '../types';

const GET_AVAILABLE_ROOMS_QUERY = gql`
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

export const useGetAvailableRooms = (checkIn: Date, checkOut: Date) => {
  const { data, loading, error, refetch } = useQuery(GET_AVAILABLE_ROOMS_QUERY, {
    variables: {
      checkIn,
      checkOut,
    },
  });

  return {
    availableRooms: data?.availableRooms || [] as Room[],
    loading,
    error,
    refetch,
  };
};
