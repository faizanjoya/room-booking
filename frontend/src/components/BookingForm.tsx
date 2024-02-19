import { ChangeEvent, FC, FormEvent, useState } from "react";
import useCreateBookingAndNewCustomer from "../hooks/useCreateBookingAndNewCustomer";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useBookingContext } from "./BookingContext";
import { CreateCustomerInput } from "../types";

const BookingFormOld: FC = () => {
  const { roomData } = useBookingContext();
  const { createBookingAndNewCustomer, loading, error, data } =
    useCreateBookingAndNewCustomer();

  const [formData, setFormData] = useState<CreateCustomerInput>({
    name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!roomData) {
      return;
    }

    try {
      await createBookingAndNewCustomer({
        variables: {
          data: {
            checkIn: roomData.checkIn,
            checkOut: roomData.checkOut,
            paid: false,
            roomId: roomData.room.id,
            customerCreate: {
              email: formData.email,
              name: formData.name,
              phone: formData.phone,
            },
          },
        },
      });

      // todo present success message more nicely
      // naviate to success page
      console.log(data);
    } catch (error) {
      //todo present error message more nicely
      console.error("Error creating booking:", error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        name="name"
        label="Name"
        value={formData.name}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        name="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        name="phone"
        label="Phone"
        value={formData.phone}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
        disabled={loading}
      >
        {loading ? "Booking..." : "Book Now"}
      </Button>
      {error && <p>Error creating booking</p>}
    </form>
  );
};

export default BookingFormOld;
