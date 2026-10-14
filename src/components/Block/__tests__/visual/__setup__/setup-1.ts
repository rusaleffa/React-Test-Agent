// Setup for Block visual tests
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

// Настройка для разных разрешений
const viewports = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 }
};

export const setViewport = (viewport: keyof typeof viewports) => {
    global.innerWidth = viewports[viewport].width;
    global.innerHeight = viewports[viewport].height;
};
