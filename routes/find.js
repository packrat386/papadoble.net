var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/book', function(req, res) {
  res.render('findBook', { title: 'Find by Book' });
});

router.get('/ingredient', function(req, res) {
  res.render('findIngredient', { title: 'Find by Ingredient' });
});

router.get('/id', function(req, res) {
  res.render('findId', { title: 'Find by ID' });
});

router.get('/', function(req, res) {
  res.render('find', { title: 'Find a Drink' });
});

module.exports = router;
