import { ChangeEvent, FC, FormEvent, useState } from "react";
import useCreateBookingAndNewCustomer from "../hooks/useCreateBookingAndNewCustomer";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useBookingContext } from "./BookingContext";
import { CreateCustomerInput } from "../types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "@mui/system/Container";
import { useNavigate } from "react-router-dom";

const BookingForm: FC = () => {
  const navigate = useNavigate();
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
    <>
      {roomData === null && <p>No room selected</p>}
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          margin: "0 auto",
          padding: "2rem",
          width: "40rem",
        }}
      >
        {roomData ? (
          <>
            <Card key={roomData.room.id} sx={{ marginTop: 2, width: "40rem" }}>
              <CardContent>
                <Typography variant="h5">{roomData.room.title}</Typography>
                <Grid container spacing={2} sx={{ marginTop: 1 }}>
                  <Grid item xs={4}>
                    <Typography>
                      {roomData.room.cost * roomData.numberOfNights} GBP
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography>Sleeps {roomData.room.sleeps}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography>{roomData.room.type}</Typography>
                  </Grid>
                </Grid>
                <Typography sx={{ marginTop: 1 }}>
                  {roomData.room.description}
                </Typography>
                <Typography>
                  {`${roomData.checkIn.toISOString().split("T")[0]} to ${
                    roomData.checkOut.toISOString().split("T")[0]
                  }`}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ marginTop: 2, width: "40rem" }}>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <TextField
                    name="name"
                    label="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                    disabled={loading || !!data}
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
                    disabled={loading || !!data}
                  />
                  <TextField
                    name="phone"
                    label="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                    disabled={loading || !!data}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2 }}
                    disabled={loading || !!data}
                  >
                    {loading ? "Booking..." : "Book and Create New Customer"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {error ? (
              <Card sx={{ marginTop: 2, width: "40rem" }}>
                <CardContent>
                  <Typography variant="h5">Error creating booking</Typography>
                  <Typography>{error.message}</Typography>
                </CardContent>
              </Card>
            ) : null}

            {data ? (
              <Card sx={{ marginTop: 2, width: "40rem" }}>
                <CardContent>
                  <Typography variant="h5">Booking successful</Typography>
                  <Typography>
                    Booking id is: {data.createBookingAndNewCustomer.id}
                  </Typography>
                  <Typography>
                    {data.createBookingAndNewCustomer.customer.email}
                  </Typography>
                </CardContent>
              </Card>
            ) : null}
          </>
        ) : null}

        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          onClick={() => navigate("/")}
        >
          Go to home
        </Button>
      </Container>
    </>
  );
};

export default BookingForm;
