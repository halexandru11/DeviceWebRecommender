function createProductCard(product, parentHTML) {
  const htmlString = `
    <div class="product-card">
        <div>
            <img src="${product.image}" class="product-card__image" alt="ProductImage">
            <div class="product-card__price">
              ${product.price} RON
            </div>
        </div>
        <h1 class="product-card__title">${product.name}</h1>
        <a href="/products/product=${product.id}">Details</a>
    </div>
  `;

  parentHTML.insertAdjacentHTML('beforeend', htmlString);
}

function clearProductCards() {
  const animalCards = document.querySelectorAll('.product-card');
  animalCards.forEach(function (animalCard) {
    animalCard.remove();
  });
}

async function getProducts() {
  try {
    const filters = JSON.parse(localStorage.getItem('selectedFilters')) || [];
    const filtersString = filters.join(',');

    let url = 'http://localhost:3000/api/products';
    if (filters.length !== 0) {
      url = `http://localhost:3000/api/products/filter=${filtersString}`;
    }

    console.log('request url: ', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      alert('Could not get products');
      return [];
    }
    return (await response.json()).products;
  } catch (err) {
    console.error('Error getting products: ', err);
    return [];
  }
}

async function showProducts() {
  clearProductCards();

  const productsListDiv = document.querySelector('.products-list');
  console.log(productsListDiv);
  const products = await getProducts();
  if (products) {
    products.forEach((product) => {
      createProductCard(product, productsListDiv);
    });
  }
}

async function startScraping() {
  try {
    const response = await fetch(
      'http://localhost:3000/api/admin/start-scraping',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) {
      alert('Could not start scraping');
      return;
    }
    alert('Scraping started');
  } catch (err) {
    console.error('Error starting scraping: ', err);
  }
}

showProducts();
