export const locations = [
    "Lucknow",
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Jaipur",
    "Ahmedabad",
    "Indore",
    "Surat",
    "Nagpur",
    "Patna",
    "Bhopal",
    "Chandigarh",
    "Goa",
    "Visakhapatnam",
    "Guwahati",
    "Ranchi",
];

export const buses = [
    {
        busId: "bus_001",
        company: "Sethi Yatra",
        busType: "A/C Seater",
        price: 899,
        originalPrice: 999,
        rating: 4.5,
        totalReviews: 720,
        badges: ["Comfortable Ride", "Well Maintained"],
    },
    {
        busId: "bus_002",
        company: "RedBus Travels",
        busType: "A/C Sleeper",
        price: 999,
        originalPrice: 1099,
        rating: 4.7,
        totalReviews: 950,
        badges: ["Highly Rated", "New Bus"],
    },
    {
        busId: "bus_003",
        company: "GoBus",
        busType: "Non-A/C Seater",
        price: 699,
        originalPrice: 799,
        rating: 4.2,
        totalReviews: 530,
        badges: ["Affordable", "Great Service"],
    },
    {
        busId: "bus_004",
        company: "National Express",
        busType: "A/C Sleeper",
        price: 1199,
        originalPrice: 1299,
        rating: 4.8,
        totalReviews: 1100,
        badges: ["Premium Experience", "Fast Service"],
    },
    {
        busId: "bus_005",
        company: "GreenLine Travels",
        busType: "Non-A/C Sleeper",
        price: 799,
        originalPrice: 899,
        rating: 4.1,
        totalReviews: 400,
        badges: ["Budget Friendly", "Good Seats"],
    },
];

export const generateSeats = () => {
    const seats = [];
    for (let i = 1; i <= 28; i++) {
        let seatType;

        if (i > 24) {
            seatType = i % 4 === 1 ? "window" : "side";
        } else {
            seatType = i % 4 === 1 ? "window" : i % 4 === 2 ? "path" : "side";
        }

        seats.push({
            seat_id: i,
            type: seatType,
            booked: false,
        });
    }
    return Array(7)
        .fill()
        .map((_, row) => seats.slice(row * 4, row * 4 + 4));
};
