const similarProducts = [
    {
        name: 'Similar TV 1',
        price: 349.9,
        url: 'https://example.com/similar-tv-1',
        img: 'https://example.com/images/similar-tv-1.jpg',
        rating: 4.5,
        numReviews: 32
    },
    {
        name: 'Similar TV 2',
        price: 379.9,
        url: 'https://example.com/similar-tv-2',
        img: 'https://example.com/images/similar-tv-2.jpg',
        rating: 4.8,
        numReviews: 58
    },
    {
        name: 'Similar TV 3',
        price: 419.9,
        url: 'https://example.com/similar-tv-3',
        img: 'https://example.com/images/similar-tv-3.jpg',
        rating: 4.6,
        numReviews: 41
    }
];


export function logSimilarProducts(products) {
    products.forEach((product, index) => {
        /*console.log(`Similar Product ${index + 1}:`);
        console.log(`Name: ${product.name}`);
        console.log(`Price: ${product.price}`);
        console.log(`URL: ${product.url}`);
        console.log(`Image: ${product.img}`);
        console.log(`Rating: ${product.rating}`);
        console.log(`Number of Reviews: ${product.numReviews}`);
        console.log('------------------------');*/

    });
}

logSimilarProducts(similarProducts);