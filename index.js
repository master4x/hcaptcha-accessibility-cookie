const
    puppeteer = require('puppeteer-extra'),
    stealth = require('puppeteer-extra-plugin-stealth');

puppeteer.use(stealth());

(async () => {
    const
        browser = await puppeteer.launch(),
        emailPage = await browser.newPage(),
        hcaptchaPage = await browser.newPage();
    await emailPage.goto('https://temp-mail.org/');
    await emailPage.waitForSelector('#click-to-copy:not(:disabled)');
    const emailAddress = await emailPage.$eval('#mail', el => el.value);
    await hcaptchaPage.goto('https://dashboard.hcaptcha.com/signup?type=accessibility');
    await hcaptchaPage.waitForSelector('#email');
    await hcaptchaPage.type('#email', emailAddress.toString());
    await hcaptchaPage.click('[data-cy="button-submit"]');
    await hcaptchaPage.waitForSelector('h1[role="alert"]', { timeout: 0 });
    await hcaptchaPage.close();
    await emailPage.waitForSelector('[data-mail-id]', { timeout: 0 });
    await emailPage.click('[data-mail-id]');
    await emailPage.waitForSelector('a[href^="https://accounts.hcaptcha.com/verify_email/"]');
    await emailPage.click('a[href^="https://accounts.hcaptcha.com/verify_email/"]');
    await emailPage.goto(await emailPage.$eval('a[href^="https://accounts.hcaptcha.com/verify_email/"]', el => el.href));
    await emailPage.waitForSelector('[data-cy="setAccessibilityCookie"]');
    await emailPage.click('[data-cy="setAccessibilityCookie"]');
    await emailPage.waitForSelector('[data-cy="fetchStatus"]');
    await browser.close();
})();