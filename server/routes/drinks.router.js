const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

router.post('/', function(req, res){
    const newDrink = req.body;
    let array_to_send = [];
    if (newDrink.tags){
        for (tag of newDrink.tags){
            array_to_send.push("'"+tag.text+"'");
        }
        (async () => {
            const client = await pool.connect()
            try {
            await client.query('BEGIN')
            const { rows } = await client.query("INSERT INTO recipes (recipe_name, garnish, notes, glass_id, ice_id, user_id, tags) VALUES ($1, $2, $3, $4, $5, $6, ARRAY ["+array_to_send+"]) RETURNING recipe_id", [newDrink.name, newDrink.garnish, newDrink.notes, newDrink.glass, newDrink.ice, newDrink.userId])
            for (ingredient of newDrink.ingredients){
                let insertIngredientsText = `INSERT INTO "ingredients" ("ingredient_name", "ingredient_quantity", "recipe_id") VALUES ($1, $2, $3)`;
                let insertIngredientsValues = [ingredient.name, ingredient.quantity, rows[0].recipe_id];
                await client.query(insertIngredientsText, insertIngredientsValues)
            }  
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
        res.sendStatus(200);
    }
    else{
        (async () => {
            const client = await pool.connect()
            try {
            await client.query('BEGIN')
            const { rows } = await client.query("INSERT INTO recipes (recipe_name, garnish, notes, glass_id, ice_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING recipe_id", [newDrink.name, newDrink.garnish, newDrink.notes, newDrink.glass, newDrink.ice, newDrink.userId])
            for (ingredient of newDrink.ingredients){
                let insertIngredientsText = `INSERT INTO "ingredients" ("ingredient_name", "ingredient_quantity", "recipe_id") VALUES ($1, $2, $3)`;
                let insertIngredientsValues = [ingredient.name, ingredient.quantity, rows[0].recipe_id];
                await client.query(insertIngredientsText, insertIngredientsValues)
            }  
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
        res.sendStatus(200);
    }
    
})

router.get('/inputs', function(req, res){
    const queryText = `SELECT * FROM glasses ORDER BY glass_name;
            SELECT * FROM ice ORDER BY CASE WHEN ice_name = 'none'
            THEN 1 -- last
            ELSE 0 -- first
            END ASC,
            ice_name ASC `;
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
            WHERE recipes.user_id = $1 ORDER BY recipes.recipe_name`;
    pool.query(queryText, [req.user.id])
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

router.delete('/:id', function(req, res){
    const id = req.params.id;
    const queryText = `DELETE FROM recipes WHERE recipes.recipe_id = $1`;
    pool.query(queryText, [id])
        .then(function(result){
            res.sendStatus(200);
        })
        .catch(function(error){
            res.sendStatus(500);
            console.log('error deleting drink', error); 
        })
});

router.put('/', function(req, res){
    const editedDrink = req.body;
    let array_to_send = [];
    if (editedDrink.tags){
        for (tag of editedDrink.tags){
            array_to_send.push("'"+tag.text+"'");
        }
        (async () => {
            const client = await pool.connect()
            try {
            await client.query('BEGIN')
            await client.query(`DELETE FROM ingredients WHERE ingredients.recipe_id = $1`, [editedDrink.recipe_id])
            for (ingredient of editedDrink.ingredients){
                let insertIngredientsText = `INSERT INTO "ingredients" ("ingredient_name", "ingredient_quantity", "recipe_id") VALUES ($1, $2, $3)`;
                let insertIngredientsValues = [ingredient.name, ingredient.quantity, editedDrink.recipe_id];
                await client.query(insertIngredientsText, insertIngredientsValues)
            }  
            await client.query("UPDATE recipes SET recipe_name = $1, garnish = $2, notes = $3, glass_id = $4, ice_id = $5, tags = ARRAY ["+array_to_send+"] WHERE recipe_id=$6", [editedDrink.recipe_name, editedDrink.garnish, editedDrink.notes, editedDrink.glass_id, editedDrink.ice_id, editedDrink.recipe_id])
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
        res.sendStatus(200);
    }
    else{
        (async () => {
            const client = await pool.connect()
            try {
            await client.query('BEGIN')
            await client.query("DELETE FROM ingredients WHERE ingredients.recipe_id = $1", [editedDrink.recipe_id])
            for (ingredient of editedDrink.ingredients){
                let insertIngredientsText = `INSERT INTO "ingredients" ("ingredient_name", "ingredient_quantity", "recipe_id") VALUES ($1, $2, $3)`;
                let insertIngredientsValues = [ingredient.name, ingredient.quantity, editedDrink.recipe_id];
                await client.query(insertIngredientsText, insertIngredientsValues)
            } 
            await client.query("UPDATE recipes SET recipe_name = $1, garnish = $2, notes = $3, glass_id = $4, ice_id = $5", [editedDrink.recipe_name, editedDrink.garnish, editedDrink.notes, editedDrink.glass_id, editedDrink.ice_id])
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
        res.sendStatus(200);
    }
})

module.exports = router;