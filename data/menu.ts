export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  price?: number | string;
  image?: string;
  category?: string;
  localImage?: any;
};

// Static local image mapping for Expo bundler
const menuImages: Record<string, any> = {
  "Chicken Biryani.jpg": require("../assets/menu/Chicken Biryani.jpg"),
  "Beef Karhai.jpg": require("../assets/menu/Beef Karhai.jpg"),
  "Beef Biryani.jpg": require("../assets/menu/Beef Biryani.jpg"),
  "Chicken Karhai.jpg": require("../assets/menu/Chicken Karhai.jpg"),
  "Tandoori Chicken.jpg": require("../assets/menu/Tandoori Chicken.jpg"),
  "Chicken Seekh Kabab.jpg": require("../assets/menu/Chicken Seekh Kabab.jpg"),
  "Beef Seekh Kabab.jpg": require("../assets/menu/Beef Seekh Kabab.jpg"),
  "Chicken Tikka.jpg": require("../assets/menu/Chicken Tikka.jpg"),
  "Paneer Tikka.jpg": require("../assets/menu/Paneer Tikka.jpg"),
  "Beef Nihari.jpg": require("../assets/menu/Beef Nihari.jpg"),
  "Mutton Karhai.jpg": require("../assets/menu/Mutton Karhai.jpg"),
  "Chicken Achari.jpg": require("../assets/menu/Chicken Achari.jpg"),
  "Samosa.jpg": require("../assets/menu/Samosa.jpg"),
  "Spring Rolls.jpg": require("../assets/menu/Spring Rolls.jpg"),
  "Pani Puri Shots.png": require("../assets/menu/Pani Puri Shots.png"),
  "Chicken 65.jpg": require("../assets/menu/Chicken 65.jpg"),
  "Gulab Jamun.jpg": require("../assets/menu/Gulab Jamun.jpg"),
  "Gajar Halwa.jpg": require("../assets/menu/Gajar Halwa.jpg"),
  "Kheer.png": require("../assets/menu/Kheer.png"),
  "sheer khurma.png": require("../assets/menu/sheer khurma.png"),
};

const menu: MenuItem[] = [
  { id: "m1", name: "Chicken Biryani", desc: "Aromatic rice layered with spiced chicken.", price: "", image: "/images/menu/Chicken Biryani.jpg", localImage: menuImages["Chicken Biryani.jpg"], category: "biryani" },
  { id: "m2", name: "Beef Karhai", desc: "Wok-style beef with tomatoes and spices.", price: "", image: "/images/menu/Beef Karhai.jpg", localImage: menuImages["Beef Karhai.jpg"], category: "curries" },
  { id: "m3", name: "Beef Biryani", desc: "Fragrant rice with tender beef and aromatic spices.", price: "", image: "/images/menu/Beef Biryani.jpg", localImage: menuImages["Beef Biryani.jpg"], category: "biryani" },
  { id: "m4", name: "Chicken Karhai", desc: "Tender chicken cooked in a traditional wok with peppers and onions.", price: "", image: "/images/menu/Chicken Karhai.jpg", localImage: menuImages["Chicken Karhai.jpg"], category: "curries" },
  { id: "m5", name: "Tandoori Chicken", desc: "Marinated chicken grilled in traditional clay oven.", price: "", image: "/images/menu/Tandoori Chicken.jpg", localImage: menuImages["Tandoori Chicken.jpg"], category: "grilled" },
  { id: "m6", name: "Chicken Seekh Kabab", desc: "Ground chicken mixed with spices and grilled on skewer.", price: "", image: "/images/menu/Chicken Seekh Kabab.jpg", localImage: menuImages["Chicken Seekh Kabab.jpg"], category: "grilled" },
  { id: "m7", name: "Beef Seekh Kabab", desc: "Spiced ground beef kabab grilled to perfection.", price: "", image: "/images/menu/Beef Seekh Kabab.jpg", localImage: menuImages["Beef Seekh Kabab.jpg"], category: "grilled" },
  { id: "m8", name: "Chicken Tikka", desc: "Marinated chicken pieces cooked in tandoor.", price: "", image: "/images/menu/Chicken Tikka.jpg", localImage: menuImages["Chicken Tikka.jpg"], category: "grilled" },
  { id: "m9", name: "Paneer Tikka", desc: "Indian cheese cubes marinated and grilled.", price: "", image: "/images/menu/Paneer Tikka.jpg", localImage: menuImages["Paneer Tikka.jpg"], category: "vegetarian" },
  { id: "m10", name: "Beef Nihari", desc: "Slow-cooked beef in rich, aromatic gravy.", price: "", image: "/images/menu/Beef Nihari.jpg", localImage: menuImages["Beef Nihari.jpg"], category: "curries" },
  { id: "m11", name: "Mutton Karhai", desc: "Tender mutton cooked in traditional wok style.", price: "", image: "/images/menu/Mutton Karhai.jpg", localImage: menuImages["Mutton Karhai.jpg"], category: "curries" },
  { id: "m12", name: "Chicken Biryani", desc: "Fragrant basmati rice with tender chicken.", price: "", image: "/images/menu/Chicken Achari.jpg", localImage: menuImages["Chicken Achari.jpg"], category: "curries" },
  { id: "m13", name: "Samosa", desc: "Crispy pastry filled with spiced potatoes and peas.", price: "", image: "/images/menu/Samosa.jpg", localImage: menuImages["Samosa.jpg"], category: "appetizers" },
  { id: "m14", name: "Spring Rolls", desc: "Crispy spring rolls with vegetable filling.", price: "", image: "/images/menu/Spring Rolls.jpg", localImage: menuImages["Spring Rolls.jpg"], category: "appetizers" },
  { id: "m15", name: "Pani Puri Shots", desc: "Traditional street food snack in convenient shots.", price: "", image: "/images/menu/Pani Puri Shots.png", localImage: menuImages["Pani Puri Shots.png"], category: "appetizers" },
  { id: "m16", name: "Chicken 65", desc: "Spicy fried chicken pieces with curry leaves.", price: "", image: "/images/menu/Chicken 65.jpg", localImage: menuImages["Chicken 65.jpg"], category: "appetizers" },
  { id: "m17", name: "Gulab Jamun", desc: "Sweet milk solids dumplings in sugar syrup.", price: "", image: "/images/menu/Gulab Jamun.jpg", localImage: menuImages["Gulab Jamun.jpg"], category: "desserts" },
  { id: "m18", name: "Gajar Halwa", desc: "Sweet carrot pudding with nuts and dates.", price: "", image: "/images/menu/Gajar Halwa.jpg", localImage: menuImages["Gajar Halwa.jpg"], category: "desserts" },
  { id: "m19", name: "Kheer", desc: "Traditional rice pudding with condensed milk and nuts.", price: "", image: "/images/menu/Kheer.png", localImage: menuImages["Kheer.png"], category: "desserts" },
  { id: "m20", name: "Sheer Khurma", desc: "Vermicelli dessert with milk and dried fruits.", price: "", image: "/images/menu/sheer khurma.png", localImage: menuImages["sheer khurma.png"], category: "desserts" },
];

export default menu;
