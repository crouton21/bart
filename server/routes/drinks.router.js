const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

router.post('/', function(req, res){
    const newDrink = req.body;
    console.log(newDrink);
    res.sendStatus(200);

    (async () => {

        const client = await pool.connect()
      
        try {
        await client.query('BEGIN')

        const { rows } = await client.query(`INSERT INTO "recipes" ("recipe_name", "garnish", "notes", "glass_id", "ice_id", "user_id") 
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING recipe_id`, [newDrink.name, newDrink.garnish, newDrink.notes, newDrink.glass, newDrink.ice, newDrink.userId])
        
        for (ingredient of newDrink.ingredients){
            let insertIngredientsText = 'INSERT INTO "ingredients" ("ingredient_name", "ingredient_quantity", "recipe_id") VALUES ($1, $2, $3)';
            let insertIngredientsValues = [ingredient.name, ingredient.quantity, rows[0].recipe_id];

            await client.query(insertIngredientsText, insertIngredientsValues)
        }
          
        const insertTagsText = 'INSERT INTO "tags" ("tag_name", "recipe_id") VALUES ($1, $2)';
        const insertTagsValues = [newDrink.tags[0].text, rows[0].recipe_id];

        await client.query(insertTagsText, insertTagsValues)
        await client.query('COMMIT')
        } 
        catch (e) {
          await client.query('ROLLBACK')
          throw e
        } 
        finally {
          client.release()
        }
      })().catch(e => console.error(e.stack))



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

router.get('/:id', function(req, res){
    const id = req.params.id;
    const queryText = `SELECT recipes.recipe_name, recipes.recipe_id FROM recipes 
            WHERE recipes.user_id = $1`;
    pool.query(queryText, [id])
        .then(function(result){
            res.send(result.rows);
        })
        .catch(function(error){
            res.sendStatus(500);
        })
})

router.get('/recipe/:id', function(req, res){
    const id = req.params.id;
    const queryText = `SELECT * FROM recipes
            JOIN glasses ON recipes.glass_id = glasses.glass_id
            JOIN ice ON recipes.ice_id = ice.ice_id
            JOIN tags ON recipes.recipe_id = tags.recipe_id
            JOIN ingredients ON recipes.recipe_id = ingredients.recipe_id
            WHERE recipes.recipe_id = $1`;
    pool.query(queryText, [id])
        .then(function(result){
            res.send(result.rows);
        })
        .catch(function(error){
            res.sendStatus(500);
        })
});

module.exports = router;