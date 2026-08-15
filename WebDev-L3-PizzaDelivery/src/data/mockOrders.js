export const MOCK_ORDERS = [
  {
    id: 'CC-94821',
    createdAt: '2026-07-24T20:45:00Z',
    customer: {
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      phone: '+1 (555) 382-9102',
      address: '742 Evergreen Terrace, Suite 4B, San Francisco, CA'
    },
    items: [
      {
        id: 'item-1',
        name: 'Truffle Mushroom Crave',
        size: 'Medium (12")',
        price: 18.99,
        quantity: 1,
        customizations: ['Extra Truffle Glaze', 'Thin Crust']
      },
      {
        id: 'item-2',
        name: 'Custom Crave Pizza',
        size: 'Large (16")',
        price: 24.50,
        quantity: 1,
        customizations: ['Sourdough Base', 'Calabrian Sauce', 'Quad Cheese', 'Jalapeños', 'Spinach']
      }
    ],
    summary: {
      subtotal: 43.49,
      tax: 3.48,
      deliveryFee: 2.99,
      discount: 8.70, // 20% off
      total: 41.26
    },
    payment: {
      method: 'Razorpay UPI',
      transactionId: 'pay_RZP9823102941',
      status: 'Paid'
    },
    status: 'in_oven', // status flow: 'received', 'preparing', 'in_oven', 'out_for_delivery', 'delivered'
    estimatedDelivery: '25 min',
    driver: {
      name: 'Marcus Vance',
      phone: '+1 (555) 912-4011',
      vehicle: 'Black Vespa Scooter (CA 892-XP)',
      rating: 4.9
    },
    timeline: [
      { step: 'received', label: 'Order Confirmed', time: '8:45 PM', completed: true },
      { step: 'preparing', label: 'Chef Preparing Crust & Toppings', time: '8:48 PM', completed: true },
      { step: 'in_oven', label: 'Baking in Woodfire Oven (450°C)', time: '8:55 PM', completed: true },
      { step: 'out_for_delivery', label: 'Out for Courier Delivery', time: 'Est. 9:08 PM', completed: false },
      { step: 'delivered', label: 'Delivered Hot & Fresh', time: 'Est. 9:18 PM', completed: false }
    ]
  },
  {
    id: 'CC-94819',
    createdAt: '2026-07-24T18:20:00Z',
    customer: {
      name: 'Sophia Chen',
      email: 'sophia.chen@example.com',
      phone: '+1 (555) 201-9944',
      address: '120 Market Street, Apt 12A, San Francisco, CA'
    },
    items: [
      {
        id: 'item-3',
        name: 'Spicy Artisanal Pepperoni',
        size: 'Large (16")',
        price: 23.60,
        quantity: 2,
        customizations: ['Hot Honey Extra']
      }
    ],
    summary: {
      subtotal: 47.20,
      tax: 3.77,
      deliveryFee: 2.99,
      discount: 0.00,
      total: 53.96
    },
    payment: {
      method: 'Razorpay Credit Card',
      transactionId: 'pay_RZP8871239120',
      status: 'Paid'
    },
    status: 'delivered',
    estimatedDelivery: 'Delivered',
    driver: {
      name: 'Elena Rostova',
      phone: '+1 (555) 881-2299',
      vehicle: 'White EV Bike (CA 102-EV)',
      rating: 5.0
    },
    timeline: [
      { step: 'received', label: 'Order Confirmed', time: '6:20 PM', completed: true },
      { step: 'preparing', label: 'Chef Preparing Crust & Toppings', time: '6:22 PM', completed: true },
      { step: 'in_oven', label: 'Baking in Woodfire Oven', time: '6:30 PM', completed: true },
      { step: 'out_for_delivery', label: 'Out for Courier Delivery', time: '6:42 PM', completed: true },
      { step: 'delivered', label: 'Delivered Hot & Fresh', time: '6:54 PM', completed: true }
    ]
  }
];
