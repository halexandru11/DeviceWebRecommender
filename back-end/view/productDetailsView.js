import { getVendorName } from '../model/vendors.js';
import { getProductSpecificationsById } from '../model/products.js';
import { getProductImageUrlByProductId } from "../model/productImages.js";
import { generateProductCards } from './productView.js';
import { tempCard, productData} from './viewController.js';

async function replaceProductSpecificationsTemplate (temp, product) {
    let output = temp.replace(/{%PRODUCT_KEY%}/g, product.key);
    output = output.replace(/{%IMAGE_VALUE%}/g, product.value);
    return output;
  };
  
  export async function generateTableSpecifications(temp, product) {
    const promises = Object.entries(product).map(([key, value]) =>
      replaceProductSpecificationsTemplate(temp, { key, value })
    );
    const resolvedPromises = await Promise.all(promises);
    const cardsHtml = resolvedPromises.join("");
    return cardsHtml;
  }


  export async function replaceProductDetailsTemplate (temp, productId) {
    const product = await getProductSpecificationsById(productId);
    const vendorName = await getVendorName(product.vendor_id);
    const photoUrl = await getProductImageUrlByProductId(productId);
    const cardsHtml = await generateProductCards(productData, tempCard);
    let output = temp.replace(/{%PRODUCT_NAME%}/g, product.name);
    output = output.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
    output = output.replace(/{%IMAGE_SRC%}/g, photoUrl);
    output = output.replace(/{%PRODUCT_PRICE%}/g, product.price);
    output = output.replace(/{%PRODUCT_DESCRIPTION%}/g, product.description);
    output = output.replace(/{%PRODUCT_VENDOR%}/g, vendorName.name);
    return output;
  };