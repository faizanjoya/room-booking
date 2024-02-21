import { cleanup, render, screen } from "@testing-library/react";
import AvailableRooms from "./AvailableRooms";
import { MemoryRouter } from "react-router-dom";
import { BookingContextProvider } from "./BookingContext";
import { Room } from "../types";
import { useGetAvailableRooms } from "../hooks/useGetAvailableRooms";
import { Mock, vitest } from "vitest";

vitest.mock("../hooks/useGetAvailableRooms");

const mockUseGetAvailableRooms = vitest.fn();
const mockAvailableRooms: Room[] = [
  {
    id: 1,
    title: "Room 1",
    cost: 100,
    sleeps: 1,
    type: "Single",
    description: "Single room",
    number: 101,
  },
  {
    id: 2,
    title: "Room 2",
    cost: 200,
    sleeps: 2,
    type: "Double",
    description: "Double room",
    number: 102,
  },
];

describe("AvailableRooms", () => {
  afterEach(() => {
    cleanup();
    vitest.clearAllMocks();
  });

  test("renders loading state", () => {
    (useGetAvailableRooms as Mock).mockImplementation(() => ({
      availableRooms: [],
      loading: true,
      error: null,
      refetch: mockUseGetAvailableRooms,
    }));

    render(
      <MemoryRouter>
        <BookingContextProvider>
          <AvailableRooms />
        </BookingContextProvider>
      </MemoryRouter>
    );

    const loading = screen.getByText("Loading...");
    expect(loading).toBeVisible();
  });

  test("renders error state", () => {
    (useGetAvailableRooms as Mock).mockImplementation(() => ({
      availableRooms: [],
      loading: false,
      error: "Error fetching available rooms",
      refetch: mockUseGetAvailableRooms,
    }));

    render(
      <MemoryRouter>
        <BookingContextProvider>
          <AvailableRooms />
        </BookingContextProvider>
      </MemoryRouter>
    );

    const error = screen.getByText("Error fetching available rooms");
    expect(error).toBeVisible();
  });

  test("renders no rooms available state", () => {
    (useGetAvailableRooms as Mock).mockImplementation(() => ({
      availableRooms: [],
      loading: false,
      error: null,
      refetch: mockUseGetAvailableRooms,
    }));

    render(
      <MemoryRouter>
        <BookingContextProvider>
          <AvailableRooms />
        </BookingContextProvider>
      </MemoryRouter>
    );
    expect(
      screen.getByText("No rooms available for selected dates")
    ).toBeInTheDocument();
  });

  test("renders available rooms", () => {
    (useGetAvailableRooms as Mock).mockImplementation(() => ({
      availableRooms: mockAvailableRooms,
      loading: true,
      error: null,
      refetch: mockUseGetAvailableRooms,
    }));

    render(
      <MemoryRouter>
        <BookingContextProvider>
          <AvailableRooms />
        </BookingContextProvider>
      </MemoryRouter>
    );
    expect(screen.getByText("Room 1")).toBeInTheDocument();
    expect(screen.getByText("Room 2")).toBeInTheDocument();
  });
});
