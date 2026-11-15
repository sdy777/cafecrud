
const express = require("express");
const pool = require("./db");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.redirect("/menus"));

app.get("/menus", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM menu ORDER BY id DESC"
    );

    res.render("menus", { menus: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("DB 오류: " + err.message);
  }
});

app.post("/menus/add", async (req, res) => {
  try {
    const { name, price, description } = req.body;

    await pool.query(
      "INSERT INTO menu (name, price, description) VALUES (?, ?, ?)",
      [name, price, description]
    );

    res.redirect("/menus");
  } catch (err) {
    console.error(err);
    res.status(500).send("등록 오류: " + err.message);
  }
});

app.get("/menus/edit/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM menu WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).send("메뉴를 찾을 수 없습니다.");
    }

    res.render("edit", { menu: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("조회 오류: " + err.message);
  }
});

app.post("/menus/update/:id", async (req, res) => {
  try {
    const { name, price, description } = req.body;

    await pool.query(
      "UPDATE menu SET name = ?, price = ?, description = ? WHERE id = ?",
      [name, price, description, req.params.id]
    );

    res.redirect("/menus");
  } catch (err) {
    console.error(err);
    res.status(500).send("수정 오류: " + err.message);
  }
});

app.post("/menus/delete/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM menu WHERE id = ?",
      [req.params.id]
    );

    res.redirect("/menus");
  } catch (err) {
    console.error(err);
    res.status(500).send("삭제 오류: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}/menus`);
});
