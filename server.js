const express = require("express");
const app = express();
const cryptor = require("crypto");
app.use(express.json());
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cors = require("cors");
app.use(cors());

function createHash(data, len) {
  return cryptor
    .createHash("shake256", { outputLength: len })
    .update(data)
    .digest("hex");
}
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
    const hashLink = createHash(req.body.link, 8);
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
  res.send("Hello, this is backend for shortify!!!");
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Application listening on port ${port}!`);
});

function errorHandler(err, req, res, next) {
  const status = err instanceof HTTPError ? err.status : 500;
  res.status(status).send({
    error: err.name,
    message: err.message,
  });
}
app.use(errorHandler);
