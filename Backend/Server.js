const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const UserRegistration = require("./controller/UserRegistration");
const UserLogin = require('./controller/UserLogin');
const resetPassword = require('./controller/ResetPassword');
const uploadImages = require('./controller/ImageController');
const app = express();

require('dotenv').config();


const dbUrl = process.env.MONGODBURL;
const port = process.env.PORT || 5000;
const host = process.env.HOST

const mongoURI = dbUrl;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));



const multer = require('multer');
const sendUser = require('./controller/sendUser');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' ;
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)) ; 
  },
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'uploads')));

app.post('/register', UserRegistration);
app.post('/login', UserLogin);
app.post('/reset', resetPassword)
app.post("/sendUser",sendUser )

app.post('/uploadImages', upload.array('images', 10), uploadImages);


app.listen(port, host, () => {
  console.log(`Server is running on port http://${host}:${port}`);
});
