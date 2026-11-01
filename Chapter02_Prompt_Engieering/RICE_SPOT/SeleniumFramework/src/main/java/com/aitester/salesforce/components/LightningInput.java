package com.aitester.salesforce.components;

import com.aitester.salesforce.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public final class LightningInput {
    private final By locator;
    private final WaitUtils waits;

    public LightningInput(WebDriver driver, By locator) {
        this.locator = locator;
        waits = new WaitUtils(driver);
    }

    public void enter(String text) {
        WebElement input = waits.visible(locator);
        input.clear();
        input.sendKeys(text);
    }

    public String value() {
        return waits.visible(locator).getAttribute("value");
    }
}
