import { getProductImageUrlByProductId } from "../model/productImages.js";
import { productData } from './viewController.js';

async function replaceProductsTemplate (temp, product) {

    const photoUrl = await getProductImageUrlByProductId(product.id);
    let output = temp.replace(/{%PRODUCT_NAME%}/g, product.name);
    output = output.replace(/{%IMAGE_SRC%}/g, photoUrl);
    output = output.replace(/{%PRODUCT_PRICE%}/g, product.price);
    output = output.replace(/{%PRODUCT_ID%}/g, product.id);
    return output;
  };
  
export async function generateProductCards(data, tempCard) {
    const promises = productData.map((el) => replaceProductsTemplate(tempCard, el));
    const resolvedPromises = await Promise.all(promises);
    const cardsHtml = resolvedPromises.join("");
    return cardsHtml;
  }