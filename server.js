import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(cors({origin:"https://ifort-front-end.onrender.com/"})); // Enable CORS for frontend communication

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://arjunvaradiyil203:arjun123@mern.wxpyu.mongodb.net/ProductsDB";

// ✅ Improved MongoDB Connection
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 3000, // Prevent indefinite waiting
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Stop the server if DB connection fails
  }
}
connectDB();

// ✅ Handle MongoDB Connection Errors
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB Connection Error:", err.message);
});

// ✅ Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);

// ✅ API Route to Add a Product
app.post("/api/products", async (req, res) => {
  try {
    const { name, price, description } = req.body;
    if (!name) return res.status(400).json({ message: "❌ Name is required" });
    if (!price) return res.status(400).json({ message: "❌ Price is required" });
    if (!description) return res.status(400).json({ message: "❌ Description is required" });

    const newProduct = new Product({ name, price, description });
    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "✅ Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("❌ Error adding product:", error.message);
    res.status(500).json({ message: "❌ Internal server error", error: error.message });
  }
});

// ✅ API Route to Fetch All Products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error.message);
    res.status(500).json({ message: "❌ Error fetching products", error: error.message });
  }
});

// ✅ Handle Undefined Routes
app.use((req, res) => {
  res.status(404).json({ message: "❌ Route not found" });
});

// ✅ Ensure Correct Port for Deployment
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
