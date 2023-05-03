const express = require('express');
const app = express();
const fs = require("fs");
const multer = require('multer');
const { createWorker } = require('tesseract.js');

const worker = createWorker({
  logger: m => console.log(m),
});

(async () => {
    await worker.create();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
  })();

const storage1 = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, res, cb) => {
    cb(null, res.originalname);
  }
});

const upload = multer({ storage: storage1 }).single("avatar");

app.set("view engine", "ejs");

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/upload', (req, res) => {
  upload(req, res, err => {
    console.log(req.file);
    fs.readFile(`./uploads/${req.file.originalname}`, (err, data) => {
      if (err) {
        return console.log("this is your error, err");
      }
      worker
        .recognize(data, "eng", { tessjs_create_pdf: '1' })
        .progress(progress => {
          console.log(process);
        })
        .then(result => {
          res.send(result.text);
        })
        .finally(() => worker.terminate());
    });
  });
});

app.listen(8000, () => {
  console.log('hey i am running on port 8000');
});

