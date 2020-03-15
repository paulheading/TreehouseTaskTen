const express = require('express'),
      router  = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect("/books")
});

module.exports = router;
