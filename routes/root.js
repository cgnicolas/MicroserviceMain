const router = require('express').Router();

router.get('/', (req, res) => {
    res.status(200).send({body: 'Hello there!'});
});

router.use('/services', require('./services/services'));

module.exports = router;