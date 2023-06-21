import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 10
}).promise();

export async function getProducts() {
    const [rows] = await pool.query('SELECT * FROM products');
    const products = [];
  
    rows.forEach(product => {
        let notNullAttributes = {};
        for (const key in product) {
            const value = product[key];
            if(value !== null && value !== '') {
                notNullAttributes[key] = value;
            }
        }
        products.push(notNullAttributes);
    });
    return products;
}

export async function getProductSpecificationsById(id) {
    const [result] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if(result.length === 0) {
        return null; }
    
    let notNullAttributes = {};
    for (const key in result[0]) {
        const value = result[0][key];
        if(value !== null && value !== '') {
            notNullAttributes[key] = value;
        }
    }
    return notNullAttributes;
}

export async function getProductsSpecsAsArray(id) {
    const specs = await getProductSpecificationsById(id);

    //return specs as array of key value pairs
    const specsArray = [];

    for (const key in specs) {
        const value = specs[key];
        specsArray.push({key, value});
    }
    return specsArray;
}

export async function getProductById(id) {
    const [result] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if(result.length === 0) {
        return null; }
    return {
        id: result[0].id,
        url: result[0].url,
        name: result[0].name,
        description: result[0].description,
        vendor_id: result[0].vendor_id,
        price: result[0].price,
        rating: result[0].rating,
        color: result[0].color,
        device_type_id: result[0].device_type_id,
        general_characteristics: result[0].general_characteristics,
        technical_characteristics: result[0].technical_characteristics,
        processor: result[0].processor,
        mother_board: result[0].mother_board,
        hard_disk: result[0].hard_disk,
        graphics_card: result[0].graphics_card,
        memory: result[0].memory,
        storage: result[0].storage,
        display: result[0].display,
        connectivity: result[0].connectivity,
        autonomy: result[0].autonomy,
        charging: result[0].charging,
        efficiency: result[0].efficiency,
        multimedia: result[0].multimedia,
        photo_video: result[0].photo_video,
        audio: result[0].audio,
        weight: result[0].weight,
        dimensions: result[0].dimensions,
        operating_system: result[0].operating_system,
        warranty: result[0].warranty,
        created_at: result[0].created_at,
        updated_at: result[0].updated_at
    }
}

async function getProductUrl(id) {
    const [rows] = await pool.query('SELECT url FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductName(id) {
    const [rows] = await pool.query('SELECT name FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductDescription(id) {
    const [rows] = await pool.query('SELECT description FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductVendorId(id) {
    const [rows] = await pool.query('SELECT vendor_id FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductPrice(id) {
    const [rows] = await pool.query('SELECT price FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductRating(id) {
    const [rows] = await pool.query('SELECT rating FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductColor(id) {
    const [rows] = await pool.query('SELECT color FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductDevicTypeId(id) {
    const [rows] = await pool.query('SELECT device_type_id FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductGeneralCharacteristics(id) {
    const [rows] = await pool.query('SELECT general_characteristics FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductTechnicalCharacteristics(id) {
    const [rows] = await pool.query('SELECT technical_characteristics FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductProcessor(id) {
    const [rows] = await pool.query('SELECT processor FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductMotherboard(id) {
    const [rows] = await pool.query('SELECT mother_board FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductHardDisk(id) {
    const [rows] = await pool.query('SELECT hard_disk FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductGraphicsCard(id) {
    const [rows] = await pool.query('SELECT graphics_card FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductMemory(id) {
    const [rows] = await pool.query('SELECT memory FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductStorage(id) {
    const [rows] = await pool.query('SELECT storage FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductDisplay(id) {
    const [rows] = await pool.query('SELECT display FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductConnectivity(id) {
    const [rows] = await pool.query('SELECT connectivity FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductAutonomy(id) {
    const [rows] = await pool.query('SELECT autonomy FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductCharging(id) {
    const [rows] = await pool.query('SELECT charging FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductEfficiency(id) {
    const [rows] = await pool.query('SELECT efficiency FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductMultimedia(id) {
    const [rows] = await pool.query('SELECT multimedia FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductPhotoVideo(id) {
    const [rows] = await pool.query('SELECT photo_video FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductAudio(id) {
    const [rows] = await pool.query('SELECT audio FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductSoftware(id) {
    const [rows] = await pool.query('SELECT software FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductFunctions(id) {
    const [rows] = await pool.query('SELECT functions FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductSmartTv(id) {
    const [rows] = await pool.query('SELECT smart_tv FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductDimensions(id) {
    const [rows] = await pool.query('SELECT dimentions FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductCasing(id) {
    const [rows] = await pool.query('SELECT casing FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductAccessories(id) {
    const [rows] = await pool.query('SELECT accessories FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductEnergyConsumption(id) {
    const [rows] = await pool.query('SELECT energy_consumption FROM products WHERE id = ?', [id]);
    return rows[0];
}

async function getProductBrand(id) {
    const [rows] = await pool.query('SELECT brand FROM products WHERE id = ?', [id]);
    return rows[0];
}


export async function testProductsTable() {

    try {
        const notes = await getProducts();
        console.log('All Notes:\n', notes);
  
        const note = await getProductById(1);
        console.log('\n\nNote with ID 1:\n', note);

        const url = await getProductUrl(1);
        console.log('\n\nUrl with ID 1:\n', url);

        const name = await getProductName(1);
        console.log('\n\nName with ID 1:\n', name);

        const description = await getProductDescription(1);
        console.log('\n\nDescription with ID 1:\n', description);

        const vendor_id = await getProductVendorId(1);
        console.log('\n\nVendor_id with ID 1:\n', vendor_id);

        const price = await getProductPrice(1);
        console.log('\n\nPrice with ID 1:\n', price);

        const rating = await getProductRating(1);
        console.log('\n\nRating with ID 1:\n', rating);

        const color = await getProductColor(1);
        console.log('\n\nColor with ID 1:\n', color);

        const device_type_id = await getProductDevicTypeId(1);
        console.log('\n\nDevice_type_id with ID 1:\n', device_type_id);

        const general_characteristics = await getProductGeneralCharacteristics(1);
        console.log('\n\nGeneral_characteristics:\n', general_characteristics);

        const technical_characteristics = await getProductTechnicalCharacteristics(1);
        console.log('\n\nTechnical_characteristics:\n', technical_characteristics);

        const processor = await getProductProcessor(1);
        console.log('\n\nProcessor:\n', processor);

        const motherboard = await getProductMotherboard(1);
        console.log('\n\nMotherboard:\n', motherboard);

        const hard_disk = await getProductHardDisk(1);
        console.log('\n\nHard_disk:\n', hard_disk);

        const graphics_card = await getProductGraphicsCard(1);
        console.log('\n\nGraphics_card:\n', graphics_card);

        const memory = await getProductMemory(1);
        console.log('\n\nMemory:\n', memory);

        const storage = await getProductStorage(1);
        console.log('\n\nStorage:\n', storage);

        const display = await getProductDisplay(1);
        console.log('\n\nDisplay:\n', display);

        const connectivity = await getProductConnectivity(1);
        console.log('\n\nConnectivity:\n', connectivity);

        const autonomy = await getProductAutonomy(1);
        console.log('\n\nAutonomy:\n', autonomy);

        const charging = await getProductCharging(1);
        console.log('\n\nCharging:\n', charging);

        const efficiency = await getProductEfficiency(1);
        console.log('\n\nEfficiency:\n', efficiency);

        const multimedia = await getProductMultimedia(1);
        console.log('\n\nMultimedia:\n', multimedia);

        const photo_video = await getProductPhotoVideo(1);
        console.log('\n\nPhoto_video:\n', photo_video);

        const audio = await getProductAudio(1);
        console.log('\n\nAudio:\n', audio);

        const software = await getProductSoftware(1);
        console.log('\n\nSoftware:\n', software);

        const functions = await getProductFunctions(1);
        console.log('\n\nFunctions:\n', functions);

        const smart_tv = await getProductSmartTv(1);
        console.log('\n\nSmart_tv:\n', smart_tv);

        const dimensions = await getProductDimensions(1);
        console.log('\n\nDimensions:\n', dimensions);

        const casing = await getProductCasing(1);
        console.log('\n\nCasing:\n', casing);

        const accessories = await getProductAccessories(1);
        console.log('\n\nAccessories:\n', accessories);

        const energy_consumption = await getProductEnergyConsumption(1);
        console.log('\n\nEnergy_consumption:\n', energy_consumption);

        const brand = await getProductBrand(1);
        console.log('\n\nBrand:\n', brand);

    } 
    catch (error) {
        console.error('Error occurred:', error);
    } 
    finally {
        pool.end();
    }

}