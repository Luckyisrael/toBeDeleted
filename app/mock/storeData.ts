import { Food1 } from 'app/assets/images';

export const stores = [
  {
    id: '1',
    name: "Joe's Grocery",
    tag: 'groceries',
    price: '£3.99',
    distance: '0.5 miles',
    deliveryTime: '10-15 mins',
    address: '819 vaness avenue, San Fransisco CA 919',
    availableProducts: [
      {
        category: 'Meat',
        image: Food1, // Replace with actual image URL
        items: [
          {
            name: 'Sausages',
            description: 'Fresh pork sausages',
            price: '£4.99',
            image: Food1,
            types: [
              { name: 'Spicy Sausage', description: '6 Premium Lincolnshire Recipe sausages', price: '£5.49', image: Food1 },
              { name: 'Regular Sausage', description: 'British sausage cumberland thin 500g', price: '£4.99', image: Food1 },
            ],
          },
          {
            name: 'Bacon',
            description: 'Smoked bacon strips',
            price: '£3.99',
            image: Food1,
            types: [
              { name: 'Thick Cut Bacon', description: 'Extra thick bacon slices', price: '£4.50', image: Food1 },
              { name: 'Regular Bacon', description: 'Standard bacon slices', price: '£3.99' , image: Food1},
            ],
          },
        ],
      },
      {
        category: 'Vegetables',
        image: Food1,
        items: [
          {
            name: 'Carrots',
            description: 'Fresh organic carrots',
            price: '£2.99',
            image: Food1,
            types: [],
          },
          {
            name: 'Broccoli',
            description: 'Organic broccoli florets',
            price: '£3.49',
            image: Food1,
            types: [],
          },
        ],
      },
      {
        category: 'Snacks',
        image: Food1,
        items: [
          {
            name: 'Chips',
            description: 'Crispy salted potato chips',
            price: '£1.99',
            image: Food1,
            types: [],
          },
          {
            name: 'Popcorn',
            description: 'Butter-flavored popcorn',
            price: '£2.49',
            image: Food1,
            types: [],
          },
        ],
      },
      {
        category: 'Drinks',
        image: Food1,
        items: [
          {
            name: 'Orange Juice',
            description: 'Freshly squeezed orange juice',
            price: '£3.99',
            image: Food1,
            types: [],
          },
          {
            name: 'Cola',
            description: 'Chilled cola drink',
            price: '£1.49',
            image: Food1,
            types: [],
          },
        ],
      },
      {
        category: 'Pasteries',
        image: Food1,
        items: [
          {
            name: 'Croissant',
            description: 'Buttery French croissant',
            price: '£2.49',
            types: [],
          },
          {
            name: 'Danish',
            description: 'Delicious fruit-filled Danish',
            price: '£2.99',
            types: [],
          },
        ],
      },
      {
        category: 'Fries',
        image: Food1,
        items: [
          {
            name: 'Croissant',
            description: 'Buttery French croissant',
            price: '£2.49',
            types: [],
          },
          {
            name: 'Danish',
            description: 'Delicious fruit-filled Danish',
            price: '£2.99',
            types: [],
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Lucky Restaurant',
    tag: 'groceries',
    price: '£3.99',
    distance: '0.5 miles',
    deliveryTime: '10-15 mins',
    address: '819 vaness avenue, San Fransisco CA 919',
    availableProducts: [
      {
        category: 'Meat',
        image: Food1, // Replace with actual image URL
        items: [
          {
            name: 'Sausages',
            description: 'Fresh pork sausages',
            price: '£4.99',
            image: Food1,
            types: [
              { name: 'Spicy Sausage', description: 'Spicy pork sausage', price: '£5.49' },
              { name: 'Regular Sausage', description: 'Classic pork sausage', price: '£4.99' },
            ],
          },
          {
            name: 'Bacon',
            description: 'Smoked bacon strips',
            price: '£3.99',
            image: Food1,
            types: [
              { name: 'Thick Cut Bacon', description: 'Extra thick bacon slices', price: '£4.50' },
              { name: 'Regular Bacon', description: 'Standard bacon slices', price: '£3.99' },
            ],
          },
        ],
      },
      {
        category: 'Vegetables',
        image: Food1,
        items: [
          {
            name: 'Carrots',
            description: 'Fresh organic carrots',
            price: '£2.99',
            image: Food1,
            types: [],
          },
          {
            name: 'Broccoli',
            description: 'Organic broccoli florets',
            price: '£3.49',
            image: Food1,
            types: [],
          },
        ],
      },
      {
        category: 'Snacks',
        image: Food1,
        items: [
          {
            name: 'Chips',
            description: 'Crispy salted potato chips',
            price: '£1.99',
            image: Food1,
            types: [],
          },
          {
            name: 'Popcorn',
            description: 'Butter-flavored popcorn',
            price: '£2.49',
            image: Food1,
            types: [],
          },
        ],
      },
      {
        category: 'Drinks',
        image: Food1,
        items: [
          {
            name: 'Orange Juice',
            description: 'Freshly squeezed orange juice',
            price: '£3.99',
            image: Food1,
            types: [],
          },
          {
            name: 'Cola',
            description: 'Chilled cola drink',
            price: '£1.49',
            image: Food1,
            types: [],
          },
        ],
      },
      {
        category: 'Pasteries',
        image: Food1,
        items: [
          {
            name: 'Croissant',
            description: 'Buttery French croissant',
            price: '£2.49',
            image: Food1,
            types: [],
          },
          {
            name: 'Danish',
            description: 'Delicious fruit-filled Danish',
            price: '£2.99',
            image: Food1,
            types: [],
          },
        ],
      },
    ],
  },
  {
    id: '3',
    name: "Samuel's Grocery",
    tag: 'groceries',
    price: '£3.99',
    distance: '0.5 miles',
    deliveryTime: '10-15 mins',
    address: '819 vaness avenue, San Fransisco CA 919',
    availableProducts: [
      {
        category: 'Meat',
        image: Food1, // Replace with actual image URL
        items: [
          {
            name: 'Sausages',
            description: 'Fresh pork sausages',
            price: '£4.99',
            image: Food1,
            types: [
              { name: 'Spicy Sausage', description: 'Spicy pork sausage', price: '£5.49' },
              { name: 'Regular Sausage', description: 'Classic pork sausage', price: '£4.99' },
            ],
          },
          {
            name: 'Bacon',
            description: 'Smoked bacon strips',
            price: '£3.99',
            image: Food1,
            types: [
              { name: 'Thick Cut Bacon', description: 'Extra thick bacon slices', price: '£4.50' },
              { name: 'Regular Bacon', description: 'Standard bacon slices', price: '£3.99' },
            ],
          },
        ],
      },
      {
        category: 'Vegetables',
        image: Food1,
        items: [
          {
            name: 'Carrots',
            description: 'Fresh organic carrots',
            price: '£2.99',
            image: Food1,
            types: [],
          },
          {
            name: 'Broccoli',
            description: 'Organic broccoli florets',
            price: '£3.49',
            image: Food1,
            types: [],
          },
        ],
      },
      {
        category: 'Snacks',
        image: Food1,
        items: [
          {
            name: 'Chips',
            description: 'Crispy salted potato chips',
            price: '£1.99',
            image: Food1,
            types: [],
          },
          {
            name: 'Popcorn',
            description: 'Butter-flavored popcorn',
            price: '£2.49',
            image: Food1,
            types: [],
          },
        ],
      },
      {
        category: 'Drinks',
        image: Food1,
        items: [
          {
            name: 'Orange Juice',
            description: 'Freshly squeezed orange juice',
            price: '£3.99',
            image: Food1,
            types: [],
          },
          {
            name: 'Cola',
            description: 'Chilled cola drink',
            price: '£1.49',
            image: Food1,
            types: [],
          },
        ],
      },
      {
        category: 'Pasteries',
        image: Food1,
        items: [
          {
            name: 'Croissant',
            description: 'Buttery French croissant',
            price: '£2.49',
            image: Food1,
            types: [],
          },
          {
            name: 'Danish',
            description: 'Delicious fruit-filled Danish',
            price: '£2.99',
            image: Food1,
            types: [],
          },
        ],
      },
    ],
  },
  {
    id: '4',
    name: 'Mr. Han Herbals',
    tag: 'groceries',
    price: '£3.99',
    distance: '0.5 miles',
    deliveryTime: '10-15 mins',
    address: '819 vaness avenue, San Fransisco CA 919',
    availableProducts: [
      {
        category: 'Meat',
        image: Food1, // Replace with actual image URL
        items: [
          {
            name: 'Sausages',
            description: 'Fresh pork sausages',
            price: '£4.99',
            image: Food1,
            types: [
              { name: 'Spicy Sausage', description: 'Spicy pork sausage', price: '£5.49' },
              { name: 'Regular Sausage', description: 'Classic pork sausage', price: '£4.99' },
            ],
          },
          {
            name: 'Bacon',
            description: 'Smoked bacon strips',
            price: '£3.99',
            image: Food1,
            types: [
              { name: 'Thick Cut Bacon', description: 'Extra thick bacon slices', price: '£4.50' },
              { name: 'Regular Bacon', description: 'Standard bacon slices', price: '£3.99' },
            ],
          },
        ],
      },
      {
        category: 'Vegetables',
        image: Food1,
        items: [
          {
            name: 'Carrots',
            description: 'Fresh organic carrots',
            price: '£2.99',
            image: Food1,
            types: [],
          },
          {
            name: 'Broccoli',
            description: 'Organic broccoli florets',
            price: '£3.49',
            image: Food1,
            types: [],
          },
        ],
      },
      {
        category: 'Snacks',
        image: Food1,
        items: [
          {
            name: 'Chips',
            description: 'Crispy salted potato chips',
            price: '£1.99',
            image: Food1,
            types: [],
          },
          {
            name: 'Popcorn',
            description: 'Butter-flavored popcorn',
            price: '£2.49',
            image: Food1,
            types: [],
          },
        ],
      },
      {
        category: 'Drinks',
        image: Food1,
        items: [
          {
            name: 'Orange Juice',
            description: 'Freshly squeezed orange juice',
            price: '£3.99',
            image: Food1,
            types: [],
          },
          {
            name: 'Cola',
            description: 'Chilled cola drink',
            price: '£1.49',
            image: Food1,
            types: [],
          },
        ],
      },
      {
        category: 'Pasteries',
        image: Food1,
        items: [
          {
            name: 'Croissant',
            description: 'Buttery French croissant',
            price: '£2.49',
            image: Food1,
            types: [],
          },
          {
            name: 'Danish',
            description: 'Delicious fruit-filled Danish',
            price: '£2.99',
            image: Food1,
            types: [],
          },
        ],
      },
    ],
  },
  // Add at least 4 more stores following the same structure as above...
];
