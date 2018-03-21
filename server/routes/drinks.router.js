const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

router.post('/', function(req, res){
    const newDrink = req.body;
    const queryText = ``
    console.log(newDrink);
    res.sendStatus(200);
})

router.get('/inputs', function(req, res){
    const queryText = `SELECT * FROM glasses ORDER BY glass_name;
            SELECT * FROM ice ORDER BY ice_name`;
    pool.query(queryText)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log('Error making query', err);
            res.sendStatus(500);
            });
});

module.exports = router;