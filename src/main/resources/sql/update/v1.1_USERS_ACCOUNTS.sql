DROP DATABASE IF EXISTS USERS;
CREATE DATABASE USERS;
USE USERS;

    

CREATE TABLE users (
  username VARCHAR(15), 
  PASSWORD VARCHAR(100), 
  enabled TINYINT(1), 
  PRIMARY KEY (username)
);


CREATE TABLE authorities (
  username VARCHAR(15), 
  authority VARCHAR(25), 
  FOREIGN KEY (username) REFERENCES users(username) ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO users (username, PASSWORD, enabled) VALUES ('JohnDoe', 'password123', 1);
INSERT INTO users (username, PASSWORD, enabled) VALUES ('JaneSmith', 'hello123', 1);
INSERT INTO users (username, PASSWORD, enabled) VALUES ('MarkJohnson', 'securepassword', 1);
INSERT INTO users (username, PASSWORD, enabled) VALUES ('EmilyBrown', 'iloveyou', 1);
INSERT INTO users (username, PASSWORD, enabled) VALUES ('MichaelLee', 'qwerty123', 1);
INSERT INTO users (username, PASSWORD, enabled) VALUES ('OliviaWong', 'letmein', 1);
INSERT INTO users (username, PASSWORD, enabled) VALUES ('AdamGarcia', 'football123', 1);
INSERT INTO users (username, PASSWORD, enabled) VALUES ('IsabellaKim', 'password123', 1);
INSERT INTO users (username, PASSWORD, enabled) VALUES ('JacobNguyen', '12345678', 1);
INSERT INTO users (username, PASSWORD, enabled) VALUES ('SophiaChen', 'elcome123', 1);
INSERT INTO users (username, PASSWORD, enabled) VALUES ('WilliamZhang', 'password123', 1);
INSERT INTO users (username, PASSWORD, enabled) VALUES ('MiaTan', 'abc123', 1);
INSERT INTO users (username, PASSWORD, enabled) VALUES ('JamesLiu', 'letmein123', 1);
INSERT INTO users (username, PASSWORD, enabled) VALUES ('AvaWang', 'password123', 1);
INSERT INTO users (username, PASSWORD, enabled) VALUES ('EthanHo', '12345678', 1);
INSERT INTO users (username, PASSWORD, enabled) VALUES ('LolsaF', '125125', 1);

INSERT INTO authorities (username, authority) VALUES ('LolsaF', 100);
INSERT INTO authorities (username, authority) VALUES ('EthanHo', 1);
INSERT INTO authorities (username, authority) VALUES ('JohnDoe', 2);
INSERT INTO authorities (username, authority) VALUES ('JaneSmith', 3);
INSERT INTO authorities (username, authority) VALUES ('MarkJohnson', 4);
INSERT INTO authorities (username, authority) VALUES ('EmilyBrown', 5);
INSERT INTO authorities (username, authority) VALUES ('MichaelLee', 6);
INSERT INTO authorities (username, authority) VALUES ('OliviaWong', 7);
INSERT INTO authorities (username, authority) VALUES ('AdamGarcia', 8);
INSERT INTO authorities (username, authority) VALUES ('IsabellaKim', 9);
INSERT INTO authorities (username, authority) VALUES ('JacobNguyen', 10);
INSERT INTO authorities (username, authority) VALUES ('SophiaChen', 11);
INSERT INTO authorities (username, authority) VALUES ('WilliamZhang', 12);
INSERT INTO authorities (username, authority) VALUES ('MiaTan', 13);
INSERT INTO authorities (username, authority) VALUES ('JamesLiu', 14);
INSERT INTO authorities (username, authority) VALUES ('AvaWang', 15);
