import { getProductSpecificationsById } from '../model/products.js';
import { getProductImageUrlByProductId } from "../model/productImages.js";
import { generateProductCards } from './productView.js';
import { tempCard, productData } from './viewController.js';

async function replaceProductSpecificationsTemplate(temp, product) {
    let output = temp.replace(/{%PRODUCT_KEY%}/g, product.key);
    output = output.replace(/{%PRODUCT_VALUE%}/g, product.value);
    return output;
};

export async function generateTableSpecifications(temp, product) {
    const promises = Object.entries(product).map(([key, value]) => {
        if (key !== 'id' && key !== 'url')
            return replaceProductSpecificationsTemplate(temp, { key, value })
    });
    const resolvedPromises = await Promise.all(promises);
    const cardsHtml = resolvedPromises.join("");
    return cardsHtml;
}

export async function replaceProductDetailsTemplate(temp, productId) {
    const product = await getProductSpecificationsById(productId);
    const photoUrl = await getProductImageUrlByProductId(productId);
    const cardsHtml = await generateProductCards(productData, tempCard);
    let output = temp.replace(/{%PRODUCT_NAME%}/g, product.name);
    output = output.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
    output = output.replace(/{%IMAGE_SRC%}/g, photoUrl);
    output = output.replace(/{%PRODUCT_URL%}/g, product.url)
    output = output.replace(/{%PRODUCT_PRICE%}/g, product.price);
    output = output.replace(/{%PRODUCT_DESCRIPTION%}/g, product.description);
    output = output.replace(/{%PRODUCT_VENDOR%}/g, product.vendor_name);
    output = output.replace(/{%PRODUCT_REVIEWS%}/g, product.numReviews);
    return output;
};

export async function addToWishlist() {
    const productId = req.url.split("=")[1];
    const product = await getProductSpecificationsById(productId);


    // Get the username of the current user (e.g., from the user session)
    const username = 'current_user';

    // Call the insertWishlistProductsIfNotExist function
    insertWishlistProductsIfNotExist([product], username)
        .then((response) => {
            // Handle the response (e.g., show success message, update UI)
            console.log(response);
        })
        .catch((error) => {
            // Handle any errors that occur during the process
            console.error(error);
        });
}