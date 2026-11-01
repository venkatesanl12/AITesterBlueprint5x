package com.aitester.salesforce.components;

import com.aitester.salesforce.utils.WaitUtils;
import java.util.NoSuchElementException;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public final class LightningCombobox {
    private final By trigger;
    private final By options;
    private final WaitUtils waits;

    public LightningCombobox(WebDriver driver, By trigger, By options) {
        this.trigger = trigger;
        this.options = options;
        waits = new WaitUtils(driver);
    }

    public void selectVisibleText(String text) {
        waits.clickable(trigger).click();
        WebElement option = waits.allVisible(options).stream()
                .filter(element -> element.getText().trim().equals(text))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Visible option not found: " + text));
        option.click();
    }
}
