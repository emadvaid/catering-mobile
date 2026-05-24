import { MENU_CATEGORIES, MENU_ITEMS, resolveMenuImage, resolveMenuImageKey } from '../data/menuItems';
import { PACKAGE_CARDS } from '../data/packages';

function parseNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseOrder(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isActive(item) {
  return item?.active !== false;
}

function normalizeRemoteImageUrl(value) {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  if (!trimmed || !/^https?:\/\//i.test(trimmed)) {
    return null;
  }

  return trimmed;
}

function sortByOrderThenName(a, b) {
  const orderDiff = parseOrder(a.order, 9999) - parseOrder(b.order, 9999);
  if (orderDiff !== 0) {
    return orderDiff;
  }

  return (a.name || '').localeCompare(b.name || '');
}

function findFallbackMenuImageByName(name) {
  const normalizedName = (name || '').trim().toLowerCase();
  if (!normalizedName) {
    return null;
  }

  return fallbackMenuItemsByName.get(normalizedName)?.image || null;
}

function uniqueByIdOrName(items) {
  const seen = new Set();

  return items.filter((item) => {
    const key = (item.id || item.name || '').toString().trim().toLowerCase();
    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

const fallbackMenuItemsByName = new Map(
  MENU_ITEMS.map((item) => [(item.name || '').trim().toLowerCase(), item])
);

export function normalizeMenuItems(sourceItems, fallbackItems = MENU_ITEMS) {
  const usingRemote = Array.isArray(sourceItems) && sourceItems.length > 0;
  const items = usingRemote ? sourceItems : fallbackItems;

  return uniqueByIdOrName(
    items
      .filter(isActive)
      .map((item, index) => {
        const itemName = (item.name || item.title || `Menu Item ${index + 1}`).trim();
        const imageKey = resolveMenuImageKey({
          imageKey: item.imageKey || null,
          name: itemName,
          legacyImagePath: item.image || item.imagePath || '',
        });
        const fallbackImage =
          typeof item.image === 'number'
            ? item.image
            : findFallbackMenuImageByName(itemName) ||
                (imageKey ? resolveMenuImage(imageKey, itemName, null) : null) ||
                (!usingRemote && typeof fallbackItems[index]?.image === 'number'
                  ? fallbackItems[index].image
                  : null) ||
                MENU_ITEMS[0]?.image;

        return {
          id: item.id || `menu-${index}`,
          name: itemName,
          category: item.category || 'All',
          description: item.description || 'Contact us for more details.',
          price: parseNumber(item.price, 0),
          priceLabel: item.priceLabel || 'Contact for pricing',
          imageKey,
          imageUrl: normalizeRemoteImageUrl(item.imageUrl),
          image: fallbackImage,
          order: parseOrder(item.order, index + 1),
          active: item.active !== false,
        };
      })
  ).sort(sortByOrderThenName);
}

export function getMenuImageSource(item) {
  if (item?.imageUrl) {
    return { uri: item.imageUrl };
  }

  if (typeof item?.image === 'number') {
    return item.image;
  }

  return resolveMenuImage(item?.imageKey || null, item?.name || '', MENU_ITEMS[0]?.image);
}

export function getMenuCategories(items) {
  const categories = new Set(['All']);

  MENU_CATEGORIES.filter((category) => category !== 'All').forEach((category) => {
    if (items.some((item) => item.category === category)) {
      categories.add(category);
    }
  });

  items.forEach((item) => {
    if (item.category && item.category !== 'All') {
      categories.add(item.category);
    }
  });

  return Array.from(categories);
}

export function formatGuestsLabel(value) {
  const raw = (value || '').toString().trim();
  if (!raw) {
    return '200+ ppl';
  }

  if (/\b(ppl|people|guests?)\b/i.test(raw)) {
    return raw;
  }

  if (/^\d+\+?$/.test(raw)) {
    return `${raw} ppl`;
  }

  return raw;
}

export function formatList(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return ['Contact us for options'];
  }

  return items.filter((item) => typeof item === 'string' && item.trim()).map((item) => item.trim());
}

export function normalizePackages(sourcePackages, fallbackPackages = PACKAGE_CARDS) {
  const usingRemote = Array.isArray(sourcePackages) && sourcePackages.length > 0;
  const packages = usingRemote ? sourcePackages : fallbackPackages;

  return uniqueByIdOrName(
    packages
      .filter(isActive)
      .map((pkg, index) => ({
        id: pkg.id || `pkg-${index}`,
        order: parseOrder(pkg.order, index + 1),
        name: (pkg.name || `Package ${index + 1}`).trim(),
        badge: pkg.badge || 'Large events',
        guests: formatGuestsLabel(pkg.guests),
        appetizers: formatList(pkg.appetizers),
        mains: formatList(pkg.mains),
        regularDessert: formatList(pkg.regularDessert),
        premiumDessert: formatList(pkg.premiumDessert),
        imageKey: pkg.imageKey || null,
        imagePath: pkg.imagePath || pkg.image || null,
        headerImageUrl: normalizeRemoteImageUrl(pkg.headerImageUrl),
        active: pkg.active !== false,
      }))
  ).sort(sortByOrderThenName);
}

export function pickHighlightDish(pkg) {
  const firstMain = Array.isArray(pkg?.mains) && pkg.mains.length > 0 ? pkg.mains[0] : '';
  const firstAppetizer =
    Array.isArray(pkg?.appetizers) && pkg.appetizers.length > 0 ? pkg.appetizers[0] : '';
  return firstMain || firstAppetizer || pkg?.name || 'Catering package';
}

export function getPackageImageSource(pkg, packageHeaderImages = {}) {
  if (pkg?.headerImageUrl) {
    return { uri: pkg.headerImageUrl };
  }

  const directMatch = packageHeaderImages[pkg?.id];
  if (directMatch) {
    return directMatch;
  }

  const fromOrder = packageHeaderImages[`pkg-${String.fromCharCode(96 + Number(pkg?.order || 0))}`];
  if (fromOrder) {
    return fromOrder;
  }

  const highlight = pickHighlightDish(pkg);
  const imageKey = resolveMenuImageKey({
    imageKey: pkg?.imageKey || null,
    name: highlight,
    legacyImagePath: pkg?.imagePath || '',
  });
  return resolveMenuImage(imageKey, highlight, MENU_ITEMS[0]?.image);
}
