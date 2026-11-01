package com.aitester.salesforce.components;

import com.aitester.salesforce.utils.WaitUtils;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public final class LightningDatePicker {
    private final By locator;
    private final WaitUtils waits;

    public LightningDatePicker(WebDriver driver, By locator) {
        this.locator = locator;
        waits = new WaitUtils(driver);
    }

    public void enter(LocalDate date, DateTimeFormatter format) {
        WebElement input = waits.visible(locator);
        input.clear();
        input.sendKeys(format.format(date));
    }
}
