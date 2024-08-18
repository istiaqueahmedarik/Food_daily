CREATE TABLE USERS (
    ID VARCHAR2(36) PRIMARY KEY,
    FIRST_NAME VARCHAR2(255) NOT NULL,
    LAST_NAME VARCHAR2(255) NOT NULL,
    DOB DATE NOT NULL,
    ADDRESS VARCHAR2(255) NOT NULL,
    MOBILE VARCHAR2(255) NOT NULL,
    CITY_CODE VARCHAR2(255) NOT NULL,
    EMAIL VARCHAR2(255) NOT NULL,
    PASSWORD VARCHAR2(255) NOT NULL,
    TYPE VARCHAR2(255) DEFAULT 'USER' NOT NULL, -- USER, ADMIN
    PROFILE_IMAGE VARCHAR2(255) DEFAULT 'https://placehold.co/600x400'
);

CREATE TABLE QA_OFFICER (
    ID VARCHAR2(36) PRIMARY KEY,
    USER_ID VARCHAR2(36) NOT NULL,
    ACADEMIC_QUALIFICATION VARCHAR2(1024) NOT NULL,
    APPROVED NUMBER(1) DEFAULT 0 CHECK (APPROVED IN (0, 1)),
    CV_LINK VARCHAR2(1024) NOT NULL,
    DATE_OF_JOINING DATE DEFAULT SYSDATE,
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
);

CREATE TABLE CATEGORY (
    ID VARCHAR2(36) PRIMARY KEY,
    KITCHEN_ID VARCHAR2(36) NOT NULL,
    NAME VARCHAR2(100) NOT NULL,
    DESCRIPTION VARCHAR2(300) NOT NULL,
    CATEGORY_IMAGE VARCHAR2(300) DEFAULT 'https://placehold.co/600x400',
    FOREIGN KEY (KITCHEN_ID) REFERENCES KITCHEN(ID)
);

CREATE SEQUENCE SEQUENCE9
             START WITH 1;

CREATE OR REPLACE TRIGGER TRIGGER9 BEFORE
    INSERT ON CATEGORY FOR EACH ROW
BEGIN
    :NEW.ID := 'CAT'
               || SEQUENCE9.NEXTVAL;
END;

CREATE TABLE CHEF ( ID VARCHAR2(36) PRIMARY KEY, USER_ID VARCHAR2(36) NOT NULL, SPECIALITY VARCHAR2(100) NOT NULL, RATING NUMBER DEFAULT 0, EXPERIENCE NUMBER DEFAULT 0, FOREIGN KEY (USER_ID) REFERENCES USERS(ID) );
/

SELECT
    *
FROM
    CHEF;

/

CREATE TABLE CERTIFICATION (
    ID VARCHAR2(36) PRIMARY KEY,
    CHEF_ID VARCHAR2(36) NOT NULL,
    CERTIFICATION VARCHAR2(300) UNIQUE NOT NULL,
    ISSUE_DATE DATE NOT NULL,
    EXPIRY_DATE DATE,
    LINK VARCHAR2(300) UNIQUE NOT NULL,
    FOREIGN KEY (CHEF_ID) REFERENCES CHEF(ID),
    CERTIFICATE_IMAGE VARCHAR2(300) DEFAULT 'https://placehold.co/600x400'
);

/

CREATE TABLE KITCHEN (
    ID VARCHAR2(36) PRIMARY KEY,
    NAME VARCHAR2(100) NOT NULL,
    ADDRESS VARCHAR2(100) NOT NULL,
    RATING NUMBER DEFAULT 0,
    CITY_NAME VARCHAR2(100) NOT NULL,
    CHEF_ID VARCHAR2(36) NOT NULL,
    APPROVED NUMBER(1) DEFAULT 0 CHECK (APPROVED IN (0, 1)),
    FOREIGN KEY (CHEF_ID) REFERENCES CHEF(ID)
);

/

CREATE TABLE KITCHEN_IMAGES(
    ID VARCHAR2(36) PRIMARY KEY,
    KITCHEN_ID VARCHAR2(36) NOT NULL,
    IMAGE VARCHAR2(255) DEFAULT 'https://placehold.co/600x400',
    DATE_ADDED DATE DEFAULT SYSDATE,
    FOREIGN KEY (KITCHEN_ID) REFERENCES KITCHEN(ID)
);

/

CREATE TABLE FOOD (
    ID VARCHAR2(36) PRIMARY KEY,
    NAME VARCHAR2(255) NOT NULL,
    DESCRIPTION VARCHAR2(300) NOT NULL,
    PRICE NUMBER NOT NULL,
    RATING NUMBER DEFAULT 0,
    CATEGORY_ID VARCHAR2(36) NOT NULL,
    FOOD_IMAGE VARCHAR2(255) DEFAULT 'https://placehold.co/600x400',
    FOREIGN KEY (CATEGORY_ID) REFERENCES CATEGORY(ID)
);

/

CREATE TABLE INGREDIENT (
    ID VARCHAR2(36) PRIMARY KEY,
    FOOD_ID VARCHAR2(36) NOT NULL,
    NAME VARCHAR2(255) NOT NULL,
    QUANTITY NUMBER NOT NULL,
    CALORIES NUMBER NOT NULL,
    FOREIGN KEY (FOOD_ID) REFERENCES FOOD(ID)
);

/

CREATE TABLE CART (
    ID VARCHAR2(36) PRIMARY KEY,
    USER_ID VARCHAR2(36) NOT NULL,
    FOOD_ID VARCHAR2(36) NOT NULL,
    QUANTITY NUMBER NOT NULL,
    DATE_ADDED DATE DEFAULT SYSDATE,
    DELETED NUMBER(1) DEFAULT 0 CHECK (DELETED IN (0, 1)),
    DELETED_ID VARCHAR2(255),
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID),
    FOREIGN KEY (FOOD_ID) REFERENCES FOOD(ID),
    FOREIGN KEY (DELETED_ID) REFERENCES ORDERS(ID)
);

/

CREATE TABLE ORDERS (
    ID VARCHAR2(255) PRIMARY KEY,
    USER_ID VARCHAR2(36) NOT NULL,
    TOTAL NUMBER DEFAULT 0,
    DATE_ADDED DATE DEFAULT SYSDATE,
    DATE_SHIPPED DATE,
    DATE_DELIVERED DATE,
    SHIPPING_ADD VARCHAR2(3255) NOT NULL,
    SHIPPING_PHONE VARCHAR2(255) NOT NULL,
    SHIPPING_NAME VARCHAR2(255) NOT NULL,
    STATUS VARCHAR2(255) DEFAULT 'PAID' NOT NULL,
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
);

-- SELECT
--     *
-- FROM
--     USERS
-- WHERE
--     UTL_MATCH.EDIT_DISTANCE(ID, 'U1') < 5;

-- SELECT
--     FIRST_NAME,
--     UTL_MATCH.JARO_WINKLER_SIMILARITY(FIRST_NAME, 'Istiaque') AS SIMILARITY_SCORE
-- FROM
--     USERS;

CREATE TABLE ACTIVE_DELIVERY (
    ID VARCHAR2(36) PRIMARY KEY,
    ORDER_ID VARCHAR2(36) NOT NULL,
    DELIVERY_PARTNER_ID VARCHAR2(36) NOT NULL,
    STATUS VARCHAR2(255) DEFAULT 'PENDING' NOT NULL,
    FOREIGN KEY (ORDER_ID) REFERENCES ORDERS(ID),
    FOREIGN KEY (DELIVERY_PARTNER_ID) REFERENCES USERS(ID)
);

SELECT
    *
FROM
    ACTIVE_DELIVERY;

CREATE SEQUENCE ACTIVE_DELIVERY_SEQ START WITH 1;

CREATE OR REPLACE TRIGGER ACTIVE_DELIVERY_TRIGGER BEFORE
    INSERT ON ACTIVE_DELIVERY FOR EACH ROW
BEGIN
    :NEW.ID := 'AD'
               || ACTIVE_DELIVERY_SEQ.NEXTVAL;
END;

CREATE TABLE DELIVERY_PARTNER ( ID VARCHAR2(36) PRIMARY KEY, USER_ID VARCHAR2(36) NOT NULL, LICENSE VARCHAR2(255) NOT NULL, VEHICLE VARCHAR2(255) NOT NULL, FOREIGN KEY (USER_ID) REFERENCES USERS(ID) );
CREATE OR REPLACE TRIGGER DELIVERY_PARTNER_TRIGGER BEFORE INSERT ON DELIVERY_PARTNER FOR EACH ROW BEGIN :NEW.ID := 'DP'
                                                                                                                   || DELIVERY_PARTNER_SEQUENCE.NEXTVAL;
END;
SELECT
    *
FROM
    ORDERS;
/

CREATE SEQUENCE CART_SEQUENCE START WITH 1;

/

CREATE OR REPLACE TRIGGER CART_TRIGGER BEFORE
    INSERT ON CART FOR EACH ROW
BEGIN
    :NEW.ID := 'CART'
               || CART_SEQUENCE.NEXTVAL;
END;
/

CREATE SEQUENCE INGREDIENT_SEQUENCE START WITH 1;

/

CREATE OR REPLACE TRIGGER INGREDIENT_TRIGGER BEFORE
    INSERT ON INGREDIENT FOR EACH ROW
BEGIN
    :NEW.ID := 'I'
               || INGREDIENT_SEQUENCE.NEXTVAL;
END;
/

CREATE SEQUENCE FOOD_SEQUENCE START WITH 1;

/

CREATE OR REPLACE TRIGGER FOOD_TRIGGER BEFORE
    INSERT ON FOOD FOR EACH ROW
BEGIN
    :NEW.ID := 'F'
               || FOOD_SEQUENCE.NEXTVAL;
END;
/

CREATE SEQUENCE SEQUENCE1 START WITH 1;

CREATE OR REPLACE TRIGGER TRIGGER1 BEFORE
    INSERT ON USERS FOR EACH ROW
BEGIN
    :NEW.ID := 'U'
               || SEQUENCE1.NEXTVAL;
END;
/

CREATE SEQUENCE SEQUENCE2
             START WITH 1;

CREATE OR REPLACE TRIGGER TRIGGER2 BEFORE
    INSERT ON CHEF FOR EACH ROW
BEGIN
    :NEW.ID := 'C'
               || SEQUENCE2.NEXTVAL;
END;
/

CREATE SEQUENCE SEQUENCE3
             START WITH 1;

CREATE OR REPLACE TRIGGER TRIGGER3 BEFORE
    INSERT ON CERTIFICATION FOR EACH ROW
BEGIN
    :NEW.ID := 'CER'
               || SEQUENCE3.NEXTVAL;
END;

CREATE SEQUENCE SEQUENCE4 START WITH 1;
CREATE OR REPLACE TRIGGER TRIGGER4 BEFORE INSERT ON KITCHEN FOR EACH ROW BEGIN :NEW.ID := 'K'
                                                                                          || SEQUENCE4.NEXTVAL;
END;
CREATE SEQUENCE SEQUENCE7 START WITH 1;
CREATE OR REPLACE TRIGGER TRIGGER7 BEFORE INSERT ON KITCHEN_IMAGES FOR EACH ROW BEGIN :NEW.ID := 'KI'
                                                                                                 || SEQUENCE7.NEXTVAL;
END;
CREATE SEQUENCE SEQUENCE8 START WITH 1;
CREATE OR REPLACE TRIGGER TRIGGER8 BEFORE INSERT ON QA_OFFICER FOR EACH ROW BEGIN :NEW.ID := 'Q'
                                                                                             || SEQUENCE8.NEXTVAL;
END;
 
-- add a field on users named profile image, which will be referenced to a imageTable
-- delete all the tables sequentially
-- DROP TABLE INGREDIENT;
-- DROP TABLE FOOD;
-- DROP TABLE KITCHEN;
-- DROP TABLE CERTIFICATION;
-- DROP TABLE CHEF;
-- DROP TABLE USERS;