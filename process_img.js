import { Jimp } from 'jimp';

async function processImage() {
    try {
        console.log("Loading image...");
        const image = await Jimp.read('public/ezgif-frame-001.png');

        // Scan each pixel and if it's close to the dark grey background, make it transparent
        const threshold = 15; // color distance threshold
        const targetColor = { r: 35, g: 35, b: 35 }; // Approximate dark grey background of the video

        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];

            // Check if dark grey (R, G, and B are close to target, and close to each other)
            if (r < 60 && g < 60 && b < 60 &&
                Math.abs(r - g) < 10 && Math.abs(g - b) < 10 && Math.abs(r - b) < 10 &&
                r > 10 && g > 10 && b > 10) {
                this.bitmap.data[idx + 3] = 0; // Alpha = 0 (transparent)
            }

            // Also knock out pure black artifacts
            if (r < 15 && g < 15 && b < 15) {
                this.bitmap.data[idx + 3] = 0;
            }
        });

        await image.write('public/ezgif-frame-001-transparent.png');
        console.log("Success");
    } catch (err) {
        console.error("Error:", err);
    }
}

processImage();
