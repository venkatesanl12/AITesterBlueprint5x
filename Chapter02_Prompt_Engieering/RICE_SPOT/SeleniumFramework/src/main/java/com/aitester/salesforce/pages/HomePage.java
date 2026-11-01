package com.aitester.salesforce.pages;

import org.openqa.selenium.WebDriver;

public final class HomePage extends BasePage {
    public HomePage(WebDriver driver) {
        super(driver);
    }

    public HomePage waitUntilLoaded() {
        visible("sf.home.ready");
        return this;
    }

    public boolean isLoaded() {
        return visible("sf.home.ready").isDisplayed();
    }

    public void logout() {
        click("sf.home.logout");
    }
}
