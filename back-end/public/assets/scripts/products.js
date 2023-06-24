const hasAdminJwtCookie = document.cookie.includes('adminJwt');
const adminButtons = document.querySelectorAll('.adminButton');

adminButtons?.forEach((adminButton) => {
  adminButton.style.display = hasAdminJwtCookie ? 'block' : 'none';
});

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
  if (!hasAdminJwtCookie) {
    alert('You are not logged in as admin');
    return;
  }
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

async function downloadProductsJson() {
  try {
    const products = await getProducts();
    const blob = new Blob([JSON.stringify(products)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'products.json';
    downloadLink.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    alert('Could not download products json');
  }
}

async function downloadProductsCsv() {
  try {
    const products = await getProducts();
    const csvHeader = Object.keys(products[0]).join(',') + '\n';
    const csvContent = products
      .map((product) => {
        return Object.values(product)
          .map((value) => {
            return value.toString().replaceAll(',', ' ');
          })
          .join(',');
      })
      .join('\n');

    const blob = new Blob([csvHeader + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'products.csv';
    downloadLink.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    alert('Could not download products csv');
  }
}

showProducts();
