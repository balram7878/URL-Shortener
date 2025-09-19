const express = require("express");
const initDB = require("../db/db.js");
const routerPost = require("../routes/post.js");
const routerGet=require("../routes/get.js");
const cors=require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({origin:"https://urlshort0.netlify.app/",credentials:true}));

app.use("/create", routerPost);
app.use("/get",routerGet);

const initialize = async () => {
  try {
    await initDB();
    console.log("DB connected");
    app.listen(process.env.PORT, () => {
      console.log("server is listening");
    });
  } catch (err) {
    console.log(err.message);
  }
};

initialize();
