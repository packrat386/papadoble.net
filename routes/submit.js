var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/submit', function(req, res) {
  res.render('submit', { title: 'Submit Your Own' });
});

module.exports = router;
