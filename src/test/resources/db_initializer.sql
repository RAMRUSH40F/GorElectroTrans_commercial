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

