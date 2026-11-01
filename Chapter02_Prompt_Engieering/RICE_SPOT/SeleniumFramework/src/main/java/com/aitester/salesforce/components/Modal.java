package com.aitester.salesforce.components;

import com.aitester.salesforce.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public final class Modal {
    private final By locator;
    private final WaitUtils waits;

    public Modal(WebDriver driver, By locator) {
        this.locator = locator;
        waits = new WaitUtils(driver);
    }

    public boolean isVisible() {
        return waits.visible(locator).isDisplayed();
    }
}
