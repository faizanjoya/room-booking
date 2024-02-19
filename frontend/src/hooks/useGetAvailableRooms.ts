import { gql, useQuery } from '@apollo/client';

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

const useGetAvailableRooms = (checkIn: Date, checkOut: Date) => {
    const { data, loading, error, refetch } = useQuery(GET_AVAILABLE_ROOMS_QUERY, {
        variables: {
            checkIn,
            checkOut,
        },
    });

    return {
        data,
        loading,
        error,
        refetch,
    };
};

export default useGetAvailableRooms;
