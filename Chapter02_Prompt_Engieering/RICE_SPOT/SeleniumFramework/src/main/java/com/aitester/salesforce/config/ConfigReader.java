package com.aitester.salesforce.config;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.Properties;

public final class ConfigReader {
    private static final Properties PROPERTIES = load();

    private ConfigReader() {
    }

    public static String get(String key) {
        String system = System.getProperty(key);
        if (hasText(system)) return system.trim();
        String environment = System.getenv(environmentKey(key));
        if (hasText(environment)) return environment.trim();
        String configured = PROPERTIES.getProperty(key);
        if (hasText(configured)) return configured.trim();
        throw new IllegalStateException("Missing required configuration: " + key);
    }

    public static String getOrDefault(String key, String fallback) {
        String system = System.getProperty(key);
        if (hasText(system)) return system.trim();
        String environment = System.getenv(environmentKey(key));
        if (hasText(environment)) return environment.trim();
        String configured = PROPERTIES.getProperty(key);
        return hasText(configured) ? configured.trim() : fallback;
    }

    public static boolean getBoolean(String key, boolean fallback) {
        String value = getOrDefault(key, Boolean.toString(fallback));
        if (!"true".equalsIgnoreCase(value) && !"false".equalsIgnoreCase(value)) {
            throw new IllegalArgumentException(key + " must be true or false");
        }
        return Boolean.parseBoolean(value);
    }

    public static int getInt(String key, int fallback) {
        try {
            return Integer.parseInt(getOrDefault(key, Integer.toString(fallback)));
        } catch (NumberFormatException exception) {
            throw new IllegalArgumentException(key + " must be an integer", exception);
        }
    }

    private static Properties load() {
        String configPath = System.getProperty("config.file", "src/test/resources/config/dev.properties");
        Properties properties = new Properties();
        loadFileOrResource(configPath, properties);
        loadFileOrResource(System.getProperty("locators.file", "src/test/resources/locators.properties"), properties);
        return properties;
    }

    private static void loadFileOrResource(String pathValue, Properties properties) {
        Path path = Path.of(pathValue);
        if (Files.isRegularFile(path)) {
            try (InputStream input = Files.newInputStream(path)) {
                properties.load(input);
                return;
            } catch (IOException exception) {
                throw new IllegalStateException("Could not read properties file: " + path, exception);
            }
        }
        String resource = pathValue.startsWith("classpath:")
                ? pathValue.substring("classpath:".length()).replaceFirst("^/", "")
                : pathValue;
        try (InputStream input = ConfigReader.class.getClassLoader().getResourceAsStream(resource)) {
            if (input == null) {
                throw new IllegalStateException("Properties file does not exist: " + pathValue);
            }
            properties.load(input);
        } catch (IOException exception) {
            throw new IllegalStateException("Could not read properties resource: " + pathValue, exception);
        }
    }

    private static String environmentKey(String key) {
        String normalized = key.replaceAll("([a-z0-9])([A-Z])", "$1_$2")
                .replace('.', '_').replace('-', '_').toUpperCase(Locale.ROOT);
        return normalized.startsWith("SALESFORCE_")
                ? "SF_" + normalized.substring("SALESFORCE_".length())
                : normalized;
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
