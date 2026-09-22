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

// Ghi dữ liệu vào data.json (giữ nguyên comments)
async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// GET /articles
router.get("/", async (req, res) => {
  try {
    const data = await readData();
    res.status(200).json(data.articles);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// GET /articles/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await readData();
    const article = data.articles.find((item) => item.id === id);
    
    if (!article) {
      return res.status(404).json({ message: "Not Found" });
    }
    
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// POST /articles
router.post("/", async (req, res) => {
  try {
    const { title, content, author, date } = req.body;
    if (!title || !content || !author || !date) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    const data = await readData();
    const newArticle = {
      id: data.articles.length > 0 ? data.articles[data.articles.length - 1].id + 1 : 1,
      title,
      content,
      author,
      date
    };

    data.articles.push(newArticle);
    await writeData(data);

    res.status(201).json({
      message: "Tạo thành công",
      newArticle,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// PUT /articles/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await readData();
    const index = data.articles.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).send("Not found");
    }

    data.articles[index] = {
      ...data.articles[index],
      ...req.body,
      id // Giữ nguyên ID gốc
    };

    await writeData(data);

    res.json({
      message: "Cập nhật thành công",
      data: data.articles[index],
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// DELETE /articles/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await readData();
    const index = data.articles.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).send("Article not found");
    }

    const [deletedArticle] = data.articles.splice(index, 1);
    await writeData(data);

    res.status(200).json({
      message: "Xóa thành công",
      deletedArticle,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;