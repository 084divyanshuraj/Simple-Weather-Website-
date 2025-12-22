CREATE DATABASE weather_app;

USE weather_app;

CREATE TABLE search_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(100),
    temperature FLOAT,
    description VARCHAR(100),
    searched_at DATETIME
);
