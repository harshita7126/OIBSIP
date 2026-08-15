const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

async function inspectIssueOrder() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  const Order = mongoose.model('Order', new mongoose.Schema({ user: Object, items: Array, totalAmount: Number, orderStatus: String }, { strict: false }));
  const User = mongoose.model('User', new mongoose.Schema({ name: String, email: String }, { strict: false }));

  const targetOrderId = '6a7f55ef2d9fa79b706ea089';
  console.log(`--- INSPECTING ORDER ${targetOrderId} IN MONGODB ---`);
  
  const orderDoc = await Order.findById(targetOrderId).lean();
  if (!orderDoc) {
    console.log(`❌ Order ${targetOrderId} NOT FOUND by ID in MongoDB!`);
    console.log('Searching latest 5 orders in MongoDB:');
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).lean();
    recentOrders.forEach(o => {
      console.log(`- ID: ${o._id} | User: ${o.user} | Total: ₹${o.totalAmount} | Created: ${o.createdAt}`);
    });
  } else {
    console.log('✅ Found Order Document:');
    console.log('ID:', orderDoc._id);
    console.log('User ID:', orderDoc.user);
    console.log('Total Amount: ₹' + orderDoc.totalAmount);
    console.log('Order Status:', orderDoc.orderStatus);
    console.log('Items Count:', orderDoc.items?.length);
    (orderDoc.items || []).forEach((item, i) => {
      console.log(`\nItem ${i + 1}: Name="${item.name}", Price=₹${item.price}, Size="${item.size}", Quantity=${item.quantity}`);
      console.log(`Item ${i + 1} Customizations:`, item.customizations);
    });

    const userDoc = await User.findById(orderDoc.user).lean();
    console.log('\nLinked User Document:', userDoc ? `${userDoc.name} (${userDoc.email})` : 'User not found');
  }

  console.log('\n--- INSPECTING LATEST 5 ORDERS RETURNED FROM DATABASE ---');
  const recent = await Order.find().sort({ createdAt: -1 }).limit(5).lean();
  recent.forEach((o, index) => {
    console.log(`${index + 1}. ID: ${o._id} | User: ${o.user} | Total: ₹${o.totalAmount} | Status: ${o.orderStatus} | Created: ${o.createdAt}`);
  });

  await mongoose.disconnect();
}

inspectIssueOrder().catch(console.error);
