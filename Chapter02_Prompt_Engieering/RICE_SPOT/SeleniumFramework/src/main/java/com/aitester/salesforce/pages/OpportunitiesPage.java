package com.aitester.salesforce.pages;

import org.openqa.selenium.WebDriver;

public final class OpportunitiesPage extends BasePage {
    public OpportunitiesPage(WebDriver driver) {
        super(driver);
    }

    public OpportunitiesPage open() {
        driver.get(ConfigReaderUrl.baseUrl() + ConfigReaderUrl.path("sf.opportunities.path"));
        return this;
    }

    public void selectStage(String stage) {
        visible("sf.opportunities.stage").sendKeys(stage);
        click("sf.opportunities.save");
    }

    public boolean recordVisible(String recordName) {
        return visible("sf.opportunities.record").getText().contains(recordName);
    }
}
