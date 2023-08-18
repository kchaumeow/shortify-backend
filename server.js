const express = require("express");
const app = express();
const cryptor = require("bcrypt");
app.use(express.json());
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class HTTPError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "HTTPError";
    this.status = status;
  }
}

app.post("/short-link", async (req, res) => {
  const link_info = await prisma.url.findFirst({
    where: { link: req.body.link },
  });
  if (link_info === null) {
    const hashLink = (
      await cryptor.hash(req.body.link, parseInt(process.env.SALT_RANGE))
    ).replace(/[\s/]/g, "");
    const url = await prisma.url.create({
      data: {
        link: req.body.link,
        hashedLink: hashLink,
      },
    });
    if (!url)
      return next(
        new HTTPError("Something went wrong while creating short-link!", 400)
      );
    res.status(201).send(url);
  } else {
    res.status(200).send(link_info);
  }
});

app.get("/", (req, res) => {
  res.send("Suck my dick, Vladik! <3");
});

app.get("/:hash", async (req, res, next) => {
  const link = await prisma.url.findFirst({
    where: {
      hashedLink: req.params.hash,
    },
  });
  if (link === null) return next(new HTTPError("No such link found!", 404));
  res.status(200).send(link);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Application listening on port 3000!");
});

function errorHandler(err, req, res, next) {
  const status = err instanceof HTTPError ? err.status : 500;
  res.status(status).send({
    error: err.name,
    message: err.message,
  });
}
app.use(errorHandler);
