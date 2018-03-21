const express = require('express');
const router = express.Router();

router.post('/', function(req, res){
    const newDrink = req.body;
    console.log(newDrink);
    res.sendStatus(200);
})

module.exports = router;