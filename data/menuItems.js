export const MENU_CATEGORIES = [
  'All',
  'Biryani',
  'Curries',
  'Grilled',
  'Vegetarian',
  'Appetizers',
  'Desserts',
];

export const MENU_IMAGE_MAP = {
  chicken_biryani: require('../assets/menu_optimized/chicken_biryani.jpg'),
  beef_biryani: require('../assets/menu_optimized/beef_biryani.jpg'),
  mutton_karhai: require('../assets/menu_optimized/mutton_karhai.jpg'),
  chicken_karhai: require('../assets/menu_optimized/chicken_karhai.jpg'),
  beef_nihari: require('../assets/menu_optimized/beef_nihari.jpg'),
  chicken_seekh_kabab: require('../assets/menu_optimized/chicken_seekh_kabab.jpg'),
  beef_seekh_kabab: require('../assets/menu_optimized/beef_seekh_kabab.jpg'),
  chicken_tikka: require('../assets/menu_optimized/chicken_tikka.jpg'),
  paneer_tikka: require('../assets/menu_optimized/paneer_tikka.jpg'),
  aloo_paratha: require('../assets/menu_optimized/aloo_paratha.jpg'),
  samosa: require('../assets/menu_optimized/samosa.jpg'),
  spring_rolls: require('../assets/menu_optimized/spring_rolls.jpg'),
  pani_puri_shots: require('../assets/menu_optimized/pani_puri_shots.png'),
  chicken_65: require('../assets/menu_optimized/chicken_65.jpg'),
  gulab_jamun: require('../assets/menu_optimized/gulab_jamun.jpg'),
  gajar_halwa: require('../assets/menu_optimized/gajar_halwa.jpg'),
};

export const MENU_ITEMS = [
  {
    id: 'm-1',
    imageKey: 'chicken_biryani',
    name: 'Chicken Biryani',
    category: 'Biryani',
    description: 'Fragrant basmati rice layered with spiced chicken.',
    priceLabel: 'Contact for pricing',
    image: MENU_IMAGE_MAP.chicken_biryani,
  },
  {
    id: 'm-2',
    imageKey: 'beef_biryani',
    name: 'Beef Biryani',
    category: 'Biryani',
    description: 'Aromatic beef biryani with bold South Asian spices.',
    priceLabel: 'Contact for pricing',
    image: MENU_IMAGE_MAP.beef_biryani,
  },
  {
    id: 'm-3',
    imageKey: 'mutton_karhai',
    name: 'Mutton Karhai',
    category: 'Curries',
    description: 'Traditional wok-cooked mutton curry with rich gravy.',
    priceLabel: 'Contact for pricing',
    image: MENU_IMAGE_MAP.mutton_karhai,
  },
  {
    id: 'm-4',
    imageKey: 'chicken_karhai',
    name: 'Chicken Karhai',
    category: 'Curries',
    description: 'Classic karhai made with tomatoes, ginger, and chilies.',
    priceLabel: 'Contact for pricing',
    image: MENU_IMAGE_MAP.chicken_karhai,
  },
  {
    id: 'm-5',
    imageKey: 'beef_nihari',
    name: 'Beef Nihari',
    category: 'Curries',
    description: 'Slow-cooked beef stew with deep, aromatic flavor.',
    priceLabel: 'Contact for pricing',
    image: MENU_IMAGE_MAP.beef_nihari,
  },
  {
    id: 'm-6',
    imageKey: 'chicken_seekh_kabab',
    name: 'Chicken Seekh Kabab',
    category: 'Grilled',
    description: 'Ground chicken kababs grilled over open flame.',
    priceLabel: 'Contact for pricing',
    image: MENU_IMAGE_MAP.chicken_seekh_kabab,
  },
  {
    id: 'm-7',
    imageKey: 'beef_seekh_kabab',
    name: 'Beef Seekh Kabab',
    category: 'Grilled',
    description: 'Juicy beef skewers with authentic spice blend.',
    priceLabel: 'Contact for pricing',
    image: MENU_IMAGE_MAP.beef_seekh_kabab,
  },
  {
    id: 'm-8',
    imageKey: 'chicken_tikka',
    name: 'Chicken Tikka',
    category: 'Grilled',
    description: 'Smoky, marinated chicken grilled to charred perfection.',
    priceLabel: 'Contact for pricing',
    image: MENU_IMAGE_MAP.chicken_tikka,
  },
  {
    id: 'm-9',
    imageKey: 'paneer_tikka',
    name: 'Paneer Tikka',
    category: 'Vegetarian',
    description: 'Spiced paneer cubes grilled with peppers and onions.',
    priceLabel: 'Contact for pricing',
    image: MENU_IMAGE_MAP.paneer_tikka,
  },
  {
    id: 'm-10',
    imageKey: 'aloo_paratha',
    name: 'Aloo Paratha',
    category: 'Vegetarian',
    description: 'Stuffed flatbread served with yogurt and chutney.',
    priceLabel: 'Contact for pricing',
    image: MENU_IMAGE_MAP.aloo_paratha,
  },
  {
    id: 'm-11',
    imageKey: 'samosa',
    name: 'Samosa',
    category: 'Appetizers',
    description: 'Crispy pastry pockets with spiced potato filling.',
    priceLabel: 'Contact for pricing',
    image: MENU_IMAGE_MAP.samosa,
  },
  {
    id: 'm-12',
    imageKey: 'spring_rolls',
    name: 'Spring Rolls',
    category: 'Appetizers',
    description: 'Crunchy rolls with savory vegetable stuffing.',
    priceLabel: 'Contact for pricing',
    image: MENU_IMAGE_MAP.spring_rolls,
  },
  {
    id: 'm-13',
    imageKey: 'pani_puri_shots',
    name: 'Pani Puri Shots',
    category: 'Appetizers',
    description: 'Street-style pani puri served as bite-size shots.',
    priceLabel: 'Contact for pricing',
    image: MENU_IMAGE_MAP.pani_puri_shots,
  },
  {
    id: 'm-14',
    imageKey: 'chicken_65',
    name: 'Chicken 65',
    category: 'Appetizers',
    description: 'Spicy and crispy fried chicken with curry leaf aroma.',
    priceLabel: 'Contact for pricing',
    image: MENU_IMAGE_MAP.chicken_65,
  },
  {
    id: 'm-15',
    imageKey: 'gulab_jamun',
    name: 'Gulab Jamun',
    category: 'Desserts',
    description: 'Soft milk dumplings soaked in cardamom syrup.',
    priceLabel: 'Contact for pricing',
    image: MENU_IMAGE_MAP.gulab_jamun,
  },
  {
    id: 'm-16',
    imageKey: 'gajar_halwa',
    name: 'Gajar Halwa',
    category: 'Desserts',
    description: 'Rich carrot pudding with nuts and khoya.',
    priceLabel: 'Contact for pricing',
    image: MENU_IMAGE_MAP.gajar_halwa,
  },
];

const IMAGE_KEY_BY_NAME = MENU_ITEMS.reduce((acc, item) => {
  acc[item.name.toLowerCase()] = item.imageKey;
  return acc;
}, {});

const IMAGE_KEY_BY_LEGACY_FILE = {
  'chicken biryani.jpg': 'chicken_biryani',
  'beef biryani.jpg': 'beef_biryani',
  'mutton karhai.jpg': 'mutton_karhai',
  'chicken karhai.jpg': 'chicken_karhai',
  'beef nihari.jpg': 'beef_nihari',
  'chicken seekh kabab.jpg': 'chicken_seekh_kabab',
  'beef seekh kabab.jpg': 'beef_seekh_kabab',
  'chicken tikka.jpg': 'chicken_tikka',
  'paneer tikka.jpg': 'paneer_tikka',
  'samosa.jpg': 'samosa',
  'spring rolls.jpg': 'spring_rolls',
  'pani puri shots.png': 'pani_puri_shots',
  'chicken 65.jpg': 'chicken_65',
  'gulab jamun.jpg': 'gulab_jamun',
  'gajar halwa.jpg': 'gajar_halwa',
};

function normalizeImageKey(value) {
  if (!value || typeof value !== 'string') {
    return null;
  }

  return value.trim().toLowerCase().replace(/[\s-]+/g, '_');
}

export function resolveMenuImageKey({ imageKey, name, legacyImagePath }) {
  const normalizedImageKey = normalizeImageKey(imageKey);
  if (normalizedImageKey && MENU_IMAGE_MAP[normalizedImageKey]) {
    return normalizedImageKey;
  }

  if (name) {
    const fromName = IMAGE_KEY_BY_NAME[name.trim().toLowerCase()];
    if (fromName && MENU_IMAGE_MAP[fromName]) {
      return fromName;
    }
  }

  if (legacyImagePath && typeof legacyImagePath === 'string') {
    const decoded = decodeURIComponent(legacyImagePath).toLowerCase();
    const fileName = decoded.split('/').pop();
    const fromLegacy = IMAGE_KEY_BY_LEGACY_FILE[fileName];
    if (fromLegacy && MENU_IMAGE_MAP[fromLegacy]) {
      return fromLegacy;
    }
  }

  return null;
}

export function resolveMenuImage(imageKey, name, fallbackImage) {
  const normalizedImageKey = normalizeImageKey(imageKey);
  if (normalizedImageKey && MENU_IMAGE_MAP[normalizedImageKey]) {
    return MENU_IMAGE_MAP[normalizedImageKey];
  }

  const fromName = name ? IMAGE_KEY_BY_NAME[name.trim().toLowerCase()] : null;
  if (fromName && MENU_IMAGE_MAP[fromName]) {
    return MENU_IMAGE_MAP[fromName];
  }

  return fallbackImage || MENU_ITEMS[0]?.image;
}
