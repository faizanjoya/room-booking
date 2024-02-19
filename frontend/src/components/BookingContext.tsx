import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  FC,
} from "react";
import { BookingRoomInput } from "../types";

interface BookingContextProps {
  roomData: BookingRoomInput | null;
  setRoomData: Dispatch<SetStateAction<BookingRoomInput | null>>;
}

const BookingContext = createContext<BookingContextProps | undefined>(
  undefined
);

interface bookingContextProviderProps {
  children: ReactNode;
}

export const BookingContextProvider: FC<bookingContextProviderProps> = ({
  children,
}) => {
  const [roomData, setRoomData] = useState<BookingRoomInput | null>(null);

  return (
    <BookingContext.Provider value={{ roomData, setRoomData }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = (): BookingContextProps => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error(
      "useBookingContext must be used within a BookingContextProvider"
    );
  }
  return context;
};
