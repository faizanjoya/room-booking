import { useQuery } from '@apollo/client';
import { GET_AVAILABLE_ROOMS_QUERY } from '../graphql/queries/availableRooms';

const useGetAvailableRooms = (checkIn: Date, checkOut: Date) => {

    return useQuery(GET_AVAILABLE_ROOMS_QUERY, {
        variables: {
            checkIn,
            checkOut,
        },
    });
};

export default useGetAvailableRooms;
