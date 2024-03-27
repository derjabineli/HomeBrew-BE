require("dotenv").config();
const express = require("express");
var cors = require("cors");

const stripe = require("stripe")(process.env.STRIPE_SECRET);

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

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
