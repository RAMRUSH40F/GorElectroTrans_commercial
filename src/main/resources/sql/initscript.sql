

--
CREATE DATABASE DEP_1;
USE DEP_1;

CREATE TABLE `lesson`(
                         `id` MEDIUMINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                         `topic` VARCHAR(250) NOT NULL,
    `duration` DECIMAL(5, 2) NOT NULL,
    `date` DATE NOT NULL,
    `teacher` VARCHAR(100) NOT NULL,
    `people_planned` SMALLINT NOT NULL,
    `isHeld` TINYINT(1) NOT NULL,
    `teacherPost` VARCHAR(40) NOT NULL,
    INDEX `idx_date` (`date`),
    INDEX `idx_teacher` (`teacher`),
    INDEX `idx_topic` (`topic`)
    );

CREATE TABLE `subdepartment`(
                                `id` SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                                `name` VARCHAR(100) NOT NULL UNIQUE
    );

CREATE TABLE `lesson_content`(
                                 `file` MEDIUMBLOB,
                                 `lesson_id` MEDIUMINT UNSIGNED NOT NULL,
                                 file_name VARCHAR(120) PRIMARY KEY
    );
ALTER TABLE
    `lesson_content`
    ADD
    INDEX `lesson_content_lesson_id_index`(`lesson_id`);


CREATE TABLE `student`(
                          `student_id` CHAR(5) PRIMARY KEY,
    `subdepartment_id` SMALLINT UNSIGNED NOT NULL,
    `name` VARCHAR(100) NOT NULL
    );
ALTER TABLE
    `student`
    ADD
    INDEX `student_name_index`(`name`);

CREATE TABLE `attendance`(
                             `lesson_id` MEDIUMINT UNSIGNED,
                             `student_id` CHAR(5),
    `success` BIT(1) NOT NULL,
    PRIMARY KEY `lesson_id_student_id_PRIMARY_KEY`(`lesson_id`, `student_id`)
    );


ALTER TABLE
    `student`
    ADD
    CONSTRAINT `student_subdepartment_id_foreign` FOREIGN KEY(`subdepartment_id`) REFERENCES `subdepartment`(`id`)
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE
    `lesson_content`
    ADD
    CONSTRAINT `lesson_content_lesson_id_foreign` FOREIGN KEY(`lesson_id`) REFERENCES `lesson`(`id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `attendance`
    ADD
    CONSTRAINT `attendance_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `student`(`student_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE
    attendance
    ADD
        CONSTRAINT `attendance_lesson_id_foreign` FOREIGN KEY (`lesson_id`) REFERENCES `lesson`(`id`) ON UPDATE CASCADE ON DELETE CASCADE;

-- VIEW


CREATE VIEW attendance_view AS
SELECT 	student.name,
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
                   ON attendance.student_id=student.student_id
         LEFT JOIN subdepartment
                   ON subdepartment.id=student.subdepartment_id
         LEFT JOIN lesson
                   ON lesson.id=attendance.lesson_id;




CREATE VIEW Materials_view AS
SELECT lesson_content.lesson_id,
       lesson.date,
       lesson.topic,
       lesson_content.file_name
FROM lesson_content
         LEFT JOIN lesson ON lesson_content.lesson_id=lesson.id;


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


INSERT INTO users (username, PASSWORD, enabled) VALUES ('LolsaF', '125125', 1);

INSERT INTO authorities (username, authority) VALUES ('LolsaF', 100);

