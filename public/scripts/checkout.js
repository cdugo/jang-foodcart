const handleResult = (result) => {
  if (result.error) {
    const displayError = document.getElementById("error-message");

    document.write(result.error.message);
  }
};

const getCartItems = () => {
    return new Promise((resolve, reject) => {
        fetch('/cart/skus')
            .then((response) => resolve(response.json()))
            .catch(() => resolve([]))
    });
}

const checkout = async () => {
    const stripe = Stripe('pk_test_DAgckAhNkr5tX2V88LDdZBwD00APCpC7w8');

    stripe
    .redirectToCheckout({
      items: await getCartItems(),
      successUrl: window.location.origin + "/success?session_id={CHECKOUT_SESSION_ID}",
      cancelUrl: window.location.origin + "/canceled?session_id={CHECKOUT_SESSION_ID}"
    })
    .then(handleResult);
}

document.addEventListener('DOMContentLoaded', () => {
    const checkoutButton = document.getElementById('checkoutButton');

    checkoutButton.addEventListener('click', checkout);
});