const { Router } = require("express");
const initDB = require("../db/db.js");

const routerPost = Router();

function generateShortCode(lenght = 6) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < lenght; i++)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

routerPost.post("/shorten", async (req, res) => {
  try {
    const db=await initDB();
    const { originalURL } = req.body;
    console.log(originalURL);
    const [rows] = await db.execute(
      "SELECT short_code from urls where original_url = ?",
      [originalURL]
    );
    if (rows.length > 0)
      return res
        .status(200)
        .json({ shortUrl: `${rows[0].short_code}` });
    const shortCode = generateShortCode();
    await db.execute(
      "INSERT INTO urls (short_code,original_url) VALUES (?,?)",
      [shortCode,
      originalURL]
    );
      console.log(shortCode);
    res.status(201).json({ shortUrl: `${shortCode}` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
  // const shortCode=generateShortCode();
});

module.exports=routerPost;