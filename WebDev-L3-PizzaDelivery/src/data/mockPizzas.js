export const MOCK_PIZZAS = [
  {
    id: 'pizza-1',
    name: 'Truffle Mushroom Crave',
    tagline: 'Earthy Wild Mushrooms & Black Truffle Glaze',
    category: 'Signature',
    price: 18.99,
    rating: 4.9,
    reviewsCount: 342,
    prepTime: '15-20 min',
    calories: '890 kcal',
    isPopular: true,
    isNew: false,
    dietary: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    description: 'Fresh wild oyster & cremini mushrooms over creamy garlic parmesan base, finished with white truffle oil drizzle and fresh thyme.',
    ingredients: ['Oyster Mushrooms', 'Cremini Mushrooms', 'Garlic Cream', 'Mozzarella', 'Truffle Glaze', 'Thyme'],
    sizes: [
      { name: 'Personal (8")', multiplier: 0.8 },
      { name: 'Medium (12")', multiplier: 1.0 },
      { name: 'Large (16")', multiplier: 1.35 }
    ]
  },
  {
    id: 'pizza-2',
    name: 'Spicy Artisanal Pepperoni',
    tagline: 'Double Aged Pepperoni & Hot Honey Drizzle',
    category: 'Meat Lovers',
    price: 17.49,
    rating: 4.95,
    reviewsCount: 512,
    prepTime: '12-18 min',
    calories: '1050 kcal',
    isPopular: true,
    isNew: false,
    dietary: ['Spicy'],
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    description: 'Crispy cup-and-char pepperoni with house San Marzano sauce, fresh mozzarella, calabrian chilies, and sweet hot honey drip.',
    ingredients: ['Cup & Char Pepperoni', 'San Marzano Tomato', 'Mozzarella', 'Calabrian Chili', 'Hot Honey'],
    sizes: [
      { name: 'Personal (8")', multiplier: 0.8 },
      { name: 'Medium (12")', multiplier: 1.0 },
      { name: 'Large (16")', multiplier: 1.35 }
    ]
  },
  {
    id: 'pizza-3',
    name: 'Smoked Burrata Margherita',
    tagline: 'Creamy Burrata Ball & Sweet Basil Oil',
    category: 'Signature',
    price: 19.50,
    rating: 4.88,
    reviewsCount: 210,
    prepTime: '14-18 min',
    calories: '820 kcal',
    isPopular: false,
    isNew: true,
    dietary: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    description: 'Slow-roasted cherry tomatoes, extra virgin olive oil, and a crown of fresh whole burrata cheese broken open before serving.',
    ingredients: ['Burrata Cheese', 'Roasted Tomatoes', 'Fresh Basil', 'San Marzano Sauce', 'EVOO'],
    sizes: [
      { name: 'Personal (8")', multiplier: 0.8 },
      { name: 'Medium (12")', multiplier: 1.0 },
      { name: 'Large (16")', multiplier: 1.35 }
    ]
  },
  {
    id: 'pizza-4',
    name: 'Fire-Roasted Garden Supreme',
    tagline: 'Charred Peppers, Artichoke & Spinach Pestos',
    category: 'Veggie',
    price: 16.99,
    rating: 4.78,
    reviewsCount: 185,
    prepTime: '15-20 min',
    calories: '760 kcal',
    isPopular: false,
    isNew: false,
    dietary: ['Vegetarian', 'Vegan-Available'],
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    description: 'Roasted bell peppers, marinated artichoke hearts, kalamata olives, red onion, baby spinach, and house basil pesto base.',
    ingredients: ['Artichoke Hearts', 'Bell Peppers', 'Kalamata Olives', 'Red Onion', 'Spinach', 'Pesto'],
    sizes: [
      { name: 'Personal (8")', multiplier: 0.8 },
      { name: 'Medium (12")', multiplier: 1.0 },
      { name: 'Large (16")', multiplier: 1.35 }
    ]
  },
  {
    id: 'pizza-5',
    name: 'Bourbon BBQ Chicken',
    tagline: 'Smokey BBQ Glaze, Charred Chicken & Cilantro',
    category: 'Meat Lovers',
    price: 18.25,
    rating: 4.85,
    reviewsCount: 290,
    prepTime: '15-22 min',
    calories: '980 kcal',
    isPopular: true,
    isNew: false,
    dietary: [],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    description: 'Wood-fired grilled chicken breast tossed in Kentucky bourbon BBQ sauce, sharp cheddar, smoked gouda, pickled red onion, and cilantro.',
    ingredients: ['Grilled Chicken', 'Bourbon BBQ', 'Cheddar', 'Smoked Gouda', 'Pickled Onion', 'Cilantro'],
    sizes: [
      { name: 'Personal (8")', multiplier: 0.8 },
      { name: 'Medium (12")', multiplier: 1.0 },
      { name: 'Large (16")', multiplier: 1.35 }
    ]
  },
  {
    id: 'pizza-6',
    name: 'Quattro Formaggi Reserve',
    tagline: 'Aged Gorgonzola, Gouda, Mozzarella & Parmesan',
    category: 'Crust Specials',
    price: 17.99,
    rating: 4.82,
    reviewsCount: 164,
    prepTime: '12-16 min',
    calories: '920 kcal',
    isPopular: false,
    isNew: false,
    dietary: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80',
    description: 'A decadent four-cheese blend infused with organic honey drizzled crust and roasted garlic clove oil.',
    ingredients: ['Gorgonzola', 'Aged Gouda', 'Mozzarella', 'Parmesan', 'Garlic Oil', 'Organic Honey'],
    sizes: [
      { name: 'Personal (8")', multiplier: 0.8 },
      { name: 'Medium (12")', multiplier: 1.0 },
      { name: 'Large (16")', multiplier: 1.35 }
    ]
  }
];

export const MOCK_BUILDER_OPTIONS = {
  bases: [
    { id: 'base-1', name: 'Classic Woodfired Hand-Tossed', price: 0, desc: 'Golden airy crust with crisp bottom bubbles', tag: 'Standard' },
    { id: 'base-2', name: 'Neapolitan Artisan Thin Crust', price: 40, desc: 'Ultra-thin, light, charred leopard spots', tag: 'Crispy' },
    { id: 'base-3', name: 'Triple Cheese Stuffed Crust', price: 80, desc: 'Stuffed rim with molten mozzarella & cheddar', tag: 'Bestseller' },
    { id: 'base-4', name: '72-Hour Fermented Sourdough', price: 60, desc: 'Rich tangy sourdough crust fermented naturally', tag: 'Chef Choice' },
    { id: 'base-5', name: 'Gluten-Free Cauliflower Crust', price: 70, desc: 'Low-carb, crispy gluten-friendly crust', tag: 'Gluten Free' }
  ],
  sauces: [
    { id: 'sauce-1', name: 'San Marzano Herb Tomato', price: 0, desc: 'Sweet Italian plum tomatoes with basil & oregano', color: '#DC2626' },
    { id: 'sauce-2', name: 'Spicy Calabrian Chili Tomato', price: 20, desc: 'Kick of heat infused with garlic and red pepper', color: '#991B1B' },
    { id: 'sauce-3', name: 'Creamy Roasted Garlic Parmesan', price: 30, desc: 'Decadent white garlic cream sauce', color: '#FEF3C7' },
    { id: 'sauce-4', name: 'Kentucky Bourbon Smoky BBQ', price: 30, desc: 'Rich tangy barbecue glaze with molasses', color: '#78350F' },
    { id: 'sauce-5', name: 'Genovese Pine Nut Pesto', price: 40, desc: 'Vibrant fresh basil pesto base', color: '#15803D' }
  ],
  cheeses: [
    { id: 'cheese-1', name: 'Fresh Mozzarella Fior di Latte', price: 0, desc: 'Melt-in-mouth creamy fresh mozzarella' },
    { id: 'cheese-2', name: 'Aged Wisconsin Sharp Cheddar', price: 25, desc: 'Bold sharp cheddar for depth' },
    { id: 'cheese-3', name: 'Smoked Dutch Gouda', price: 35, desc: 'Rich nutty flavor with subtle woodsmoke' },
    { id: 'cheese-4', name: 'Quad Cheese Overload Blend', price: 60, desc: 'Mozzarella, Cheddar, Gouda & Parmesan' },
    { id: 'cheese-5', name: 'Plant-Based Almond Mozzarella', price: 50, desc: '100% dairy-free vegan melting cheese' }
  ],
  veggies: [
    { id: 'veg-1', name: 'Charred Bell Peppers', price: 20, color: '#EF4444', category: 'Vegetable' },
    { id: 'veg-2', name: 'Wild Cremini Mushrooms', price: 25, color: '#A16207', category: 'Vegetable' },
    { id: 'veg-3', name: 'Pickled Jalapeño Rings', price: 15, color: '#166534', category: 'Vegetable' },
    { id: 'veg-4', name: 'Kalamata Olives', price: 20, color: '#1F2937', category: 'Vegetable' },
    { id: 'veg-5', name: 'Caramelized Red Onions', price: 15, color: '#831843', category: 'Vegetable' },
    { id: 'veg-6', name: 'Sweet Golden Corn', price: 15, color: '#EAB308', category: 'Vegetable' },
    { id: 'veg-7', name: 'Sun-Dried Tomatoes', price: 25, color: '#991B1B', category: 'Vegetable' },
    { id: 'veg-8', name: 'Fresh Baby Spinach', price: 20, color: '#15803D', category: 'Vegetable' }
  ]
};
