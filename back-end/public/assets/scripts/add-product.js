const hasAdminJwtCookie = document.cookie.includes('adminJwt');

async function addProduct(product) {
  if (!hasAdminJwtCookie) {
    alert('You are not logged in as admin');
    return;
  }

  try {
    let url = 'http://localhost:3000/api/products';
    console.log('request url: ', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      alert('Could not add product');
    }
  } catch (err) {
    console.error('Error getting products: ', err);
  }
}

const addProductButton = document.getElementById('add-product');

addProductButton.addEventListener('click', async () => {
  console.log('Adding product');
  const name = document.getElementById('name').value;
  const url = document.getElementById('url').value;
  const price = document.getElementById('price').value;
  const rating = document.getElementById('rating').value;
  const numReviews = document.getElementById('numReviews').value;
  const img = document.getElementById('img').value;

  const product = {
    name,
    url,
    price,
    rating,
    numReviews,
    img,
  };

  await addProduct(product);
});
