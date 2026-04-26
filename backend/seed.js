const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  { name: 'Transport', iconName: 'car' },
  { name: 'Food', iconName: 'utensils' },
  { name: 'Shopping', iconName: 'shopping-bag' },
  { name: 'Tourism', iconName: 'camera' }
];

const cities = [
  { 
    name: 'Jaipur', state: 'Rajasthan', description: 'The Pink City known for its palaces.', themeColor: '#e83e8c', imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80', latitude: 26.9124, longitude: 75.7873,
    places: [
      { name: 'Amer Fort', description: 'Majestic fort known for its artistic Hindu elements.', imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80' },
      { name: 'Hawa Mahal', description: 'Iconic "Palace of Winds" with 953 small windows.', imageUrl: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&q=80' },
      { name: 'City Palace', description: 'Sprawling complex of courtyards, gardens and buildings.', imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80' }
    ]
  },
  { 
    name: 'Mumbai', state: 'Maharashtra', description: 'The bustling financial capital of India.', themeColor: '#ffc107', imageUrl: 'https://images.unsplash.com/photo-1522262719266-9ab5929b3dc3?auto=format&fit=crop&q=80', latitude: 19.0760, longitude: 72.8777,
    places: [
      { name: 'Gateway of India', description: 'Arch monument built during the 20th century.', imageUrl: 'https://images.unsplash.com/photo-1570160897040-30430ef2010a?auto=format&fit=crop&q=80' },
      { name: 'Elephanta Caves', description: 'Historic rock-cut caves dedicated to Lord Shiva.', imageUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80' },
      { name: 'Marine Drive', description: 'C-shaped natural bay along the coast.', imageUrl: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&q=80' }
    ]
  },
  { 
    name: 'Delhi', state: 'Delhi', description: 'The vibrant capital city with rich history.', themeColor: '#dc3545', imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80', latitude: 28.6139, longitude: 77.2090,
    places: [
      { name: 'Red Fort', description: 'Historic fortification from the Mughal era.', imageUrl: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&q=80' },
      { name: 'India Gate', description: 'War memorial located astride the Rajpath.', imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80' },
      { name: 'Qutub Minar', description: '73-meter high tower of victory.', imageUrl: 'https://images.unsplash.com/photo-1523544545273-b3d20de95bbd?auto=format&fit=crop&q=80' }
    ]
  },
  { 
    name: 'Bhopal', state: 'Madhya Pradesh', description: 'The City of Lakes, known for its greenery.', themeColor: '#198754', imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80', latitude: 23.2599, longitude: 77.4126,
    places: [
      { name: 'Upper Lake', description: 'Oldest man-made lake in India.', imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80' },
      { name: 'Van Vihar', description: 'Wildlife sanctuary and zoo.', imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80' }
    ]
  },
  { 
    name: 'Lucknow', state: 'Uttar Pradesh', description: 'The City of Nawabs, famous for its culture and cuisine.', themeColor: '#6f42c1', imageUrl: 'https://images.unsplash.com/photo-162815771614-ade9d652a65d?auto=format&fit=crop&q=80', latitude: 26.8467, longitude: 80.9462,
    places: [
      { name: 'Bara Imambara', description: 'Historic congregational hall built by Asaf-ud-Daula.', imageUrl: 'https://images.unsplash.com/photo-162815771614-ade9d652a65d?auto=format&fit=crop&q=80' },
      { name: 'Rumi Darwaza', description: 'Iconic gateway known as the Turkish Gate.', imageUrl: 'https://images.unsplash.com/photo-162815771614-ade9d652a65d?auto=format&fit=crop&q=80' }
    ]
  },
  { 
    name: 'Kolkata', state: 'West Bengal', description: 'The City of Joy, a cultural hub.', themeColor: '#007bff', imageUrl: 'https://images.unsplash.com/photo-1558431382-27e39cbef4bc?auto=format&fit=crop&q=80', latitude: 22.5726, longitude: 88.3639,
    places: [
      { name: 'Victoria Memorial', description: 'Large marble building built between 1906 and 1921.', imageUrl: 'https://images.unsplash.com/photo-1558431382-27e39cbef4bc?auto=format&fit=crop&q=80' },
      { name: 'Howrah Bridge', description: 'Balanced cantilever bridge over the Hooghly River.', imageUrl: 'https://images.unsplash.com/photo-1558431382-27e39cbef4bc?auto=format&fit=crop&q=80' }
    ]
  },
  { 
    name: 'Bengaluru', state: 'Karnataka', description: 'The Silicon Valley of India.', themeColor: '#28a745', imageUrl: 'https://images.unsplash.com/photo-1596402184320-417d717867cd?auto=format&fit=crop&q=80', latitude: 12.9716, longitude: 77.5946,
    places: [
      { name: 'Lalbagh Botanical Garden', description: 'Historic garden with a glass house.', imageUrl: 'https://images.unsplash.com/photo-1596402184320-417d717867cd?auto=format&fit=crop&q=80' },
      { name: 'Bangalore Palace', description: 'Royal palace inspired by Windsor Castle.', imageUrl: 'https://images.unsplash.com/photo-1596402184320-417d717867cd?auto=format&fit=crop&q=80' }
    ]
  },
  { 
    name: 'Pune', state: 'Maharashtra', description: 'The cultural capital of Maharashtra.', themeColor: '#fd7e14', imageUrl: 'https://images.unsplash.com/photo-1562158014-998846174a81?auto=format&fit=crop&q=80', latitude: 18.5204, longitude: 73.8567,
    places: [
      { name: 'Shaniwar Wada', description: 'Historical fortification built in 1732.', imageUrl: 'https://images.unsplash.com/photo-1562158014-998846174a81?auto=format&fit=crop&q=80' },
      { name: 'Aga Khan Palace', description: 'Historic building that served as a prison for Gandhi.', imageUrl: 'https://images.unsplash.com/photo-1562158014-998846174a81?auto=format&fit=crop&q=80' }
    ]
  },
  { 
    name: 'Hyderabad', state: 'Telangana', description: 'The City of Pearls.', themeColor: '#20c997', imageUrl: 'https://images.unsplash.com/photo-1572431441259-20410714798c?auto=format&fit=crop&q=80', latitude: 17.3850, longitude: 78.4867,
    places: [
      { name: 'Charminar', description: 'Mosque and monument built in 1591.', imageUrl: 'https://images.unsplash.com/photo-1572431441259-20410714798c?auto=format&fit=crop&q=80' },
      { name: 'Golconda Fort', description: 'Historic citadel and fort.', imageUrl: 'https://images.unsplash.com/photo-1572431441259-20410714798c?auto=format&fit=crop&q=80' }
    ]
  },
  { 
    name: 'Chennai', state: 'Tamil Nadu', description: 'Gateway to South India.', themeColor: '#e83e8c', imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80', latitude: 13.0827, longitude: 80.2707,
    places: [
      { name: 'Marina Beach', description: 'Natural urban beach along the Bay of Bengal.', imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80' },
      { name: 'Kapaleeshwarar Temple', description: 'Ancient temple dedicated to Lord Shiva.', imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80' }
    ]
  },
  { name: 'Ahmedabad', state: 'Gujarat', description: 'The historic walled city.', themeColor: '#fd7e14', imageUrl: 'https://images.unsplash.com/photo-1603297638322-c7a28f164270?auto=format&fit=crop&q=80', latitude: 23.0225, longitude: 72.5714, places: [{name: 'Sabarmati Ashram', description: 'Gandhi\'s residence.', imageUrl: 'https://images.unsplash.com/photo-1603297638322-c7a28f164270?auto=format&fit=crop&q=80'}] },
  { name: 'Agra', state: 'Uttar Pradesh', description: 'Home of the Taj Mahal.', themeColor: '#6c757d', imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eaa0ae?auto=format&fit=crop&q=80', latitude: 27.1767, longitude: 78.0081, places: [{name: 'Taj Mahal', description: 'Wonder of the world.', imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eaa0ae?auto=format&fit=crop&q=80'}] },
  { name: 'Udaipur', state: 'Rajasthan', description: 'The City of Lakes.', themeColor: '#0dcaf0', imageUrl: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&q=80', latitude: 24.5854, longitude: 73.7125, places: [{name: 'City Palace', description: 'Royal palace on Lake Pichola.', imageUrl: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&q=80'}] },
  { name: 'Varanasi', state: 'Uttar Pradesh', description: 'The spiritual capital of India.', themeColor: '#ffc107', imageUrl: 'https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&q=80', latitude: 25.3176, longitude: 82.9739, places: [{name: 'Kashi Vishwanath', description: 'Sacred Hindu temple.', imageUrl: 'https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&q=80'}] },
  { name: 'Amritsar', state: 'Punjab', description: 'Home of the Golden Temple.', themeColor: '#fd7e14', imageUrl: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&q=80', latitude: 31.6340, longitude: 74.8723, places: [{name: 'Golden Temple', description: 'Sacred Sikh shrine.', imageUrl: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&q=80'}] },
  { name: 'Shimla', state: 'Himachal Pradesh', description: 'The Queen of Hills.', themeColor: '#0dcaf0', imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80', latitude: 31.1048, longitude: 77.1734, places: [{name: 'The Ridge', description: 'Large open space in the heart of Shimla.', imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80'}] },
  { name: 'Srinagar', state: 'Jammu & Kashmir', description: 'Paradise on Earth.', themeColor: '#198754', imageUrl: 'https://images.unsplash.com/photo-1598305072042-30019623e7e1?auto=format&fit=crop&q=80', latitude: 34.0837, longitude: 74.7973, places: [{name: 'Dal Lake', description: 'Famous lake with houseboats.', imageUrl: 'https://images.unsplash.com/photo-1598305072042-30019623e7e1?auto=format&fit=crop&q=80'}] },
  { name: 'Goa', state: 'Goa', description: 'The beach paradise.', themeColor: '#007bff', imageUrl: 'https://images.unsplash.com/photo-1512757776204-1246914d5694?auto=format&fit=crop&q=80', latitude: 15.2993, longitude: 74.1240, places: [{name: 'Baga Beach', description: 'Popular beach destination.', imageUrl: 'https://images.unsplash.com/photo-1512757776204-1246914d5694?auto=format&fit=crop&q=80'}] },
  { name: 'Kochi', state: 'Kerala', description: 'The Queen of the Arabian Sea.', themeColor: '#198754', imageUrl: 'https://images.unsplash.com/photo-1589982841217-0725c567849e?auto=format&fit=crop&q=80', latitude: 9.9312, longitude: 76.2673, places: [{name: 'Chinese Fishing Nets', description: 'Iconic fishing nets of Kochi.', imageUrl: 'https://images.unsplash.com/photo-1589982841217-0725c567849e?auto=format&fit=crop&q=80'}] },
  { name: 'Mysuru', state: 'Karnataka', description: 'The City of Palaces.', themeColor: '#6f42c1', imageUrl: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80', latitude: 12.2958, longitude: 76.6394, places: [{name: 'Mysore Palace', description: 'Grand royal residence.', imageUrl: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80'}] },
  { name: 'Indore', state: 'Madhya Pradesh', description: 'The cleanest city in India.', themeColor: '#0dcaf0', imageUrl: 'https://images.unsplash.com/photo-1605330559013-1768407425f1?auto=format&fit=crop&q=80', latitude: 22.7196, longitude: 75.8577, places: [{name: 'Rajwada', description: 'Historic palace in Indore.', imageUrl: 'https://images.unsplash.com/photo-1605330559013-1768407425f1?auto=format&fit=crop&q=80'}] },
  { name: 'Patna', state: 'Bihar', description: 'The ancient city of Pataliputra.', themeColor: '#fd7e14', imageUrl: 'https://images.unsplash.com/photo-162815771614-ade9d652a65d?auto=format&fit=crop&q=80', latitude: 25.5941, longitude: 85.1376, places: [{name: 'Golghar', description: 'Historic granary.', imageUrl: 'https://images.unsplash.com/photo-162815771614-ade9d652a65d?auto=format&fit=crop&q=80'}] },
  { name: 'Guwahati', state: 'Assam', description: 'Gateway to Northeast India.', themeColor: '#198754', imageUrl: 'https://images.unsplash.com/photo-1605330559013-1768407425f1?auto=format&fit=crop&q=80', latitude: 26.1445, longitude: 91.7362, places: [{name: 'Kamakhya Temple', description: 'Sacred Shakti Peetha.', imageUrl: 'https://images.unsplash.com/photo-1605330559013-1768407425f1?auto=format&fit=crop&q=80'}] },
  { name: 'Ranchi', state: 'Jharkhand', description: 'The City of Waterfalls.', themeColor: '#0dcaf0', imageUrl: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80', latitude: 23.3441, longitude: 85.3096, places: [{name: 'Hundru Falls', description: 'Scenic waterfall near Ranchi.', imageUrl: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80'}] },
  { name: 'Bhubaneswar', state: 'Odisha', description: 'The Temple City.', themeColor: '#ffc107', imageUrl: 'https://images.unsplash.com/photo-1605330559013-1768407425f1?auto=format&fit=crop&q=80', latitude: 20.2961, longitude: 85.8245, places: [{name: 'Lingaraja Temple', description: 'Ancient Shiva temple.', imageUrl: 'https://images.unsplash.com/photo-1605330559013-1768407425f1?auto=format&fit=crop&q=80'}] },
  { name: 'Chandigarh', state: 'Chandigarh', description: 'The City Beautiful.', themeColor: '#198754', imageUrl: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80', latitude: 30.7333, longitude: 76.7794, places: [{name: 'Rock Garden', description: 'Sculpture garden made of recycled materials.', imageUrl: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80'}] },
  { name: 'Madurai', state: 'Tamil Nadu', description: 'The Athens of the East.', themeColor: '#6f42c1', imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80', latitude: 9.9252, longitude: 78.1198, places: [{name: 'Meenakshi Temple', description: 'Historic Hindu temple.', imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80'}] },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', description: 'The Jewel of the East Coast.', themeColor: '#0dcaf0', imageUrl: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80', latitude: 17.6868, longitude: 83.2185, places: [{name: 'Rishikonda Beach', description: 'Scenic beach destination.', imageUrl: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80'}] },
  { name: 'Nagpur', state: 'Maharashtra', description: 'The Orange City.', themeColor: '#fd7e14', imageUrl: 'https://images.unsplash.com/photo-1605330559013-1768407425f1?auto=format&fit=crop&q=80', latitude: 21.1458, longitude: 79.0882, places: [{name: 'Deekshabhoomi', description: 'Buddhist monument.', imageUrl: 'https://images.unsplash.com/photo-1605330559013-1768407425f1?auto=format&fit=crop&q=80'}] },
  { name: 'Nashik', state: 'Maharashtra', description: 'The Wine Capital of India.', themeColor: '#6f42c1', imageUrl: 'https://images.unsplash.com/photo-1562158014-998846174a81?auto=format&fit=crop&q=80', latitude: 19.9975, longitude: 73.7898, places: [{name: 'Sula Vineyards', description: 'Famous winery in Nashik.', imageUrl: 'https://images.unsplash.com/photo-1562158014-998846174a81?auto=format&fit=crop&q=80'}] }
];

const itemTemplates = {
  Transport: [
    { name: 'Auto/Rickshaw Fare', min: 30, max: 80, avg: 50, baseFare: 25, perKmFare: 12 },
    { name: 'Cab/Taxi Fare', min: 100, max: 250, avg: 150, baseFare: 50, perKmFare: 18 },
    { name: 'E-Rickshaw Fare', min: 10, max: 30, avg: 20, baseFare: 10, perKmFare: 5 },
    { name: 'Bike Rental (Per Day)', min: 300, max: 800, avg: 500, baseFare: 300, perKmFare: 0 }
  ],
  Food: [
    { name: 'Street Food Meal', min: 50, max: 200, avg: 120 },
    { name: 'Local Thali', min: 150, max: 400, avg: 250 },
    { name: 'Cafe Coffee', min: 100, max: 300, avg: 180 },
    { name: 'Premium Restaurant', min: 800, max: 2500, avg: 1500 }
  ],
  Shopping: [
    { name: 'Local Souvenir/Handicraft', min: 100, max: 1500, avg: 500, isSouvenir: true },
    { name: 'Traditional Clothes', min: 500, max: 3000, avg: 1200, isSouvenir: true },
    { name: 'Artisan Pottery', min: 200, max: 2000, avg: 800, isSouvenir: true },
    { name: 'Local Jewelry', min: 300, max: 5000, avg: 1500, isSouvenir: true }
  ],
  Tourism: [
    { name: 'Monument Entry (Indian)', min: 20, max: 100, avg: 50 },
    { name: 'Monument Entry (Foreigner)', min: 300, max: 1000, avg: 600 },
    { name: 'Local Tour Guide', min: 500, max: 2000, avg: 1000 }
  ]
};

async function main() {
  console.log('Start seeding...');

  // Create Categories
  const categoryDocs = {};
  for (const c of categories) {
    const created = await prisma.category.upsert({
      where: { name: c.name },
      update: {},
      create: c,
    });
    categoryDocs[created.name] = created;
  }

  // Clear existing data to avoid duplicates on re-seed
  await prisma.priceItem.deleteMany({});
  await prisma.place.deleteMany({});
  await prisma.city.deleteMany({});

  // Create Cities & Prices
  for (const cityData of cities) {
    const city = await prisma.city.create({
      data: {
        name: cityData.name,
        state: cityData.state,
        description: cityData.description,
        themeColor: cityData.themeColor,
        imageUrl: cityData.imageUrl,
        latitude: cityData.latitude,
        longitude: cityData.longitude
      },
    });

    // Create Places
    if (cityData.places) {
      for (const place of cityData.places) {
        await prisma.place.create({
          data: {
            ...place,
            cityId: city.id
          }
        });
      }
    }

    const metros = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Hyderabad', 'Kolkata'];
    const hillStations = ['Shimla', 'Srinagar'];
    
    let multiplier = 1.0;
    if (metros.includes(cityData.name)) multiplier = 1.5; // High cost of living
    else if (hillStations.includes(cityData.name)) multiplier = 1.3; // Tough terrain
    else if (cityData.state === 'Rajasthan') multiplier = 1.1; // Tourist premium
    
    for (const [catName, items] of Object.entries(itemTemplates)) {
      const category = categoryDocs[catName];

      for (const item of items) {
        await prisma.priceItem.create({
          data: {
            name: item.name,
            minPrice: Math.round(item.min * multiplier),
            maxPrice: Math.round(item.max * multiplier),
            avgPrice: Math.round(item.avg * multiplier),
            baseFare: item.baseFare ? Math.round(item.baseFare * multiplier) : null,
            perKmFare: item.perKmFare ? Math.round(item.perKmFare * multiplier) : null,
            isSouvenir: item.isSouvenir || false,
            cityId: city.id,
            categoryId: category.id,
          }
        });
      }
    }
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
