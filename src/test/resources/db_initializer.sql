CREATE TABLE users
(
    username VARCHAR(30) PRIMARY KEY,
    PASSWORD VARCHAR(100),
    enabled  BOOLEAN
);


CREATE TABLE authorities
(
    username  VARCHAR(30),
    authority VARCHAR(25),
    FOREIGN KEY (username) REFERENCES users (username) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE `lesson`
(
    `id`             MEDIUMINT PRIMARY KEY AUTO_INCREMENT,
    `topic`          VARCHAR(250)  NOT NULL,
    `duration`       DECIMAL(5, 2) NOT NULL,
    `date`           DATE          NOT NULL,
    `teacher`        VARCHAR(100)  NOT NULL,
    `people_planned` INTEGER       NOT NULL,
    `isHeld`         INTEGER       NOT NULL,
    `teacherPost`    VARCHAR(40)   NOT NULL
);


CREATE TABLE `subdepartment`
(
    `id`   INTEGER PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL
);

CREATE TABLE `lesson_content`
(
    `file`      BLOB,
    `lesson_id` INTEGER NOT NULL,
    file_name   VARCHAR(120) PRIMARY KEY
);


CREATE TABLE `student`
(
    `student_id`       CHAR(5) PRIMARY KEY,
    `subdepartment_id` INTEGER      NOT NULL,
    `name`             VARCHAR(100) NOT NULL
);


CREATE TABLE `attendance`
(
    `lesson_id`  INTEGER,
    `student_id` CHAR(5),
    `success`    BOOLEAN,
    PRIMARY KEY (lesson_id, student_id)
);


-- VIEW


CREATE VIEW Attendance_view AS
SELECT student.name,
       attendance.lesson_id,
       lesson.date,
       attendance.student_id,
       attendance.success,
       lesson.topic,
       lesson.duration,
       lesson.teacher,
       subdepartment.name AS subdepartment
FROM attendance
         LEFT JOIN student
                   ON attendance.student_id = student.student_id
         LEFT JOIN subdepartment
                   ON subdepartment.id = student.subdepartment_id
         LEFT JOIN lesson
                   ON lesson.id = attendance.lesson_id;



CREATE VIEW Materials_view AS
SELECT lesson_content.lesson_id,
       lesson.date,
       lesson.topic,
       lesson_content.file_name
FROM lesson_content
         LEFT JOIN lesson ON lesson_content.lesson_id = lesson.id;


INSERT INTO users (username, PASSWORD, enabled)
VALUES ('JohnDoe', 'password123', 1);
INSERT INTO users (username, PASSWORD, enabled)
VALUES ('JaneSmith', 'hello123', 1);
INSERT INTO users (username, PASSWORD, enabled)
VALUES ('MarkJohnson', 'securepassword', 1);
INSERT INTO users (username, PASSWORD, enabled)
VALUES ('EmilyBrown', 'iloveyou', 1);
INSERT INTO users (username, PASSWORD, enabled)
VALUES ('MichaelLee', 'qwerty123', 1);
INSERT INTO users (username, PASSWORD, enabled)
VALUES ('OliviaWong', 'letmein', 1);
INSERT INTO users (username, PASSWORD, enabled)
VALUES ('AdamGarcia', 'football123', 1);
INSERT INTO users (username, PASSWORD, enabled)
VALUES ('IsabellaKim', 'password123', 1);
INSERT INTO users (username, PASSWORD, enabled)
VALUES ('JacobNguyen', '12345678', 1);
INSERT INTO users (username, PASSWORD, enabled)
VALUES ('SophiaChen', 'elcome123', 1);
INSERT INTO users (username, PASSWORD, enabled)
VALUES ('WilliamZhang', 'password123', 1);
INSERT INTO users (username, PASSWORD, enabled)
VALUES ('MiaTan', 'abc123', 1);
INSERT INTO users (username, PASSWORD, enabled)
VALUES ('JamesLiu', 'letmein123', 1);


INSERT INTO users (username, PASSWORD, enabled)
VALUES ('EthanHo', '12345678', 1);
INSERT INTO users (username, PASSWORD, enabled)
VALUES ('AvaWang', 'password123', 0);
INSERT INTO users (username, PASSWORD, enabled)
VALUES ('LolsaF', '125125', 1);

INSERT INTO authorities (username, authority)
VALUES ('LolsaF', 100);
INSERT INTO authorities (username, authority)
VALUES ('EthanHo', 1);
INSERT INTO authorities (username, authority)
VALUES ('JohnDoe', 2);
INSERT INTO authorities (username, authority)
VALUES ('JaneSmith', 3);
INSERT INTO authorities (username, authority)
VALUES ('MarkJohnson', 4);
INSERT INTO authorities (username, authority)
VALUES ('EmilyBrown', 5);
INSERT INTO authorities (username, authority)
VALUES ('MichaelLee', 6);
INSERT INTO authorities (username, authority)
VALUES ('OliviaWong', 7);
INSERT INTO authorities (username, authority)
VALUES ('AdamGarcia', 8);
INSERT INTO authorities (username, authority)
VALUES ('IsabellaKim', 9);
INSERT INTO authorities (username, authority)
VALUES ('JacobNguyen', 10);
INSERT INTO authorities (username, authority)
VALUES ('SophiaChen', 11);
INSERT INTO authorities (username, authority)
VALUES ('WilliamZhang', 12);
INSERT INTO authorities (username, authority)
VALUES ('MiaTan', 13);
INSERT INTO authorities (username, authority)
VALUES ('JamesLiu', 14);
INSERT INTO authorities (username, authority)
VALUES ('AvaWang', 15);

