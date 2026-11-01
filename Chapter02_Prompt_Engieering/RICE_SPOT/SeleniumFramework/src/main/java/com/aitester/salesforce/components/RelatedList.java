package com.aitester.salesforce.components;

import com.aitester.salesforce.utils.WaitUtils;
import java.util.List;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public final class RelatedList {
    private final By rowsLocator;
    private final WaitUtils waits;

    public RelatedList(WebDriver driver, By rowsLocator) {
        this.rowsLocator = rowsLocator;
        waits = new WaitUtils(driver);
    }

    public List<WebElement> rows() {
        return waits.allVisible(rowsLocator);
    }
}
