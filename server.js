import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Enable CORS for frontend communication

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ProductsDB";

// ✅ Improved MongoDB Connection with Proper Error Handling
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 3000, // Avoid indefinite waiting
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Stop the server if DB connection fails
  }
}
connectDB();

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
    if (!name || !price || !description) {
      return res.status(400).json({ message: "❌ All fields are required" });
    }

    const newProduct = new Product({ name, price, description });
    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "✅ Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ message: "❌ Error adding product", error });
  }
});

// ✅ API Route to Fetch All Products (Fixed)
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products); // ✅ Added missing response
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ message: "❌ Error fetching products", error });
  }
});

// ✅ Server Running on Correct Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
