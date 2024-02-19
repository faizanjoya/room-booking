export interface Room {
    id: number;
    title: string;
    description: string;
    number: number;
    type: string;
    sleeps: number;
    cost: number;
}

export interface BookingRoomInput {
    checkIn: Date;
    checkOut: Date;
    room: Room;
}

export interface CreateCustomerInput {
    name: string;
    email: string;
    phone: string;
}

export interface CreateBookingAndNewCustomerInput {
    checkIn: Date;
    checkOut: Date;
    paid: boolean;
    room: Room;
    customer: CreateCustomerInput;
}
