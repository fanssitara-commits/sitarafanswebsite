import { products } from "@/data/products";

const NAMES = [
  "Ali Raza", "Sara Khan", "Usman Tariq", "Ayesha Malik", "Bilal Ahmed",
  "Fatima Noor", "Hamza Sheikh", "Zainab Iqbal", "Omar Farooq", "Hina Aslam",
  "Kashif Mehmood", "Nimra Javed", "Adeel Anwar", "Rabia Sultan",
];
const CITIES = ["Lahore", "Karachi", "Islamabad", "Faisalabad", "Gujranwala", "Multan", "Rawalpindi"];
const AREAS = ["Model Town", "DHA Phase 5", "Gulberg III", "Bahria Town", "Satellite Town", "Cantt", "Johar Town"];
const PAYMENTS = ["Cash on Delivery", "Card", "Cash on Delivery", "Bank Transfer"];

const pick = (arr, i) => arr[i % arr.length];
const rand = (n) => Math.floor(Math.random() * n);
const phone = () => "0300 " + (1000000 + rand(8999999));

export function makeOrders() {
  const orders = [];
  const N = 16;
  for (let i = 0; i < N; i++) {
    const daysAgo = rand(14);
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(9 + rand(11), rand(60));

    const itemCount = 1 + rand(3);
    const items = [];
    for (let j = 0; j < itemCount; j++) {
      const p = products[rand(products.length)];
      if (items.find((it) => it.id === p.id)) continue;
      items.push({ id: p.id, name: p.name, category: p.category, price: p.price, qty: 1 + rand(2) });
    }
    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const shipping = subtotal > 10000 ? 0 : 300;
    const name = pick(NAMES, i + rand(3));
    const city = pick(CITIES, i);
    const status = daysAgo >= 9 ? "Delivered" : daysAgo >= 5 ? "Shipped" : daysAgo >= 2 ? "Processing" : "Pending";
    orders.push({
      id: "SF-" + (10000000 + i * 37 + rand(30)),
      date: d.toISOString(),
      customer: {
        name,
        phone: phone(),
        email: name.toLowerCase().replace(/\s+/g, ".") + "@gmail.com",
        city,
        address: `House ${10 + rand(300)}, ${pick(AREAS, i)}`,
        payment: pick(PAYMENTS, i),
        notes: rand(3) === 0 ? "Please call before delivery." : "",
      },
      items,
      subtotal,
      shipping,
      total: subtotal + shipping,
      status,
    });
  }
  return orders.sort((a, b) => new Date(b.date) - new Date(a.date));
}

const MESSAGES = [
  { name: "Junaid Akhtar", phone: "0300 4455661", email: "junaid.akhtar@gmail.com", subject: "Bulk order for offices", message: "Assalam o Alaikum, I want to order 20 ceiling fans for our new office. Can you share a bulk price and delivery time to Islamabad?", read: false },
  { name: "Mariam Yousuf", phone: "0321 7788990", email: "mariam.y@outlook.com", subject: "Warranty question", message: "Does the Royal Gold model come with a 3-year warranty? And is installation included?", read: false },
  { name: "Tariq Mehmood", phone: "0333 2211009", email: "tariq.m@gmail.com", subject: "Spare parts availability", message: "I need a replacement capacitor for a fan I bought two years ago. Do you sell spare parts?", read: true },
  { name: "Sana Riaz", phone: "0345 6677001", email: "sana.riaz@gmail.com", subject: "Which fan for a large hall?", message: "We have a 20x30 ft hall. Which model would give the best airflow? Budget is flexible.", read: true },
  { name: "Faisal Qureshi", phone: "0301 9988770", email: "faisal.q@yahoo.com", subject: "Dealer enquiry", message: "I run an electronics shop in Multan and would like to become a dealer. Please share terms.", read: false },
];

const COMPLAINTS = [
  { name: "Rehan Sattar", phone: "0300 1234567", email: "rehan.s@gmail.com", orderId: "SF-10000234", category: "Delivery Problem", message: "My order was supposed to arrive in 3 days but it's been a week with no update. Please check.", status: "New" },
  { name: "Amna Sheikh", phone: "0321 9876543", email: "", orderId: "", category: "Product Issue", message: "One of the fan blades has a small crack near the mount. Otherwise the fan works fine.", status: "In Progress" },
  { name: "Waqar Ahmed", phone: "0333 5551212", email: "waqar@gmail.com", orderId: "SF-10000371", category: "Warranty Claim", message: "The remote stopped working after two months. I would like a replacement under warranty.", status: "New" },
  { name: "Nida Kamal", phone: "0345 7778899", email: "nida.k@gmail.com", orderId: "", category: "Billing / Payment", message: "I was charged shipping even though my order was above Rs 10,000. Please refund the shipping.", status: "Resolved" },
];

function stamp(list, prefix) {
  return list.map((x, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(10 + i, 15 * (i % 4));
    return { id: prefix + (10000000 + i * 53 + 7), date: d.toISOString(), ...x };
  });
}

export const makeMessages = () => stamp(MESSAGES, "MSG-");
export const makeComplaints = () => stamp(COMPLAINTS, "CMP-");
