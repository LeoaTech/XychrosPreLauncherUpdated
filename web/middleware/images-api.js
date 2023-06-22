import { Shopify } from '@shopify/shopify-api';
import FormData from 'form-data';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const uploadShopImages = async (accessToken, shop) => {

    // const IMAGE_ENDPOINT = `https://${shop}/admin/api/2022-10`;

    // async function uploadImage(filePath, fileName) {
    //     const formData = new FormData();
    //     formData.append('file', fs.createReadStream(filePath), { filename: fileName });

    //     try {
    //         const response = await fetch(`${IMAGE_ENDPOINT}/themes/144005988661/assets.json`, {
    //             method: 'PUT',
    //             body: formData,
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //                 'X-Shopify-Access-Token': accessToken,
    //             },
    //         });
    //         if (!response.ok) {
    //             throw new Error('Failed to upload image');
    //         }
    //         const data = await response.json();
    //         return data.asset.public_url;
    //     } catch (error) {
    //         console.error('Error uploading image:', error);
    //         throw error;
    //     }
    // }

    // async function main() {
    //     const filePath = 'C:/Users/Dell/Documents/XychrosPreLauncherUpdated/web/test_assets';
    //     const fileName = 'food.png';
    //     try {
    //         const imageUrl = await uploadImage(filePath, fileName);
    //         console.log(`Image uploaded: ${imageUrl}`);
    //     } catch (error) {
    //         console.error('Error uploading image:', error);
    //     }
    // }

    // main();

    async function uploadImages() {
        try {
            const directoryPath = 'C:/Users/Dell/Documents/XychrosPreLauncherUpdated/web/test_assets'; //hardcoded
            const fileNames = await fs.promises.readdir(directoryPath);
            console.log(fileNames);

            for (const fileName of fileNames) {
                const imagePath = path.join(directoryPath, fileName);
                try {
                    await fs.promises.access(imagePath);
                } catch (err) {
                    console.log(`File not found: ${imagePath}`, err);
                    continue;
                }

                const imageBuffer = await fs.promises.readFile(imagePath);
                const assetKey = `assets/${fileName}`;

                const headers = {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': accessToken
                };

                const response = await fetch(`https://${shop}/admin/api/2021-07/themes/144005988661/assets.json`, {
                    method: 'PUT',
                    headers: headers,
                    body: JSON.stringify({
                        asset: {
                            key: assetKey,
                            attachment: imageBuffer.toString('base64'),
                        },
                    }),
                });

                const json = await response.json();
                console.log(json);
                if (json.asset && json.asset.public_url) {
                    console.log(`Image ${fileName} uploaded successfully!`);
                } else {
                    console.error(`Failed to upload image ${fileName}`, json.errors);
                }
            }
        } catch (err) {
            console.error('Failed to upload images', err);
        }
    }

    await uploadImages();
};



// ------------------- API ----------------
export default function upload_shopImages(app) {
    // route to get session
    app.get("/api/upload_shopimages", async (req, res) => {
        try {
            const session = await Shopify.Utils.loadCurrentSession(
                req,
                res,
                app.get("use-online-tokens")
            );
            const { accessToken, shop } = session;
            await uploadShopImages(accessToken, shop);
        }
        catch (error) {
            res.status(400).json({ success: false, message: "Failed to upload images", error: error.message });
        }
    });
}
