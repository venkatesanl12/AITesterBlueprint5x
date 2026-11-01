package com.aitester.salesforce.tests;

import com.aitester.salesforce.api.SalesforceApiClient;
import com.aitester.salesforce.config.ConfigReader;
import com.aitester.salesforce.listeners.InfraRetryAnalyzer;
import com.aitester.salesforce.pages.LeadsPage;
import com.aitester.salesforce.pages.LoginPage;
import com.github.javafaker.Faker;
import java.util.Map;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public final class SalesforceLeadApiUiTest extends BaseTest {
    @DataProvider(name = "leadData", parallel = true)
    public Object[][] leadData() {
        Faker faker = new Faker();
        return new Object[][] {
                {faker.name().firstName(), faker.name().lastName(), faker.company().name()},
                {faker.name().firstName(), faker.name().lastName(), faker.company().name()}
        };
    }

    @Test(dataProvider = "leadData", retryAnalyzer = InfraRetryAnalyzer.class)
    public void apiCreatedLeadIsVisibleInLightning(String firstName, String lastName, String company) {
        require("salesforce.baseUrl", "salesforce.username", "salesforce.password",
                "salesforce.instanceUrl", "salesforce.accessToken", "sf.leads.path", "sf.leads.record");
        SalesforceApiClient api = new SalesforceApiClient();
        String leadId = api.createRecord("Lead", Map.of(
                "FirstName", firstName, "LastName", lastName, "Company", company));
        try {
            new LoginPage(driver()).open().login(
                    ConfigReader.get("salesforce.username"), ConfigReader.get("salesforce.password"));
            Assert.assertTrue(new LeadsPage(driver()).open().recordVisible(lastName),
                    "The API-created lead should appear in the configured Leads view");
        } finally {
            api.deleteRecord("Lead", leadId);
        }
    }

    private void require(String... keys) {
        for (String key : keys) {
            if (ConfigReader.getOrDefault(key, "").isBlank()) {
                throw new SkipException("Lead test requires configuration: " + key);
            }
        }
    }
}
