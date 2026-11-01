package com.aitester.salesforce.components;

import com.aitester.salesforce.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public final class LightningButton {
    private final By locator;
    private final WaitUtils waits;

    public LightningButton(WebDriver driver, By locator) {
        this.locator = locator;
        waits = new WaitUtils(driver);
    }

    public void click() {
        waits.clickable(locator).click();
    }

    public WebElement element() {
        return waits.visible(locator);
    }
}
