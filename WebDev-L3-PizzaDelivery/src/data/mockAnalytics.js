export const MOCK_ANALYTICS = {
  kpis: {
    totalRevenue: 28490.50,
    revenueGrowth: '+18.4%',
    activeOrders: 14,
    avgDeliveryTime: '22 min',
    satisfactionRate: '98.6%',
    totalCustomers: 1240
  },
  salesHistory: [
    { day: 'Mon', revenue: 3200, orders: 120 },
    { day: 'Tue', revenue: 3800, orders: 145 },
    { day: 'Wed', revenue: 4100, orders: 160 },
    { day: 'Thu', revenue: 4900, orders: 190 },
    { day: 'Fri', revenue: 6800, orders: 260 },
    { day: 'Sat', revenue: 8200, orders: 310 },
    { day: 'Sun', revenue: 7400, orders: 285 }
  ],
  topPizzas: [
    { name: 'Spicy Artisanal Pepperoni', sales: 482, percentage: 35 },
    { name: 'Truffle Mushroom Crave', sales: 340, percentage: 25 },
    { name: 'Smoked Burrata Margherita', sales: 230, percentage: 17 },
    { name: 'Bourbon BBQ Chicken', sales: 190, percentage: 14 },
    { name: 'Others & Custom Build', sales: 120, percentage: 9 }
  ],
  hourlyPeak: [
    { hour: '12 PM', orders: 45 },
    { hour: '2 PM', orders: 25 },
    { hour: '4 PM', orders: 15 },
    { hour: '6 PM', orders: 85 },
    { hour: '8 PM', orders: 110 },
    { hour: '10 PM', orders: 60 }
  ]
};
