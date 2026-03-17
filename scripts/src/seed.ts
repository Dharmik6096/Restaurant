import { db, usersTable, menuItemsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seed() {
  // Create admin user
  const existingAdmin = await db.select().from(usersTable).where(eq(usersTable.email, "admin@kalapi.com"));
  if (existingAdmin.length === 0) {
    const hashed = await bcrypt.hash("admin123", 10);
    await db.insert(usersTable).values({ name: "Admin", email: "admin@kalapi.com", password: hashed, role: "admin" });
    console.log("Admin user created: admin@kalapi.com / admin123");
  } else {
    console.log("Admin already exists");
  }

  // Seed menu items
  const existingMenu = await db.select().from(menuItemsTable);
  if (existingMenu.length === 0) {
    const menuData = [
      { name: "Paneer Tikka", description: "Marinated cottage cheese cubes grilled to perfection with spices", price: 280, category: "Starters", image: "/images/dish-pasta.png", isVeg: true, isAvailable: true, isFeatured: false, rating: 4.5 },
      { name: "Hara Bhara Kabab", description: "Crispy spinach and pea patties with mint chutney", price: 220, category: "Starters", image: "/images/dish-pizza.png", isVeg: true, isAvailable: true, isFeatured: false, rating: 4.3 },
      { name: "Mushroom Crispy", description: "Battered and fried mushrooms tossed in tangy sauce", price: 240, category: "Starters", image: "/images/dish-dessert.png", isVeg: true, isAvailable: true, isFeatured: false, rating: 4.2 },
      { name: "Tomato Basil Soup", description: "Velvety roasted tomato soup with fresh basil and cream", price: 160, category: "Soups", image: "/images/dish-dal.png", isVeg: true, isAvailable: true, isFeatured: false, rating: 4.4 },
      { name: "Sweet Corn Soup", description: "Delicate sweet corn soup with vegetables and ginger", price: 150, category: "Soups", image: "/images/dish-pasta.png", isVeg: true, isAvailable: true, isFeatured: false, rating: 4.1 },
      { name: "Shahi Paneer", description: "Rich paneer curry in a creamy tomato-cashew gravy", price: 320, category: "Main Course", image: "/images/dish-dal.png", isVeg: true, isAvailable: true, isFeatured: true, rating: 4.7 },
      { name: "Dal Makhani", description: "Slow-cooked black lentils in a rich buttery sauce overnight", price: 280, category: "Main Course", image: "/images/dish-dal.png", isVeg: true, isAvailable: true, isFeatured: true, rating: 4.8 },
      { name: "Palak Kofta", description: "Spinach dumplings in a luscious spiced gravy", price: 300, category: "Main Course", image: "/images/dish-pasta.png", isVeg: true, isAvailable: true, isFeatured: false, rating: 4.3 },
      { name: "Vegetable Dum Biryani", description: "Aromatic basmati rice layered with garden vegetables", price: 340, category: "Biryani", image: "/images/dish-pizza.png", isVeg: true, isAvailable: true, isFeatured: true, rating: 4.6 },
      { name: "Paneer Biryani", description: "Fragrant biryani with marinated paneer and whole spices", price: 380, category: "Biryani", image: "/images/dish-pasta.png", isVeg: true, isAvailable: true, isFeatured: false, rating: 4.5 },
      { name: "Royal Thali", description: "Complete meal with roti, dal, sabzi, rice, raita and dessert", price: 499, category: "Combos", image: "/images/dish-dal.png", isVeg: true, isAvailable: true, isFeatured: true, rating: 4.7 },
      { name: "Mini Combo Meal", description: "2 rotis, 1 sabzi, dal, rice and salad", price: 299, category: "Combos", image: "/images/dish-pizza.png", isVeg: true, isAvailable: true, isFeatured: false, rating: 4.4 },
      { name: "Chole Bhature", description: "Fluffy bhature with spicy chickpea curry", price: 180, category: "Mini Meals", image: "/images/dish-pasta.png", isVeg: true, isAvailable: true, isFeatured: false, rating: 4.5 },
      { name: "Pav Bhaji", description: "Mumbai-style spiced vegetable mash with butter pav", price: 160, category: "Mini Meals", image: "/images/dish-pizza.png", isVeg: true, isAvailable: true, isFeatured: false, rating: 4.3 },
      { name: "Charcoal Pizza", description: "Black charcoal base with triple cheese, jalapenos and olives", price: 420, category: "Pizza & Pasta", image: "/images/dish-pizza.png", isVeg: true, isAvailable: true, isFeatured: true, rating: 4.6 },
      { name: "Stuffed Pasta", description: "Giant pasta shells stuffed with ricotta, spinach and herbs", price: 380, category: "Pizza & Pasta", image: "/images/dish-pasta.png", isVeg: true, isAvailable: true, isFeatured: true, rating: 4.5 },
      { name: "Pesto Linguine", description: "Handmade pasta in basil pesto with pine nuts and parmesan", price: 360, category: "Pizza & Pasta", image: "/images/dish-pasta.png", isVeg: true, isAvailable: true, isFeatured: false, rating: 4.4 },
      { name: "Jeera Rice", description: "Fragrant basmati rice tempered with cumin", price: 140, category: "Rice & Dal", image: "/images/dish-dal.png", isVeg: true, isAvailable: true, isFeatured: false, rating: 4.2 },
      { name: "Yellow Dal Tadka", description: "Lentils tempered with ghee, cumin and dried chillies", price: 180, category: "Rice & Dal", image: "/images/dish-dal.png", isVeg: true, isAvailable: true, isFeatured: false, rating: 4.5 },
      { name: "Butter Naan", description: "Soft leavened bread from tandoor slathered with butter", price: 60, category: "Breads", image: "/images/dish-pasta.png", isVeg: true, isAvailable: true, isFeatured: false, rating: 4.3 },
      { name: "Garlic Kulcha", description: "Fluffy kulcha stuffed with garlic and herbs", price: 80, category: "Breads", image: "/images/dish-pizza.png", isVeg: true, isAvailable: true, isFeatured: false, rating: 4.4 },
      { name: "Mango Lassi", description: "Thick chilled yoghurt drink blended with Alphonso mangoes", price: 120, category: "Beverages", image: "/images/dish-dessert.png", isVeg: true, isAvailable: true, isFeatured: false, rating: 4.6 },
      { name: "Masala Chaas", description: "Spiced buttermilk with cumin, ginger and mint", price: 80, category: "Beverages", image: "/images/dish-dal.png", isVeg: true, isAvailable: true, isFeatured: false, rating: 4.4 },
      { name: "Chocolate Explosion", description: "Decadent molten chocolate cake with ice cream and fudge", price: 280, category: "Beverages", image: "/images/dish-dessert.png", isVeg: true, isAvailable: true, isFeatured: true, rating: 4.9 },
    ];
    await db.insert(menuItemsTable).values(menuData as any);
    console.log(`Seeded ${menuData.length} menu items`);
  } else {
    console.log(`Menu already has ${existingMenu.length} items`);
  }
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
