import { ChangeEvent, FC, FormEvent, useState } from "react";
import useCreateBookingAndNewCustomer from "../hooks/useCreateBookingAndNewCustomer";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";

const BookingFormOld: FC = () => {
  const params = useParams();
  const { roomId, checkIn, checkOut } = params;

  if (!roomId || !checkIn || !checkOut) {
    throw new Error("Invalid params");
  }

  const { createBookingAndNewCustomer, loading, error, data } =
    useCreateBookingAndNewCustomer();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await createBookingAndNewCustomer({
        variables: {
          data: {
            checkIn: checkIn,
            checkOut: checkOut,
            paid: false,
            roomId: roomId,
            customerCreate: {
              email: formData.email,
              name: formData.name,
              phone: formData.phone,
            },
          },
        },
      });

      // Todo navigate to all bookings page
      console.log("Booking created:", data);
    } catch (error) {
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
