const express = require("express");
const app = express();
const cryptor = require("bcrypt");
app.use(express.json());

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.post("/short-link", async (req, res) => {
  try {
    const link_info = await prisma.url.findFirst({
      where: { link: req.body.link },
    });
    console.log(link_info);
    if (link_info === null) {
      const saltRange = 10;
      const hashLink = (await cryptor.hash(req.body.link, saltRange)).replace(
        /[\s/]/g,
        ""
      );
      const url = await prisma.url.create({
        data: {
          link: req.body.link,
          hashedLink: hashLink,
        },
      });
      console.log(url);
      res.status(201).send(url);
    } else {
      res.status(200).send(link_info);
    }
  } catch (err) {
    res.status(401).send({
      error: err.name,
      errMessage: err.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send("Suck my dick, Vladik! <3");
});

app.get("/:hash", async (req, res) => {
  try {
    const link = await prisma.url.findFirst({
      where: {
        hashedLink: req.params.hash,
      },
    });
    if (link === null) throw new Error("No such link found!");
    res.status(200).send(link);
  } catch (err) {
    res.status(404).send({
      error: err.name,
      errMessage: err.message,
    });
  }
});
app.listen(3000, () => {
  console.log("Application listening on port 3000!");
});
