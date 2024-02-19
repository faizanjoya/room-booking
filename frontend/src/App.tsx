import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AvailableRooms from "./components/AvailableRooms";

import BookingForm from "./components/BookingForm";
import { BookingContextProvider } from "./components/BookingContext";

function App() {
  return (
    <BrowserRouter>
      <BookingContextProvider>
        <Routes>
          <Route path="" element={<AvailableRooms />} />
          <Route path="/book" element={<BookingForm />} />
        </Routes>
      </BookingContextProvider>
    </BrowserRouter>
  );
}

export default App;
