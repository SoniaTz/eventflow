import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Admin User
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@spotyourvibe.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@spotyourvibe.com',
      password: hashedAdminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create SuperAdmin User
  const hashedSuperAdminPassword = await bcrypt.hash('superadmin123', 10);
  await prisma.user.upsert({
    where: { email: 'info@spotyourvibe.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'info@spotyourvibe.com',
      password: hashedSuperAdminPassword,
      role: 'SUPERADMIN',
    },
  });
  console.log('✅ SuperAdmin user created: info@spotyourvibe.com');

  // Create Verified Organizer
  const hashedOrganizerPassword = await bcrypt.hash('organizer123', 10);
  const organizer = await prisma.user.upsert({
    where: { email: 'organizer@spotyourvibe.com' },
    update: {},
    create: {
      name: 'Event Organizer',
      email: 'organizer@spotyourvibe.com',
      password: hashedOrganizerPassword,
      role: 'ORGANIZER',
    },
  });
  console.log('✅ Organizer user created:', organizer.email);

  // Create Organizer Application (Approved)
  await prisma.organizerApplication.upsert({
    where: { userId: organizer.id },
    update: {},
    create: {
      userId: organizer.id,
      organizationName: 'Premier Events Co.',
      phone: '+1-555-0100',
      description: 'Leading event organizer specializing in concerts and festivals',
      website: 'https://premierevents.com',
      status: 'APPROVED',
    },
  });
  console.log('✅ Organizer application created (APPROVED)');

  // Create Regular User
  const hashedUserPassword = await bcrypt.hash('user123', 10);
  await prisma.user.upsert({
    where: { email: 'user@spotyourvibe.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'user@spotyourvibe.com',
      password: hashedUserPassword,
      role: 'USER',
    },
  });
  console.log('✅ Regular user created: user@spotyourvibe.com');

  // Create Categories
  const categories = ['Music', 'Conference', 'Sports', 'Entertainment', 'Arts', 'Food & Drink'];
  const categoryRecords = {};
  for (const name of categories) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name }
    });
    categoryRecords[name] = cat;
  }
  console.log('✅ Categories created');

  // Create Venues
  const venueData = [
    { name: 'Madison Square Garden', address: '4 Pennsylvania Plaza', city: 'New York', capacity: 20789 },
    { name: 'The O2 Arena', address: 'Peninsula Square', city: 'London', capacity: 20000 },
    { name: 'Staples Center', address: '1111 S Figueroa St', city: 'Los Angeles', capacity: 19060 },
    { name: 'Sydney Opera House', address: 'Bennelong Point', city: 'Sydney', capacity: 5738 },
    { name: 'Berlin Philharmonic', address: 'Herbert-von-Karajan-Straße 1', city: 'Berlin', capacity: 2440 },
  ];
  const venueRecords = [];
  for (const v of venueData) {
    const venue = await prisma.venue.upsert({
      where: { id: v.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: { id: v.name.toLowerCase().replace(/\s+/g, '-'), ...v }
    });
    venueRecords.push(venue);
  }
  console.log('✅ Venues created');

  // Create Sample Events with images
  const existingImages = [
    '/uploads/events/event-1781446551061-104681019.webp',
    '/uploads/events/event-1781511011708-52196103.webp',
    '/uploads/events/event-1781533440514-86184191.webp',
    '/uploads/events/event-1781621428920-573692458.webp',
    '/uploads/events/event-1781622372792-594185853.webp',
    '/uploads/events/event-1781622516163-17741371.webp',
    '/uploads/events/event-1781637441430-216259421.png',
    '/uploads/events/event-1781637948580-279712791.png',
  ];

  const sampleEvents = [
    {
      title: 'Summer Music Festival 2026',
      shortDescription: 'An unforgettable weekend of live music performances',
      fullDescription: 'Join us for the biggest summer music festival featuring top artists from around the world. Three days of non-stop music, food, and entertainment.',
      image: existingImages[0],
      startDate: new Date('2026-07-15T18:00:00Z'),
      endDate: new Date('2026-07-17T23:00:00Z'),
      maxCapacity: 5000,
      venueId: venueRecords[0].id,
      categoryId: categoryRecords['Music'].id,
    },
    {
      title: 'Tech Innovation Summit',
      shortDescription: 'Explore the future of technology',
      fullDescription: 'A premier conference bringing together industry leaders, innovators, and tech enthusiasts to discuss AI, blockchain, and emerging technologies.',
      image: existingImages[1],
      startDate: new Date('2026-08-20T09:00:00Z'),
      endDate: new Date('2026-08-22T18:00:00Z'),
      maxCapacity: 3000,
      venueId: venueRecords[1].id,
      categoryId: categoryRecords['Conference'].id,
    },
    {
      title: 'Championship Finals',
      shortDescription: 'Witness the ultimate sporting showdown',
      fullDescription: 'The most anticipated sporting event of the year. Watch top athletes compete for the championship title in an electrifying atmosphere.',
      image: existingImages[2],
      startDate: new Date('2026-09-10T14:00:00Z'),
      endDate: new Date('2026-09-10T22:00:00Z'),
      maxCapacity: 15000,
      venueId: venueRecords[2].id,
      categoryId: categoryRecords['Sports'].id,
    },
    {
      title: 'Broadway Night: The Musical Experience',
      shortDescription: 'A magical evening of Broadway hits',
      fullDescription: 'Experience the magic of Broadway with performances from the most beloved musicals. Featuring a live orchestra and world-class performers.',
      image: existingImages[3],
      startDate: new Date('2026-10-05T19:30:00Z'),
      endDate: new Date('2026-10-05T22:30:00Z'),
      maxCapacity: 2000,
      venueId: venueRecords[3].id,
      categoryId: categoryRecords['Entertainment'].id,
    },
    {
      title: 'International Art Exhibition',
      shortDescription: 'Discover masterpieces from around the globe',
      fullDescription: 'A curated exhibition featuring contemporary art from emerging and established artists worldwide. Paintings, sculptures, and digital installations.',
      image: existingImages[4],
      startDate: new Date('2026-11-01T10:00:00Z'),
      endDate: new Date('2026-11-15T20:00:00Z'),
      maxCapacity: 1000,
      venueId: venueRecords[4].id,
      categoryId: categoryRecords['Arts'].id,
    },
    {
      title: 'Gourmet Food & Wine Festival',
      shortDescription: 'A culinary journey for food lovers',
      fullDescription: 'Taste exquisite dishes from Michelin-starred chefs and sample fine wines from renowned vineyards. Cooking demonstrations and tasting sessions included.',
      image: existingImages[5],
      startDate: new Date('2026-12-08T12:00:00Z'),
      endDate: new Date('2026-12-10T21:00:00Z'),
      maxCapacity: 3500,
      venueId: venueRecords[0].id,
      categoryId: categoryRecords['Food & Drink'].id,
    },
  ];

  for (const eventData of sampleEvents) {
    await prisma.event.upsert({
      where: { id: eventData.title.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        id: eventData.title.toLowerCase().replace(/\s+/g, '-'),
        ...eventData,
        availableSeats: eventData.maxCapacity,
        status: 'APPROVED',
        organizerId: organizer.id,
        seatingType: 'general',
        maxTicketsPerOrder: 10,
      }
    });
  }
  console.log(`✅ ${sampleEvents.length} sample events created with images`);

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });