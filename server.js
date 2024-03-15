const express = require("express");
const app = express();
const port = 3000;
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const path = require("path");
const { mergePdfs } = require("./merge");
app.use("/static", express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "templates/index.html"));
});

app.post("/merge", upload.array("pdfs", 2), async function (req, res, next) {
  let pdf1 = req.body.pdf1;
  let pdf2 = req.body.pdf2;
  pdf1 = Number.parseInt(pdf1);
  pdf2 = Number.parseInt(pdf2);

  let d = await mergePdfs(
    path.join(__dirname, req.files[0].path),
    path.join(__dirname, req.files[1].path),pdf1,pdf2
  );
  res.redirect(`http://localhost:${port}/static/${d}.pdf`);
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
