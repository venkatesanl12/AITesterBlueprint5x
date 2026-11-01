package com.aitester.salesforce.components;

import com.aitester.salesforce.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public final class Spinner {
    private final By locator;
    private final WaitUtils waits;

    public Spinner(WebDriver driver, By locator) {
        this.locator = locator;
        waits = new WaitUtils(driver);
    }

    public boolean waitUntilHidden() {
        return waits.invisible(locator);
    }
}
