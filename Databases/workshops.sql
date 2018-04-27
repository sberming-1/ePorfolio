DROP database IF EXISTS workshops;
create database workshops;
\c workshops

DROP table IF EXISTS workshops;
CREATE TABLE workshops (
    id serial PRIMARY KEY,
    title VARCHAR(225),
    date VARCHAR(10) not null,
    location VARCHAR(225),
    maxseats int,
    seatstaken int,
    instructor VARCHAR(225),
    UNIQUE (title,date,location)
);

DROP table IF EXISTS users;
CREATE TABLE users(
    firstname VARCHAR(225),
    lastname VARCHAR(225),
    username VARCHAR(225) PRIMARY KEY,
    email VARCHAR(225)
);

DROP table IF EXISTS attendees;
CREATE TABLE attendees(
    workshopid int,
    username VARCHAR(225),
    PRIMARY KEY (workshopid,username),
    FOREIGN KEY (workshopid) REFERENCES workshops(id),
    FOREIGN KEY (username) REFERENCES users(username)
);

INSERT INTO users VALUES ('Bob','Ross','bross','bross@mail.net');
INSERT INTO users VALUES ('Bill','Ross','bill.ross','bill.ross@mail.net');
INSERT INTO workshops (title,date,location,maxseats,seatstaken,instructor) VALUES ('Painting','2017-10-30','Virginia',30,0,'Bob Ross');



DROP ROLE IF EXISTS workshopmanager;
CREATE USER workshopmanager WITH PASSWORD 'reY5678Fgejad90';
GRANT ALL ON workshops,users,attendees,workshops_id_seq TO workshopmanager;