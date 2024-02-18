import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import useGetAvailableRooms from "../hooks/useGetAvailableRooms";
import {
  DateRange,
  DateRangePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

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
    setValue(newValue);
  };

  useEffect(() => {
    refetch({
      checkIn: value[0]?.toDate() || new Date(),
      checkOut: value[1]?.toDate() || new Date(),
    });
  }, [value, refetch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching available rooms</p>;
  }

  if (data) {
    console.log(data);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
      <DateRangePicker
        value={value}
        onAccept={handleAccept}
        localeText={{ start: "Check-in", end: "Check-out" }}
      />

      <div>
        <p>Available Rooms</p>
        {data?.availableRooms.map((room: Room) => (
          <Card key={room.id} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h5">{room.title}</Typography>
              <Grid container spacing={2} sx={{ marginTop: 1 }}>
                <Grid item xs={4}>
                  <Typography>{room.cost} GBP</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography>{room.sleeps} Sleeps</Typography>
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
    </LocalizationProvider>
  );
}

export default AvailableRooms;
