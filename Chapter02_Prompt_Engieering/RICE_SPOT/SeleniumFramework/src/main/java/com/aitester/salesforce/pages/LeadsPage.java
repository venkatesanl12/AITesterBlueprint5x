package com.aitester.salesforce.pages;

import com.aitester.salesforce.components.LightningInput;
import java.util.Map;
import org.openqa.selenium.WebDriver;

public final class LeadsPage extends BasePage {
    public LeadsPage(WebDriver driver) {
        super(driver);
    }

    public LeadsPage open() {
        driver.get(ConfigReaderUrl.baseUrl() + ConfigReaderUrl.path("sf.leads.path"));
        return this;
    }

    public void create(Map<String, String> fields) {
        click("sf.leads.new");
        fields.forEach((field, value) ->
                new LightningInput(driver, locator("sf.leads.field." + field)).enter(value));
        click("sf.leads.save");
    }

    public boolean recordVisible(String recordName) {
        return visible("sf.leads.record").getText().contains(recordName);
    }
}
