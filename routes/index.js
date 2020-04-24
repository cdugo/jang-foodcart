var express = require('express');
var router = express.Router();

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

router.get('/add/:id', function(req, res, next) {

  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var product = products.find((item) => item.id == productId);
  cart.add(product, productId);
  req.session.cart = cart;
  res.redirect('/');
  inline();
});

router.get('/cart', function(req, res, next) {
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

router.get('/cart/skus', (request, response, next) => {
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
});

module.exports = router;
