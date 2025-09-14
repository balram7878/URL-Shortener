const { Router } = require("express");
const initDB = require("../db/db.js");
const router = Router();

router.get("/:short_code", async (req, res) => {
  try {
    const short_code = req.params.short_code;
    const db = await initDB();
    const [rows] =await db.execute(
      "SELECT original_url FROM urls WHERE short_code  = ?",
      [short_code]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "URL not found" });
    const long_url = rows[0].original_url;
    res.redirect(302, long_url);
    // res.status(200).json({longUrl:`${long_url}`})
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports=router;