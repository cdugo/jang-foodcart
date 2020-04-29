var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth')
var fs = require('fs');


var Cart = require('../utilities/cart');
var products = require('../data/products.json');

router.get('/', function (req, res, next) {
  var productId = products && products[0].id;

  res.render('index', 
  { 
    title: 'Techlife Cafe',
    products: products
  }
  );
});

router.get('/add/:id', auth,  function(req, res, next) {

  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var product = products.find((item) => item.id == productId);
  cart.add(product, productId);
  req.session.cart = cart;
  res.redirect('/');
  inline();
});

router.get('/cart', auth,function(req, res, next) {
  if (!req.session.cart) {
    return res.render('cart', {
      products: null
    });
  }
  var cart = new Cart(req.session.cart);
  res.render('cart', {
    title: 'Your Shopping Cart',
    products: cart.getItems(),
    totalPrice: cart.totalPrice
  });
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.remove(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

router.get('/cart/skus', auth, (request, response, next) => {
  try {
  var cart = new Cart(request.session.cart ? request.session.cart : {}),
    items = cart.items;

  const SKUsAndQuantities = [];

  for (const i in items) {
    if (!items.hasOwnProperty(i)) continue;
    
    const item = items[i];

    SKUsAndQuantities.push({sku: item.sku, quantity: item.quantity});
  }

  delete request.session.cart;

  response.json(SKUsAndQuantities)

  } catch (error) {
    console.log(error.statusCode);
    if (error.statusCode == 401) {
     res.redirect('/login')}
    else {(console.log(error))};
};
});
router.get("/me", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});
module.exports = router;
