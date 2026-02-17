export type Caterer = {
  id: string;
  name: string;
  desc: string;
  image: string;
  href?: string;
  rating?: string;
  distance?: string;
  deliveryFee?: string;
  categories?: string[];
};

const caterers: Caterer[] = [
  {
    id: "pakistani-1",
    name: "Karahi & Kebab Pakistani Catering",
    desc: "Traditional Pakistani dishes: biryani, karahi, kebabs, and chutneys.",
    image:
      "https://images.unsplash.com/photo-1604908177079-3a79b4f0c9d6?w=1200&q=80&auto=format&fit=crop",
    href: "/pakistani",
    rating: "4.9",
    distance: "0.6 mi",
    deliveryFee: "$30+",
    categories: ["Pakistani", "BBQ", "Halal"],
  },
  {
    id: "veg-1",
    name: "Green Garden Catering",
    desc: "Fresh salads, vegetarian entrees, and seasonal sides.",
    image:
      "https://images.unsplash.com/photo-1546069901-eacef0df6022?w=1200&q=80&auto=format&fit=crop",
    rating: "4.7",
    distance: "1.2 mi",
    deliveryFee: "$25+",
    categories: ["Vegetarian", "Healthy"],
  },
  {
    id: "pizza-1",
    name: "Fiesta Pizza Co.",
    desc: "Wood-fired pizzas and party platters.",
    image:
      "https://images.unsplash.com/photo-1548365328-9f6e26e7c8f6?w=1200&q=80&auto=format&fit=crop",
    rating: "4.8",
    distance: "2.1 mi",
    deliveryFee: "$15+",
    categories: ["Pizza"],
  },
  {
    id: "bbq-1",
    name: "Smoky Mountain BBQ",
    desc: "Slow-cooked brisket, pulled pork, and classic sides.",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80&auto=format&fit=crop",
    rating: "4.6",
    distance: "3.3 mi",
    deliveryFee: "$35+",
    categories: ["BBQ"],
  },
];

export default caterers;
