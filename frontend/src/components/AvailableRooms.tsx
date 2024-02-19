import "dayjs/locale/en-gb";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import useGetAvailableRooms from "../hooks/useGetAvailableRooms";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRange, DateRangePicker } from "@mui/x-date-pickers-pro";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { BookingRoomInput, Room } from "../types";
import { useBookingContext } from "./BookingContext";
import { useNavigate } from "react-router-dom";

function AvailableRooms() {
  const navigate = useNavigate();
  const [value, setValue] = useState<DateRange<Dayjs>>([
    dayjs(),
    dayjs().add(1, "day"),
  ]);
  const [numberOfNights, setNumberOfNights] = useState<number>(1);
  const { roomData, setRoomData } = useBookingContext();

  const { loading, error, data, refetch } = useGetAvailableRooms(
    value[0]?.toDate() || new Date(),
    value[1]?.toDate() || new Date()
  );

  const handleAccept = (newValue: DateRange<Dayjs>) => {
    if (!newValue[0] || !newValue[1]) {
      return;
    }

    if (newValue[0].isBefore(newValue[1])) {
      setValue(newValue);
      setNumberOfNights(newValue[1].diff(newValue[0], "day"));
    }
  };

  const handleBook = (room: Room) => {
    const [checkInDate, checkOutDate] = value;

    if (!checkInDate || !checkOutDate) {
      return;
    }

    const dataToSet: BookingRoomInput = {
      checkIn: checkInDate.toDate(),
      checkOut: checkOutDate.toDate(),
      room: room,
    };

    if (dataToSet !== roomData) {
      setRoomData(dataToSet);
      navigate("/book");
    }
  };

  useEffect(() => {
    if (!error && !loading && data) {
      refetch({
        checkIn: value[0]?.toDate() || new Date(),
        checkOut: value[1]?.toDate() || new Date(),
      });
    }
  }, [value, refetch, error, loading, data]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
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
        <DateRangePicker
          value={value}
          onAccept={handleAccept}
          localeText={{ start: "Check-in", end: "Check-out" }}
        />

        {error && <p>Error fetching available rooms</p>}
        {loading && <p>Loading...</p>}
        {data && data.availableRooms.length === 0 && (
          <p>No rooms available for selected dates</p>
        )}

        <div>
          {data?.availableRooms.map((room: Room) => (
            <Card key={room.id} sx={{ marginTop: 2 }}>
              <CardContent>
                <Typography variant="h5">{room.title}</Typography>
                <Grid container spacing={2} sx={{ marginTop: 1 }}>
                  <Grid item xs={4}>
                    <Typography>{room.cost * numberOfNights} GBP</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography>Sleeps {room.sleeps}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography>{room.type}</Typography>
                  </Grid>
                </Grid>
                <Typography sx={{ marginTop: 1 }}>
                  {room.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleBook(room)}
                  sx={{ marginTop: 2 }}
                >
                  Book
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </LocalizationProvider>
  );
}

export default AvailableRooms;
