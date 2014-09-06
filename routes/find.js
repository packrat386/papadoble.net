var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/find/book', function(req, res) {
  res.render('findBook', { title: 'Find by Book' });
});

router.get('/find/ingredient', function(req, res) {
  res.render('findIngredient', { title: 'Find by Ingredient' });
});

router.get('/find/id', function(req, res) {
  res.render('findId', { title: 'Find by ID' });
});

router.get('/find', function(req, res) {
  res.render('find', { title: 'Find a Drink' });
});

module.exports = router;
