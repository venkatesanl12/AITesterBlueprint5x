package com.aitester.salesforce.components;

import com.aitester.salesforce.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public final class Toast {
    private final By locator;
    private final WaitUtils waits;

    public Toast(WebDriver driver, By locator) {
        this.locator = locator;
        waits = new WaitUtils(driver);
    }

    public String text() {
        return waits.visible(locator).getText();
    }
}
