package com.aitester.salesforce.api;

import com.aitester.salesforce.config.ConfigReader;
import io.restassured.response.Response;
import java.util.Map;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import static io.restassured.RestAssured.given;

public final class SalesforceApiClient {
    private static final Logger LOGGER = LogManager.getLogger(SalesforceApiClient.class);
    private final String instanceUrl;
    private final String accessToken;
    private final String apiVersion;

    public SalesforceApiClient() {
        instanceUrl = ConfigReader.get("salesforce.instanceUrl").replaceAll("/+$", "");
        accessToken = ConfigReader.get("salesforce.accessToken");
        apiVersion = ConfigReader.getOrDefault("salesforce.apiVersion", "v60.0");
    }

    public String createRecord(String objectApiName, Map<String, ?> fields) {
        Response response = given()
                .baseUri(instanceUrl)
                .basePath("/services/data/" + apiVersion + "/sobjects/" + objectApiName)
                .auth().oauth2(accessToken)
                .contentType("application/json")
                .body(fields)
                .post();
        response.then().statusCode(201);
        String id = response.jsonPath().getString("id");
        if (id == null || id.isBlank()) {
            throw new IllegalStateException("Salesforce did not return an ID for " + objectApiName);
        }
        LOGGER.info("Created Salesforce {} record {}", objectApiName, id);
        return id;
    }

    public void deleteRecord(String objectApiName, String recordId) {
        given()
                .baseUri(instanceUrl)
                .basePath("/services/data/" + apiVersion + "/sobjects/" + objectApiName + "/" + recordId)
                .auth().oauth2(accessToken)
                .delete()
                .then().statusCode(204);
        LOGGER.info("Deleted Salesforce {} record {}", objectApiName, recordId);
    }

    public Response query(String soql) {
        return given()
                .baseUri(instanceUrl)
                .basePath("/services/data/" + apiVersion + "/query")
                .auth().oauth2(accessToken)
                .queryParam("q", soql)
                .get()
                .then().statusCode(200)
                .extract().response();
    }
}
