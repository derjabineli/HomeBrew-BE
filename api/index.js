require("dotenv").config();
const express = require("express");
var cors = require("cors");

const stripe = require("stripe")(process.env.STRIPE_SECRET);

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "https://home-brew-eta.vercel.app",
  })
);

app.use((req, res, next) => {
  console.log(process.env.FRONTEND_URL);
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://home-brew-eta.vercel.app"
  );

  // Allow specific HTTP methods
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

  // Allow specific headers to be sent in the request
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Allow credentials (e.g., cookies, authentication) to be included in requests
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Continue to the next middleware or route handler
  next();
});

app.post("/checkout", async (req, res) => {
  console.log(req.body);
  const items = req.body.items;
  let lineItems = [];
  items.forEach((item) => {
    lineItems.push({
      price: item.id,
      quantity: item.quantity,
    });
  });

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: process.env.FRONTEND_URL,
    cancel_url: process.env.FRONTEND_URL,
  });

  res.send(
    JSON.stringify({
      url: session.url,
    })
  );
});

app.listen(process.env.PORT, () => {
  console.log("Server running on" + process.env.PORT);
});
