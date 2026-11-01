package com.aitester.salesforce.pages;

import com.aitester.salesforce.config.ConfigReader;
import org.openqa.selenium.WebDriver;

public final class LoginPage extends BasePage {
    public LoginPage(WebDriver driver) {
        super(driver);
    }

    public LoginPage open() {
        driver.get(ConfigReader.get("salesforce.baseUrl"));
        return this;
    }

    public HomePage login(String username, String password) {
        visible("sf.login.username").sendKeys(username);
        visible("sf.login.password").sendKeys(password);
        click("sf.login.submit");
        return new HomePage(driver);
    }
}
