import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AvailableRooms from "./components/AvailableRooms";

import BookingForm from "./components/BookingForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<AvailableRooms />} />
        <Route
          path="/book/:roomId/:checkIn/:checkOut"
          element={<BookingForm />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
