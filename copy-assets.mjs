import { copyFileSync } from 'fs';

const src = 'C:/Users/hrida/.gemini/antigravity/brain/2ed9d892-d47f-40ef-ae91-1fddfca42594/';
const certDst = 'C:/Users/hrida/Documents/projects/portfoliov2/public/assets/certificates/';
const projDst = 'C:/Users/hrida/Documents/projects/portfoliov2/public/assets/projects/';

copyFileSync(src + 'media__1773759863844.png', certDst + 'cloud-computing-nptel.png');
copyFileSync(src + 'media__1773759524640.png', projDst + 'flight-route-optimizer.png');
copyFileSync(src + 'media__1773759946036.png', projDst + 'organizo.png');

console.log('✅ All 3 files copied successfully!');
