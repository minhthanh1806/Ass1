const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const router = express.Router();
const DATA_FILE = path.join(__dirname, "..", "data.json");

// Đọc toàn bộ data từ data.json
async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { articles: [], comments: [] };
  }
}

async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

router.get("/", async (req, res) => {
  try {
    const data = await readData();
    res.status(200).json(data.comments);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await readData();
    const comment = data.comments.find((item) => item.id === id);
    
    if (!comment) {
      return res.status(404).json({ message: "Not Found" });
    }
    
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;

