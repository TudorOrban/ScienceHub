import { Builder, By } from 'selenium-webdriver';

async function firstTest() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('http://localhost:3000/workspace/issues');
        await driver.findElement(By.name('q')).sendKeys('Selenium');
        await driver.findElement(By.name('btnK')).click();
    } finally {
        await driver.quit();
    }
}

firstTest();



// firstTest();
