// The route we are creating:
const router = require('express').Router();
let Items = require('../models/items-model');

//API call to get current data from the database:
router.route('/').get(async (req, res) => {
  try {
    const items = await Items.find({});
    res.json(items);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

router.route('/add').post((req, res) => {
    const itemName = req.body.itemName;
    const description = req.body.description;
    const price = req.body.price;
    const image = req.body.image;
    const newitems = new Items({
        itemName,
        description,
        price,
        image
    })
    newitems.save()
    .then(()=>res.json("Items Added!"))
    .catch(err => res.status(400).json("Error "+ err));
})

module.exports = router;