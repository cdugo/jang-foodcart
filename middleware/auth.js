module.exports = function(req, res, next) {
  try {
    if (req.session && req.session.user && req.session.user.id) {
      return next()
    } else {
      return res.status(302).redirect('/login')
    }
  } catch (e) {
    console.log(e)
    return res.status(302).redirect('/login')
  }
};