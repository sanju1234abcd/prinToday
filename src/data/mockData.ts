import { Category, Subcategory, Product, Order } from '../types';

// ── Real MongoDB IDs — seeded via scripts/seedCatalog.ts ─────────────────────
export const MOCK_CATEGORIES: Category[] = [
  {
    id: '6a84960e7003f2bf9724c01b',
    name: 'Wedding Essentials',
    slug: 'wedding-essentials',
    description: 'All kinds of Wedding Invitation Cards, Menus, Decor, & Management.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    iconName: 'Sparkles',
    productCount: 0
  },
  {
    id: '6a84960e7003f2bf9724c01c',
    name: 'Brand Marketing & Events',
    slug: 'brand-marketing-events',
    description: 'Banners, Flyers, Promo Tables, Canopies, T-Shirts & Full Event Management.',
    image: 'https://images.unsplash.com/photo-1542744094-3a3121699479?auto=format&fit=crop&w=800&q=80',
    iconName: 'Megaphone',
    productCount: 0
  },
  {
    id: '6a84960e7003f2bf9724c01d',
    name: 'All About Business & Office',
    slug: 'business-office',
    description: 'Visiting Cards, Letterheads, Bill Books, Stamps, ID Cards & Packaging.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    iconName: 'Briefcase',
    productCount: 0
  },
  {
    id: '6a84960e7003f2bf9724c01e',
    name: 'Personal Gifts',
    slug: 'personal-gifts',
    description: 'Photo Frames, Customized Mugs, Cushions, T-Shirts & Personalized Notebooks.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    iconName: 'Gift',
    productCount: 0
  }
];

export const MOCK_SUBCATEGORIES: Subcategory[] = [
  // ── Wedding Essentials ──────────────────────────────────────────────────────
  { id: '6a84960e7003f2bf9724c01f', categoryId: '6a84960e7003f2bf9724c01b', name: 'Invitation Card', slug: 'wedding-invitation-card', description: '', image: '' },
  { id: '6a84960e7003f2bf9724c020', categoryId: '6a84960e7003f2bf9724c01b', name: 'Wedding Itinerary', slug: 'wedding-itinerary', description: '', image: '' },
  { id: '6a84960e7003f2bf9724c021', categoryId: '6a84960e7003f2bf9724c01b', name: 'Thank You Card', slug: 'wedding-thank-you-card', description: '', image: '' },
  { id: '6a84960e7003f2bf9724c022', categoryId: '6a84960e7003f2bf9724c01b', name: 'Welcome Board', slug: 'wedding-welcome-board', description: '', image: '' },
  { id: '6a84960e7003f2bf9724c023', categoryId: '6a84960e7003f2bf9724c01b', name: 'Wedding Menu', slug: 'wedding-menu', description: '', image: '' },
  { id: '6a84960e7003f2bf9724c024', categoryId: '6a84960e7003f2bf9724c01b', name: 'Sticker', slug: 'wedding-sticker', description: '', image: '' },
  { id: '6a84960e7003f2bf9724c025', categoryId: '6a84960e7003f2bf9724c01b', name: 'Hamper', slug: 'wedding-hamper', description: '', image: '' },
  { id: '6a84960e7003f2bf9724c026', categoryId: '6a84960e7003f2bf9724c01b', name: 'Gifts', slug: 'wedding-gifts', description: '', image: '' },
  { id: '6a84960e7003f2bf9724c027', categoryId: '6a84960e7003f2bf9724c01b', name: 'Flower Car Decor', slug: 'wedding-flower-car-decor', description: '', image: '' },
  { id: '6a84960e7003f2bf9724c028', categoryId: '6a84960e7003f2bf9724c01b', name: 'Totto Decor', slug: 'wedding-totto-decor', description: '', image: '' },
  { id: '6a84960e7003f2bf9724c029', categoryId: '6a84960e7003f2bf9724c01b', name: 'All Types of Decoration', slug: 'wedding-all-types-of-decoration', description: '', image: '' },
  { id: '6a84960e7003f2bf9724c02a', categoryId: '6a84960e7003f2bf9724c01b', name: 'Sound System', slug: 'wedding-sound-system', description: '', image: '' },
  { id: '6a84960e7003f2bf9724c02b', categoryId: '6a84960e7003f2bf9724c01b', name: 'Guest Welcoming Service', slug: 'wedding-guest-welcoming-service', description: '', image: '' },
  { id: '6a84960e7003f2bf9724c02c', categoryId: '6a84960e7003f2bf9724c01b', name: 'Hospitality Team', slug: 'wedding-hospitality-team', description: '', image: '' },
  { id: '6a84960e7003f2bf9724c02d', categoryId: '6a84960e7003f2bf9724c01b', name: 'Full Event Planning & Management', slug: 'wedding-full-event-planning-management', description: '', image: '' },
  // ── Brand Marketing & Events ────────────────────────────────────────────────
  { id: '6a84960e7003f2bf9724c02e', categoryId: '6a84960e7003f2bf9724c01c', name: 'Posters', slug: 'brand-posters', description: '', image: '' },
  { id: '6a84960e7003f2bf9724c02f', categoryId: '6a84960e7003f2bf9724c01c', name: 'Banner', slug: 'brand-banner', description: '', image: '' },
  { id: '6a84960e7003f2bf9724c030', categoryId: '6a84960e7003f2bf9724c01c', name: 'Flyers / Handbills / Leaflets', slug: 'brand-flyers-handbills-leaflets', description: '', image: '' },
  { id: '6a84960e7003f2bf9724c031', categoryId: '6a84960e7003f2bf9724c01c', name: 'Brochures', slug: 'brand-brochures', description: '', image: '' },
  { id: '6a84960e7003f2bf9724c032', categoryId: '6a84960e7003f2bf9724c01c', name: 'Booklet', slug: 'brand-booklet', description: '', image: '' },
  { id: '6a84964a35e452ed1bd9c8cc', categoryId: '6a84960e7003f2bf9724c01c', name: 'Sticker', slug: 'brand-sticker', description: '', image: '' },
  { id: '6a84964a35e452ed1bd9c8cd', categoryId: '6a84960e7003f2bf9724c01c', name: 'Standee', slug: 'brand-standee', description: '', image: '' },
  { id: '6a84964a35e452ed1bd9c8ce', categoryId: '6a84960e7003f2bf9724c01c', name: 'Promo Table', slug: 'brand-promo-table', description: '', image: '' },
  { id: '6a84964a35e452ed1bd9c8cf', categoryId: '6a84960e7003f2bf9724c01c', name: 'Canopy Tent', slug: 'brand-canopy-tent', description: '', image: '' },
  { id: '6a84964a35e452ed1bd9c8d0', categoryId: '6a84960e7003f2bf9724c01c', name: 'All Types of Branding', slug: 'brand-all-types-of-branding', description: '', image: '' },
  { id: '6a84964a35e452ed1bd9c8d1', categoryId: '6a84960e7003f2bf9724c01c', name: 'Marketing / Brand Activation', slug: 'brand-marketing-brand-activation', description: '', image: '' },
  { id: '6a84964a35e452ed1bd9c8d2', categoryId: '6a84960e7003f2bf9724c01c', name: 'Custom T-Shirts & Caps', slug: 'brand-custom-t-shirts-caps', description: '', image: '' },
  { id: '6a84964a35e452ed1bd9c8d3', categoryId: '6a84960e7003f2bf9724c01c', name: 'Custom Paper Bags', slug: 'brand-custom-paper-bags', description: '', image: '' },
  { id: '6a84964a35e452ed1bd9c8d4', categoryId: '6a84960e7003f2bf9724c01c', name: 'Custom Paper Cups', slug: 'brand-custom-paper-cups', description: '', image: '' },
  { id: '6a84964a35e452ed1bd9c8d5', categoryId: '6a84960e7003f2bf9724c01c', name: 'Custom Water Bottle', slug: 'brand-custom-water-bottle', description: '', image: '' },
  { id: '6a84964a35e452ed1bd9c8d6', categoryId: '6a84960e7003f2bf9724c01c', name: 'Table Cover', slug: 'brand-table-cover', description: '', image: '' },
  { id: '6a84964a35e452ed1bd9c8d7', categoryId: '6a84960e7003f2bf9724c01c', name: 'Table Runner', slug: 'brand-table-runner', description: '', image: '' },
  { id: '6a84964a35e452ed1bd9c8d8', categoryId: '6a84960e7003f2bf9724c01c', name: 'Invitation / Welcome / Thank You Letter', slug: 'brand-invitation-welcome-thank-you-letter', description: '', image: '' },
  { id: '6a84964b35e452ed1bd9c8d9', categoryId: '6a84960e7003f2bf9724c01c', name: 'Custom Envelope', slug: 'brand-custom-envelope', description: '', image: '' },
  { id: '6a84964b35e452ed1bd9c8da', categoryId: '6a84960e7003f2bf9724c01c', name: 'Inauguration Stalls', slug: 'brand-inauguration-stalls', description: '', image: '' },
  { id: '6a84964b35e452ed1bd9c8db', categoryId: '6a84960e7003f2bf9724c01c', name: 'Memento', slug: 'brand-memento', description: '', image: '' },
  { id: '6a84964b35e452ed1bd9c8dc', categoryId: '6a84960e7003f2bf9724c01c', name: 'Sound System', slug: 'brand-sound-system', description: '', image: '' },
  { id: '6a84964b35e452ed1bd9c8dd', categoryId: '6a84960e7003f2bf9724c01c', name: 'Management Team', slug: 'brand-management-team', description: '', image: '' },
  { id: '6a84964b35e452ed1bd9c8de', categoryId: '6a84960e7003f2bf9724c01c', name: 'Full Event Management', slug: 'brand-full-event-management', description: '', image: '' },
  // ── All About Business & Office ─────────────────────────────────────────────
  { id: '6a84964b35e452ed1bd9c8df', categoryId: '6a84960e7003f2bf9724c01d', name: 'Visiting Card', slug: 'business-visiting-card', description: '', image: '' },
  { id: '6a84964b35e452ed1bd9c8e0', categoryId: '6a84960e7003f2bf9724c01d', name: 'Letterhead / Letter Card', slug: 'business-letterhead-letter-card', description: '', image: '' },
  { id: '6a84964b35e452ed1bd9c8e1', categoryId: '6a84960e7003f2bf9724c01d', name: 'Bill Book', slug: 'business-bill-book', description: '', image: '' },
  { id: '6a84964b35e452ed1bd9c8e2', categoryId: '6a84960e7003f2bf9724c01d', name: 'Stamps', slug: 'business-stamps', description: '', image: '' },
  { id: '6a84964b35e452ed1bd9c8e3', categoryId: '6a84960e7003f2bf9724c01d', name: 'Diaries', slug: 'business-diaries', description: '', image: '' },
  { id: '6a84964b35e452ed1bd9c8e4', categoryId: '6a84960e7003f2bf9724c01d', name: 'Nameplate', slug: 'business-nameplate', description: '', image: '' },
  { id: '6a84964b35e452ed1bd9c8e5', categoryId: '6a84960e7003f2bf9724c01d', name: 'Sign Board', slug: 'business-sign-board', description: '', image: '' },
  { id: '6a84964b35e452ed1bd9c8e6', categoryId: '6a84960e7003f2bf9724c01d', name: 'Customized Packaging', slug: 'business-customized-packaging', description: '', image: '' },
  { id: '6a84964b35e452ed1bd9c8e7', categoryId: '6a84960e7003f2bf9724c01d', name: 'All Stationery Items', slug: 'business-all-stationery-items', description: '', image: '' },
  // ── Personal Gifts ──────────────────────────────────────────────────────────
  { id: '6a84964b35e452ed1bd9c8e8', categoryId: '6a84960e7003f2bf9724c01e', name: 'Photo Frame', slug: 'personal-photo-frame', description: '', image: '' },
  { id: '6a84964b35e452ed1bd9c8e9', categoryId: '6a84960e7003f2bf9724c01e', name: 'Personalized Mugs', slug: 'personal-personalized-mugs', description: '', image: '' },
  { id: '6a84964b35e452ed1bd9c8ea', categoryId: '6a84960e7003f2bf9724c01e', name: 'Customized Planters', slug: 'personal-customized-planters', description: '', image: '' },
  { id: '6a84964b35e452ed1bd9c8eb', categoryId: '6a84960e7003f2bf9724c01e', name: 'Personalized Diary', slug: 'personal-personalized-diary', description: '', image: '' },
  { id: '6a84964b35e452ed1bd9c8ec', categoryId: '6a84960e7003f2bf9724c01e', name: 'Personalized Notebook', slug: 'personal-personalized-notebook', description: '', image: '' },
  { id: '6a84964b35e452ed1bd9c8ed', categoryId: '6a84960e7003f2bf9724c01e', name: 'Personalized Calendar', slug: 'personal-personalized-calendar', description: '', image: '' },
  { id: '6a84964b35e452ed1bd9c8ee', categoryId: '6a84960e7003f2bf9724c01e', name: 'Cushions', slug: 'personal-cushions', description: '', image: '' },
  { id: '6a84964b35e452ed1bd9c8ef', categoryId: '6a84960e7003f2bf9724c01e', name: 'Customized Bag', slug: 'personal-customized-bag', description: '', image: '' },
  { id: '6a84964b35e452ed1bd9c8f0', categoryId: '6a84960e7003f2bf9724c01e', name: 'T-Shirt', slug: 'personal-t-shirt', description: '', image: '' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-visiting-card-matte',
    categoryId: 'cat-business',
    subcategoryId: 'sub-business-0',
    title: 'Premium Matte Business Cards',
    slug: 'premium-matte-business-cards',
    description: 'High-grade 350 GSM Art Card stock with smooth velvet matte lamination for an executive touch.',
    basePrice: 299, // Base for 100 cards
    pricingType: 'fixed',
    minQuantity: 100,
    quantityPresets: [100, 250, 500, 1000, 2000],
    requirements: {
      requiresArtworkUpload: true,
      requiresCustomDimensions: false,
      variantOptions: [
        {
          name: 'Paper GSM',
          options: [
            { label: '300 GSM Standard', extraPrice: 0 },
            { label: '350 GSM Heavy Premium', extraPrice: 50 },
            { label: '400 GSM Ultra Thick', extraPrice: 120 }
          ],
          defaultOption: '350 GSM Heavy Premium'
        },
        {
          name: 'Lamination',
          options: [
            { label: 'Matte Lamination', extraPrice: 0 },
            { label: 'Gloss Lamination', extraPrice: 0 },
            { label: 'Velvet Touch Soft', extraPrice: 80 }
          ],
          defaultOption: 'Matte Lamination'
        },
        {
          name: 'Corners',
          options: [
            { label: 'Square Cut (Standard)', extraPrice: 0 },
            { label: 'Rounded 4 Corners', extraPrice: 40 }
          ],
          defaultOption: 'Square Cut (Standard)'
        }
      ]
    },
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    badges: ['Best Seller', 'Same Day Dispatch'],
    rating: 4.9,
    reviewsCount: 420,
    turnaroundTime: '24 Hours'
  },
  {
    id: 'prod-flex-banner-outdoor',
    categoryId: 'cat-brand',
    subcategoryId: 'sub-brand-1',
    title: 'HD Flex Banner (1440 DPI Outdoor)',
    slug: 'hd-flex-banner-outdoor',
    description: 'Heavy duty weather-proof PVC flex banner printed with 1440 DPI high definition eco-solvent inks.',
    basePrice: 12, // per sqft
    pricingType: 'per_sqft',
    minQuantity: 1,
    quantityPresets: [1, 2, 5, 10, 20],
    requirements: {
      requiresArtworkUpload: true,
      requiresCustomDimensions: true,
      dimensionUnit: 'ft',
      defaultWidth: 6,
      defaultHeight: 3,
      variantOptions: [
        {
          name: 'Flex Material Quality',
          options: [
            { label: 'Normal Flex (240 GSM)', priceMultiplier: 1.0 },
            { label: 'Star Flex HD (340 GSM)', priceMultiplier: 1.4 },
            { label: 'Backlit Flex (400 GSM)', priceMultiplier: 1.8 }
          ],
          defaultOption: 'Star Flex HD (340 GSM)'
        },
        {
          name: 'Finishing Options',
          options: [
            { label: 'Eyelets (Grommets) on 4 Edges', extraPrice: 0 },
            { label: 'Pockets on Top & Bottom', extraPrice: 0 },
            { label: 'Raw Trim (No Grommets)', extraPrice: 0 }
          ],
          defaultOption: 'Eyelets (Grommets) on 4 Edges'
        }
      ]
    },
    thumbnail: 'https://images.unsplash.com/photo-1542744094-3a3121699479?auto=format&fit=crop&w=800&q=80',
    badges: ['Popular', 'Weather Proof'],
    rating: 4.8,
    reviewsCount: 310,
    turnaroundTime: 'Same Day'
  },
  {
    id: 'prod-rollup-standee',
    categoryId: 'cat-brand',
    subcategoryId: 'sub-brand-6',
    title: 'Aluminum Roll-Up Standee (6ft × 2.5ft)',
    slug: 'aluminum-rollup-standee',
    description: 'Sleek aluminum mechanism with non-curl vinyl graphics. Portable carrying bag included.',
    basePrice: 1250,
    pricingType: 'fixed',
    minQuantity: 1,
    quantityPresets: [1, 2, 5, 10],
    requirements: {
      requiresArtworkUpload: true,
      requiresCustomDimensions: false,
      variantOptions: [
        {
          name: 'Standee Size',
          options: [
            { label: 'Standard 6ft × 2.5ft', extraPrice: 0 },
            { label: 'Large 6ft × 3ft', extraPrice: 250 },
            { label: 'Jumbo 6ft × 4ft', extraPrice: 650 }
          ],
          defaultOption: 'Standard 6ft × 2.5ft'
        },
        {
          name: 'Banner Media',
          options: [
            { label: 'Non-Curl Matte Vinyl', extraPrice: 0 },
            { label: 'HD Glossy Canvas', extraPrice: 150 }
          ],
          defaultOption: 'Non-Curl Matte Vinyl'
        }
      ]
    },
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    badges: ['Best Seller', 'Includes Carry Bag'],
    rating: 4.9,
    reviewsCount: 540,
    turnaroundTime: '24 Hours'
  },
  {
    id: 'prod-promo-table-demo',
    categoryId: 'cat-brand',
    subcategoryId: 'sub-brand-7',
    title: 'Portable Demonstration Promo Table',
    slug: 'portable-promo-table',
    description: 'Foldable counter booth with header banner board and custom vinyl wrap graphics for exhibitions & pop-ups.',
    basePrice: 3499,
    pricingType: 'fixed',
    minQuantity: 1,
    quantityPresets: [1, 2, 5],
    requirements: {
      requiresArtworkUpload: true,
      requiresCustomDimensions: false,
      variantOptions: [
        {
          name: 'Body Material',
          options: [
            { label: 'Heavy Duty PVC Molded', extraPrice: 0 },
            { label: 'Aluminum Frame Premium', extraPrice: 850 }
          ],
          defaultOption: 'Heavy Duty PVC Molded'
        }
      ]
    },
    thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    badges: ['Exhibition Special'],
    rating: 4.7,
    reviewsCount: 185,
    turnaroundTime: '2-3 Days'
  },
  {
    id: 'prod-wedding-card-royal',
    categoryId: 'cat-wedding',
    subcategoryId: 'sub-wedding-0',
    title: 'Royal Metallic Gold Foil Wedding Suite',
    slug: 'royal-gold-foil-wedding-card',
    description: 'Luxury 400 GSM textured card stock with raised gold foil stamping, custom inserts & wax seal envelopes.',
    basePrice: 1499, // Base for 50 cards
    pricingType: 'fixed',
    minQuantity: 50,
    quantityPresets: [50, 100, 200, 500],
    requirements: {
      requiresArtworkUpload: true,
      requiresCustomDimensions: false,
      variantOptions: [
        {
          name: 'Card Inserts',
          options: [
            { label: '2 Inserts (Main + Haldi)', extraPrice: 0 },
            { label: '3 Inserts (Main + Haldi + Reception)', extraPrice: 250 },
            { label: '4 Inserts Full Suite', extraPrice: 450 }
          ],
          defaultOption: '2 Inserts (Main + Haldi)'
        },
        {
          name: 'Foil Color',
          options: [
            { label: 'Royal Metallic Gold', extraPrice: 0 },
            { label: 'Rose Gold Foil', extraPrice: 50 },
            { label: 'Silver Mirror Foil', extraPrice: 0 }
          ],
          defaultOption: 'Royal Metallic Gold'
        }
      ]
    },
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    badges: ['Luxury Suite', 'Free Digital Proof'],
    rating: 5.0,
    reviewsCount: 220,
    turnaroundTime: '3-4 Days'
  },
  {
    id: 'prod-ceramic-photo-mug',
    categoryId: 'cat-personal',
    subcategoryId: 'sub-personal-1',
    title: 'Custom Ceramic Photo Mug (325ml)',
    slug: 'custom-ceramic-photo-mug',
    description: 'Dishwasher & microwave safe grade-A ceramic mug with vibrant edge-to-edge sublimation print.',
    basePrice: 199,
    pricingType: 'fixed',
    minQuantity: 1,
    quantityPresets: [1, 5, 10, 25, 50, 100],
    requirements: {
      requiresArtworkUpload: true,
      requiresCustomDimensions: false,
      variantOptions: [
        {
          name: 'Mug Type',
          options: [
            { label: 'White Classic Ceramic', extraPrice: 0 },
            { label: 'Color Handle & Inner (Black)', extraPrice: 40 },
            { label: 'Color Handle & Inner (Red)', extraPrice: 40 },
            { label: 'Magic Color Changing Mug', extraPrice: 120 }
          ],
          defaultOption: 'White Classic Ceramic'
        }
      ]
    },
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    badges: ['Top Gift Item', 'Microwave Safe'],
    rating: 4.8,
    reviewsCount: 610,
    turnaroundTime: '24 Hours'
  },
  {
    id: 'prod-acrylic-wall-frame',
    categoryId: 'cat-personal',
    subcategoryId: 'sub-personal-0',
    title: 'Frameless Floating Acrylic Photo Print',
    slug: 'frameless-acrylic-photo-print',
    description: '3mm crystal clear acrylic sheet direct UV printed with metal standoff wall mounts for modern home decor.',
    basePrice: 499, // Base for 8x12 in
    pricingType: 'fixed',
    minQuantity: 1,
    quantityPresets: [1, 2, 4, 8],
    requirements: {
      requiresArtworkUpload: true,
      requiresCustomDimensions: false,
      variantOptions: [
        {
          name: 'Frame Size',
          options: [
            { label: '8 × 12 Inches (A4 Size)', extraPrice: 0 },
            { label: '12 × 18 Inches (A3 Size)', extraPrice: 450 },
            { label: '18 × 24 Inches (Statement)', extraPrice: 950 },
            { label: '24 × 36 Inches (Large Gallery)', extraPrice: 1850 }
          ],
          defaultOption: '8 × 12 Inches (A4 Size)'
        },
        {
          name: 'Acrylic Thickness',
          options: [
            { label: '3mm Standard Glass Finish', extraPrice: 0 },
            { label: '5mm Heavy Premium Glass', extraPrice: 200 }
          ],
          defaultOption: '3mm Standard Glass Finish'
        }
      ]
    },
    thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    badges: ['Trending Decor', 'HD UV Print'],
    rating: 4.9,
    reviewsCount: 390,
    turnaroundTime: '2 Days'
  },
  {
    id: 'prod-branded-polo-tshirt',
    categoryId: 'cat-personal',
    subcategoryId: 'sub-personal-8',
    title: 'Custom Embroidered Corporate Polo T-Shirt',
    slug: 'custom-embroidered-polo-tshirt',
    description: '100% Bio-washed combed cotton 230 GSM pique polo shirt with custom chest logo embroidery or DTF print.',
    basePrice: 449,
    pricingType: 'fixed',
    minQuantity: 5,
    quantityPresets: [5, 10, 25, 50, 100],
    requirements: {
      requiresArtworkUpload: true,
      requiresCustomDimensions: false,
      variantOptions: [
        {
          name: 'Branding Style',
          options: [
            { label: 'Chest Embroidered Logo', extraPrice: 0 },
            { label: 'Full Color DTF Print Front & Back', extraPrice: 60 }
          ],
          defaultOption: 'Chest Embroidered Logo'
        },
        {
          name: 'Color',
          options: [
            { label: 'Navy Blue', extraPrice: 0 },
            { label: 'Jet Black', extraPrice: 0 },
            { label: 'Pure White', extraPrice: 0 },
            { label: 'Royal Emerald Green', extraPrice: 0 }
          ],
          defaultOption: 'Navy Blue'
        }
      ]
    },
    thumbnail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    badges: ['Bulk Discount', '100% Cotton'],
    rating: 4.8,
    reviewsCount: 280,
    turnaroundTime: '3-5 Days'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-84920',
    shippingAddress: {
      fullName: 'Rahul Sharma',
      email: 'rahul.sharma@techcorp.in',
      phone: '+91 75950 31319',
      gstin: '07AAAAA1234A1Z5',
      houseNo: 'Suite 402, Cyber Towers',
      streetName: 'Hitec City Main Road',
      area: 'Hyderabad, Telangana',
      pin: '500081'
    },
    items: [
      {
        cartItemId: 'item-1',
        product: MOCK_PRODUCTS[1], // HD Flex Banner
        customDimensions: {
          width: 8,
          height: 4,
          unit: 'ft',
          totalSqFt: 32
        },
        selectedVariants: {
          'Flex Material Quality': 'Star Flex HD (340 GSM)',
          'Finishing Options': 'Eyelets (Grommets) on 4 Edges'
        },
        artworkFile: {
          name: 'Storefront_Banner_Final.pdf',
          size: 4200000,
          type: 'application/pdf',
          previewUrl: 'https://images.unsplash.com/photo-1542744094-3a3121699479?auto=format&fit=crop&w=400&q=80'
        },
        quantity: 2,
        unitPrice: 537.6, // 32 sqft * 12 * 1.4 multiplier
        totalPrice: 1075.2
      }
    ],
    subtotal: 1075.2,
    gstAmount: 193.53,
    shippingFee: 0,
    totalAmount: 1268.73,
    status: 'Printing',
    createdAt: '2026-07-30T14:20:00Z',
    paymentMethod: 'UPI / Online Payment'
  },
  {
    id: 'ORD-73194',
    shippingAddress: {
      fullName: 'Ananya Verma',
      email: 'ananya@designstudio.co',
      phone: '+91 91234 56789',
      houseNo: 'Flat 12B, Rosewood Apartments',
      streetName: 'Indiranagar Main Road',
      area: 'Bengaluru, Karnataka',
      pin: '560038'
    },
    items: [
      {
        cartItemId: 'item-2',
        product: MOCK_PRODUCTS[0], // Visiting cards
        selectedVariants: {
          'Paper GSM': '350 GSM Heavy Premium',
          'Lamination': 'Matte Lamination',
          'Corners': 'Square Cut (Standard)'
        },
        artworkFile: {
          name: 'VisitingCard_Ananya.png',
          size: 1500000,
          type: 'image/png',
          previewUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80'
        },
        quantity: 500,
        unitPrice: 1.25,
        totalPrice: 625.00
      }
    ],
    subtotal: 625.00,
    gstAmount: 112.50,
    shippingFee: 50,
    totalAmount: 787.50,
    status: 'Dispatched',
    createdAt: '2026-07-29T10:15:00Z',
    paymentMethod: 'Credit Card'
  }
];

export const MOCK_FAQS = [
  {
    q: 'What file formats do you accept for custom artwork?',
    a: 'We accept PDF (high-resolution print ready), PNG (transparent minimum 300 DPI), JPG/JPEG, AI, EPS, and PSD files up to 50MB. For best printing quality, convert text to outlines/curves.'
  },
  {
    q: 'How does custom flex banner pricing work?',
    a: 'Flex banners are calculated on a per-square-foot basis (Width in ft × Height in ft). For example, a 6ft × 3ft banner is 18 sq.ft. Multiplied by our base rate per sq.ft. (with media tier multipliers), your live cost updates automatically.'
  },
  {
    q: 'Will I get a digital proof before printing starts?',
    a: 'Yes! Our design team sends a free 2D digital proof via WhatsApp or Email within 2-4 hours of order placement. Printing only starts once you approve the proof.'
  },
  {
    q: 'Do you provide corporate GST invoicing?',
    a: 'Absolutely! Enter your GSTIN during checkout, and a compliant B2B tax invoice with 18% GST input credit will be emailed immediately upon order fulfillment.'
  },
  {
    q: 'What are your turnaround and delivery timelines?',
    a: 'Standard products like Visiting Cards and Roll-up Standees ship within 24 Hours. Flex Banners ordered before 2 PM qualify for Same-Day Dispatch. Express courier delivery takes 1-3 business days across India.'
  }
];

export const MOCK_TESTIMONIALS = [
  {
    id: 't1',
    name: 'Vikram Sethi',
    company: 'Apex Retail Outlets',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'PrinToday delivered 15 Roll-up Standees and Flex Banners for our franchise launch within 24 hours! Crisp 1440 DPI printing quality.'
  },
  {
    id: 't2',
    name: 'Priya Mukherjee',
    company: 'Blossom Weddings & Events',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'The metallic gold foil wedding cards and easel acrylic welcome boards exceeded all expectations. Exceptional craftsmanship!'
  },
  {
    id: 't3',
    name: 'Karan Mehta',
    company: 'TechStart Innovations',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'Smooth ordering workflow! Uploaded our company vectors, received dynamic pricing instantly, and got proper GST invoices for full tax credit.'
  }
];
