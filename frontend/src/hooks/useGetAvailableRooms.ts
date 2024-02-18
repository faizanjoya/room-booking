import { useQuery } from '@apollo/client';
import { GET_AVAILABLE_ROOMS_QUERY } from '../graphql/queries/availableRooms';

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
