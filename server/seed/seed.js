const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Tour = require('../models/Tour');
const Booking = require('../models/Booking');
const Wishlist = require('../models/Wishlist');

dotenv.config();

const sampleTours = [
  {
    title: 'Goa: Tropical Beach & Luxury Catamaran Cruise',
    destination: 'Goa',
    category: 'Beach',
    duration: '5 Days / 4 Nights',
    price: 18500,
    capacity: 16,
    availableDates: ['2026-11-15', '2026-11-28', '2026-12-10', '2026-12-24'],
    overview:
      'Immerse in the sun-drenched golden sands of South and North Goa. Experience a sunset catamaran cruise along the Mandovi River, historic Portuguese Latin Quarter walking tour in Fontainhas, and beachfront gourmet dining.',
    featured: true,
    rating: 4.9,
    reviewsCount: 38,
    images: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    ],
    inclusions: [
      '4 Nights in 5-Star Beachfront Resort',
      'Daily Buffet Breakfast & Gourmet Dinners',
      'Private Mandovi Luxury Catamaran Sunset Cruise',
      'AC SUV Transport for all transfers and sightseeing',
      'Heritage Guide in Fontainhas & Old Goa Churches',
    ],
    exclusions: [
      'Airfare to and from Goa',
      'Personal water sports and beach parasailing fees',
      'Alcoholic beverages outside dinner inclusions',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Beachfront Welcome',
        description:
          'Arrival at MOPA or Dabolim airport, private luxury transfer to beach resort in Candolim. Evening welcome cocktail with live acoustic Goan music.',
        meals: 'Dinner Included',
        accommodation: 'Taj Holiday Village Resort',
      },
      {
        day: 2,
        title: 'Latin Quarter Heritage & Spice Plantation',
        description:
          'Walking heritage tour through colorful Fontainhas alleys. Lunch with traditional Goan thali at Sahakari Spice Plantation followed by spice trail.',
        meals: 'Breakfast & Traditional Lunch',
        accommodation: 'Taj Holiday Village Resort',
      },
      {
        day: 3,
        title: 'Mandovi Luxury Catamaran Sunset Cruise',
        description:
          'Leisure morning on the beach. Afternoon boarding of private twin-hull catamaran with snacks, drinks, and dolphin spotting in the Arabian Sea.',
        meals: 'Breakfast & Sunset Canapes',
        accommodation: 'Taj Holiday Village Resort',
      },
      {
        day: 4,
        title: 'South Goa Hidden Coves & Cabo de Rama',
        description:
          'Explore pristine Palolem Beach, Butterfly Beach boat transfer, and sunset cliff vistas at historic Cabo de Rama Fort.',
        meals: 'Breakfast & Seafood Dinner',
        accommodation: 'Taj Holiday Village Resort',
      },
      {
        day: 5,
        title: 'Souvenir Markets & Departure',
        description:
          'Morning shopping at Anjuna flea market, checkout, and airport chauffeur drop-off.',
        meals: 'Breakfast Included',
        accommodation: 'Departure',
      },
    ],
    reviews: [
      {
        user: 'Rohit Sharma',
        rating: 5,
        comment: 'The private catamaran cruise was unforgettable! Seamless organization and top-notch hotel.',
        date: new Date('2026-09-12'),
      },
      {
        user: 'Neha Varma',
        rating: 5,
        comment: 'Loved the Fontainhas heritage walk and beach dinner. Truly a 5-star experience.',
        date: new Date('2026-10-04'),
      },
    ],
  },
  {
    title: 'Kashmir: Paradise on Earth - Srinagar, Gulmarg & Pahalgam',
    destination: 'Srinagar, Kashmir',
    category: 'Mountain',
    duration: '6 Days / 5 Nights',
    price: 32000,
    capacity: 12,
    availableDates: ['2026-11-20', '2026-12-05', '2026-12-20', '2027-01-10'],
    overview:
      'Awaken on a heritage cedar wood Shikara in Dal Lake, ride the Gulmarg Gondola to Kongdoori & Apharwat Peak snowfields, and wander through pine-scented valleys in Pahalgam.',
    featured: true,
    rating: 4.95,
    reviewsCount: 52,
    images: [
      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1200&auto=format&fit=crop&q=80',
    ],
    inclusions: [
      '1 Night in Heritage Royal Houseboat on Dal Lake',
      '4 Nights in Luxury Alpine Boutique Resorts',
      'Gulmarg Gondola Phase 1 & 2 Cable Car Tickets Included',
      '2-Hour Shikara ride on Dal Lake at Sunset',
      'All Meals: Authentic Kashmiri Wazwan & Multi-Cuisine Buffets',
    ],
    exclusions: ['Pony / horse rides in Pahalgam', 'Personal warm jackets rental'],
    itinerary: [
      {
        day: 1,
        title: 'Welcome to Dal Lake & Shikara Cruise',
        description: 'Warm Kashmiri Kahwa welcome aboard royal carved cedar houseboat. Evening floating market Shikara ride.',
        meals: 'Dinner Included',
        accommodation: 'Royal Dal Heritage Houseboat',
      },
      {
        day: 2,
        title: 'Mughal Gardens to Gulmarg Alpine Meadows',
        description: 'Visit Nishat Bagh and Shalimar Bagh before scenic drive ascending pine forests to snow-clad Gulmarg.',
        meals: 'Breakfast & Dinner',
        accommodation: 'The Khyber Himalayan Resort & Spa',
      },
      {
        day: 3,
        title: 'Gulmarg Gondola to Apharwat Peak (13,780 ft)',
        description: 'Ascend Asia highest operating cable car to Phase 2 Apharwat Peak. Enjoy snow sledging and skiing views.',
        meals: 'Breakfast & Dinner',
        accommodation: 'The Khyber Himalayan Resort & Spa',
      },
      {
        day: 4,
        title: 'Pahalgam - Valley of Shepherds',
        description: 'Drive along saffron fields of Pampore to Lidder River valley. Stroll along Betaab Valley and Aru Valley.',
        meals: 'Breakfast & Dinner',
        accommodation: 'Pahalgam Pine Palace',
      },
      {
        day: 5,
        title: 'Baisaran Mini Switzerland Excursion',
        description: 'Scenic pine forest nature walk in Baisaran meadow overlooking snow-capped Pir Panjal range.',
        meals: 'Breakfast & Wazwan Feast Dinner',
        accommodation: 'Pahalgam Pine Palace',
      },
      {
        day: 6,
        title: 'Departure from Srinagar Airport',
        description: 'Morning saffron and dry fruit shopping at Lal Chowk, followed by airport drop-off.',
        meals: 'Breakfast Included',
        accommodation: 'Departure',
      },
    ],
    reviews: [
      {
        user: 'Vikram Malhotra',
        rating: 5,
        comment: 'Unbelievably scenic. The Gondola ride was breathtaking and Wazwan dinner was out of this world.',
        date: new Date('2026-09-28'),
      },
    ],
  },
  {
    title: 'Manali & Solang: Alpine Pine Valley & Rohtang Pass',
    destination: 'Manali, Himachal Pradesh',
    category: 'Adventure',
    duration: '5 Days / 4 Nights',
    price: 21000,
    capacity: 18,
    availableDates: ['2026-11-18', '2026-12-02', '2026-12-16', '2027-01-05'],
    overview:
      'Crisp mountain breezes, Apple orchards of Old Manali, thrilling paragliding over Solang Valley, and scenic snowy crossings through Atal Tunnel to Sissu.',
    featured: true,
    rating: 4.85,
    reviewsCount: 29,
    images: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1200&auto=format&fit=crop&q=80',
    ],
    inclusions: [
      '4 Nights in Luxury Riverside Pine Chalet',
      'Breakfast and 4-Course Dinners daily',
      'Atal Tunnel & Sissu Lahaul Day Expedition',
      'Solang Valley Adventure & Cable Car Pass',
    ],
    exclusions: ['Extreme sports equipment rental', 'Personal laundry'],
    itinerary: [
      { day: 1, title: 'Arrival in Manali & Old Manali Cafes', description: 'Check-in, relax by the Beas River, visit Hadimba Temple and artisanal cafes in Old Manali.', meals: 'Dinner Included', accommodation: 'Apple Country Resort' },
      { day: 2, title: 'Solang Valley Adventure Sports', description: 'Full day in Solang Valley: paragliding, zorbing, and ropeway ride.', meals: 'Breakfast & Dinner', accommodation: 'Apple Country Resort' },
      { day: 3, title: 'Atal Tunnel to Sissu Waterfall', description: 'Drive through world-famous 9km Atal Tunnel into dramatic snowscapes of Lahaul Valley.', meals: 'Breakfast & Dinner', accommodation: 'Apple Country Resort' },
      { day: 4, title: 'Naggar Castle & Roerich Art Gallery', description: 'Visit historic wooden Naggar Castle, local trout lunch, and river rafting in Kullu.', meals: 'Breakfast & Dinner', accommodation: 'Apple Country Resort' },
      { day: 5, title: 'Mall Road Shopping & Farewell', description: 'Buy Kullu shawls and organic honey before onward journey.', meals: 'Breakfast Included', accommodation: 'Departure' },
    ],
    reviews: [
      { user: 'Kunal Kapoor', rating: 5, comment: 'Atal Tunnel and Sissu were stunning. Seamless arrangements!', date: new Date('2026-10-15') },
    ],
  },
  {
    title: 'Kerala: Backwaters, Munnar Tea Hills & Alleppey Houseboat',
    destination: 'Kerala',
    category: 'Honeymoon',
    duration: '6 Days / 5 Nights',
    price: 27500,
    capacity: 14,
    availableDates: ['2026-11-22', '2026-12-08', '2026-12-22', '2027-01-12'],
    overview:
      'Misty rolling tea estates in Munnar, spices of Thekkady, and a fairytale private thatched houseboat drifting on tranquil backwaters of Alleppey.',
    featured: true,
    rating: 4.92,
    reviewsCount: 44,
    images: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&auto=format&fit=crop&q=80',
    ],
    inclusions: [
      '2 Nights in Munnar Tea Plantation Luxury Villa',
      '1 Night in Thekkady Rainforest Jungle Lodge',
      '1 Night in Private Luxury Alleppey Kettuvallam Houseboat',
      '1 Night in Marari Beach Eco Resort',
      'Full Board on Houseboat (Authentic Karimeen fish & Kerala Sadhya)',
    ],
    exclusions: ['Ayurvedic spa treatments', 'Tips and personal porterage'],
    itinerary: [
      { day: 1, title: 'Cochin to Misty Munnar Tea Hills', description: 'Scenic drive past Cheeyappara waterfalls to colonial tea highlands.', meals: 'Dinner Included', accommodation: 'Blanket Hotel & Spa Munnar' },
      { day: 2, title: 'Kolukkumalai Tea & Eravikulam National Park', description: 'Early morning jeep safari to Kolukkumalai world highest tea plantation. Spot Nilgiri Tahr.', meals: 'Breakfast & Dinner', accommodation: 'Blanket Hotel & Spa Munnar' },
      { day: 3, title: 'Thekkady Periyar Wildlife Sanctuary', description: 'Boat safari in Periyar Lake watching wild elephants, followed by evening Kathakali cultural show.', meals: 'Breakfast & Dinner', accommodation: 'Spice Village Thekkady' },
      { day: 4, title: 'Private Alleppey Houseboat Cruise', description: 'Board traditional wood & coir houseboat. Cruise serene canals as chef prepares fresh local cuisine.', meals: 'All Meals Included', accommodation: 'Lakes & Lagoons Houseboat' },
      { day: 5, title: 'Marari Beach Relaxation & Sunset', description: 'Disembark to peaceful Marari Beach resort. Sunset stroll on white sands.', meals: 'Breakfast & Dinner', accommodation: 'Marari Sands Beach Resort' },
      { day: 6, title: 'Departure via Cochin Port', description: 'Visit Chinese fishing nets in Fort Kochi before transfer to airport.', meals: 'Breakfast Included', accommodation: 'Departure' },
    ],
    reviews: [
      { user: 'Pooja Hegde', rating: 5, comment: 'The houseboat experience was magical! Highly recommend for couples.', date: new Date('2026-10-18') },
    ],
  },
  {
    title: 'Ladakh: Land of High Passes - Pangong Lake & Nubra',
    destination: 'Leh, Ladakh',
    category: 'Adventure',
    duration: '7 Days / 6 Nights',
    price: 38000,
    capacity: 10,
    availableDates: ['2026-11-25', '2026-12-12', '2027-01-15'],
    overview:
      'Cross Khardung La (18,380 ft), ride double-humped Bactrian camels on Hunder sand dunes, and gaze upon the changing turquoise hues of Pangong Tso.',
    featured: true,
    rating: 4.96,
    reviewsCount: 31,
    images: [
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80',
    ],
    inclusions: [
      '6 Nights in Luxury Heated Swiss Tents & Boutique Hotels',
      'All Meals & Oxygen Cylinders on standby in 4x4 vehicles',
      'Inner Line Permits for Nubra & Pangong Lake',
      'High-altitude experienced driver and guide',
    ],
    exclusions: ['Flights into Leh', 'Personal thermal gear'],
    itinerary: [
      { day: 1, title: 'Arrival in Leh & Acclimatization', description: 'Rest and acclimatize with garlic soup and herbal teas. Evening visit to Shanti Stupa.', meals: 'Dinner Included', accommodation: 'The Grand Dragon Ladakh' },
      { day: 2, title: 'Monasteries & Hall of Fame', description: 'Thiksey and Shey monasteries, Sindhu Ghat, and Magnetic Hill wonder.', meals: 'Breakfast & Dinner', accommodation: 'The Grand Dragon Ladakh' },
      { day: 3, title: 'Khardung La to Nubra Valley', description: 'Ascend world highest motorable pass to Nubra Valley. Sunset camel safari in Hunder.', meals: 'Breakfast & Dinner', accommodation: 'Nubra Organic Retreat' },
      { day: 4, title: 'Diskit Monastery to Pangong Tso', description: 'Pass 106ft Maitreya Buddha, traverse Shayok river route directly to Pangong Lake.', meals: 'Breakfast & Dinner', accommodation: 'Pangong Glamping Tents' },
      { day: 5, title: 'Sunrise at Pangong to Leh via Chang La', description: 'Breathtaking lake colors at dawn, return over Chang La (17,688 ft).', meals: 'Breakfast & Dinner', accommodation: 'The Grand Dragon Ladakh' },
      { day: 6, title: 'Leh Local Bazaars & Tibetan Handicrafts', description: 'Explore Old Leh main market, buy Pashmina shawls and apricots.', meals: 'Breakfast & Farewell Dinner', accommodation: 'The Grand Dragon Ladakh' },
      { day: 7, title: 'Departure from Leh Kushok Bakula Airport', description: 'Spectacular aerial Himalayan flight departure.', meals: 'Breakfast Included', accommodation: 'Departure' },
    ],
    reviews: [
      { user: 'Siddharth Roy', rating: 5, comment: 'Pangong Lake at sunrise is a spiritual experience. Outstanding support team!', date: new Date('2026-09-20') },
    ],
  },
  {
    title: 'Bali: Tropical Island Odyssey - Ubud, Nusa Penida & Seminyak',
    destination: 'Bali, Indonesia',
    category: 'Luxury',
    duration: '7 Days / 6 Nights',
    price: 58000,
    capacity: 12,
    availableDates: ['2026-11-28', '2026-12-15', '2026-12-28', '2027-01-18'],
    overview:
      'Lush jungle pool villas in Ubud, iconic T-Rex cliff at Kelingking Beach Nusa Penida, floating breakfasts, Tanah Lot sea temple, and sunset beach clubs.',
    featured: true,
    rating: 4.97,
    reviewsCount: 61,
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&auto=format&fit=crop&q=80',
    ],
    inclusions: [
      '3 Nights in Private Pool Villa in Ubud',
      '3 Nights in 5-Star Beachfront Seminyak Resort',
      'Speedboat transfers to Nusa Penida Island Day Tour',
      'Balinese Spa Treatment & Floating Breakfast in Villa',
      'Airport VIP fast-track assistance',
    ],
    exclusions: ['International Flights', 'Visa on Arrival fees (approx $35)'],
    itinerary: [
      { day: 1, title: 'Denpasar Arrival to Rainforest Ubud', description: 'Private luxury transfer to Ubud valley villa with infinity pool overlooking jungle.', meals: 'Dinner Included', accommodation: 'Kamandalu Ubud Resort' },
      { day: 2, title: 'Tegalalang Rice Terraces & Jungle Swing', description: 'Early morning photoshoot on giant jungle swing and sacred monkey forest sanctuary.', meals: 'Breakfast & Lunch', accommodation: 'Kamandalu Ubud Resort' },
      { day: 3, title: 'Nusa Penida Island Speedboat Day Cruise', description: 'Visit Kelingking T-Rex cliff, Angel Billabong, Broken Beach, and snorkel with Manta Rays.', meals: 'Breakfast & Seafood Lunch', accommodation: 'Kamandalu Ubud Resort' },
      { day: 4, title: 'Transfer to Seminyak & Tanah Lot Sunset', description: 'Scenic drive to southern coast, ocean cliff temple at Tanah Lot, and beach club entry.', meals: 'Breakfast & Dinner', accommodation: 'W Bali Seminyak' },
      { day: 5, title: 'Uluwatu Cliff & Kecak Fire Dance', description: 'Sunset ocean vistas at Uluwatu Temple with mesmerizing Balinese fire dance performance.', meals: 'Breakfast & Jimbaran Seafood Dinner', accommodation: 'W Bali Seminyak' },
      { day: 6, title: 'Free Leisure & Seminyak Boutiques', description: 'Enjoy luxury Balinese massage, shopping, and beachside cocktails.', meals: 'Breakfast & Dinner', accommodation: 'W Bali Seminyak' },
      { day: 7, title: 'Farewell Bali Departure', description: 'Transfer to Ngurah Rai International Airport.', meals: 'Breakfast Included', accommodation: 'Departure' },
    ],
    reviews: [
      { user: 'Ananya Panday', rating: 5, comment: 'The Ubud private villa and floating breakfast were absolute heaven!', date: new Date('2026-10-10') },
    ],
  },
  {
    title: 'Andaman: Turquoise Coral Seas & Havelock Radhanagar',
    destination: 'Andaman & Nicobar',
    category: 'Beach',
    duration: '6 Days / 5 Nights',
    price: 42000,
    capacity: 15,
    availableDates: ['2026-11-20', '2026-12-08', '2026-12-24', '2027-01-20'],
    overview:
      'Asia best beach at Radhanagar Havelock, thrilling sea walk and scuba diving on Elephant Beach reefs, and poignant sound & light show at Cellular Jail.',
    featured: false,
    rating: 4.88,
    reviewsCount: 27,
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    ],
    inclusions: [
      'Makruzz Catamaran Luxury Cruise between Islands',
      '5 Nights in 5-Star Beach Resorts',
      'Scuba Diving session with PADI certified instructor',
      'All Entry permits and museum tickets',
    ],
    exclusions: ['Airfare to Port Blair', 'Personal underwater camera hire'],
    itinerary: [
      { day: 1, title: 'Port Blair & Historic Cellular Jail', description: 'Cellular Jail visit and moving light & sound memorial.', meals: 'Dinner Included', accommodation: 'Symphony Samudra Resort' },
      { day: 2, title: 'Makruzz Cruise to Havelock Island', description: 'High-speed catamaran cruise to Havelock. Radhanagar Beach sunset.', meals: 'Breakfast & Dinner', accommodation: 'Barefoot at Havelock' },
      { day: 3, title: 'Elephant Beach Coral Snorkel & Scuba', description: 'Speedboat to Elephant Beach for vibrant live corals and sea turtles.', meals: 'Breakfast & Dinner', accommodation: 'Barefoot at Havelock' },
      { day: 4, title: 'Neil Island Natural Rock Bridge', description: 'Visit Bharatpur and Laxmanpur beaches with natural coral formation.', meals: 'Breakfast & Dinner', accommodation: 'Sea Shell Neil' },
      { day: 5, title: 'Return to Port Blair & Chidiya Tapu Sunset', description: 'Cruise back to capital. Sunset birdwatching at Chidiya Tapu.', meals: 'Breakfast & Seafood Dinner', accommodation: 'Symphony Samudra Resort' },
      { day: 6, title: 'Departure', description: 'Airport drop-off for flight back home.', meals: 'Breakfast Included', accommodation: 'Departure' },
    ],
    reviews: [
      { user: 'Deepak Rao', rating: 5, comment: 'Crystal clear waters and world-class scuba dive in Havelock!', date: new Date('2026-09-30') },
    ],
  },
  {
    title: 'Varanasi & Ayodhya: Sacred Ganges & Heritage Trail',
    destination: 'Varanasi & Ayodhya, Uttar Pradesh',
    category: 'Spiritual',
    duration: '4 Days / 3 Nights',
    price: 19500,
    capacity: 20,
    availableDates: ['2026-11-16', '2026-11-30', '2026-12-14', '2027-01-08'],
    overview:
      'Witness the mesmerizing evening Ganga Aarti at Dashashwamedh Ghat from a private decorated bajra boat, visit Kashi Vishwanath corridor and newly consecrated Ram Mandir in Ayodhya.',
    featured: false,
    rating: 4.91,
    reviewsCount: 35,
    images: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
    ],
    inclusions: [
      'VIP Darshan at Kashi Vishwanath & Ayodhya Ram Mandir',
      'Exclusive Sunset Decorated Boat during Ganga Aarti',
      '3 Nights in Heritage Palace Hotel on the Ghats',
      'All Pure Vegetarian Gourmet Meals',
    ],
    exclusions: ['Personal donations and special puja rituals', 'Airfare'],
    itinerary: [
      { day: 1, title: 'Varanasi Arrival & Evening Ganga Aarti', description: 'Check-in to riverside heritage palace. Private sunset bajra boat for Dashashwamedh Aarti.', meals: 'Dinner Included', accommodation: 'BrijRama Palace Varanasi' },
      { day: 2, title: 'Subah-e-Banaras, Sarnath & Vishwanath', description: 'Dawn sunrise boat ride, visit Sarnath deer park where Buddha gave his first sermon, and Kashi Vishwanath temple corridor.', meals: 'Breakfast & Dinner', accommodation: 'BrijRama Palace Varanasi' },
      { day: 3, title: 'Ayodhya Ram Mandir VIP Excursion', description: 'Morning Vande Bharat or luxury coach to Ayodhya. Darshan at Ram Mandir and Hanuman Garhi.', meals: 'Breakfast & Dinner', accommodation: 'The Grand Ayodhya Palace' },
      { day: 4, title: 'Sarayu River Aarti & Departure', description: 'Morning Sarayu riverfront visit and transfer to Ayodhya or Varanasi airport.', meals: 'Breakfast Included', accommodation: 'Departure' },
    ],
    reviews: [
      { user: 'Sunita Mehra', rating: 5, comment: 'The VIP boat at Varanasi Aarti was divine. Unmatched spiritual tranquility.', date: new Date('2026-10-02') },
    ],
  },
  {
    title: 'Meghalaya: Living Root Bridges & Cherrapunji Waterfalls',
    destination: 'Shillong & Cherrapunji',
    category: 'Heritage',
    duration: '5 Days / 4 Nights',
    price: 29000,
    capacity: 14,
    availableDates: ['2026-11-24', '2026-12-10', '2026-12-26', '2027-01-14'],
    overview:
      'Hike down to the miraculous Double Decker Living Root Bridge in Nongriat, gaze into emerald transparent waters of Umngot River in Dawki, and explore Nohkalikai Falls.',
    featured: false,
    rating: 4.89,
    reviewsCount: 22,
    images: [
      'https://images.unsplash.com/photo-1626014303757-64670081d4be?w=1200&auto=format&fit=crop&q=80',
    ],
    inclusions: [
      'All boutique forest resort accommodations',
      'Local Khasi naturalist guide for Nongriat trek',
      'Boating on crystal-clear Umngot River Dawki',
      'Breakfast and traditional local dinners',
    ],
    exclusions: ['Guwahati airport flights', 'Trekking poles'],
    itinerary: [
      { day: 1, title: 'Guwahati to Shillong Scotland of the East', description: 'Umiam Lake viewpoint and boutique lodge check-in.', meals: 'Dinner Included', accommodation: 'Ri Kynjai Resort' },
      { day: 2, title: 'Cherrapunji & Nohkalikai Waterfalls', description: 'Drive along cloud-kissed cliffs to tallest plunge waterfall in India and Mawsmai Cave.', meals: 'Breakfast & Dinner', accommodation: 'Polo Orchid Resort' },
      { day: 3, title: 'Nongriat Double Decker Root Bridge Trek', description: 'Hike 3000 stone steps through lush jungle to UNESCO bio-engineering wonder and Rainbow Falls.', meals: 'Breakfast & Packed Picnic', accommodation: 'Polo Orchid Resort' },
      { day: 4, title: 'Dawki Crystal River & Mawlynnong Cleanest Village', description: 'Boat ride where boats appear to float on air over transparent water.', meals: 'Breakfast & Dinner', accommodation: 'Ri Kynjai Resort' },
      { day: 5, title: 'Departure via Guwahati Kamakhya', description: 'Morning Kamakhya temple visit and airport drop-off.', meals: 'Breakfast Included', accommodation: 'Departure' },
    ],
    reviews: [
      { user: 'Arunav Gogoi', rating: 5, comment: 'Dawki and living root bridges felt like another planet! Excellent guide.', date: new Date('2026-10-12') },
    ],
  },
  {
    title: 'Dubai: Ultra Luxury Desert Safari & Burj Khalifa Skyline',
    destination: 'Dubai, UAE',
    category: 'Luxury',
    duration: '5 Days / 4 Nights',
    price: 65000,
    capacity: 16,
    availableDates: ['2026-11-26', '2026-12-12', '2026-12-27', '2027-01-15'],
    overview:
      'Stay in world-class 5-star skyscraper suites, ascend Burj Khalifa level 148 At The Top Sky, race across red dunes in vintage Land Rovers, and dine under desert stars.',
    featured: true,
    rating: 4.94,
    reviewsCount: 48,
    images: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&auto=format&fit=crop&q=80',
    ],
    inclusions: [
      '4 Nights in 5-Star Hotel in Downtown Dubai',
      'Burj Khalifa Level 148 Sky Lounge Fast-Track Tickets',
      'Platinum Heritage Desert Safari with 6-course royal dinner',
      'Private Yacht Cruise past Atlantis The Palm',
    ],
    exclusions: ['UAE Tourist Visa', 'Personal luxury shopping'],
    itinerary: [
      { day: 1, title: 'Dubai Arrival & Marina Dhow Cruise', description: 'Chauffeur limousine transfer from DXB airport. Evening luxury marina cruise.', meals: 'Dinner Included', accommodation: 'Address Downtown Dubai' },
      { day: 2, title: 'Burj Khalifa Sky & Dubai Mall Fountain', description: 'Highest observation deck in the world at 555m, followed by underwater zoo.', meals: 'Breakfast & Dinner', accommodation: 'Address Downtown Dubai' },
      { day: 3, title: 'Royal Desert Safari with Falcons & Fire Show', description: 'Conservation reserve safari in open-top 1950s Land Rovers with royal BBQ.', meals: 'Breakfast & Royal Dinner', accommodation: 'Address Downtown Dubai' },
      { day: 4, title: 'Palm Jumeirah Yacht & Museum of Future', description: 'Private 3-hour yacht past Burj Al Arab and futuristic architectural marvel.', meals: 'Breakfast & Dinner', accommodation: 'Address Downtown Dubai' },
      { day: 5, title: 'Gold Souk & Departure', description: 'Old Dubai abra water taxi to Spice & Gold Souks, airport transfer.', meals: 'Breakfast Included', accommodation: 'Departure' },
    ],
    reviews: [
      { user: 'Sameer Khan', rating: 5, comment: 'Spectacular VIP arrangements. The platinum desert safari was unforgettable.', date: new Date('2026-10-08') },
    ],
  },
  {
    title: 'Ooty & Coonoor: Nilgiri Toy Train & British Tea Mansions',
    destination: 'Ooty & Nilgiris, Tamil Nadu',
    category: 'Mountain',
    duration: '4 Days / 3 Nights',
    price: 16500,
    capacity: 16,
    availableDates: ['2026-11-17', '2026-12-03', '2026-12-18', '2027-01-07'],
    overview:
      'Chug through misty eucalyptus tunnels on the UNESCO Nilgiri Mountain Railway toy train, sample artisanal homemade chocolates, and stroll across botanical gardens.',
    featured: false,
    rating: 4.82,
    reviewsCount: 19,
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80',
    ],
    inclusions: [
      '3 Nights in Heritage British Colonial Tea Mansion',
      'First Class Toy Train Tickets from Mettupalayam to Ooty',
      'Private car for Coonoor Sim Park and Doddabetta Peak',
      'Daily English Breakfast & Anglo-Indian dinners',
    ],
    exclusions: ['Airfare to Coimbatore', 'Boating charges at Ooty Lake'],
    itinerary: [
      { day: 1, title: 'Coimbatore to Nilgiris & Heritage Check-in', description: 'Scenic hairpin bend climb to Ooty. Afternoon tea in royal estate.', meals: 'Dinner Included', accommodation: 'Savoy - IHCL SeleQtions' },
      { day: 2, title: 'UNESCO Toy Train to Coonoor & Tea Estate', description: 'Historic steam train chugging past waterfalls to Coonoor tea gardens.', meals: 'Breakfast & Dinner', accommodation: 'Savoy - IHCL SeleQtions' },
      { day: 3, title: 'Doddabetta Peak & Avalanche Lake', description: 'Panoramic 8,650 ft view, quiet trout fishing at pristine Avalanche Lake.', meals: 'Breakfast & Dinner', accommodation: 'Savoy - IHCL SeleQtions' },
      { day: 4, title: 'Botanical Gardens & Coimbatore Departure', description: 'Morning rose garden walk and downhill transfer.', meals: 'Breakfast Included', accommodation: 'Departure' },
    ],
    reviews: [
      { user: 'Meera Nambiar', rating: 5, comment: 'Toy train was nostalgic and the Savoy tea mansion was sheer vintage elegance.', date: new Date('2026-09-18') },
    ],
  },
  {
    title: 'Darjeeling & Gangtok: Kanchenjunga Sunrise & Monasteries',
    destination: 'Darjeeling & Sikkim',
    category: 'Mountain',
    duration: '6 Days / 5 Nights',
    price: 26000,
    capacity: 14,
    availableDates: ['2026-11-21', '2026-12-07', '2026-12-21', '2027-01-11'],
    overview:
      'Watch golden dawn illuminate Mount Kanchenjunga (world 3rd highest peak) from Tiger Hill, ride the Himalayan Toy Train, and visit Rumtek Monastery in Sikkim.',
    featured: false,
    rating: 4.87,
    reviewsCount: 26,
    images: [
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1200&auto=format&fit=crop&q=80',
    ],
    inclusions: [
      'All boutique hotel stays with Kanchenjunga view',
      'Tiger Hill sunrise special 4x4 permits',
      'Tsomgo Changu Lake & Baba Mandir permit in Sikkim',
      'Breakfast and Himalayan Tibetan buffet dinners',
    ],
    exclusions: ['Bagdogra flights', 'Cable car at Gangtok'],
    itinerary: [
      { day: 1, title: 'Bagdogra to Darjeeling Queen of the Hills', description: 'Climb through tea slopes to Darjeeling town. Stroll along Chowrasta Mall.', meals: 'Dinner Included', accommodation: 'Mayfair Darjeeling' },
      { day: 2, title: 'Tiger Hill Dawn Sunrise & Batasia Loop', description: 'Witness pink and gold dawn over Kanchenjunga. Visit Ghoom Monastery.', meals: 'Breakfast & Dinner', accommodation: 'Mayfair Darjeeling' },
      { day: 3, title: 'Darjeeling to Gangtok via Teesta River', description: 'Scenic journey to Sikkim capital, visit Enchey Monastery and MG Marg.', meals: 'Breakfast & Dinner', accommodation: 'Mayfair Spa Resort Gangtok' },
      { day: 4, title: 'Glacial Tsomgo Lake at 12,310 ft', description: 'Drive to high-altitude frozen lake near Indo-China border.', meals: 'Breakfast & Dinner', accommodation: 'Mayfair Spa Resort Gangtok' },
      { day: 5, title: 'Rumtek Dharma Chakra Centre', description: 'Grandest monastery in Sikkim with ancient Buddhist murals and relics.', meals: 'Breakfast & Dinner', accommodation: 'Mayfair Spa Resort Gangtok' },
      { day: 6, title: 'Farewell Bagdogra Departure', description: 'Transfer down to Bagdogra airport.', meals: 'Breakfast Included', accommodation: 'Departure' },
    ],
    reviews: [
      { user: 'Tashi Bhutia', rating: 5, comment: 'Tiger Hill sunrise gave me goosebumps. Everything was well planned!', date: new Date('2026-10-14') },
    ],
  },
  {
    title: 'Rajasthan: Royal Heritage - Jaipur, Jodhpur & Udaipur',
    destination: 'Rajasthan',
    category: 'Heritage',
    duration: '7 Days / 6 Nights',
    price: 34500,
    capacity: 15,
    availableDates: ['2026-11-23', '2026-12-09', '2026-12-25', '2027-01-16'],
    overview:
      'Live like a Maharaja in authentic heritage Haveli palaces. Explore Amber Fort, Mehrangarh Citadel over the Blue City, and sunset boat ride on Lake Pichola in Udaipur.',
    featured: true,
    rating: 4.95,
    reviewsCount: 47,
    images: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&auto=format&fit=crop&q=80',
    ],
    inclusions: [
      '6 Nights in Royal Heritage Palaces (Jaipur, Jodhpur, Udaipur)',
      'Private AC Innova Crysta throughout',
      'Private boat cruise on Lake Pichola facing City Palace',
      'Elephant or Jeep ride at Amber Fort with royal historian guide',
      'Daily Rajasthani Royal Thali Dinners & Breakfasts',
    ],
    exclusions: ['Monuments video camera tickets', 'Personal shopping for gemstones'],
    itinerary: [
      { day: 1, title: 'Jaipur Pink City Palace & Hawa Mahal', description: 'Grand welcome with marigold garlands. Visit City Palace and Hawa Mahal.', meals: 'Dinner Included', accommodation: 'Samode Haveli Jaipur' },
      { day: 2, title: 'Amber Fort & Nahargarh Fort Sunset', description: 'Royal ascent to Amber Fort, Sheesh Mahal mirror palace, and sunset overlooking Jaipur.', meals: 'Breakfast & Dinner', accommodation: 'Samode Haveli Jaipur' },
      { day: 3, title: 'Jaipur to Jodhpur Blue City & Mehrangarh', description: 'Drive past Thar scrublands to mighty Mehrangarh Fort towering over indigo blue rooftops.', meals: 'Breakfast & Dinner', accommodation: 'Ajit Bhawan Palace Jodhpur' },
      { day: 4, title: 'Jaswant Thada & Drive to Udaipur', description: 'White marble cenotaph, drive past Ranakpur Jain temples with 1,444 marble pillars.', meals: 'Breakfast & Dinner', accommodation: 'Fateh Garh Heritage Palace Udaipur' },
      { day: 5, title: 'Udaipur City Palace & Lake Pichola Cruise', description: 'Majestic City Palace complex and royal boat ride past Jag Mandir.', meals: 'Breakfast & Dinner', accommodation: 'Fateh Garh Heritage Palace Udaipur' },
      { day: 6, title: 'Saheliyon-ki-Bari & Puppet Folk Evening', description: 'Royal fountains garden, Bagore Ki Haveli Dharohar cultural folk performance.', meals: 'Breakfast & Royal Feast Dinner', accommodation: 'Fateh Garh Heritage Palace Udaipur' },
      { day: 7, title: 'Udaipur Airport Departure', description: 'Transfer to Maharana Pratap Airport.', meals: 'Breakfast Included', accommodation: 'Departure' },
    ],
    reviews: [
      { user: 'Kavita Singhal', rating: 5, comment: 'Felt like real royalty every single day. Samode Haveli was exquisite!', date: new Date('2026-10-06') },
    ],
  },
  {
    title: 'Vietnam: Halong Bay Luxury Cruise & Hanoi French Quarter',
    destination: 'Hanoi & Halong Bay, Vietnam',
    category: 'Luxury',
    duration: '6 Days / 5 Nights',
    price: 52000,
    capacity: 14,
    availableDates: ['2026-11-27', '2026-12-14', '2026-12-30', '2027-01-22'],
    overview:
      'Sail between thousands of limestone karsts on an ultra-luxury 5-star balcony cruise ship in Halong Bay, taste authentic Pho in Hanoi Old Quarter, and kayak through emerald lagoons.',
    featured: false,
    rating: 4.93,
    reviewsCount: 39,
    images: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&auto=format&fit=crop&q=80',
    ],
    inclusions: [
      '2 Nights aboard 5-Star Halong Bay Cruise with private sea balcony',
      '3 Nights in French Colonial Boutique Hotel in Hanoi',
      'All meals on cruise including 7-course seafood banquet',
      'Bamboo boat rowing and kayaking through Sung Sot cave',
      'Hanoi street food guided tasting tour',
    ],
    exclusions: ['International Flights', 'Vietnam e-Visa'],
    itinerary: [
      { day: 1, title: 'Hanoi Arrival & Old Quarter Street Food', description: 'Check-in near Hoan Kiem Lake, cyclo tour through 36 guild streets and egg coffee tasting.', meals: 'Dinner Included', accommodation: 'Sofitel Legend Metropole Hanoi' },
      { day: 2, title: 'Boarding 5-Star Halong Bay Cruise', description: 'Limousine bus to Halong Bay port. Welcome drink on cruise, sail into limestone karst maze.', meals: 'Lunch & Seafood Dinner', accommodation: 'Stellar of the Seas Cruise' },
      { day: 3, title: 'Sung Sot Cave & Kayaking Emerald Lagoons', description: 'Explore Surprise Cave, kayak to hidden tidal lagoons, sunset cooking demonstration on sundeck.', meals: 'All Meals Included', accommodation: 'Stellar of the Seas Cruise' },
      { day: 4, title: 'Tai Chi at Dawn & Return to Hanoi', description: 'Morning sunrise Tai Chi on sundeck, pearl farm visit, cruise back and transfer to Hanoi.', meals: 'Brunch & Dinner', accommodation: 'Sofitel Legend Metropole Hanoi' },
      { day: 5, title: 'Ninh Binh Karst Day Trip', description: 'Rowboat through river caves of Trang An UNESCO site and climb Mua Cave peak.', meals: 'Breakfast & Lunch', accommodation: 'Sofitel Legend Metropole Hanoi' },
      { day: 6, title: 'Departure from Noi Bai Airport', description: 'Transfer to Hanoi airport for flight home.', meals: 'Breakfast Included', accommodation: 'Departure' },
    ],
    reviews: [
      { user: 'Rajesh Nair', rating: 5, comment: 'Halong Bay cruise balcony was out of this world! Amazing Vietnamese food.', date: new Date('2026-09-25') },
    ],
  },
  {
    title: 'Switzerland: Zermatt Matterhorn & Glacier Express Panorama',
    destination: 'Zermatt & St. Moritz, Switzerland',
    category: 'Mountain',
    duration: '7 Days / 6 Nights',
    price: 145000,
    capacity: 12,
    availableDates: ['2026-11-20', '2026-12-05', '2026-12-24', '2027-01-15'],
    overview:
      'Ride the world-renowned Glacier Express panoramic train through snowy alpine gorges, stay in timber luxury chalets in car-free Zermatt with unobstructed views of the iconic Matterhorn, and enjoy Swiss cheese fondue by a roaring fire.',
    featured: true,
    rating: 4.98,
    reviewsCount: 54,
    images: [
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=1200&auto=format&fit=crop&q=80',
    ],
    inclusions: [
      'Glacier Express Excellence Class First Class Tickets',
      '6 Nights in 5-Star Swiss Alpine Chalets',
      'Gornergrat Cogwheel Train to 3,089m summit',
      'Daily 5-course gourmet Swiss dinners with wine pairings',
      'Private helicopter Matterhorn fly-by experience',
    ],
    exclusions: ['International flights to Zurich/Geneva', 'Personal ski equipment rental'],
    itinerary: [
      { day: 1, title: 'Zurich to St. Moritz Engadin Valley', description: 'Scenic train into the high-altitude playground of royalty and alpine winter sports.', meals: 'Dinner Included', accommodation: 'Badrutt Palace Hotel' },
      { day: 2, title: 'Boarding Glacier Express Panorama', description: '8-hour journey over 291 bridges and through 91 tunnels with private sommelier service.', meals: 'All Meals Included', accommodation: 'The Omnia Zermatt' },
      { day: 3, title: 'Matterhorn Glacier Paradise (3,883m)', description: 'Highest cable car in Europe into year-round glacial snow world and ice palace.', meals: 'Breakfast & Fondue Dinner', accommodation: 'The Omnia Zermatt' },
      { day: 4, title: 'Gornergrat Railway & Riffelsee Reflection', description: 'Historic cogwheel railway ascent with picture-perfect Matterhorn lake reflection.', meals: 'Breakfast & Dinner', accommodation: 'The Omnia Zermatt' },
      { day: 5, title: 'Helicopter Alpine Tour & Spa Afternoon', description: 'Air Zermatt private helicopter flight circling the Matterhorn North Face.', meals: 'Breakfast & Dinner', accommodation: 'The Omnia Zermatt' },
      { day: 6, title: 'Scenic Descent to Geneva / Interlaken', description: 'Cruise past Lake Geneva vineyards with farewell Michelin-star feast.', meals: 'Breakfast & Dinner', accommodation: 'Hotel Beau-Rivage Geneva' },
      { day: 7, title: 'Departure from Geneva Airport', description: 'Private limousine transfer to airport for onward journey.', meals: 'Breakfast Included', accommodation: 'Departure' },
    ],
    reviews: [
      { user: 'Karan Singhal', rating: 5, comment: 'Glacier Express Excellence Class was the most luxurious journey of my life.', date: new Date('2026-10-12') },
    ],
  },
  {
    title: 'Japan: Tokyo, Kyoto & Mt. Fuji Cherry Blossom Trail',
    destination: 'Tokyo & Kyoto, Japan',
    category: 'Heritage',
    duration: '8 Days / 7 Nights',
    price: 135000,
    capacity: 14,
    availableDates: ['2026-11-25', '2026-12-10', '2027-01-08', '2027-03-20'],
    overview:
      'Shinkansen bullet train rides past snow-capped Mount Fuji, traditional Ryokan stay with private Onsen hot springs, private tea ceremony with a Kyoto Geisha master, and culinary adventures in Shibuya and Gion.',
    featured: true,
    rating: 4.97,
    reviewsCount: 68,
    images: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80',
    ],
    inclusions: [
      '7-Day JR Whole Japan Green Car (First Class) Pass',
      '3 Nights 5-Star Hotel Tokyo + 4 Nights Luxury Kyoto Ryokan',
      'Private Geisha Tea Ceremony & Kaiseki Banquet',
      'Hakone Lake Ashi Pirate Ship & Mt. Fuji Cable Car',
    ],
    exclusions: ['International Flights', 'Japan Tourist Visa'],
    itinerary: [
      { day: 1, title: 'Tokyo Arrival & Shinjuku Neon Night', description: 'VIP Haneda airport transfer, evening dining overlooking Shibuya Crossing.', meals: 'Dinner Included', accommodation: 'Aman Tokyo' },
      { day: 2, title: 'Senso-ji Asakusa & Ginza High Fashion', description: 'Ancient temple blessing and master sushi chef omakase lunch.', meals: 'Breakfast & Omakase Lunch', accommodation: 'Aman Tokyo' },
      { day: 3, title: 'Hakone Onsen & Mt. Fuji Views', description: 'Hot spring dip overlooking Mount Fuji, Lake Ashi cruise.', meals: 'Breakfast & Dinner', accommodation: 'Gora Kadan Ryokan Hakone' },
      { day: 4, title: 'Shinkansen Bullet Train to Kyoto', description: '300 km/h train ride into imperial capital of shrines and bamboo groves.', meals: 'Breakfast & Dinner', accommodation: 'Hoshinoya Kyoto' },
      { day: 5, title: 'Fushimi Inari 10,000 Torii Gates & Arashiyama', description: 'Dawn walk through vermillion torii tunnels and tranquil bamboo forest.', meals: 'Breakfast & Dinner', accommodation: 'Hoshinoya Kyoto' },
      { day: 6, title: 'Kinkaku-ji Golden Pavilion & Gion Tea Master', description: 'Gold leaf temple and private Geisha cultural dialogue.', meals: 'Breakfast & Kaiseki Dinner', accommodation: 'Hoshinoya Kyoto' },
      { day: 7, title: 'Nara Deer Park & Osaka Dotonbori Street Food', description: 'Feed sacred bow-trained deer and taste Osaka culinary delights.', meals: 'Breakfast & Street Food Tour', accommodation: 'The Ritz-Carlton Osaka' },
      { day: 8, title: 'Kansai / Narita Airport Departure', description: 'Transfer to international airport.', meals: 'Breakfast Included', accommodation: 'Departure' },
    ],
    reviews: [
      { user: 'Sanjay Gupta', rating: 5, comment: 'Hoshinoya Kyoto and the bullet train experience were pure perfection.', date: new Date('2026-10-05') },
    ],
  },
  {
    title: 'Iceland: Aurora Borealis, Blue Lagoon & Golden Circle',
    destination: 'Reykjavik, Iceland',
    category: 'Adventure',
    duration: '6 Days / 5 Nights',
    price: 125000,
    capacity: 12,
    availableDates: ['2026-11-18', '2026-12-04', '2026-12-28', '2027-01-20'],
    overview:
      'Hunt the dancing emerald Northern Lights across Arctic skies, soak in mineral-rich geothermal waters of the Blue Lagoon, walk behind Gullfoss waterfall, and explore ice caves inside Vatnajökull glacier.',
    featured: false,
    rating: 4.96,
    reviewsCount: 37,
    images: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&auto=format&fit=crop&q=80',
    ],
    inclusions: [
      'Super Jeep 4x4 Northern Lights chases with professional astrophotographer',
      'Blue Lagoon Retreat Spa VIP entry with private changing suite',
      'Crystal Blue Ice Cave caving expedition with crampons',
      '5 Nights in Luxury Glass-Roofed Aurora Domes & Nordic Resorts',
    ],
    exclusions: ['Flights to Keflavik', 'Personal thermal drysuit'],
    itinerary: [
      { day: 1, title: 'Keflavik Arrival & Blue Lagoon Retreat', description: 'Warm geothermal silica waters amidst black lava fields.', meals: 'Dinner Included', accommodation: 'The Retreat at Blue Lagoon' },
      { day: 2, title: 'Golden Circle & Geysir Eruptions', description: 'Thingvellir continental divide, exploding Strokkur geyser, and Gullfoss falls.', meals: 'Breakfast & Dinner', accommodation: 'Ion Adventure Hotel' },
      { day: 3, title: 'South Coast Black Sand Beaches & Skogafoss', description: 'Basalt sea stacks of Reynisfjara and walk behind Seljalandsfoss waterfall.', meals: 'Breakfast & Dinner', accommodation: 'Hotel Ranga' },
      { day: 4, title: 'Vatnajokull Glacier Ice Cave Exploration', description: 'Enter iridescent sapphire ice caves carved inside Europe largest glacier.', meals: 'Breakfast & Dinner', accommodation: 'Fosshotel Glacier Lagoon' },
      { day: 5, title: 'Jokulsarlon Diamond Beach & Aurora Hunt', description: 'Icebergs glistening like diamonds on volcanic black sand. Night aurora hunt.', meals: 'Breakfast & Dinner', accommodation: 'Hotel Ranga' },
      { day: 6, title: 'Reykjavik Culture & Departure', description: 'Harpa concert hall, Hallgrimskirkja, and airport transfer.', meals: 'Breakfast Included', accommodation: 'Departure' },
    ],
    reviews: [
      { user: 'Tanvi Shah', rating: 5, comment: 'Saw the Northern Lights from our glass dome bedroom! A bucket list dream fulfilled.', date: new Date('2026-09-29') },
    ],
  },
  {
    title: 'Egypt: Pyramids of Giza & Nile River Luxury Dahabiya Cruise',
    destination: 'Cairo, Luxor & Aswan, Egypt',
    category: 'Heritage',
    duration: '7 Days / 6 Nights',
    price: 88000,
    capacity: 14,
    availableDates: ['2026-11-22', '2026-12-08', '2026-12-22', '2027-01-14'],
    overview:
      'Stand before the Great Sphinx and Pyramids of Giza with an Egyptologist, sail the Nile on a private hand-crafted twin-sail Dahabiya yacht, and enter the golden tomb of King Tutankhamun in the Valley of the Kings.',
    featured: false,
    rating: 4.92,
    reviewsCount: 41,
    images: [
      'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=1200&auto=format&fit=crop&q=80',
    ],
    inclusions: [
      '3 Nights in Mena House Hotel with direct Pyramid views',
      '3 Nights aboard Private Luxury Boutique Nile Dahabiya Yacht',
      'VIP Access to King Tutankhamun Tomb in Valley of the Kings',
      'Private Egyptologist historian guide throughout',
    ],
    exclusions: ['Egypt Entry Visa', 'Camel ride tipping'],
    itinerary: [
      { day: 1, title: 'Cairo Arrival & Historic Mena House', description: 'Private VIP airport assistance, sunset cocktails facing Great Pyramid of Cheops.', meals: 'Dinner Included', accommodation: 'Marriott Mena House Cairo' },
      { day: 2, title: 'Pyramids of Giza, Sphinx & Grand Museum', description: 'Explore ancient marvels and treasures of King Tut at Grand Egyptian Museum.', meals: 'Breakfast & Dinner', accommodation: 'Marriott Mena House Cairo' },
      { day: 3, title: 'Fly to Luxor & Karnak Temple Column Hall', description: 'Hypostyle hall with 134 towering stone columns. Boarding private Dahabiya.', meals: 'All Meals Included', accommodation: 'Nile Dahabiya Yacht' },
      { day: 4, title: 'Valley of the Kings & Hatshepsut Temple', description: 'Descent into royal pharaoh burial chambers and Colossi of Memnon.', meals: 'All Meals Included', accommodation: 'Nile Dahabiya Yacht' },
      { day: 5, title: 'Edfu Temple of Horus & Kom Ombo Sunset', description: 'Falcon god temple and crocodile god double sanctuary.', meals: 'All Meals Included', accommodation: 'Nile Dahabiya Yacht' },
      { day: 6, title: 'Aswan Philae Temple & Abu Simbel Flight', description: 'Island temple of Isis and colossal temples of Ramses II carved into mountains.', meals: 'Breakfast & Dinner', accommodation: 'Sofitel Legend Old Cataract Aswan' },
      { day: 7, title: 'Flight back to Cairo & Departure', description: 'Connecting flights for homebound journey.', meals: 'Breakfast Included', accommodation: 'Departure' },
    ],
    reviews: [
      { user: 'Vikram Joshi', rating: 5, comment: 'The Dahabiya sailing was so quiet and intimate. Far better than giant cruise ships!', date: new Date('2026-10-09') },
    ],
  },
  {
    title: 'Amalfi Coast: Positano, Capri & Ravello Cliffside Dream',
    destination: 'Amalfi Coast & Capri, Italy',
    category: 'Honeymoon',
    duration: '6 Days / 5 Nights',
    price: 115000,
    capacity: 10,
    availableDates: ['2026-11-24', '2026-12-12', '2027-01-05', '2027-04-10'],
    overview:
      'Clifftop luxury villas overlooking the sparkling Tyrrhenian Sea, private Riva wooden speedboat charter to the Blue Grotto of Capri, Limoncello tastings in Ravello, and Michelin-starred dining in Positano.',
    featured: true,
    rating: 4.96,
    reviewsCount: 33,
    images: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&auto=format&fit=crop&q=80',
    ],
    inclusions: [
      '5 Nights in 5-Star Clifftop Resorts in Positano & Ravello',
      'Full Day Private Riva Speedboat Charter around Capri Island',
      'Exclusive Sunset Wine Tasting in Historic Ravello Gardens',
      'Chauffeur Mercedes S-Class for all coastal highway transfers',
    ],
    exclusions: ['Flights into Naples', 'Blue Grotto rowboat entry fee'],
    itinerary: [
      { day: 1, title: 'Naples Airport to Positano Cliff Vista', description: 'Scenic drive along dramatic coastal cliff hairpin roads. Check-in and welcome Prosecco.', meals: 'Dinner Included', accommodation: 'Le Sirenuse Positano' },
      { day: 2, title: 'Private Riva Speedboat to Capri & Faraglioni', description: 'Sail through natural rock arches of Faraglioni and swim in emerald sea grottos.', meals: 'Breakfast & Seafood Lunch', accommodation: 'Le Sirenuse Positano' },
      { day: 3, title: 'Amalfi Town & St. Andrew Cathedral', description: 'Historic maritime republic, handmade paper workshop, and limoncello tasting.', meals: 'Breakfast & Dinner', accommodation: 'Belmond Hotel Caruso Ravello' },
      { day: 4, title: 'Ravello Infinity Terrace at Villa Cimbrone', description: 'Stroll through cliffside gardens suspended 1,200 ft over the azure sea.', meals: 'Breakfast & Dinner', accommodation: 'Belmond Hotel Caruso Ravello' },
      { day: 5, title: 'Path of the Gods Hike & Cooking Class', description: 'Panoramic cliff trail followed by private Italian pasta & seafood masterclass.', meals: 'Breakfast & Cooking Masterclass', accommodation: 'Belmond Hotel Caruso Ravello' },
      { day: 6, title: 'Farewell Naples Departure', description: 'Chauffeur transfer to Naples airport or train station.', meals: 'Breakfast Included', accommodation: 'Departure' },
    ],
    reviews: [
      { user: 'Simran Khurana', rating: 5, comment: 'Le Sirenuse and the Capri boat tour were pure magic. Absolute honeymoon paradise!', date: new Date('2026-10-16') },
    ],
  },
  {
    title: 'Rann of Kutch: Moonlit White Desert & Bhuj Royal Palace',
    destination: 'Kutch, Gujarat',
    category: 'Heritage',
    duration: '4 Days / 3 Nights',
    price: 19500,
    capacity: 20,
    availableDates: ['2026-11-15', '2026-12-02', '2026-12-16', '2027-01-10'],
    overview:
      'Walk upon the vast salt flats of the Great Rann under the glow of the full moon during Rann Utsav, stay in luxury air-conditioned Bhungas (traditional Kutchi mud huts), and watch master Rogan art craftsmen.',
    featured: false,
    rating: 4.88,
    reviewsCount: 28,
    images: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
    ],
    inclusions: [
      '3 Nights in Luxury AC Tent / Bhunga at Tent City Dhordo',
      'All Traditional Gujarati & Kutchi Buffets',
      'Full Moon Night Desert Safari with camel cart ride',
      'Visits to Nirona Artisan village (Rogan painting & bell making)',
    ],
    exclusions: ['Airfare to Bhuj / Ahmedabad', 'Personal handicraft purchases'],
    itinerary: [
      { day: 1, title: 'Bhuj Arrival & Prag Mahal Heritage Palace', description: 'Gothic palace visit, transfer to White Desert Tent City with folk dance welcome.', meals: 'Dinner Included', accommodation: 'The Tent City Dhordo' },
      { day: 2, title: 'White Desert Full Moon Walk & Kala Dungar', description: 'Highest point in Kutch with panoramic desert views. Sunset and moonrise on salt flats.', meals: 'Breakfast & Dinner', accommodation: 'The Tent City Dhordo' },
      { day: 3, title: 'Artisan Villages: Nirona & Hodka', description: 'See 300-year-old castor oil Rogan art, copper bells, and mirror embroidery.', meals: 'Breakfast & Dinner', accommodation: 'The Tent City Dhordo' },
      { day: 4, title: 'Bhujodi Weaving Village & Departure', description: 'Buy authentic Kutchi shawls and leather crafts before airport transfer.', meals: 'Breakfast Included', accommodation: 'Departure' },
    ],
    reviews: [
      { user: 'Harish Patel', rating: 5, comment: 'The moonlit white desert took my breath away. Very comfortable tents!', date: new Date('2026-10-02') },
    ],
  },
  {
    title: 'Sri Lanka: Sigiriya Rock, Nuwara Eliya Tea & Mirissa Blue Whales',
    destination: 'Sri Lanka',
    category: 'Beach',
    duration: '6 Days / 5 Nights',
    price: 36000,
    capacity: 16,
    availableDates: ['2026-11-19', '2026-12-06', '2026-12-20', '2027-01-12'],
    overview:
      'Climb the UNESCO 5th-century Sigiriya Lion Rock citadel, ride the scenic blue train through misty Ceylon tea highlands in Ella, and take a catamaran cruise to spot Blue Whales off the southern coast of Mirissa.',
    featured: false,
    rating: 4.89,
    reviewsCount: 31,
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80',
    ],
    inclusions: [
      '5 Nights in Luxury Heritage Boutique Resorts',
      'Reserved First Class seats on Iconic Ella Scenic Blue Train',
      'Private Morning Whale Watching Yacht Charter in Mirissa',
      'All Breakfasts & Authentic Sri Lankan Curry Dinners',
    ],
    exclusions: ['Flights into Colombo', 'Sri Lanka Electronic Travel Authorization fee'],
    itinerary: [
      { day: 1, title: 'Colombo to Sigiriya Ancient Kingdom', description: 'Private transfer through tropical palm groves. Evening dambulla cave temple.', meals: 'Dinner Included', accommodation: 'Aliya Resort & Spa' },
      { day: 2, title: 'Sigiriya Lion Rock Fortress Dawn Climb', description: 'Climb 1,200 steps to ancient palace ruins in the sky with frescoes.', meals: 'Breakfast & Dinner', accommodation: 'Aliya Resort & Spa' },
      { day: 3, title: 'Ella Scenic Blue Train & Nine Arches Bridge', description: 'World most picturesque rail journey through misty tea plantations.', meals: 'Breakfast & Dinner', accommodation: '98 Acres Resort & Spa Ella' },
      { day: 4, title: 'Little Adam Peak & Drive to Southern Coast', description: 'Panoramic sunrise trek, scenic descent to golden beaches of Mirissa.', meals: 'Breakfast & Dinner', accommodation: 'Weligama Bay Marriott Resort' },
      { day: 5, title: 'Blue Whale Watching & Galle Dutch Fort', description: 'Morning boat safari for Earth largest mammal. Afternoon walk in historic Galle Fort.', meals: 'Breakfast & Seafood Dinner', accommodation: 'Weligama Bay Marriott Resort' },
      { day: 6, title: 'Departure from Colombo Airport', description: 'Transfer to Bandaranaike International Airport.', meals: 'Breakfast Included', accommodation: 'Departure' },
    ],
    reviews: [
      { user: 'Dilip Sen', rating: 5, comment: 'Saw 3 blue whales breaching right next to our yacht! Unbelievable journey.', date: new Date('2026-09-15') },
    ],
  },
  {
    title: 'Kenya & Serengeti: Masai Mara Great Migration & Luxury Safari',
    destination: 'Masai Mara & Nairobi, Kenya',
    category: 'Adventure',
    duration: '6 Days / 5 Nights',
    price: 165000,
    capacity: 10,
    availableDates: ['2026-11-26', '2026-12-15', '2027-01-18', '2027-02-10'],
    overview:
      'Witness the dramatic river crossings of the Great Wildebeest Migration, take a dawn hot air balloon safari over the African savannah with champagne breakfast, and spot the Big Five with expert Masai trackers.',
    featured: true,
    rating: 4.99,
    reviewsCount: 46,
    images: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&auto=format&fit=crop&q=80',
    ],
    inclusions: [
      'Bush flights between Wilson Airport and Masai Mara airstrip',
      'Dawn Hot Air Balloon Safari with bush champagne breakfast',
      'All National Park & Reserve conservation fees included',
      '5 Nights in Luxury Canvas Glamping Tented Camp with butler service',
      'Open-sided 4x4 Land Cruisers with guaranteed window seats',
    ],
    exclusions: ['Kenya eTA visa ($34)', 'Yellow fever vaccination'],
    itinerary: [
      { day: 1, title: 'Nairobi to Masai Mara via Bush Flight', description: 'Fly over Great Rift Valley. Welcome Masai dance and evening game drive.', meals: 'Lunch & Dinner Included', accommodation: 'Governors Camp Masai Mara' },
      { day: 2, title: 'Dawn Hot Air Balloon & Mara River Crossings', description: 'Float over herds of elephants and zebras. Watch big cats on hunt.', meals: 'All Meals Included', accommodation: 'Governors Camp Masai Mara' },
      { day: 3, title: 'Big Five Safari: Lions, Leopards & Rhinos', description: 'Full day in savannah with bush picnic under an acacia tree.', meals: 'All Meals Included', accommodation: 'Governors Camp Masai Mara' },
      { day: 4, title: 'Masai Cultural Manyatta Village Experience', description: 'Learn traditional fire making, beadwork, and wildlife tracking wisdom.', meals: 'All Meals Included', accommodation: 'Governors Camp Masai Mara' },
      { day: 5, title: 'Sunset Game Drive & Bushfire Dinner', description: 'Final twilight game drive spotting nocturnal animals, 4-course starlit dinner.', meals: 'All Meals Included', accommodation: 'Governors Camp Masai Mara' },
      { day: 6, title: 'Bush Flight to Nairobi & Departure', description: 'Visit Giraffe Centre in Nairobi before international flight home.', meals: 'Breakfast & Lunch Included', accommodation: 'Departure' },
    ],
    reviews: [
      { user: 'Aditi Roy', rating: 5, comment: 'Watching lions hunt and the balloon safari over Mara was life-changing!', date: new Date('2026-10-11') },
    ],
  },
  {
    title: "Paris & French Riviera: City of Lights, Versailles & Côte d'Azur Yachting",
    destination: "Paris & Nice, France",
    category: "Luxury",
    duration: "7 Days / 6 Nights",
    price: 155000,
    capacity: 12,
    availableDates: ["2026-11-20", "2026-12-05", "2026-12-25", "2027-01-15"],
    overview: "Experience the pinnacle of European elegance. Stroll the Champs-Élysées, take an exclusive after-hours tour of the Louvre and Palace of Versailles, followed by high-speed TGV to the French Riviera for private catamaran sailing along Monaco, Cannes, and Nice.",
    featured: true,
    rating: 4.96,
    reviewsCount: 34,
    images: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&auto=format&fit=crop&q=80"
    ],
    inclusions: [
      "6 Nights in 5-Star Heritage French Palaces (Paris & Hotel Negresco Nice)",
      "Daily French gourmet breakfasts & 3-Star Michelin tasting dinner",
      "VIP skip-the-line Louvre and Versailles private curator tours",
      "Private yacht day-charter along Côte d'Azur (Cannes to Monaco)",
      "First-Class TGV rail transfer between Paris and Nice"
    ],
    exclusions: ["Schengen visa fees", "International flights to Paris"],
    itinerary: [
      { day: 1, title: "Bienvenue à Paris & Seine River Sunset Cruise", description: "Private airport chauffeur transfer to hotel. Evening vintage wooden boat cruise on Seine with champagne.", meals: "Dinner Included", accommodation: "Le Meurice Paris" },
      { day: 2, title: "Louvre Museum Curator Tour & Montmartre", description: "Private guide through Mona Lisa and Venus de Milo. Afternoon macaron tasting in Montmartre artist alleys.", meals: "Breakfast & Lunch", accommodation: "Le Meurice Paris" },
      { day: 3, title: "Royal Palace of Versailles & Hall of Mirrors", description: "Explore golden King Louis XIV chambers and fountain musical gardens in royal private golf carts.", meals: "Breakfast & Dinner", accommodation: "Le Meurice Paris" },
      { day: 4, title: "High-Speed TGV to French Riviera & Nice Promenade", description: "Scenic TGV train journey south to Nice. Sunset walk along Promenade des Anglais with gelato.", meals: "Breakfast & Dinner", accommodation: "Hotel Negresco Nice" },
      { day: 5, title: "Private Yacht Charter: Cannes, Antibes & Monaco", description: "Full-day sailing aboard 50ft private yacht with snorkeling in turquoise coves and Monaco casino tour.", meals: "All Meals Included", accommodation: "Hotel Negresco Nice" },
      { day: 6, title: "Eze Medieval Cliff Village & Fragrance Workshop", description: "Clifftop botanical garden vistas over the Mediterranean and bespoke perfume creation at Fragonard.", meals: "Breakfast & Michelin Dinner", accommodation: "Hotel Negresco Nice" },
      { day: 7, title: "Nice Flower Market & Chauffeur Departure", description: "Morning shopping at Cours Saleya flower market and private transfer to Nice Côte d'Azur airport.", meals: "Breakfast Included", accommodation: "Departure" }
    ],
    reviews: [
      { user: "Dr. Ananya Sen", rating: 5, comment: "The private yacht cruise from Cannes to Monaco was breathtaking! Outstanding concierge service.", date: new Date("2026-09-28") }
    ]
  },
  {
    title: "Santorini & Athens: Aegean Caldera Sunsets, Acropolis & Luxury Catamaran",
    destination: "Santorini & Athens, Greece",
    category: "Honeymoon",
    duration: "6 Days / 5 Nights",
    price: 138000,
    capacity: 12,
    availableDates: ["2026-11-18", "2026-12-08", "2027-01-20", "2027-02-14"],
    overview: "A romantic Greek dream. Marvel at whitewashed cliffside suites overlooking the Aegean caldera, indulge in a private catamaran sunset sail with Greek barbecue, taste volcanic Assyrtiko wines, and explore the ancient Parthenon in Athens.",
    featured: true,
    rating: 4.98,
    reviewsCount: 42,
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80"
    ],
    inclusions: [
      "3 Nights in Oia Cliffside Cave Suite with private plunge pool",
      "2 Nights in Luxury Acropolis-view Boutique Hotel Athens",
      "Private Sunset Lagoon 450 Catamaran Cruise with Greek BBQ & Wine",
      "Domestic Athens - Santorini flight transfers included",
      "Private archaeological tour of the Parthenon & Acropolis Museum"
    ],
    exclusions: ["Greece Stayover municipal tax (€10/night)", "International air tickets"],
    itinerary: [
      { day: 1, title: "Arrival in Athens & Plaka Historic Quarter", description: "Chauffeur transfer from Athens airport. Evening rooftop mezze dinner gazing upon illuminated Acropolis.", meals: "Dinner Included", accommodation: "Electra Metropolis Athens" },
      { day: 2, title: "Acropolis & Flight to Santorini Island", description: "Morning private historian tour of the Parthenon. Afternoon scenic 40-min flight to volcanic Santorini.", meals: "Breakfast & Dinner", accommodation: "Canaves Oia Suites" },
      { day: 3, title: "Caldera Private Catamaran Cruise & Hot Springs", description: "Sail past Red Beach and White Beach, swim in volcanic thermal hot springs, feast on fresh grilled sea bass.", meals: "Breakfast & Greek BBQ Lunch", accommodation: "Canaves Oia Suites" },
      { day: 4, title: "Pyrgos Medieval Castle & Winery Cellar Tasting", description: "Panoramic highest island viewpoint at Pyrgos, followed by 6-course wine pairing at Santo Wines.", meals: "Breakfast & Wine Lunch", accommodation: "Canaves Oia Suites" },
      { day: 5, title: "Oia Sunset Stroll & Cliffside Candlelight Dinner", description: "Leisure morning in private plunge pool. Sunset photography tour through blue-domed churches.", meals: "Breakfast & Candlelight Dinner", accommodation: "Canaves Oia Suites" },
      { day: 6, title: "Flight to Athens & International Departure", description: "Morning Greek breakfast, flight transfer to Athens International Airport.", meals: "Breakfast Included", accommodation: "Departure" }
    ],
    reviews: [
      { user: "Karan & Pooja", rating: 5, comment: "Our honeymoon was pure magic. The cave suite in Oia and the catamaran cruise were straight out of a dream!", date: new Date("2026-10-18") }
    ]
  },
  {
    title: "Maldives: Overwater Pool Villa, Seaplane & Bioluminescent Lagoon",
    destination: "Male & Baa Atoll, Maldives",
    category: "Honeymoon",
    duration: "5 Days / 4 Nights",
    price: 112000,
    capacity: 10,
    availableDates: ["2026-11-12", "2026-11-30", "2026-12-18", "2027-01-10"],
    overview: "Pure unadulterated tropical indulgence. Sleep over crystal lagoon waters in an ultra-luxurious private pool villa. Glide over coral atolls via scenic seaplane, snorkel with manta rays in UNESCO Baa Atoll biosphere, and dine on a private sandbank.",
    featured: true,
    rating: 4.97,
    reviewsCount: 39,
    images: [
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&auto=format&fit=crop&q=80"
    ],
    inclusions: [
      "4 Nights in Sunset Overwater Villa with Private Infinity Plunge Pool",
      "Roundtrip Scenic Trans Maldivian Seaplane transfers from Male",
      "All-Inclusive Gourmet Dining (Breakfast, Lunch, 5-Course Dinner & Drinks)",
      "Private Sandbank Starlit Dinner with Personal Chef",
      "Guided House Reef Snorkeling with Manta Rays & Sea Turtles"
    ],
    exclusions: ["PADI Scuba Certification courses", "Deep Sea Big Game Fishing"],
    itinerary: [
      { day: 1, title: "Scenic Seaplane Arrival & Overwater Welcome", description: "Breathtaking 35-minute seaplane flight across coral rings. Traditional Boduberu drum greeting.", meals: "Dinner & Drinks", accommodation: "Vakkaru Maldives Luxury Resort" },
      { day: 2, title: "Manta Ray Snorkeling & Floating Breakfast", description: "Enjoy champagne floating breakfast delivered directly into your villa pool. Afternoon manta ray safari.", meals: "All Inclusive Gourmet", accommodation: "Vakkaru Maldives Luxury Resort" },
      { day: 3, title: "Overwater Spa Treatment & Sunset Dolphin Cruise", description: "Balinese couple massage in glass-floor treatment pavilion. Evening traditional dhoni boat dolphin cruise.", meals: "All Inclusive Gourmet", accommodation: "Vakkaru Maldives Luxury Resort" },
      { day: 4, title: "Castaway Island Sandbank Picnic & Starlit Cinema", description: "Private speedboat to deserted white sand islet. Night outdoor cinema under the southern stars.", meals: "All Inclusive Gourmet", accommodation: "Vakkaru Maldives Luxury Resort" },
      { day: 5, title: "Seaplane to Male International Airport", description: "Final sunrise swim in the lagoon, seaplane transfer to Male for connecting flight.", meals: "Breakfast Included", accommodation: "Departure" }
    ],
    reviews: [
      { user: "Rohan Kapoor", rating: 5, comment: "Floating breakfast in our villa and seeing dozens of wild dolphins at sunset was sublime!", date: new Date("2026-10-09") }
    ]
  },
  {
    title: "Spiti Valley: The Middle Land - Kaza, Key Monastery, Chandratal & Pin Valley",
    destination: "Spiti Valley, Himachal Pradesh",
    category: "Adventure",
    duration: "7 Days / 6 Nights",
    price: 24500,
    capacity: 14,
    availableDates: ["2026-11-14", "2026-11-28", "2026-12-15", "2027-01-08"],
    overview: "Conquer the rugged trans-Himalayan high-altitude desert in custom 4x4 expedition vehicles. Witness thousand-year-old Buddhist murals at Key Monastery, camp beneath millions of stars at Chandratal Moon Lake, and post a letter from Hikkim, the highest post office on Earth.",
    featured: true,
    rating: 4.93,
    reviewsCount: 29,
    images: [
      "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&auto=format&fit=crop&q=80"
    ],
    inclusions: [
      "Custom 4x4 Expedition Suv with seasoned high-altitude mountain drivers",
      "6 Nights in Boutique Himalayan Homestays & Swiss Glamping Tents at Chandratal",
      "All meals with organic local Himachali and Tibetan specialties",
      "Special Inner Line Permits & Green fees for Spiti & Pin Valley",
      "Portable medical oxygen cylinders and certified mountain expedition leader"
    ],
    exclusions: ["Personal warm gear rentals", "Tips to drivers and monastery monks"],
    itinerary: [
      { day: 1, title: "Manali to Kaza via Atal Tunnel & Kunzum Pass", description: "Drive through Atal Tunnel, cross snowy Kunzum Pass at 14,931 ft. Arrive at Kaza for acclimatization.", meals: "Lunch & Dinner", accommodation: "The Grand Dew Kaza" },
      { day: 2, title: "Key Monastery & Kibber High Village Safari", description: "Visit 11th century cliff Key Gompa, tea with lamas, and search for Himalayan blue sheep in Kibber.", meals: "All Meals Included", accommodation: "The Grand Dew Kaza" },
      { day: 3, title: "Hikkim Highest Post Office, Komic & Langza Fossils", description: "Post letters from 14,567 ft at Hikkim, see golden Buddha in Langza, hunt for million-year marine fossils.", meals: "All Meals Included", accommodation: "The Grand Dew Kaza" },
      { day: 4, title: "Pin Valley National Park & Kungri Gompa", description: "Cross into vibrant red scree mountains of Pin Valley. Traditional butter tea in Mudh village.", meals: "All Meals Included", accommodation: "Tara House Mudh" },
      { day: 5, title: "Camp Chandratal - The Sacred Moon Lake", description: "Drive to high-altitude Chandratal Lake at 14,100 ft. Golden sunset reflections and Milky Way stargazing.", meals: "All Meals Included", accommodation: "Luxury Swiss Tents Chandratal" },
      { day: 6, title: "Chandratal to Manali via Rohtang Panorama", description: "Scenic descent across Batal boulders and Gramphu back into lush green Kullu Valley.", meals: "All Meals Included", accommodation: "Span Resort Manali" },
      { day: 7, title: "Old Manali Cafes & Evening Departure", description: "Leisure morning in pine forests, checkout and Volvo or flight departure from Kullu.", meals: "Breakfast Included", accommodation: "Departure" }
    ],
    reviews: [
      { user: "Siddharth Joshi", rating: 5, comment: "Chandratal Lake camping under the Milky Way is the most surreal night of my life. 10/10 expedition!", date: new Date("2026-10-14") }
    ]
  },
  {
    title: "Japan Imperial Trail: Tokyo Shinjuku, Kyoto Gion Geisha & Mt. Fuji Onsen",
    destination: "Tokyo & Kyoto, Japan",
    category: "Heritage",
    duration: "8 Days / 7 Nights",
    price: 148000,
    capacity: 14,
    availableDates: ["2026-11-25", "2026-12-12", "2027-01-22", "2027-03-25"],
    overview: "Immerse in the timeless wonder of the Land of the Rising Sun. Ride the Shinkansen bullet train at 320 km/h, soak in healing outdoor onsen hot springs with direct views of snowcapped Mount Fuji, walk through thousands of scarlet Torii gates in Kyoto, and taste A5 Wagyu beef.",
    featured: true,
    rating: 4.99,
    reviewsCount: 51,
    images: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80"
    ],
    inclusions: [
      "7-Day Unlimited Japan Rail (JR) Green Car Pass for Shinkansen Bullet Trains",
      "7 Nights in Luxury 5-Star Tokyo Highrise & Authentic Historic Kyoto Ryokan",
      "Traditional Kaiseki multi-course dinners & Private A5 Kobe Wagyu dining",
      "Private Kyoto Geisha tea ceremony & Arashiyama Bamboo Grove dawn walk",
      "Hakone Ropeway cable car and Lake Ashi pirate boat cruise facing Mt. Fuji"
    ],
    exclusions: ["Japan tourist visa processing", "Personal anime/souvenir shopping"],
    itinerary: [
      { day: 1, title: "Tokyo Arrival & Shinjuku Neon Skyline", description: "Private airport limousine to hotel. Evening observation deck views and Shibuya crossing walk.", meals: "Dinner Included", accommodation: "Keio Plaza Premier Tokyo" },
      { day: 2, title: "Asakusa Sensoji Temple & TeamLab Digital Art", description: "Ancient incense purification at Sensoji, followed by futuristic digital art light experience in Odaiba.", meals: "Breakfast & Lunch", accommodation: "Keio Plaza Premier Tokyo" },
      { day: 3, title: "Hakone Mount Fuji Onsen & Lake Ashi Cruise", description: "Day trip to Hakone. Soak in outdoor thermal springs with Mount Fuji backdrop and ride volcanic cable car.", meals: "Breakfast & Kaiseki Dinner", accommodation: "Hakone Kowakien Ten-yu" },
      { day: 4, title: "Shinkansen Bullet Train to Ancient Kyoto", description: "Speed through the countryside at 320 km/h. Check in to traditional tatami ryokan in historic Gion.", meals: "Breakfast & Dinner", accommodation: "Kyoto Ryokan Gion" },
      { day: 5, title: "Fushimi Inari 10,000 Torii & Golden Pavilion", description: "Hike scarlet shrine paths at Fushimi Inari, marvel at shimmering Kinkaku-ji reflection in temple lake.", meals: "Breakfast & Lunch", accommodation: "Kyoto Ryokan Gion" },
      { day: 6, title: "Arashiyama Bamboo Forest & Nara Sacred Deer", description: "Morning walk through towering green bamboo, afternoon bowing deer encounters at Nara Park.", meals: "Breakfast & Dinner", accommodation: "Kyoto Ryokan Gion" },
      { day: 7, title: "Osaka Dotonbori Street Food & Castles", description: "Short bullet train hop to Osaka. Savor takoyaki and gyoza in vibrant Dotonbori neon riverwalk.", meals: "Breakfast & Street Food Tour", accommodation: "Kyoto Ryokan Gion" },
      { day: 8, title: "Bullet Train Return to Tokyo & Departure", description: "Express train back to Narita/Haneda International Airport for departure.", meals: "Breakfast Included", accommodation: "Departure" }
    ],
    reviews: [
      { user: "Vikram Singhania", rating: 5, comment: "The Ryokan stay and the Shinkansen ride past Mt. Fuji were absolutely flawless. Best tour ever!", date: new Date("2026-10-02") }
    ]
  },
  {
    title: "Canadian Rockies: Emerald Lake Louise, Banff Hot Springs & Heli-Glacier Tour",
    destination: "Banff & Lake Louise, Canada",
    category: "Mountain",
    duration: "7 Days / 6 Nights",
    price: 175000,
    capacity: 12,
    availableDates: ["2026-11-15", "2026-12-05", "2027-01-18", "2027-02-10"],
    overview: "Spectacular alpine wilderness. Gaze upon the impossibly turquoise waters of Lake Louise and Moraine Lake, soar over Columbia Icefield glaciers on a private helicopter flight, and relax in Fairmont Banff Springs castle luxury.",
    featured: true,
    rating: 4.95,
    reviewsCount: 28,
    images: [
      "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80"
    ],
    inclusions: [
      "6 Nights in Iconic Fairmont Banff Springs & Fairmont Chateau Lake Louise",
      "Private 30-Minute Helicopter Flight over Mount Assiniboine & Glaciers",
      "Icefields Parkway Glacier Skywalk & Ice Explorer giant snow truck drive",
      "Banff Upper Hot Springs thermal soak pass with mountain views",
      "All National Park passes, luxury heated coach transfers, and park naturalists"
    ],
    exclusions: ["Canada eTA / Visa fees", "Winter ski equipment rental"],
    itinerary: [
      { day: 1, title: "Calgary Arrival & Scenic Transfer to Banff", description: "Arrive at Calgary International, chauffeur drive through scenic foothills into the Rocky Mountains.", meals: "Dinner Included", accommodation: "Fairmont Banff Springs" },
      { day: 2, title: "Banff Gondola & Sulphur Mountain Hot Springs", description: "Ascend 360-degree mountain viewpoint via Banff Gondola, afternoon soak in mineral hot springs.", meals: "Breakfast & Lunch", accommodation: "Fairmont Banff Springs" },
      { day: 3, title: "Emerald Waters of Lake Louise & Moraine Lake", description: "Marvel at vibrant glacial lakes, canoe on pristine waters, and walk shoreline alpine trails.", meals: "Breakfast & Dinner", accommodation: "Fairmont Chateau Lake Louise" },
      { day: 4, title: "Columbia Icefield & Glacier Heli-Flight", description: "Board gigantic all-terrain Ice Explorer truck on Athabasca Glacier, soaring heli-flight over peaks.", meals: "Breakfast & Picnic Lunch", accommodation: "Fairmont Chateau Lake Louise" },
      { day: 5, title: "Yoho National Park & Takakkaw Waterfalls", description: "Cross Continental Divide into British Columbia. See natural rock bridges and thunderous falls.", meals: "Breakfast & Dinner", accommodation: "Fairmont Banff Springs" },
      { day: 6, title: "Wildlife Safari & Western Sleigh Ride", description: "Spot elk, moose, bighorn sheep, and grizzly bears, followed by traditional horse-drawn sleigh ride.", meals: "Breakfast & Steak Dinner", accommodation: "Fairmont Banff Springs" },
      { day: 7, title: "Calgary Chauffeur Drop-off & Departure", description: "Final mountain breakfast, private airport transfer to Calgary.", meals: "Breakfast Included", accommodation: "Departure" }
    ],
    reviews: [
      { user: "Rajesh Kulkarni", rating: 5, comment: "Staying at Fairmont Lake Louise with direct glacier views from the room was worth every single rupee!", date: new Date("2026-09-22") }
    ]
  },
  {
    title: "Bhutan: Tiger’s Nest Monastery, Paro Valley & Punakha Dzong Fortress",
    destination: "Paro & Thimphu, Bhutan",
    category: "Spiritual",
    duration: "6 Days / 5 Nights",
    price: 48000,
    capacity: 16,
    availableDates: ["2026-11-10", "2026-11-26", "2026-12-14", "2027-01-12"],
    overview: "Step into the mythical Thunder Dragon Kingdom, the world's only carbon-negative nation. Hike through fragrant pine forests to the cliffside Tiger's Nest Monastery, admire majestic riverside dzongs, and immerse in Bhutanese Gross National Happiness.",
    featured: true,
    rating: 4.97,
    reviewsCount: 33,
    images: [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80"
    ],
    inclusions: [
      "Bhutan Government Sustainable Development Fee (SDF) and Visa processing",
      "5 Nights in Luxury Heritage Bhutanese Resorts (Le Méridien Thimphu & Zhiwa Ling Paro)",
      "All meals featuring organic farm-to-table Bhutanese dishes & Ema Datshi",
      "Licensed English-speaking Bhutanese cultural guide and private chauffeur SUV",
      "Traditional hot stone bath experience with medicinal artemisia herbs"
    ],
    exclusions: ["Flight tickets to Paro Airport", "Personal temple donation offerings"],
    itinerary: [
      { day: 1, title: "Paro Mountain Flight Arrival & Drive to Thimphu", description: "Spectacular flight along Himalayan peaks. Scenic riverside drive to capital Thimphu, visit Tashichho Dzong.", meals: "Lunch & Dinner", accommodation: "Le Méridien Thimphu" },
      { day: 2, title: "Buddha Dordenma & National Textile Museum", description: "Gaze at 169ft giant golden bronze Buddha overlooking valley, see royal weavers, practice national archery.", meals: "All Meals Included", accommodation: "Le Méridien Thimphu" },
      { day: 3, title: "Dochula 108 Chortens & Punakha Valley", description: "Cross 10,200ft Dochula pass with 108 memorial stupas, visit majestic Punakha Dzong at river confluence.", meals: "All Meals Included", accommodation: "Dhensa Boutique Punakha" },
      { day: 4, title: "Chimi Lhakhang & Return to Paro Valley", description: "Walk through terraced rice fields to temple of fertility, drive back to Paro for evening folk dancing.", meals: "All Meals Included", accommodation: "Zhiwa Ling Heritage Paro" },
      { day: 5, title: "Pilgrimage Trek to Paro Taktsang (Tiger's Nest)", description: "Memorable morning hike to monastery clinging to 3,000ft granite cliff. Evening traditional herbal stone bath.", meals: "All Meals Included", accommodation: "Zhiwa Ling Heritage Paro" },
      { day: 6, title: "Paro Airport Departure & Farewell", description: "Traditional white khata scarf blessing by guide, drop-off at Paro Airport.", meals: "Breakfast Included", accommodation: "Departure" }
    ],
    reviews: [
      { user: "Priya Nair", rating: 5, comment: "Reaching Tiger's Nest was deeply spiritual. The peace and natural beauty of Bhutan cannot be put into words.", date: new Date("2026-10-16") }
    ]
  },
  {
    title: "Coorg & Kabini: Emerald Coffee Estates, Nagarhole Boat Safari & Waterfalls",
    destination: "Coorg & Kabini, Karnataka",
    category: "Honeymoon",
    duration: "4 Days / 3 Nights",
    price: 18500,
    capacity: 18,
    availableDates: ["2026-11-12", "2026-11-24", "2026-12-12", "2026-12-28"],
    overview: "The Scotland of India. Stay in colonial heritage plantation bungalows surrounded by misty coffee and black pepper vines. Experience thrilling wildlife boat safaris spotting wild elephants and tigers in Nagarhole, followed by Kodava fireside feasts.",
    featured: true,
    rating: 4.89,
    reviewsCount: 31,
    images: [
      "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80"
    ],
    inclusions: [
      "3 Nights in Luxury Plantation Resort with Private Jacuzzi (Evolve Back / Tamara)",
      "Kabini River Wildlife Boat Safari with government naturalists",
      "Guided Plantation Tour with coffee cupping and tasting masterclass",
      "Private AC Innova Crysta for all Bangalore / Mysore airport transfers",
      "All meals including authentic Kodava Pandi Curry and Bamboo Shoot delicacies"
    ],
    exclusions: ["Airfare to Bangalore/Mysore", "Alcoholic drinks outside package"],
    itinerary: [
      { day: 1, title: "Bangalore Chauffeur Pickup & Coorg Plantation Welcome", description: "Scenic 5-hour drive past Mysore into Coorg mist hills. Warm cardamom spice welcome drink.", meals: "Dinner Included", accommodation: "The Tamara Coorg" },
      { day: 2, title: "Abbey Falls, Raja's Seat & Coffee Roasting", description: "Walk through coffee blossoms to roaring Abbey Falls, sunset valley vista at Raja's Seat.", meals: "Breakfast & Dinner", accommodation: "The Tamara Coorg" },
      { day: 3, title: "Transfer to Kabini & Nagarhole River Safari", description: "Drive to Kabini water reservoir. Afternoon boat safari spotting herds of wild Asiatic elephants.", meals: "All Meals Included", accommodation: "Evolve Back Kabini" },
      { day: 4, title: "Dawn Birding Trail & Bangalore Departure", description: "Early morning coracle boat ride on Kabini, check out and drive back to Bangalore airport.", meals: "Breakfast & Lunch", accommodation: "Departure" }
    ],
    reviews: [
      { user: "Sunil & Deepa", rating: 5, comment: "The mist, coffee aroma, and spotting a tiger across Kabini River made our trip magical!", date: new Date("2026-09-30") }
    ]
  },
  {
    title: "New Zealand: Queenstown Alpine Sky, Milford Sound Cruise & Rotorua Geysers",
    destination: "Queenstown & Rotorua, New Zealand",
    category: "Adventure",
    duration: "8 Days / 7 Nights",
    price: 185000,
    capacity: 12,
    availableDates: ["2026-11-22", "2026-12-10", "2027-01-14", "2027-02-20"],
    overview: "The world's ultimate adventure wonderland. Cruise beneath soaring 1,000-meter sheer cliffs and thundering waterfalls in magical Milford Sound, ride the Skyline Gondola high above Lake Wakatipu, and experience geothermal hot geysers and Maori culture.",
    featured: true,
    rating: 4.98,
    reviewsCount: 44,
    images: [
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80"
    ],
    inclusions: [
      "7 Nights in 5-Star Lakefront Lodges (Eichardt's Queenstown & Rotorua Lake Resort)",
      "Milford Sound Premium Boutique Glass-Roof Catamaran Nature Cruise with Buffet",
      "Queenstown Skyline Gondola & 3 Luge Rides overlooking Southern Alps",
      "Te Puia Geothermal Valley entry & Maori Haka feast cultural experience",
      "Domestic flight between Auckland and Queenstown included"
    ],
    exclusions: ["New Zealand NZeTA & IVL Levy ($100)", "Commercial bungee jump fees"],
    itinerary: [
      { day: 1, title: "Queenstown Arrival & Lake Wakatipu Sunset", description: "Private airport transfer to luxury lakefront lodge. Evening cruise on historic TSS Earnslaw steamship.", meals: "Dinner Included", accommodation: "Eichardt's Private Hotel" },
      { day: 2, title: "Milford Sound Fjord Helicopter & Catamaran Cruise", description: "Fly over snowcapped Southern Alps to Milford Sound. Cruise right under Stirling Falls with dolphins.", meals: "Breakfast & Fjord Buffet Lunch", accommodation: "Eichardt's Private Hotel" },
      { day: 3, title: "Skyline Gondola, Luge & Gibbston Valley Winery", description: "Panoramic views from Bob's Peak, exhilarating luge rides, and Pinot Noir wine tasting.", meals: "Breakfast & Wine Lunch", accommodation: "Eichardt's Private Hotel" },
      { day: 4, title: "Arrowtown Gold Rush Village & Wanaka Tree", description: "Step back into 1860s historic miner village, photo stop at famous lonely tree of Lake Wanaka.", meals: "Breakfast & Dinner", accommodation: "Eichardt's Private Hotel" },
      { day: 5, title: "Flight to Rotorua & Te Puia Geothermal Geysers", description: "Fly to North Island. Witness erupting Pohutu geyser, bubbling mud pools, and nocturnal kiwi birds.", meals: "Breakfast & Hangi Feast", accommodation: "Pullman Rotorua" },
      { day: 6, title: "Waitomo Glowworm Caves Boat Drift", description: "Glide silently underground in darkness illuminated by thousands of living bioluminescent glowworms.", meals: "Breakfast & Lunch", accommodation: "Pullman Rotorua" },
      { day: 7, title: "Hobbiton Movie Set Private Guided Tour", description: "Wander through the Shire, Bag End, and enjoy a cold cider at the Green Dragon Inn.", meals: "Breakfast & Dragon Feast", accommodation: "Pullman Rotorua" },
      { day: 8, title: "Auckland City & International Departure", description: "Scenic drive to Auckland International Airport for flight home.", meals: "Breakfast Included", accommodation: "Departure" }
    ],
    reviews: [
      { user: "Sameer Patel", rating: 5, comment: "Milford Sound cruise and Hobbiton were surreal! Outstanding itinerary executed with Swiss precision.", date: new Date("2026-10-19") }
    ]
  },
  {
    title: "Sikkim Wonderland: Gangtok, Pelling Kanchenjunga & Gurudongmar Sacred Lake",
    destination: "Gangtok & North Sikkim, India",
    category: "Mountain",
    duration: "6 Days / 5 Nights",
    price: 28500,
    capacity: 15,
    availableDates: ["2026-11-16", "2026-11-30", "2026-12-20", "2027-01-18"],
    overview: "Marvel at the mighty third-highest peak on Earth, Mount Kanchenjunga. Journey through rhododendron valleys to sacred Gurudongmar Lake at 17,800 feet, walk the Pelling Skywalk, and spin prayer wheels at Rumtek Monastery.",
    featured: true,
    rating: 4.91,
    reviewsCount: 26,
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=1200&auto=format&fit=crop&q=80"
    ],
    inclusions: [
      "5 Nights in Premium Himalayan View Resorts (Mayfair Gangtok & Elgin Mount Pandim Pelling)",
      "Special North Sikkim & Gurudongmar Protected Area Permits included",
      "Dedicated 4x4 Mountain Scorpio/Innova with experienced local mountain driver",
      "All meals including organic Sikkimese Thukpa, Momos, and Gundruk delicacies",
      "Pelling Glass Skywalk entry and Rumtek Monastery guided history walk"
    ],
    exclusions: ["Airfare to Bagdogra Airport", "Personal thermal jackets"],
    itinerary: [
      { day: 1, title: "Bagdogra Airport to Gangtok via Teesta River", description: "Scenic drive along turquoise Teesta River into Gangtok. Evening MG Marg walk.", meals: "Dinner Included", accommodation: "Mayfair Spa Resort Gangtok" },
      { day: 2, title: "Tsomgo Sacred Lake & Baba Mandir Border", description: "Drive to high-altitude glacial Tsomgo Lake at 12,400 ft, yak rides and snow views.", meals: "Breakfast & Lunch", accommodation: "Mayfair Spa Resort Gangtok" },
      { day: 3, title: "Drive to Lachen via Seven Sisters Waterfall", description: "Travel deep into North Sikkim alpine wilderness. Waterfalls cascading through pine forests.", meals: "All Meals Included", accommodation: "Apple Orchard Resort Lachen" },
      { day: 4, title: "Gurudongmar Sacred Lake (17,800 ft) & Lachung", description: "Early morning drive to crystal blue Gurudongmar Lake surrounded by snow walls. Transfer to Lachung.", meals: "All Meals Included", accommodation: "Yarlam Resort Lachung" },
      { day: 5, title: "Yumthang Valley of Flowers & Drive to Pelling", description: "Stroll through hot springs and alpine meadows. Evening drive to historic Pelling.", meals: "All Meals Included", accommodation: "The Elgin Mount Pandim" },
      { day: 6, title: "Pelling Kanchenjunga Sunrise & Bagdogra Departure", description: "Unrivaled dawn view of golden Kanchenjunga peaks from room balcony. Transfer to Bagdogra.", meals: "Breakfast Included", accommodation: "Departure" }
    ],
    reviews: [
      { user: "Tanya Sen", rating: 5, comment: "Gurudongmar Lake at 17,800 ft took our breath away. Incredible driver and hotels throughout!", date: new Date("2026-10-12") }
    ]
  },
  {
    title: "Seychelles: Mahé Luxury Villas, Praslin Coco de Mer & La Digue Beaches",
    destination: "Mahé & Praslin, Seychelles",
    category: "Beach",
    duration: "6 Days / 5 Nights",
    price: 128000,
    capacity: 12,
    availableDates: ["2026-11-19", "2026-12-08", "2027-01-16", "2027-02-22"],
    overview: "Eden in the Indian Ocean. Bicycle past giant granite boulders on Anse Source d'Argent (the most photographed beach on Earth), walk beneath towering double-coconut Coco de Mer palms in UNESCO Vallée de Mai, and feed hundred-year-old giant Aldabra tortoises.",
    featured: true,
    rating: 4.97,
    reviewsCount: 35,
    images: [
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80"
    ],
    inclusions: [
      "5 Nights in 5-Star Oceanfront Villa Resorts (Constance Ephelia Mahé & Raffles Praslin)",
      "Cat Cocos High-Speed Inter-Island Ferry tickets between Mahé, Praslin & La Digue",
      "Full-day guided electric golf buggy / bicycle tour of La Digue Island",
      "Entry & naturalist guide to UNESCO Vallée de Mai primeval rainforest",
      "Daily Creole breakfast buffets & 4-course beachfront seafood dinners"
    ],
    exclusions: ["Seychelles travel authorization fee (€10)", "Deep sea fishing equipment"],
    itinerary: [
      { day: 1, title: "Mahé Island Arrival & Beachfront Villa Welcome", description: "Chauffeur transfer from Seychelles International. Welcome coconut cocktail at oceanfront resort.", meals: "Dinner Included", accommodation: "Constance Ephelia Mahé" },
      { day: 2, title: "Victoria Capital & Morne Seychellois Viewpoint", description: "See little Big Ben clock tower in Victoria, spices at Sir Selwyn Clarke market, sunset vista at Mission Lodge.", meals: "Breakfast & Dinner", accommodation: "Constance Ephelia Mahé" },
      { day: 3, title: "Ferry to Praslin & Vallée de Mai Palm Forest", description: "Speed across ocean to Praslin. Walk under prehistoric Coco de Mer trees, spot rare black parrots.", meals: "Breakfast & Creole Dinner", accommodation: "Raffles Praslin" },
      { day: 4, title: "La Digue Bicycle Safari: Anse Source d'Argent", description: "Take wooden boat to sleepy La Digue. Bicycle past vanilla plantations and giant Aldabra tortoises.", meals: "Breakfast & Beach BBQ", accommodation: "Raffles Praslin" },
      { day: 5, title: "Anse Lazio Crystal Snorkeling & Catamaran Sunset", description: "Swim in powder-soft sands of Anse Lazio, voted top 10 beach worldwide. Evening catamaran champagne cruise.", meals: "Breakfast & Seafood Feast", accommodation: "Raffles Praslin" },
      { day: 6, title: "Scenic Ferry to Mahé & International Departure", description: "Ferry back to Mahé, private chauffeur transfer to airport for international flight.", meals: "Breakfast Included", accommodation: "Departure" }
    ],
    reviews: [
      { user: "Nitin Bansal", rating: 5, comment: "La Digue beach with the massive granite rocks looks like another planet. Unbelievable luxury!", date: new Date("2026-10-15") }
    ]
  },
  {
    title: "Turkey Panorama: Cappadocia Hot Air Balloon, Bosphorus Yacht & Hagia Sophia",
    destination: "Istanbul & Cappadocia, Turkey",
    category: "Heritage",
    duration: "6 Days / 5 Nights",
    price: 74000,
    capacity: 16,
    availableDates: ["2026-11-14", "2026-11-28", "2026-12-22", "2027-01-20"],
    overview: "Where East meets West. Float above fairy chimneys at sunrise in Cappadocia, sleep in a restored carved rock cave suite, sail down the Bosphorus Strait dividing Europe and Asia, and marvel at the mosaics of Hagia Sophia, Blue Mosque, and Topkapi Palace.",
    featured: true,
    rating: 4.96,
    reviewsCount: 38,
    images: [
      "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1200&auto=format&fit=crop&q=80"
    ],
    inclusions: [
      "Guaranteed Dawn Hot Air Balloon Flight over Cappadocia Valleys with Champagne Toast",
      "3 Nights in Historic Cave Hotel Cappadocia (Museum Hotel / Sultan Cave Suites)",
      "2 Nights in Luxury Bosphorus-front 5-Star Hotel in Istanbul (Ciragan Palace Kempinski)",
      "Private Sunset Yacht Cruise along the Bosphorus Strait with Turkish mezes",
      "Domestic flight tickets between Istanbul and Cappadocia included"
    ],
    exclusions: ["Turkey e-Visa fee ($50)", "Turkish hammam massage upgrades"],
    itinerary: [
      { day: 1, title: "Istanbul Arrival & Bosphorus Palace Check-In", description: "Private airport transfer to hotel along the water. Evening walk through Sultanahmet illuminated square.", meals: "Dinner Included", accommodation: "Ciragan Palace Kempinski" },
      { day: 2, title: "Hagia Sophia, Blue Mosque & Grand Bazaar", description: "Tour 1,500-year-old Hagia Sophia, marvel at 20,000 blue Iznik tiles, shop spices in Grand Bazaar.", meals: "Breakfast & Ottoman Lunch", accommodation: "Ciragan Palace Kempinski" },
      { day: 3, title: "Flight to Cappadocia & Sunset Red Valley ATV", description: "Fly to Cappadocia. Check into fairy chimney cave suite. Sunset quad bike safari through rock valleys.", meals: "Breakfast & Dinner", accommodation: "Museum Hotel Cappadocia" },
      { day: 4, title: "Dawn Hot Air Balloon Flight & Underground City", description: "Float 2,000 ft above fairy chimneys as hundreds of balloons rise. Explore Kaymakli multi-level underground city.", meals: "Champagne Breakfast & Lunch", accommodation: "Museum Hotel Cappadocia" },
      { day: 5, title: "Goreme Open Air Museum & Pottery Masterclass", description: "Ancient rock-cut Byzantine churches with biblical frescoes, hands-on red clay pottery in Avanos.", meals: "Breakfast & Pottery Lunch", accommodation: "Museum Hotel Cappadocia" },
      { day: 6, title: "Flight to Istanbul & International Departure", description: "Morning Turkish breakfast, flight back to Istanbul Airport for return flight.", meals: "Breakfast Included", accommodation: "Departure" }
    ],
    reviews: [
      { user: "Meera Chawla", rating: 5, comment: "Seeing a hundred hot air balloons floating over Cappadocia at sunrise was the highlight of our year!", date: new Date("2026-10-06") }
    ]
  },
  {
    title: "Norway Arctic Dream: Tromsø Aurora Safari, Fjord Cruise & Husky Sledding",
    destination: "Tromsø & Lofoten, Norway",
    category: "Adventure",
    duration: "6 Days / 5 Nights",
    price: 162000,
    capacity: 12,
    availableDates: ["2026-11-20", "2026-12-10", "2027-01-12", "2027-02-08"],
    overview: "Chase the magical green ribbons of the Aurora Borealis in the Arctic wilderness. Drive your own team of eager Alaskan huskies through snow-covered pine forests, stay in glass-roofed Aurora cabins, and cruise silent fjords with humpback whales.",
    featured: true,
    rating: 4.97,
    reviewsCount: 37,
    images: [
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=1200&auto=format&fit=crop&q=80"
    ],
    inclusions: [
      "5 Nights in Luxury Arctic Glass-Roof Domes & Traditional Seaside Rorbuer Cabins",
      "Guided Northern Lights Chase with professional astro-photographer & campfire",
      "Self-Drive Alaskan Husky Dog Sledding Safari with thermal suits included",
      "Silent Electric Fjord Catamaran Cruise with whale watching & hydrophone",
      "Warm thermal winter overalls, arctic boots, and headlamps provided for all activities"
    ],
    exclusions: ["Schengen visa fees", "Alcoholic spirits outside dinners"],
    itinerary: [
      { day: 1, title: "Tromsø Paris of the North & Arctic Cathedral", description: "Chauffeur transfer from Tromsø Airport. Visit striking modern Arctic Cathedral and cable car viewpoint.", meals: "Dinner Included", accommodation: "Clarion Hotel The Edge" },
      { day: 2, title: "Silent Fjord Cruise & Whale Watching", description: "Sail through icy fjords on silent electric catamaran. Listen to orcas and humpbacks via underwater microphones.", meals: "Breakfast & Soup Lunch", accommodation: "Clarion Hotel The Edge" },
      { day: 3, title: "Alaskan Husky Sledding & Sami Reindeer Ranch", description: "Drive dog sled team across pristine snowfields, feed herd of 300 reindeer, hear traditional joik singing.", meals: "All Meals Included", accommodation: "Tromsø Ice Domes Resort" },
      { day: 4, title: "Northern Lights Mobile Chase & Campfire", description: "Travel with meteorologist guide to inland cloudless valleys. Photograph vibrant Aurora dances around campfire.", meals: "Breakfast & Arctic BBQ", accommodation: "Tromsø Ice Domes Resort" },
      { day: 5, title: "Snowshoe Trekking & Glass Dome Stargazing", description: "Snowshoe hike through birch forests. Sleep under glass dome gazing up at northern stars and aurora.", meals: "All Meals Included", accommodation: "Glass Roof Aurora Dome" },
      { day: 6, title: "Morning Arctic Sauna & Tromsø Departure", description: "Floating fjord sauna with icy dip, transfer to Tromsø Airport.", meals: "Breakfast Included", accommodation: "Departure" }
    ],
    reviews: [
      { user: "Gaurav Malhotra", rating: 5, comment: "The Northern Lights appeared right over our glass dome cabin! Pure magic. Husky sledding was a blast.", date: new Date("2026-10-10") }
    ]
  },
  {
    title: "Rishikesh & Haridwar: Sacred Ganga Aarti, Glass Skywalk & White Water Rapids",
    destination: "Rishikesh, Uttarakhand",
    category: "Spiritual",
    duration: "4 Days / 3 Nights",
    price: 14500,
    capacity: 20,
    availableDates: ["2026-11-10", "2026-11-22", "2026-12-06", "2026-12-20"],
    overview: "Rejuvenate mind, body, and soul where the holy Ganges emerges from the Himalayas. Witness the divine evening Ganga Aarti at Triveni Ghat and Har Ki Pauri, attend sunrise yoga with revered gurus, cross the new glass skywalk, and conquer thrilling grade III/IV river rapids.",
    featured: true,
    rating: 4.88,
    reviewsCount: 30,
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80"
    ],
    inclusions: [
      "3 Nights in Luxury Riverside Wellness Retreat (Ananda in the Himalayas / Aloha on the Ganges)",
      "VIP Reserved Seating at Triveni Ghat & Har Ki Pauri Evening Ganga Aarti",
      "Private White Water Rafting Expedition (16 km Shivpuri to Rishikesh)",
      "Daily Sunrise Yoga & Meditation sessions conducted by certified yoga masters",
      "Private AC Chauffeur transfer to and from Dehradun Jolly Grant Airport"
    ],
    exclusions: ["Bungee jumping at Mohan Chatti (Jumpin Heights)", "Personal temple donations"],
    itinerary: [
      { day: 1, title: "Dehradun Airport Pickup & Riverside Welcome", description: "Chauffeur transfer along the Ganges. Traditional aarti welcome, evening stroll across Laxman Jhula.", meals: "Dinner Included", accommodation: "Aloha On The Ganges" },
      { day: 2, title: "Sunrise Yoga & White Water Rafting Adventure", description: "Morning Pranayama yoga. Gear up with wetsuits and helmets to raft roller coaster and golf course rapids.", meals: "Breakfast & Riverside Lunch", accommodation: "Aloha On The Ganges" },
      { day: 3, title: "Beatles Ashram & Har Ki Pauri Grand Aarti", description: "Explore graffiti meditation caves at Maharishi Mahesh Yogi ashram. Drive to Haridwar for glowing Ganga Aarti.", meals: "Breakfast & Vegetarian Feast", accommodation: "Aloha On The Ganges" },
      { day: 4, title: "Neer Garh Waterfall Hike & Dehradun Departure", description: "Short morning hike to emerald cascade pools, checkout and transfer to Dehradun Airport.", meals: "Breakfast Included", accommodation: "Departure" }
    ],
    reviews: [
      { user: "Kavita Rao", rating: 5, comment: "The Ganga Aarti with thousands of floating oil lamps gave me goosebumps. Wonderful rafting experience too!", date: new Date("2026-09-19") }
    ]
  },
  {
    title: "Lakshadweep: Pristine Coral Atolls, Scuba Diving & Glass-Bottom Boats",
    destination: "Agatti & Bangaram, Lakshadweep",
    category: "Beach",
    duration: "5 Days / 4 Nights",
    price: 34000,
    capacity: 14,
    availableDates: ["2026-11-15", "2026-12-01", "2026-12-18", "2027-01-15"],
    overview: "India's secluded coral treasure. Dip your toes into blindingly white sands and impossibly clear neon cyan lagoons. Snorkel with green sea turtles in shallow waters, take sunset speedboats to uninhabited Bangaram & Thinnakara islets, and scuba dive along pristine reef drop-offs.",
    featured: true,
    rating: 4.94,
    reviewsCount: 29,
    images: [
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80"
    ],
    inclusions: [
      "Official Lakshadweep Island Entry Permit (E-Permit) clearance",
      "4 Nights in Beachfront AC Cottages on Agatti and Bangaram Island",
      "All speedboat transfers between Agatti airstrip and Bangaram/Thinnakara",
      "Daily buffet breakfast, fresh coconut water, and multi-cuisine island meals",
      "1 Guided Discover Scuba Dive session with PADI certified divemaster"
    ],
    exclusions: ["Airfare between Kochi (COK) and Agatti (AGX)", "Night reef fishing expeditions"],
    itinerary: [
      { day: 1, title: "Flight from Kochi to Agatti & Lagoon Welcome", description: "Fly over turquoise coral reefs to Agatti airstrip. Welcome garland and fresh tender coconut.", meals: "Lunch & Dinner", accommodation: "Agatti Island Beach Resort" },
      { day: 2, title: "Discover Scuba Diving & Sea Turtle Lagoon", description: "PADI dive along coral walls with manta rays and clownfish. Afternoon swim with green sea turtles.", meals: "All Meals Included", accommodation: "Agatti Island Beach Resort" },
      { day: 3, title: "Speedboat Expedition to Uninhabited Bangaram", description: "35-minute twin-engine speedboat ride across azure waters to tear-drop shaped Bangaram island paradise.", meals: "All Meals Included", accommodation: "Bangaram Island Resort" },
      { day: 4, title: "Thinnakara Sandbank & Glass-Bottom Boat Safari", description: "Walk across shallow sand spit to uninhabited Thinnakara. Watch vibrant corals through glass-bottom boat.", meals: "All Meals Included", accommodation: "Bangaram Island Resort" },
      { day: 5, title: "Speedboat to Agatti & Kochi Flight Departure", description: "Speedboat back to Agatti airstrip for flight back to mainland Kochi.", meals: "Breakfast Included", accommodation: "Departure" }
    ],
    reviews: [
      { user: "Vivek Deshmukh", rating: 5, comment: "Lakshadweep waters are clearer than the Maldives! Swimming with sea turtles right by the beach was unforgettable.", date: new Date("2026-10-21") }
    ]
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wanderly';
    console.log(`[Seed Script] Connecting to MongoDB: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('[Seed Script] Connected successfully.');

    // 1. Clear existing data
    console.log('[Seed Script] Refreshing collections...');
    await Tour.deleteMany({});
    await Booking.deleteMany({});
    await Wishlist.deleteMany({});

    // 2. Insert tours
    console.log(`[Seed Script] Inserting ${sampleTours.length} curated tours...`);
    const insertedTours = await Tour.insertMany(sampleTours);
    console.log('[Seed Script] Tours seeded successfully.');

    // 3. Ensure demo users exist
    console.log('[Seed Script] Creating / updating demo users...');
    
    // Admin user: admin@wanderly.com / Admin@123
    let adminUser = await User.findOne({ email: 'admin@wanderly.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Wanderly Administrator',
        email: 'admin@wanderly.com',
        password: 'Admin@123',
        role: 'admin',
        phone: '+91 99887 76655',
      });
    } else {
      adminUser.role = 'admin';
      adminUser.password = 'Admin@123';
      await adminUser.save();
    }

    // Student user: aarav@wanderly.com / User@123
    let studentUser = await User.findOne({ email: 'aarav@wanderly.com' });
    if (!studentUser) {
      studentUser = await User.create({
        name: 'Aarav Mehta',
        email: 'aarav@wanderly.com',
        password: 'User@123',
        role: 'user',
        phone: '+91 98765 43210',
      });
    } else {
      studentUser.password = 'User@123';
      await studentUser.save();
    }

    // 4. Create sample bookings for student user so dashboard has realistic data
    console.log('[Seed Script] Creating sample bookings for student user...');
    const goaTour = insertedTours.find((t) => t.destination.includes('Goa')) || insertedTours[0];
    const kashmirTour = insertedTours.find((t) => t.destination.includes('Kashmir')) || insertedTours[1];
    const baliTour = insertedTours.find((t) => t.destination.includes('Bali')) || insertedTours[5];

    // Upcoming booking: Goa
    const goaBooking = await Booking.create({
      bookingReference: 'WND-GOA4-7821',
      userId: studentUser._id,
      tourId: goaTour._id,
      travelDate: goaTour.availableDates[0],
      travelers: 2,
      pricePerPerson: goaTour.price,
      basePrice: goaTour.price * 2,
      addOns: [{ name: 'Mandovi Luxury Catamaran Sunset Cruise', price: 3500 }],
      addOnsTotal: 3500,
      insuranceAdded: true,
      insuranceAmount: 1998,
      couponCode: 'WANDERLY10',
      discountAmount: Math.round((goaTour.price * 2 * 10) / 100),
      totalPrice: goaTour.price * 2 + 3500 + 1998 - Math.round((goaTour.price * 2 * 10) / 100),
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      paymentDetails: {
        transactionId: 'TXN-WND-849201',
        upiId: 'aarav@okhdfcbank',
      },
      status: 'Confirmed',
      contactDetails: {
        name: 'Aarav Mehta',
        email: 'aarav@wanderly.com',
        phone: '+91 98765 43210',
        specialRequests: 'Window seat on catamaran cruise please.',
      },
    });

    // Update Goa tour booked seats
    goaTour.bookedSeats.push({ date: goaTour.availableDates[0], count: 2 });
    await goaTour.save();

    // Upcoming booking: Kashmir
    const kashmirBooking = await Booking.create({
      bookingReference: 'WND-KSH9-3419',
      userId: studentUser._id,
      tourId: kashmirTour._id,
      travelDate: kashmirTour.availableDates[1],
      travelers: 1,
      pricePerPerson: kashmirTour.price,
      basePrice: kashmirTour.price,
      addOns: [{ name: 'Private Kashmiri Wazwan Feast', price: 2500 }],
      addOnsTotal: 2500,
      insuranceAdded: false,
      insuranceAmount: 0,
      couponCode: '',
      discountAmount: 0,
      totalPrice: kashmirTour.price + 2500,
      paymentMethod: 'Credit/Debit Card',
      paymentStatus: 'Paid',
      paymentDetails: {
        transactionId: 'TXN-WND-392817',
        cardLast4: '8821',
      },
      status: 'Confirmed',
      contactDetails: {
        name: 'Aarav Mehta',
        email: 'aarav@wanderly.com',
        phone: '+91 98765 43210',
        specialRequests: 'Vegetarian meals on houseboat.',
      },
    });
    kashmirTour.bookedSeats.push({ date: kashmirTour.availableDates[1], count: 1 });
    await kashmirTour.save();

    // Past / Cancelled booking: Bali
    await Booking.create({
      bookingReference: 'WND-BLI2-9012',
      userId: studentUser._id,
      tourId: baliTour._id,
      travelDate: '2026-09-10',
      travelers: 2,
      pricePerPerson: baliTour.price,
      basePrice: baliTour.price * 2,
      addOns: [],
      addOnsTotal: 0,
      insuranceAdded: false,
      insuranceAmount: 0,
      couponCode: 'FIRSTTRIP',
      discountAmount: 2500,
      totalPrice: baliTour.price * 2 - 2500,
      paymentMethod: 'Net Banking',
      paymentStatus: 'Refunded',
      paymentDetails: {
        transactionId: 'TXN-WND-109283',
        bankName: 'HDFC Bank',
      },
      status: 'Cancelled',
      contactDetails: {
        name: 'Aarav Mehta',
        email: 'aarav@wanderly.com',
        phone: '+91 98765 43210',
        specialRequests: '',
      },
    });

    // 5. Seed Wishlist for student user
    console.log('[Seed Script] Seeding wishlist for student user...');
    await Wishlist.create({
      userId: studentUser._id,
      tourIds: [baliTour._id, insertedTours[4]._id, insertedTours[14]._id], // Bali, Ladakh, Switzerland
    });

    console.log('\n=============================================================');
    console.log(' ✨ [Seed Script] Database seeding completed successfully! ✨');
    console.log(' 🌍 22 Luxury Tours Loaded into MongoDB Compass');
    console.log(' 💳 Feature-Rich Multi-Method Payment Records Initialized');
    console.log(' 🔑 Admin Account:   admin@wanderly.com / Admin@123');
    console.log(' 🔑 Student Account: aarav@wanderly.com / User@123');
    console.log(' 📋 3 Realistic Bookings and Wishlist pre-loaded');
    console.log('=============================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Script Error]:', error);
    process.exit(1);
  }
};

seedDB();
