package com.aitester.salesforce.tests;

import com.aitester.salesforce.driver.DriverFactory;
import org.openqa.selenium.WebDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

public abstract class BaseTest {
    @BeforeMethod(alwaysRun = true)
    public void startBrowser() {
        DriverFactory.createDriver();
    }

    @AfterMethod(alwaysRun = true)
    public void closeBrowser() {
        DriverFactory.quitDriver();
    }

    protected WebDriver driver() {
        return DriverFactory.getDriver();
    }
}
