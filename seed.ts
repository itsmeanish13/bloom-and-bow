import { db } from './src/lib/db';
import { Prisma } from '@prisma/client';

const products = [
  {
    slug: 'the-tuesday-bunch',
    title: 'The Tuesday Bunch',
    description: 'Seasonal stems, kraft-wrapped, no two ever quite the same.',
    category: 'flowers',
    occasions: JSON.stringify(['birthday', 'just_because']),
    price: 85000,
    stockStatus: 'in_stock',
    badges: JSON.stringify(['bestseller']),
    sortOrder: 1,
  },
  {
    slug: 'tiny-gift-box-sunshine',
    title: 'Tiny Gift Box, Sunshine',
    description: 'A small treat and a hand-written card, sealed with wax.',
    category: 'gifts',
    occasions: JSON.stringify(['birthday', 'thank_you']),
    price: 48000,
    stockStatus: 'in_stock',
    badges: JSON.stringify([]),
    sortOrder: 2,
  },
  {
    slug: 'dried-everlasting-jar',
    title: 'Dried Everlasting Jar',
    description: 'A bouquet that keeps going long after the others wilt.',
    category: 'flowers',
    occasions: JSON.stringify(['anniversary', 'new_home', 'just_because']),
    price: 110000,
    stockStatus: 'in_stock',
    badges: JSON.stringify(['new']),
    sortOrder: 3,
  },
  {
    slug: 'rosy-morning-wreath',
    title: 'Rosy Morning Wreath',
    description: 'Soft pink roses with eucalyptus, perfect for doorways and tabletops.',
    category: 'flowers',
    occasions: JSON.stringify(['anniversary', 'birthday', 'new_home']),
    price: 125000,
    stockStatus: 'in_stock',
    badges: JSON.stringify(['bestseller', 'new']),
    sortOrder: 4,
  },
  {
    slug: 'wildflower-pouch',
    title: 'Wildflower Pouch',
    description: 'A linen pouch of dried wildflowers — lavender, chamomile, and love.',
    category: 'gifts',
    occasions: JSON.stringify(['thank_you', 'just_because', 'sorry']),
    price: 35000,
    stockStatus: 'in_stock',
    badges: JSON.stringify([]),
    sortOrder: 5,
  },
  {
    slug: 'the-sunday-arrangement',
    title: 'The Sunday Arrangement',
    description: 'Lush green foliage, white lilies, and a touch of gold ribbon.',
    category: 'flowers',
    occasions: JSON.stringify(['anniversary', 'birthday', 'new_home']),
    price: 95000,
    stockStatus: 'in_stock',
    badges: JSON.stringify([]),
    sortOrder: 6,
  },
  {
    slug: 'honey-and-heather-box',
    title: 'Honey & Heather Box',
    description: 'Local honey, dried heather, and a beeswax candle in a keepsake box.',
    category: 'gifts',
    occasions: JSON.stringify(['thank_you', 'birthday', 'just_because']),
    price: 62000,
    stockStatus: 'in_stock',
    badges: JSON.stringify(['new']),
    sortOrder: 7,
  },
  {
    slug: 'blush-posy',
    title: 'Blush Posy',
    description: 'A petite hand-tied posy in soft pinks and creams. Sweet and simple.',
    category: 'flowers',
    occasions: JSON.stringify(['birthday', 'anniversary', 'sorry']),
    price: 55000,
    stockStatus: 'in_stock',
    badges: JSON.stringify([]),
    sortOrder: 8,
  },
  {
    slug: 'garden-party-basket',
    title: 'Garden Party Basket',
    description: 'An overflowing basket of mixed seasonal blooms, wrapped in tissue and twine.',
    category: 'flowers',
    occasions: JSON.stringify(['birthday', 'anniversary', 'thank_you', 'new_home']),
    price: 150000,
    stockStatus: 'made_to_order',
    badges: JSON.stringify([]),
    sortOrder: 9,
  },
];

async function seed() {
  console.log('🌱 Seeding Bloom & Bow...');

  // Clear existing products
  await db.product.deleteMany();

  for (const p of products) {
    await db.product.create({ data: p });
    console.log(`  ✅ ${p.title}`);
  }

  console.log(`\n🌸 Done! ${products.length} products seeded.`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });