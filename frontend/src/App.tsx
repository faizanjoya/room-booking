import "./App.css";
import "dayjs/locale/en-gb";
import AvailableRooms from "./components/AvailableRooms";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
        <AvailableRooms />
      </LocalizationProvider>
    </>
  );
}

export default App;
