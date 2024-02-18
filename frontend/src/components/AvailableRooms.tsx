import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import useGetAvailableRooms from "../hooks/useGetAvailableRooms";
import { DateRange, DateRangePicker } from "@mui/x-date-pickers-pro";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

interface Room {
  id: number;
  title: string;
  description: string;
  number: number;
  type: string;
  sleeps: number;
  cost: number;
}

function AvailableRooms() {
  const [value, setValue] = useState<DateRange<Dayjs>>([
    dayjs(),
    dayjs().add(1, "day"),
  ]);

  const [checkInDate, checkOutDate] = value;

  const { loading, error, data, refetch } = useGetAvailableRooms(
    checkInDate?.toDate() || new Date(),
    checkOutDate?.toDate() || new Date()
  );

  const handleAccept = (newValue: DateRange<Dayjs>) => {
    if (!newValue[0] || !newValue[1]) {
      return;
    }

    if (newValue[0].isBefore(newValue[1])) {
      setValue(newValue);
    }
  };

  useEffect(() => {
    if (!error && !loading && data) {
      refetch({
        checkIn: value[0]?.toDate() || new Date(),
        checkOut: value[1]?.toDate() || new Date(),
      });
    }
  }, [value, refetch]);

  return (
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
                  <Typography>{room.cost} GBP</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography>Sleeps {room.sleeps}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography>{room.type}</Typography>
                </Grid>
              </Grid>
              <Typography sx={{ marginTop: 1 }}>{room.description}</Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}

export default AvailableRooms;
