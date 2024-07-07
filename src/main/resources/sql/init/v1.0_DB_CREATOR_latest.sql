
DROP DATABASE IF EXISTS DEP_1;
DROP DATABASE IF EXISTS DEP_2;
DROP DATABASE IF EXISTS DEP_3;
DROP DATABASE IF EXISTS DEP_4;
DROP DATABASE IF EXISTS DEP_5;
DROP DATABASE IF EXISTS DEP_6;
DROP DATABASE IF EXISTS DEP_7;
DROP DATABASE IF EXISTS DEP_8;
DROP DATABASE IF EXISTS DEP_9;
DROP DATABASE IF EXISTS DEP_10;
DROP DATABASE IF EXISTS DEP_11;
DROP DATABASE IF EXISTS DEP_12;
DROP DATABASE IF EXISTS DEP_13;
DROP DATABASE IF EXISTS DEP_14;
DROP DATABASE IF EXISTS DEP_15;


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

     CREATE DATABASE DEP_2;
                 USE DEP_2;

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

     CREATE DATABASE DEP_3;
                 USE DEP_3;
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


     CREATE DATABASE DEP_4;
                 USE DEP_4;

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



     CREATE DATABASE DEP_5;
                 USE DEP_5;

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




     CREATE DATABASE DEP_6;
                 USE DEP_6;

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




     CREATE DATABASE DEP_7;
                 USE DEP_7;

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




     CREATE DATABASE DEP_8;
                 USE DEP_8;

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





     CREATE DATABASE DEP_9;
                 USE DEP_9;

CREATE TABLE `lesson`(
  `id` MEDIUMINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, 
  `topic` VARCHAR(250) NOT NULL, 
  `duration` DECIMAL(5, 2)NOT NULL, 
  `date` DATE NOT NULL, 
  `teacher` VARCHAR(100) NOT NULL, 
  `people_planned` SMALLINT NOT NULL,
  `isHeld` TINYINT(1) NOT NULL, 
  `teacherPost` VARCHAR(40) NOT NULL 
);
ALTER TABLE 
  `lesson` 
ADD 
  INDEX `lesson_date_index`(`date`);
  
  
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




     CREATE DATABASE DEP_10;
                 USE DEP_10;

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





     CREATE DATABASE DEP_11;
                 USE DEP_11;

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





     CREATE DATABASE DEP_12;
                 USE DEP_12;

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




     CREATE DATABASE DEP_13;
                 USE DEP_13;

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




     CREATE DATABASE DEP_14;
                 USE DEP_14;
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




     CREATE DATABASE DEP_15;
                 USE DEP_15;

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



