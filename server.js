require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const authController = require('./controllers/auth');
const artController = require('./controllers/art');
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.use('/auth', authController);

app.use('/art', artController);

app.get('/*', (req,res) => {
    res.json({comment: 'This is a bad URL'});
});

app.listen(PORT, () => {
    console.log(`Server listening to PORT ${PORT}`);
});
