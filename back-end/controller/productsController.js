import { insertProducts } from '../model/products';

function loadPage(url) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        document.getElementById('app').innerHTML = data.output;
      } else {
        console.error('Error loading page:', xhr.status, xhr.responseText);
      }
    }
  };

  xhr.open('GET', url);
  xhr.send();
}

let productButton = document.querySelector('#products-btn');
productButton.addEventListener('click', function () {
  let xhr = new XMLHttpRequest();

  xhr.open('GET', 'http://localhost:3000/products/products.html', true);

  xhr.send();

  xhr.onload = function () {
    if (xhr.status === 200) {
      let products = JSON.parse(xhr.response);
      loadPage('/products/product-details.html');
    }
    if (xhr.status === 404) {
      console.log('404 Not Found');
    }
  };
});

function createProduct(data) {
  let xhr = new XMLHttpRequest();

  xhr.open('POST', 'http://localhost:3000/products/products.html', true);

  xhr.send();

  xhr.onload = function () {
    if (xhr.status === 200) {
      let products = JSON.parse(xhr.response);
      loadPage('/products/product-details.html');
    }
    if (xhr.status === 404) {
      console.log('404 Not Found');
    }
  };
}

function updateProduct(data) {
  let xhr = new XMLHttpRequest();

  xhr.open('PUT', 'http://localhost:3000/products/products.html', true);

  xhr.send();

  xhr.onload = function () {
    if (xhr.status === 200) {
      let products = JSON.parse(xhr.response);
      loadPage('/products/product-details.html');
    }
    if (xhr.status === 404) {
      console.log('404 Not Found');
    }
  };
}

function deleteProduct(data) {
  let xhr = new XMLHttpRequest();

  xhr.open('DELETE', 'http://localhost:3000/products/products.html', true);

  xhr.send();

  xhr.onload = function () {
    if (xhr.status === 200) {
      let products = JSON.parse(xhr.response);
      loadPage('/products/product-details.html');
    }
    if (xhr.status === 404) {
      console.log('404 Not Found');
    }
  };
}
