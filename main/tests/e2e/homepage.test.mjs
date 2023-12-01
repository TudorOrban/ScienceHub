import { Builder, By } from 'selenium-webdriver';

async function firstTest() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('http://localhost:3000/workspace/issues'); // Replace with a valid URL
        await driver.findElement(By.name('q')).sendKeys('Selenium');
        await driver.findElement(By.name('btnK')).click();
        // Add more actions here
    } finally {
        await driver.quit();
    }
}

firstTest();



// firstTest();
