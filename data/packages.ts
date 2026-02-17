export type Package = {
  id: string;
  name: string;
  priceNote: string;
  appetizers: string[];
  mains: string[];
  dessertsRegular: string[];
  dessertsPremium: string[];
  note?: string;
};

const packages: Package[] = [
  {
    id: "pkg-custom",
    name: "Customizable Package",
    priceNote: "Pick items + set headcount",
    appetizers: ["Choose any 3 appetizers from the menu"],
    mains: ["Choose 4-6 mains from the menu"],
    dessertsRegular: ["Pick 1 regular dessert"],
    dessertsPremium: ["Pick 1 premium dessert"],
    note: "Tell us your headcount and we will tailor quantities and pricing.",
  },
  {
    id: "pkg-a",
    name: "Package A",
    priceNote: "200+ ppl",
    appetizers: ["Punjabi Samosa", "Papri chaat", "Chicken 65"],
    mains: [
      "Chicken biryani",
      "Goat bhuna",
      "Beef Nihari",
      "Palak paneer",
      "Tandoori Chicken + Chicken seekh kabab",
      "Tandoori Naan",
      "Salad",
      "Raita",
      "Chutney",
    ],
    dessertsRegular: ["Kheer"],
    dessertsPremium: ["Shahi Tukray"],
  },
  {
    id: "pkg-b",
    name: "Package B",
    priceNote: "200+ ppl",
    appetizers: ["Pani puri Shots", "Papri chaat", "Chilli Chicken (Dry)"],
    mains: [
      "Goat Pulao",
      "Chicken tikka masala",
      "Beef karahi",
      "Bagare Baigan",
      "Chicken -65",
      "Tandoori Naan",
      "Salad",
      "Raita",
      "Chutney",
    ],
    dessertsRegular: ["Fruit Custard"],
    dessertsPremium: ["Rasmalai"],
  },
  {
    id: "pkg-c",
    name: "Package C",
    priceNote: "200+ ppl",
    appetizers: ["Vege spring rolls", "Dahi Baray", "Shami Bun kabab"],
    mains: [
      "Beef pulao",
      "Chicken achari",
      "Goat karahi",
      "Karahi pakora",
      "Chatpata tikka + Beef seekh kabab",
      "Tandoori Naan",
      "Salad",
      "Raita",
      "Chutney",
    ],
    dessertsRegular: ["Gulab jamun"],
    dessertsPremium: ["Gajar Halwa"],
  },
  {
    id: "pkg-d",
    name: "Package D",
    priceNote: "200+ ppl",
    appetizers: ["Papri chaat", "Aloo Tikki bun kabab", "Chicken Manchurian (DRY)"],
    mains: [
      "Goat Biryani",
      "Chicken karahi",
      "Beef korma",
      "Paneer tikka masala",
      "Tandoori Chicken + Beef chapli kabab",
      "Tandoori Naan",
      "Salad",
      "Raita",
      "Chutney",
    ],
    dessertsRegular: ["Sewaiyan"],
    dessertsPremium: ["Zarda"],
  },
];

export default packages;
