USE dep_1;
ALTER TABLE lesson
    ADD status varchar(20) NOT NULL DEFAULT 'PLANNED' ;
UPDATE lesson
SET status = CASE isHeld WHEN TRUE THEN 'HELD' ELSE status  END ;
USE dep_2;
ALTER TABLE lesson
    ADD status varchar(20) NOT NULL DEFAULT 'PLANNED' ;
UPDATE lesson
SET status = CASE isHeld WHEN TRUE THEN 'HELD' ELSE status  END ;
USE dep_3;
ALTER TABLE lesson
    ADD status varchar(20) NOT NULL DEFAULT 'PLANNED' ;
UPDATE lesson
SET status = CASE isHeld WHEN TRUE THEN 'HELD' ELSE status  END ;
USE dep_4;
ALTER TABLE lesson
    ADD status varchar(20) NOT NULL DEFAULT 'PLANNED' ;
UPDATE lesson
SET status = CASE isHeld WHEN TRUE THEN 'HELD' ELSE status  END ;
USE dep_5;
ALTER TABLE lesson
    ADD status varchar(20) NOT NULL DEFAULT 'PLANNED' ;
UPDATE lesson
SET status = CASE isHeld WHEN TRUE THEN 'HELD' ELSE status  END ;
USE dep_6;
ALTER TABLE lesson
    ADD status varchar(20) NOT NULL DEFAULT 'PLANNED' ;
UPDATE lesson
SET status = CASE isHeld WHEN TRUE THEN 'HELD' ELSE status  END ;
USE dep_7;
ALTER TABLE lesson
    ADD status varchar(20) NOT NULL DEFAULT 'PLANNED' ;
UPDATE lesson
SET status = CASE isHeld WHEN TRUE THEN 'HELD' ELSE status  END ;
USE dep_8;
ALTER TABLE lesson
    ADD status varchar(20) NOT NULL DEFAULT 'PLANNED' ;
UPDATE lesson
SET status = CASE isHeld WHEN TRUE THEN 'HELD' ELSE status  END ;
USE dep_9;
ALTER TABLE lesson
    ADD status varchar(20) NOT NULL DEFAULT 'PLANNED' ;
UPDATE lesson
SET status = CASE isHeld WHEN TRUE THEN 'HELD' ELSE status  END ;
USE dep_10;
ALTER TABLE lesson
    ADD status varchar(20) NOT NULL DEFAULT 'PLANNED' ;
UPDATE lesson
SET status = CASE isHeld WHEN TRUE THEN 'HELD' ELSE status  END ;
USE dep_11;
ALTER TABLE lesson
    ADD status varchar(20) NOT NULL DEFAULT 'PLANNED' ;
UPDATE lesson
SET status = CASE isHeld WHEN TRUE THEN 'HELD' ELSE status  END ;
USE dep_12;
ALTER TABLE lesson
    ADD status varchar(20) NOT NULL DEFAULT 'PLANNED' ;
UPDATE lesson
SET status = CASE isHeld WHEN TRUE THEN 'HELD' ELSE status  END ;
USE dep_13;
ALTER TABLE lesson
    ADD status varchar(20) NOT NULL DEFAULT 'PLANNED' ;
UPDATE lesson
SET status = CASE isHeld WHEN TRUE THEN 'HELD' ELSE status  END ;
USE dep_14;
ALTER TABLE lesson
    ADD status varchar(20) NOT NULL DEFAULT 'PLANNED' ;
UPDATE lesson
SET status = CASE isHeld WHEN TRUE THEN 'HELD' ELSE status  END ;
USE dep_15;
ALTER TABLE lesson
    ADD status varchar(20) NOT NULL DEFAULT 'PLANNED' ;
UPDATE lesson
SET status = CASE isHeld WHEN TRUE THEN 'HELD' ELSE status  END ;