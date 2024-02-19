import { useMutation, gql } from '@apollo/client';

const CREATE_BOOKING_AND_NEW_CUSTOMER = gql`
  mutation CreateBookingAndNewCustomer($data: BookingAndCustomerCreateInput!) {
    createBookingAndNewCustomer(data: $data) {
      id
      createdAt
      updatedAt
      checkIn
      checkOut
      paid
      room {
        id
        title
        description
        number
        type
        sleeps
        cost
      }
      customer {
        id
        name
        email
        phone
      }
    }
  }
`;

const useCreateBookingAndNewCustomer = () => {
  const [createBookingAndNewCustomer, { loading, error, data }] = useMutation(
    CREATE_BOOKING_AND_NEW_CUSTOMER
  );

  return {
    createBookingAndNewCustomer,
    loading,
    error,
    data,
  };
};

export default useCreateBookingAndNewCustomer;
