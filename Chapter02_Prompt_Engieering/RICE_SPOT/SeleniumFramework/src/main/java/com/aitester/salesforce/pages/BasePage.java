package com.aitester.salesforce.pages;

import com.aitester.salesforce.utils.JavaScriptUtils;
import com.aitester.salesforce.utils.LocatorResolver;
import com.aitester.salesforce.utils.ShadowDomUtils;
import com.aitester.salesforce.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public abstract class BasePage {
    protected final WebDriver driver;
    protected final WaitUtils waits;
    protected final ShadowDomUtils shadowDom;
    protected final JavaScriptUtils javascript;

    protected BasePage(WebDriver driver) {
        this.driver = driver;
        waits = new WaitUtils(driver);
        shadowDom = new ShadowDomUtils(driver);
        javascript = new JavaScriptUtils(driver);
    }

    protected By locator(String key) {
        return LocatorResolver.fromConfig(key);
    }

    protected WebElement visible(String key) {
        return waits.visible(locator(key));
    }

    protected void click(String key) {
        waits.clickable(locator(key)).click();
    }
}
