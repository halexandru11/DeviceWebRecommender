function exportAsJson() {
  const url = window.location.href;
  let reqUrl;
  if (url.includes('products.html')) {
    reqUrl = '/products/products.html';
  } else {
    reqUrl = '/';
  }

  const data = { type: 'json' };

  fetch(reqUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      console.log(response);
      if (response.ok) {
        console.log('success');
      } else {
        console.log('error');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function exportAsCsv() {
  const url = window.location.href;
  let reqUrl;
  if (url.includes('products.html')) {
    reqUrl = '/products/products.html';
  } else {
    reqUrl = '/';
  }

  const data = { type: 'csv' };

  fetch(reqUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      console.log(response);
      if (response.ok) {
        console.log('success');
      } else {
        console.log('error');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
