const router = require("express").Router();
const { getFileStream } = require('../s3');

router.get('/:key', async (req, res) => {
    try {
        const key = req.params.key;
        const readStream = getFileStream(key);
        readStream.pipe(res);
        res.status(200)
    } catch (e) {
        console.log(e)
    }
})

module.exports = router;