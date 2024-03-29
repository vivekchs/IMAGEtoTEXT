// requirements
const express = require('express');
const app = express();
const fs = require("fs");
const multer = require('multer');
const { TesseractWorker } = require('tesseract.js');
const worker = new TesseractWorker();

// const { createWorker } = Tesseract;
// const worker = await createWorker({
//   langPath: '...',
//   logger: m => console.log(m),
// });

// worker.recognize('image.png')
//   .then(result => {
//     console.log(result.text);
//   });
// storage

const storage1 = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, res, cb)=>
    {
        cb(null, res.originalname);
    }
    
   
});
const upload = multer({ storage: storage1 }).single("avatar");

app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.render('index')
})
app.post('/upload', (req, res) => {
    upload(req, res, err => {
        console.log(req.file);
        // console.log(res);
        fs.readFile(`./uploads/${req.file.originalname}`,  (err, data) => {
            if (err) {
                return console.log("this is your error,err");
            }
            worker
                .recognize(data, "eng", {  })
                .progress(progress => {
                    console.log(process);
                })
                .then(result => {
                    res.send(result.text)
                })
                .finally(() => worker.terminate());
            
            
        });
    })
})

// satrt the server
app.listen(8000, () => {
    console.log('hey i am running on port 8000');
});


