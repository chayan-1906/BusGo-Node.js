import {ISeat} from "./models/BusSchema";

export const cities = [
    'Lucknow',
    'Delhi',
    'Mumbai',
    'Bangalore',
    'Chennai',
    'Kolkata',
    'Hyderabad',
    // 'Pune',
    'Amritsar',
    'Jaipur',
    'Ahmedabad',
    // 'Indore',
    // 'Surat',
    'Nagpur',
    'Patna',
    // 'Bhopal',
    'Chandigarh',
    'Goa',
    'Visakhapatnam',
    'Guwahati',
    'Ranchi',
    // 'Mysore',
    // 'Coimbatore',
    'Kanpur',
    // 'Thane',
    'Agra',
    // 'Nashik',
    // 'Vadodara',
    // 'Faridabad',
    // 'Meerut',
    'Rajkot',
    // 'Kochi',
];

export const buses = [
    {
        busId: 'bus_001',
        company: 'Indigo Express',
        busTags: ['A/C', 'Volvo', 'Sleeper', 'Private'],
        price: 849,
        originalPrice: 999,
        rating: 4.5,
        totalReviews: 720,
        badges: ['Comfortable Ride', 'Well Maintained', 'On-Time Arrival'],
    },
    {
        busId: 'bus_002',
        company: 'SkyLine Tours',
        busTags: ['Non A/C', 'Private'],
        price: 1049,
        originalPrice: 1199,
        rating: 4.7,
        totalReviews: 950,
        badges: ['Highly Rated', 'New Bus', 'Safe Driver'],
    },
    {
        busId: 'bus_003',
        company: 'BlueBird Travels',
        busTags: ['Non A/C', 'Seater', 'Private'],
        price: 729,
        originalPrice: 849,
        rating: 4.2,
        totalReviews: 530,
        badges: ['Affordable', 'Great Service', 'Onboard Water'],
    },
    {
        busId: 'bus_004',
        company: 'Royal Roadways',
        busTags: ['A/C', 'Sleeper', 'Private'],
        price: 1150,
        originalPrice: 1300,
        rating: 4.8,
        totalReviews: 1100,
        badges: ['Premium Experience', 'Fast Service', 'Charging Ports'],
    },
    {
        busId: 'bus_005',
        company: 'Swift Travels',
        busTags: ['Non A/C', 'Sleeper', 'Private'],
        price: 769,
        originalPrice: 919,
        rating: 4.1,
        totalReviews: 400,
        badges: ['Budget Friendly', 'Good Seats', 'Friendly Staff'],
    },
    {
        busId: 'bus_006',
        company: 'Tranz India',
        busTags: ['A/C', 'Seater', 'Government'],
        price: 985,
        originalPrice: 1150,
        rating: 4.3,
        totalReviews: 610,
        badges: ['Comfortable Ride', 'WiFi Available', 'CCTV Enabled'],
    },
    {
        busId: 'bus_007',
        company: 'Blueway Tours',
        busTags: ['A/C', 'Sleeper', 'Private'],
        price: 1120,
        originalPrice: 1270,
        rating: 4.6,
        totalReviews: 880,
        badges: ['Well Maintained', 'Snack Included', 'Recliner Seats'],
    },
    {
        busId: 'bus_008',
        company: 'Silverline Express',
        busTags: ['Non A/C', 'Seater', 'Private'],
        price: 685,
        originalPrice: 835,
        rating: 3.9,
        totalReviews: 320,
        badges: ['Affordable', 'Spacious Seats', 'Sanitized Buses'],
    },
    {
        busId: 'bus_009',
        company: 'TurboWay Buses',
        busTags: ['A/C', 'Sleeper', 'Volvo', 'Private'],
        price: 1210,
        originalPrice: 1410,
        rating: 4.9,
        totalReviews: 1300,
        badges: ['Luxury Coach', 'Fast Service', 'Professional Staff'],
    },
    {
        busId: 'bus_010',
        company: 'GoldenRoute',
        busTags: ['Non A/C', 'Sleeper', 'Private'],
        price: 830,
        originalPrice: 980,
        rating: 4.0,
        totalReviews: 450,
        badges: ['Budget Friendly', 'Night Service', 'Safe Stops'],
    },
    {
        busId: 'bus_011',
        company: 'Zed Travels',
        busTags: ['A/C', 'Seater', 'Private'],
        price: 940,
        originalPrice: 1090,
        rating: 4.4,
        totalReviews: 670,
        badges: ['Fast Boarding', 'Clean Interiors', 'Curtains Provided'],
    },
    {
        busId: 'bus_012',
        company: 'Orbit Buses',
        busTags: ['A/C', 'Sleeper', 'Private'],
        price: 1190,
        originalPrice: 1390,
        rating: 4.6,
        totalReviews: 990,
        badges: ['Luxury Ride', 'Entertainment System', 'Mineral Water'],
    },
    {
        busId: 'bus_013',
        company: 'QuickMove Travels',
        busTags: ['Non A/C', 'Seater', 'Private'],
        price: 610,
        originalPrice: 760,
        rating: 3.8,
        totalReviews: 290,
        badges: ['Low Cost', 'Daily Service', 'Experienced Drivers'],
    },
    {
        busId: 'bus_014',
        company: 'Starline Coaches',
        busTags: ['A/C', 'Sleeper', 'Private'],
        price: 1025,
        originalPrice: 1200,
        rating: 4.5,
        totalReviews: 800,
        badges: ['Onboard Charging', 'Soft Cushions', 'Music System'],
    },
    {
        busId: 'bus_015',
        company: 'Prime RoadLines',
        busTags: ['Non A/C', 'Sleeper', 'Government'],
        price: 750,
        originalPrice: 900,
        rating: 4.1,
        totalReviews: 500,
        badges: ['Reliable Service', 'Night Travel', 'Quick Stops'],
    },
];

// Government bus template for each route
export const governmentBus = {
    busId: 'govt_bus',
    company: 'State Transport Corporation',
    busTags: ['A/C', 'Seater', 'Govt'],
    price: 650,
    originalPrice: 750,
    rating: 4.0,
    totalReviews: 300,
    badges: ['Government Service', 'Affordable', 'Safe Travel'],
};

export const generateSeats = (): ISeat[][] => {
    const seats: ISeat[] = [];

    for (let i = 1; i <= 28; i++) {
        let seatType: ISeat['seatType'];

        if (i > 24) {
            seatType = i % 4 === 1 ? 'window' : 'side';
        } else {
            seatType = i % 4 === 1 ? 'window' : i % 4 === 2 ? 'path' : 'side';
        }

        seats.push({
            seatId: i,
            seatType,
            isBooked: false,
        });
    }

    return Array.from({length: 7}, (_, row) => seats.slice(row * 4, row * 4 + 4));
}
