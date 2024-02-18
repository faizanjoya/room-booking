import dayjs from "dayjs";
import useGetAvailableRooms from "../hooks/useGetAvailableRooms";

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
  const { loading, error, data } = useGetAvailableRooms(
    dayjs("2024-01-17").toDate(),
    dayjs("2024-01-19").toDate()
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching available rooms</p>;
  }

  if (!data) {
    return <p>No data</p>;
  }

  if (data) {
    console.log(data);
  }

  return (
    <div>
      <p>Available Rooms</p>
      {data?.availableRooms.map((room: Room) => (
        <div key={room.id}>
          <p>{room.title}</p>
          <p>{room.description}</p>
          <p>{room.number}</p>
          <p>{room.type}</p>
          <p>{room.sleeps}</p>
          <p>{room.cost}</p>
        </div>
      ))}
    </div>
  );
}

export default AvailableRooms;
