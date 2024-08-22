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

CREATE TABLE CHEF (
    ID VARCHAR2(36) PRIMARY KEY,
    CHEF_NAME VARCHAR2(100) UNIQUE NOT NULL,
    USER_ID VARCHAR2(36) NOT NULL,
    SPECIALITY VARCHAR2(100) NOT NULL,
    EXPERIENCE NUMBER DEFAULT 0,
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
);

CREATE TABLE KITCHEN (
    ID VARCHAR2(36) PRIMARY KEY,
    NAME VARCHAR2(100) NOT NULL,
    ADDRESS VARCHAR2(100) NOT NULL,
    CITY_NAME VARCHAR2(100) NOT NULL,
    CHEF_ID VARCHAR2(36) NOT NULL,
    APPROVED NUMBER(1) DEFAULT 0 CHECK (APPROVED IN (0, 1)),
    FOREIGN KEY (CHEF_ID) REFERENCES CHEF(ID)
);

CREATE TABLE KITCHEN_IMAGES(
    ID VARCHAR2(36) PRIMARY KEY,
    KITCHEN_ID VARCHAR2(36) NOT NULL,
    IMAGE VARCHAR2(255) DEFAULT 'https://placehold.co/600x400',
    DATE_ADDED DATE DEFAULT SYSDATE,
    FOREIGN KEY (KITCHEN_ID) REFERENCES KITCHEN(ID)
);

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

CREATE TABLE CATEGORY (
    ID VARCHAR2(36) PRIMARY KEY,
    KITCHEN_ID VARCHAR2(36) NOT NULL,
    NAME VARCHAR2(100) NOT NULL,
    DESCRIPTION VARCHAR2(300) NOT NULL,
    CATEGORY_IMAGE VARCHAR2(300) DEFAULT 'https://placehold.co/600x400',
    FOREIGN KEY (KITCHEN_ID) REFERENCES KITCHEN(ID)
);

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

CREATE TABLE INGREDIENT (
    ID VARCHAR2(36) PRIMARY KEY,
    FOOD_ID VARCHAR2(36) NOT NULL,
    NAME VARCHAR2(255) NOT NULL,
    QUANTITY NUMBER NOT NULL,
    CALORIES NUMBER NOT NULL,
    FOREIGN KEY (FOOD_ID) REFERENCES FOOD(ID)
);

CREATE TABLE ORDERS (
    ID VARCHAR2(255) PRIMARY KEY,
    USER_ID VARCHAR2(36) NOT NULL,
    TOTAL NUMBER DEFAULT 0,
    DATE_ADDED DATE DEFAULT SYSDATE,
    DATE_PREPARED DATE,
    DATE_SHIPPED DATE,
    DATE_DELIVERED DATE,
    SHIPPING_ADD VARCHAR2(3255) NOT NULL,
    SHIPPING_PHONE VARCHAR2(255) NOT NULL,
    SHIPPING_NAME VARCHAR2(255) NOT NULL,
    STATUS VARCHAR2(255) DEFAULT 'PAID' NOT NULL,
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
);

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

CREATE TABLE DELIVERY_PARTNER (
    ID VARCHAR2(36) PRIMARY KEY,
    USER_ID VARCHAR2(36) NOT NULL,
    LICENSE VARCHAR2(255) NOT NULL,
    VEHICLE VARCHAR2(255) NOT NULL,
    VERIFIED NUMBER(1) DEFAULT 0 CHECK (VERIFIED IN (0, 1)),
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
);

CREATE TABLE CONVERSATIONS (
    CONVERSATION_ID VARCHAR2(36) PRIMARY KEY,
    USER_ID VARCHAR2(36) NOT NULL,
    DELIVERY_PARTNER_ID VARCHAR2(36) NOT NULL,
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID),
    FOREIGN KEY (DELIVERY_PARTNER_ID) REFERENCES USERS(ID)
);

CREATE TABLE MESSAGES (
    MESSAGE_ID VARCHAR2(36) PRIMARY KEY,
    CONVERSATION_ID VARCHAR2(36) NOT NULL,
    SENDER_ID VARCHAR2(36) NOT NULL,
    MESSAGE VARCHAR2(255) NOT NULL,
    DATE_ADDED DATE DEFAULT SYSDATE,
    FOREIGN KEY (CONVERSATION_ID) REFERENCES CONVERSATIONS(CONVERSATION_ID),
    FOREIGN KEY (SENDER_ID) REFERENCES USERS(ID)
);

CREATE TABLE ACTIVE_DELIVERY (
    ID VARCHAR2(36) PRIMARY KEY,
    ORDER_ID VARCHAR2(36) NOT NULL,
    DELIVERY_PARTNER_ID VARCHAR2(36) NOT NULL,
    STATUS VARCHAR2(255) DEFAULT 'PENDING' NOT NULL,
    FOREIGN KEY (ORDER_ID) REFERENCES ORDERS(ID),
    FOREIGN KEY (DELIVERY_PARTNER_ID) REFERENCES USERS(ID)
);

CREATE TABLE FOOD_RATING (
    ID VARCHAR2(36) PRIMARY KEY,
    FOOD_ID VARCHAR2(36) NOT NULL,
    USER_ID VARCHAR2(36) NOT NULL,
    RATING NUMBER DEFAULT 0,
    REVIEW VARCHAR2(255) DEFAULT '',
    DATE_ADDED DATE DEFAULT SYSDATE,
    FOREIGN KEY (FOOD_ID) REFERENCES FOOD(ID),
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
);

CREATE TABLE DELIVERY_COMMISION (
    DELIVERY_PARTNER_ID VARCHAR2(36) NOT NULL,
    AMOUNT NUMBER DEFAULT 0.15,
    FOREIGN KEY (DELIVERY_PARTNER_ID) REFERENCES DELIVERY_PARTNER(ID)
);

CREATE TABLE CHEF_COMMISION (
    CHEF_ID VARCHAR2(36) NOT NULL,
    AMOUNT NUMBER DEFAULT 0.8,
    FOREIGN KEY (CHEF_ID) REFERENCES CHEF(ID)
);

CREATE TABLE LOGS(
    ID VARCHAR2(36) PRIMARY KEY,
    LOG_TIMESTAMP DATE DEFAULT SYSDATE,
    TYPE VARCHAR2(255) NOT NULL,
    MESSAGE VARCHAR2(255) NOT NULL,
    STATUS VARCHAR2(255) DEFAULT 'INFO' NOT NULL
);

CREATE SEQUENCE LOGS_SEQUENCE START WITH 1;

CREATE OR REPLACE TRIGGER LOGS_TRIGGER BEFORE
    INSERT ON LOGS FOR EACH ROW
BEGIN
    :NEW.ID := 'LOG'
               || LOGS_SEQUENCE.NEXTVAL;
END;

CREATE OR REPLACE TRIGGER DELIVERY_COMMISION_TRIGGER AFTER INSERT ON DELIVERY_PARTNER FOR EACH ROW BEGIN INSERT INTO DELIVERY_COMMISION (
    DELIVERY_PARTNER_ID
) VALUES (
    :NEW.ID
);
END;
/

CREATE OR REPLACE TRIGGER CHEF_COMMISION_TRIGGER AFTER
    INSERT ON CHEF FOR EACH ROW
BEGIN
    INSERT INTO CHEF_COMMISION (
        CHEF_ID
    ) VALUES (
        :NEW.ID
    );
END;
/

CREATE SEQUENCE CONVERSATION_SEQUENCE START WITH 1;

CREATE OR REPLACE TRIGGER CONVERSATION_TRIGGER BEFORE
    INSERT ON CONVERSATIONS FOR EACH ROW
BEGIN
    :NEW.CONVERSATION_ID := 'CON'
                            || CONVERSATION_SEQUENCE.NEXTVAL;
END;
/

CREATE SEQUENCE MESSAGE_SEQUENCE START WITH 1;

CREATE OR REPLACE TRIGGER MESSAGE_TRIGGER BEFORE
    INSERT ON MESSAGES FOR EACH ROW
BEGIN
    :NEW.MESSAGE_ID := 'MSG'
                       || MESSAGE_SEQUENCE.NEXTVAL;
END;
/

CREATE SEQUENCE FOOD_RATING_SEQUENCE START WITH 1;

CREATE OR REPLACE TRIGGER FOOD_RATING_TRIGGER BEFORE
    INSERT ON FOOD_RATING FOR EACH ROW
BEGIN
    :NEW.ID := 'FR'
               || FOOD_RATING_SEQUENCE.NEXTVAL;
END;
/

CREATE SEQUENCE SEQUENCE9
             START WITH 1;

CREATE OR REPLACE TRIGGER TRIGGER9 BEFORE
    INSERT ON CATEGORY FOR EACH ROW
BEGIN
    :NEW.ID := 'CAT'
               || SEQUENCE9.NEXTVAL;
END;
/

CREATE SEQUENCE ACTIVE_DELIVERY_SEQ START WITH 1;

CREATE OR REPLACE TRIGGER ACTIVE_DELIVERY_TRIGGER BEFORE
    INSERT ON ACTIVE_DELIVERY FOR EACH ROW
BEGIN
    :NEW.ID := 'AD'
               || ACTIVE_DELIVERY_SEQ.NEXTVAL;
END;
/

CREATE SEQUENCE DELIVERY_PARTNER_SEQUENCE START WITH 1;

CREATE OR REPLACE TRIGGER DELIVERY_PARTNER_TRIGGER BEFORE
    INSERT ON DELIVERY_PARTNER FOR EACH ROW
BEGIN
    :NEW.ID := 'DP'
               || DELIVERY_PARTNER_SEQUENCE.NEXTVAL;
END;
/

CREATE SEQUENCE CART_SEQUENCE START WITH 1;

CREATE OR REPLACE TRIGGER CART_TRIGGER BEFORE
    INSERT ON CART FOR EACH ROW
BEGIN
    :NEW.ID := 'CART'
               || CART_SEQUENCE.NEXTVAL;
END;
/

CREATE SEQUENCE INGREDIENT_SEQUENCE START WITH 1;

CREATE OR REPLACE TRIGGER INGREDIENT_TRIGGER BEFORE
    INSERT ON INGREDIENT FOR EACH ROW
BEGIN
    :NEW.ID := 'I'
               || INGREDIENT_SEQUENCE.NEXTVAL;
END;
/

CREATE SEQUENCE FOOD_SEQUENCE START WITH 1;

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

CREATE SEQUENCE SEQUENCE2 START WITH 1;

CREATE OR REPLACE TRIGGER TRIGGER2 BEFORE
    INSERT ON CHEF FOR EACH ROW
BEGIN
    :NEW.ID := 'C'
               || SEQUENCE2.NEXTVAL;
END;
/

CREATE SEQUENCE SEQUENCE3 START WITH 1;

CREATE OR REPLACE TRIGGER TRIGGER3 BEFORE
    INSERT ON CERTIFICATION FOR EACH ROW
BEGIN
    :NEW.ID := 'CER'
               || SEQUENCE3.NEXTVAL;
END;
/

CREATE SEQUENCE SEQUENCE4 START WITH 1;

CREATE OR REPLACE TRIGGER TRIGGER4 BEFORE
    INSERT ON KITCHEN FOR EACH ROW
BEGIN
    :NEW.ID := 'K'
               || SEQUENCE4.NEXTVAL;
END;
/

CREATE SEQUENCE SEQUENCE7 START WITH 1;

CREATE OR REPLACE TRIGGER TRIGGER7 BEFORE
    INSERT ON KITCHEN_IMAGES FOR EACH ROW
BEGIN
    :NEW.ID := 'KI'
               || SEQUENCE7.NEXTVAL;
END;
/

CREATE SEQUENCE SEQUENCE8 START WITH 1;

CREATE OR REPLACE TRIGGER TRIGGER8 BEFORE
    INSERT ON QA_OFFICER FOR EACH ROW
BEGIN
    :NEW.ID := 'Q'
               || SEQUENCE8.NEXTVAL;
END;
/

SELECT
    *
FROM
    CART;

-- create an admin users
INSERT INTO USERS (
    ID,
    FIRST_NAME,
    LAST_NAME,
    DOB,
    ADDRESS,
    MOBILE,
    CITY_CODE,
    EMAIL,
    PASSWORD,
    TYPE
) VALUES (
    'ADMIN1',
    'Admin',
    'User',
    TO_DATE('01-01-1990', 'DD-MM-YYYY'),
    'Admin Address',
    '1234567890',
    'CITY1',
    'admin@admin.com',
    'admin',
    'ADMIN'
);

CREATE OR REPLACE FUNCTION GET_FOOD_NAMES(
    ORDER_ID VARCHAR2
) RETURN VARCHAR2 IS
    FOOD_NAMES VARCHAR2(4000);
BEGIN
    SELECT
        LISTAGG(F.NAME
                || ' x'
                || C.QUANTITY, ', ') WITHIN GROUP ( ORDER BY F.NAME ) INTO FOOD_NAMES
    FROM
        FOOD F
        JOIN CART C
        ON F.ID = C.FOOD_ID
    WHERE
        C.DELETED_ID = ORDER_ID;
    RETURN FOOD_NAMES;
END;
/

CREATE OR REPLACE FUNCTION GET_ORDER_STATUS(
    STATUS VARCHAR2
) RETURN VARCHAR2 IS
BEGIN
    CASE STATUS
        WHEN 'DELIVERED' THEN
            RETURN 'DELIVERED';
        WHEN 'PREPEARED' THEN
            RETURN 'PREPEARED';
        WHEN 'SHIPPED' THEN
            RETURN 'SHIPPED';
        WHEN 'CANCELLED' THEN
            RETURN 'CANCELLED';
        ELSE
            RETURN 'PENDING';
    END CASE;
END;
/

--(SELECT IMAGE FROM KITCHEN_IMAGES WHERE KITCHEN_IMAGES.KITCHEN_ID = KITCHEN.ID AND ROWNUM = 1) AS KITCHEN_IMAGE,
CREATE OR REPLACE FUNCTION GET_KITCHEN_IMAGE(
    KITCHEN_ID VARCHAR2
) RETURN VARCHAR2 IS
    KITCHEN_IMAGE VARCHAR2(255);
BEGIN
    SELECT
        IMAGE INTO KITCHEN_IMAGE
    FROM
        KITCHEN_IMAGES
    WHERE
        KITCHEN_IMAGES.KITCHEN_ID = KITCHEN_ID
        AND ROWNUM = 1;
    RETURN KITCHEN_IMAGE;
END;
 

-- INSERT INTO MESSAGES (CONVERSATION_ID,SENDER_ID,MESSAGE) VALUES (:conversationId, :senderId,:messageText)
CREATE OR REPLACE PROCEDURE SEND_MESSAGE( CONVERSATION_ID VARCHAR2, SENDER_ID VARCHAR2, MESSAGE VARCHAR2 ) IS
BEGIN
    INSERT INTO MESSAGES (
        CONVERSATION_ID,
        SENDER_ID,
        MESSAGE
    ) VALUES (
        CONVERSATION_ID,
        SENDER_ID,
        MESSAGE
    );
END;
/

-- INSERT INTO USERS (FIRST_NAME, LAST_NAME, DOB, ADDRESS, MOBILE, CITY_CODE, EMAIL, PASSWORD, TYPE) VALUES(:firstName, :lastName, TO_DATE(:formattedDob, 'YYYY-MM-DD'), :address, :mobile, :cityCode, :email, :password, :type)
CREATE OR REPLACE PROCEDURE REGISTER_USER(
    FIRST_NAME VARCHAR2,
    LAST_NAME VARCHAR2,
    DOB DATE,
    ADDRESS VARCHAR2,
    MOBILE VARCHAR2,
    CITY_CODE VARCHAR2,
    EMAIL VARCHAR2,
    PASSWORD VARCHAR2,
    TYPE VARCHAR2
) IS
BEGIN
    INSERT INTO USERS (
        FIRST_NAME,
        LAST_NAME,
        DOB,
        ADDRESS,
        MOBILE,
        CITY_CODE,
        EMAIL,
        PASSWORD,
        TYPE
    ) VALUES (
        FIRST_NAME,
        LAST_NAME,
        DOB,
        ADDRESS,
        MOBILE,
        CITY_CODE,
        EMAIL,
        PASSWORD,
        TYPE
    );
    COMMIT;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'USER_REGISTER',
        'User Registered - '
        || EMAIL,
        'INFO'
    );
END;
/

-- UPDATE USERS SET FIRST_NAME = :firstName, LAST_NAME = :lastName, DOB = TO_DATE(:formattedDob, \'YYYY-MM-DD\'), ADDRESS = :address, MOBILE = :mobileNumber, CITY_CODE = :cityCode WHERE ID = :id AND EMAIL = :email
CREATE OR REPLACE PROCEDURE UPDATE_USER(
    U_ID VARCHAR2,
    U_EMAIL VARCHAR2,
    U_FIRST_NAME VARCHAR2,
    U_LAST_NAME VARCHAR2,
    U_DOB DATE,
    U_ADDRESS VARCHAR2,
    U_MOBILE VARCHAR2,
    U_CITY_CODE VARCHAR2
) IS
BEGIN
    UPDATE USERS
    SET
        FIRST_NAME = U_FIRST_NAME,
        LAST_NAME = U_LAST_NAME,
        DOB = U_DOB,
        ADDRESS = U_ADDRESS,
        MOBILE = U_MOBILE,
        CITY_CODE = U_CITY_CODE
    WHERE
        ID = U_ID
        AND EMAIL = U_EMAIL;
    COMMIT;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'USER_UPDATE',
        'User Updated - '
        || U_EMAIL,
        'INFO'
    );
END;
/

--INSERT INTO CHEF(USER_ID,CHEF_NAME, SPECIALITY,EXPERIENCE) VALUES(:id,:name,:speciality, :experience)
CREATE OR REPLACE PROCEDURE REGISTER_CHEF(
    U_ID VARCHAR2,
    U_NAME VARCHAR2,
    U_SPECIALITY VARCHAR2,
    U_EXPERIENCE NUMBER
) IS
BEGIN
    INSERT INTO CHEF (
        USER_ID,
        CHEF_NAME,
        SPECIALITY,
        EXPERIENCE
    ) VALUES (
        U_ID,
        U_NAME,
        U_SPECIALITY,
        U_EXPERIENCE
    );
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'CHEF_REGISTER',
        'Chef Registered - '
        || U_NAME,
        'INFO'
    );
END;
/

--UPDATE USERS SET PROFILE_IMAGE = :profileImage WHERE ID = :id AND EMAIL = :email
CREATE OR REPLACE PROCEDURE UPDATE_PROFILE_IMAGE(
    U_ID VARCHAR2,
    U_EMAIL VARCHAR2,
    U_PROFILE_IMAGE VARCHAR2
) IS
BEGIN
    UPDATE USERS
    SET
        PROFILE_IMAGE = U_PROFILE_IMAGE
    WHERE
        ID = U_ID
        AND EMAIL = U_EMAIL;
END;
/

--INSERT INTO KITCHEN (NAME, ADDRESS, CITY_NAME, CHEF_ID) VALUES(:KICHEN_NAME, :KITCHEN_ADDRESS, :KITCHEN_CITY_NAME, :chefId)
CREATE OR REPLACE PROCEDURE REGISTER_KITCHEN(
    K_NAME VARCHAR2,
    K_ADDRESS VARCHAR2,
    K_CITY_NAME VARCHAR2,
    K_CHEF_ID VARCHAR2
) IS
BEGIN
    INSERT INTO KITCHEN (
        NAME,
        ADDRESS,
        CITY_NAME,
        CHEF_ID
    ) VALUES (
        K_NAME,
        K_ADDRESS,
        K_CITY_NAME,
        K_CHEF_ID
    );
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'KITCHEN_REGISTER',
        'Kitchen Registered - '
        || K_NAME,
        'INFO'
    );
END;
/

-- AWAIT RUNQUERY('DELETE FROM KITCHEN_IMAGES WHERE KITCHEN_ID = :kitchenId', { KITCHENID });

-- AWAIT RUNQUERY("DELETE FROM INGREDIENT WHERE FOOD_ID IN (SELECT ID FROM FOOD WHERE CATEGORY_ID IN (SELECT ID FROM CATEGORY WHERE KITCHEN_ID = :kitchenId))", { KITCHENID });

-- AWAIT RUNQUERY("DELETE FROM CART WHERE FOOD_ID IN (SELECT ID FROM FOOD WHERE CATEGORY_ID IN (SELECT ID FROM CATEGORY WHERE KITCHEN_ID = :kitchenId))", { KITCHENID });

-- AWAIT RUNQUERY("DELETE FROM FOOD WHERE CATEGORY_ID IN (SELECT ID FROM CATEGORY WHERE KITCHEN_ID = :kitchenId)", { KITCHENID });

-- AWAIT RUNQUERY("DELETE FROM CATEGORY WHERE KITCHEN_ID = :kitchenId", { KITCHENID });

-- AWAIT RUNQUERY("DELETE FROM KITCHEN WHERE ID = :kitchenId", { KITCHENID });

CREATE OR REPLACE PROCEDURE DELETE_KITCHEN(
    KITCHEN_ID VARCHAR2
) IS
BEGIN
    DELETE FROM KITCHEN_IMAGES
    WHERE
        KITCHEN_ID = KITCHEN_ID;
    DELETE FROM INGREDIENT
    WHERE
        FOOD_ID IN (
            SELECT
                ID
            FROM
                FOOD
            WHERE
                CATEGORY_ID IN (
                    SELECT
                        ID
                    FROM
                        CATEGORY
                    WHERE
                        KITCHEN_ID = KITCHEN_ID
                )
        );
    DELETE FROM CART
    WHERE
        FOOD_ID IN (
            SELECT
                ID
            FROM
                FOOD
            WHERE
                CATEGORY_ID IN (
                    SELECT
                        ID
                    FROM
                        CATEGORY
                    WHERE
                        KITCHEN_ID = KITCHEN_ID
                )
        );
    DELETE FROM FOOD
    WHERE
        CATEGORY_ID IN (
            SELECT
                ID
            FROM
                CATEGORY
            WHERE
                KITCHEN_ID = KITCHEN_ID
        );
    DELETE FROM CATEGORY
    WHERE
        KITCHEN_ID = KITCHEN_ID;
    DELETE FROM KITCHEN
    WHERE
        ID = KITCHEN_ID;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'KITCHEN_DELETE',
        'Kitchen Deleted - '
        || KITCHEN_ID,
        'INFO'
    );
END;
/

--UPDATE KITCHEN SET NAME = :KICHEN_NAME, ADDRESS = :KITCHEN_ADDRESS, CITY_NAME = :KITCHEN_CITY_NAME WHERE ID = :kitchenId

CREATE OR REPLACE PROCEDURE UPDATE_KITCHEN(
    K_NAME VARCHAR2,
    K_ADDRESS VARCHAR2,
    K_CITY_NAME VARCHAR2,
    K_ID VARCHAR2
) IS
BEGIN
    UPDATE KITCHEN
    SET
        NAME = K_NAME,
        ADDRESS = K_ADDRESS,
        CITY_NAME = K_CITY_NAME
    WHERE
        ID = K_ID;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'KITCHEN_UPDATE',
        'Kitchen Updated - '
        || K_ID,
        'SUCCESS'
    );
END;
/

--INSERT INTO KITCHEN_IMAGES (KITCHEN_ID, IMAGE) VALUES(:kitchenId, :image)
CREATE OR REPLACE PROCEDURE ADD_KITCHEN_IMAGE(
    KITCHEN_ID VARCHAR2,
    IMAGE VARCHAR2
) IS
BEGIN
    INSERT INTO KITCHEN_IMAGES (
        KITCHEN_ID,
        IMAGE
    ) VALUES (
        KITCHEN_ID,
        IMAGE
    );
END;
/

--DELETE FROM KITCHEN_IMAGES WHERE ID = :imageId
CREATE OR REPLACE PROCEDURE DELETE_KITCHEN_IMAGE(
    IMAGE_ID VARCHAR2
) IS
BEGIN
    DELETE FROM KITCHEN_IMAGES
    WHERE
        ID = IMAGE_ID;
END;
/

--INSERT INTO CERTIFICATION(CHEF_ID, CERTIFICATION, ISSUE_DATE, LINK,CERTIFICATE_IMAGE) VALUES(:chef_id, :name, TO_DATE(:f_issue_date, \'YYYY-MM-DD\'), :link,:certification)
CREATE OR REPLACE PROCEDURE ADD_CERTIFICATION(
    CHEF_ID VARCHAR2,
    NAME VARCHAR2,
    ISSUE_DATE DATE,
    LINK VARCHAR2,
    CERTIFICATION_IMAGE VARCHAR2
) IS
BEGIN
    INSERT INTO CERTIFICATION (
        CHEF_ID,
        CERTIFICATION,
        ISSUE_DATE,
        LINK,
        CERTIFICATE_IMAGE
    ) VALUES (
        CHEF_ID,
        NAME,
        ISSUE_DATE,
        LINK,
        CERTIFICATION_IMAGE
    );
END;
/

--INSERT INTO CERTIFICATION(CHEF_ID, CERTIFICATION, ISSUE_DATE, EXPIRY_DATE, LINK,CERTIFICATE_IMAGE) VALUES(:chef_id, :name, TO_DATE(:f_issue_date, \'YYYY-MM-DD\'), TO_DATE(:f_expiry_date, \'YYYY-MM-DD\'), :link,:certification)
CREATE OR REPLACE PROCEDURE ADD_CERTIFICATION_WITH_EXPIRY(
    CHEF_ID VARCHAR2,
    NAME VARCHAR2,
    ISSUE_DATE DATE,
    EXPIRY_DATE DATE,
    LINK VARCHAR2,
    CERTIFICATION_IMAGE VARCHAR2
) IS
BEGIN
    INSERT INTO CERTIFICATION (
        CHEF_ID,
        CERTIFICATION,
        ISSUE_DATE,
        EXPIRY_DATE,
        LINK,
        CERTIFICATE_IMAGE
    ) VALUES (
        CHEF_ID,
        NAME,
        ISSUE_DATE,
        EXPIRY_DATE,
        LINK,
        CERTIFICATION_IMAGE
    );
END;
/

--UPDATE KITCHEN SET APPROVED = 1 WHERE ID = :kitchen_id
CREATE OR REPLACE PROCEDURE APPROVE_KITCHEN(
    A_KITCHEN_ID VARCHAR2
) IS
BEGIN
    UPDATE KITCHEN
    SET
        APPROVED = 1
    WHERE
        ID = A_KITCHEN_ID;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'KITCHEN_APPROVE',
        'Kitchen Approved - '
        || A_KITCHEN_ID,
        'SUCCESS'
    );
END;
/

-- CONST RES = AWAIT RUNQUERY('DELETE FROM KITCHEN_IMAGES WHERE KITCHEN_ID = :kitchen_id', { KITCHEN_ID });

-- CONST RESULT = AWAIT RUNQUERY('DELETE FROM KITCHEN WHERE ID = :kitchen_id', { KITCHEN_ID });

-- RETURN C.JSON({ RESULT });

CREATE OR REPLACE PROCEDURE DELETE_KITCHEN_WITH_IMAGES(
    KITCHEN_ID VARCHAR2
) IS
BEGIN
    DELETE FROM KITCHEN_IMAGES
    WHERE
        KITCHEN_ID = KITCHEN_ID;
    DELETE FROM KITCHEN
    WHERE
        ID = KITCHEN_ID;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'KITCHEN_DELETE',
        'Kitchen Deleted - '
        || KITCHEN_ID,
        'SUCCESS'
    );
END;
/

--UPDATE DELIVERY_PARTNER SET VERIFIED = 1 WHERE ID = :delivery_id
CREATE OR REPLACE PROCEDURE VERIFY_DELIVERY_PARTNER(
    V_DELIVERY_ID VARCHAR2
) IS
BEGIN
    UPDATE DELIVERY_PARTNER
    SET
        VERIFIED = 1
    WHERE
        ID = V_DELIVERY_ID;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'DELIVERY_PARTNER_VERIFY',
        'Delivery Partner Verified - '
        || V_DELIVERY_ID,
        'SUCCESS'
    );
END;
/

--DELETE FROM DELIVERY_PARTNER WHERE ID = :delivery_id CASCADE CONSTRAINTS
CREATE OR REPLACE PROCEDURE DELETE_DELIVERY_PARTNER(
    DELIVERY_ID VARCHAR2
) IS
BEGIN
    DELETE FROM DELIVERY_PARTNER
    WHERE
        ID = DELIVERY_ID;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'DELIVERY_PARTNER_DELETE',
        'Delivery Partner Deleted - '
        || DELIVERY_ID,
        'WARNING'
    );
END;
/

--INSERT INTO QA_OFFICER(USER_ID, ACADEMIC_QUALIFICATION, CV_LINK) VALUES(:id, :ACADEMIC_QUALIFICATION, :CV_LINK)
CREATE OR REPLACE PROCEDURE ADD_QA_OFFICER(
    U_ID VARCHAR2,
    ACADEMIC_QUALIFICATION VARCHAR2,
    CV_LINK VARCHAR2
) IS
BEGIN
    INSERT INTO QA_OFFICER (
        USER_ID,
        ACADEMIC_QUALIFICATION,
        CV_LINK
    ) VALUES (
        U_ID,
        ACADEMIC_QUALIFICATION,
        CV_LINK
    );
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'QA_OFFICER_REGISTER',
        'QA Officer Registered - '
        || U_ID,
        'SUCCESS'
    );
END;
/

--UPDATE QA_OFFICER SET APPROVED = 1, DATE_OF_JOINING = SYSDATE WHERE ID = :qa_id
CREATE OR REPLACE PROCEDURE APPROVE_QA_OFFICER(
    A_QA_ID VARCHAR2
) IS
BEGIN
    UPDATE QA_OFFICER
    SET
        APPROVED = 1,
        DATE_OF_JOINING = SYSDATE
    WHERE
        ID = A_QA_ID;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'QA_OFFICER_APPROVE',
        'QA Officer Approved - '
        || A_QA_ID,
        'SUCCESS'
    );
END;
/

--DELETE FROM QA_OFFICER WHERE ID = :qa_id
CREATE OR REPLACE PROCEDURE DELETE_QA_OFFICER(
    QA_ID VARCHAR2
) IS
BEGIN
    DELETE FROM QA_OFFICER
    WHERE
        ID = QA_ID;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'QA_OFFICER_DELETE',
        'QA Officer Deleted - '
        || QA_ID,
        'WARNING'
    );
END;
/

--INSERT INTO FOOD(NAME,DESCRIPTION,PRICE,CATEGORY_ID,FOOD_IMAGE) VALUES(:name, :description, :price, :category_id, :image)

CREATE OR REPLACE PROCEDURE ADD_FOOD(
    NAME VARCHAR2,
    DESCRIPTION VARCHAR2,
    PRICE NUMBER,
    CATEGORY_ID VARCHAR2,
    IMAGE VARCHAR2
) IS
BEGIN
    INSERT INTO FOOD (
        NAME,
        DESCRIPTION,
        PRICE,
        CATEGORY_ID,
        FOOD_IMAGE
    ) VALUES (
        NAME,
        DESCRIPTION,
        PRICE,
        CATEGORY_ID,
        IMAGE
    );
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'FOOD_ADD',
        'Food Added - '
        || NAME,
        'SUCCESS'
    );
END;
/

--INSERT INTO CATEGORY(KITCHEN_ID, NAME, DESCRIPTION, CATEGORY_IMAGE) VALUES(:kitchen_id, :name, :description, :category_image)
CREATE OR REPLACE PROCEDURE ADD_CATEGORY(
    KITCHEN_ID VARCHAR2,
    NAME VARCHAR2,
    DESCRIPTION VARCHAR2,
    CATEGORY_IMAGE VARCHAR2
) IS
BEGIN
    INSERT INTO CATEGORY (
        KITCHEN_ID,
        NAME,
        DESCRIPTION,
        CATEGORY_IMAGE
    ) VALUES (
        KITCHEN_ID,
        NAME,
        DESCRIPTION,
        CATEGORY_IMAGE
    );
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'CATEGORY_ADD',
        'Category Added - '
        || NAME,
        'SUCCESS'
    );
END;
/

--INSERT INTO INGREDIENT(FOOD_ID, NAME, QUANTITY, CALORIES) VALUES(:food_id, :name, :quantity, :calories)
CREATE OR REPLACE PROCEDURE ADD_INGREDIENT(
    FOOD_ID VARCHAR2,
    NAME VARCHAR2,
    QUANTITY NUMBER,
    CALORIES NUMBER
) IS
BEGIN
    INSERT INTO INGREDIENT (
        FOOD_ID,
        NAME,
        QUANTITY,
        CALORIES
    ) VALUES (
        FOOD_ID,
        NAME,
        QUANTITY,
        CALORIES
    );
END;
/

--DELETE FROM INGREDIENT WHERE ID = :iid
CREATE OR REPLACE PROCEDURE DELETE_INGREDIENT(
    I_ID VARCHAR2
) IS
BEGIN
    DELETE FROM INGREDIENT
    WHERE
        ID = I_ID;
END;
/

--INSERT INTO CART(USER_ID, FOOD_ID, QUANTITY) VALUES(:id, :food_id, :quantity)
CREATE OR REPLACE PROCEDURE ADD_TO_CART(
    U_ID VARCHAR2,
    FOOD_ID VARCHAR2,
    QUANTITY NUMBER
) IS
BEGIN
    INSERT INTO CART (
        USER_ID,
        FOOD_ID,
        QUANTITY
    ) VALUES (
        U_ID,
        FOOD_ID,
        QUANTITY
    );
END;
/

CREATE OR REPLACE PROCEDURE ADD_TO_CART_SCHEDULED(
    U_ID VARCHAR2,
    FOOD_ID VARCHAR2,
    QUANTITY NUMBER,
    TIME DATE
) IS
BEGIN
    INSERT INTO CART (
        USER_ID,
        FOOD_ID,
        QUANTITY,
        DATE_ADDED
    ) VALUES (
        U_ID,
        FOOD_ID,
        QUANTITY,
        TIME
    );
END;
/

--DELETE FROM CART WHERE USER_ID = :id AND FOOD_ID = :food_id
CREATE OR REPLACE PROCEDURE DELETE_FROM_CART(
    U_ID VARCHAR2,
    U_CART_ID VARCHAR2
) IS
BEGIN
    DELETE FROM CART
    WHERE
        USER_ID = U_ID
        AND ID = U_CART_ID;
END;
/

-- CONST RESULT = AWAIT RUNQUERY("UPDATE ORDERS SET DATE_SHIPPED = SYSDATE, STATUS = 'SHIPPED' WHERE ID = :oid", { OID });

-- AWAIT RUNQUERY("INSERT INTO ACTIVE_DELIVERY(ORDER_ID, DELIVERY_PARTNER_ID) VALUES(:oid, :id)", { OID, ID });

CREATE OR REPLACE PROCEDURE SHIP_ORDER(
    O_ID VARCHAR2,
    S_ID VARCHAR2
) IS
BEGIN
    UPDATE ORDERS
    SET
        DATE_SHIPPED = SYSDATE,
        STATUS = 'SHIPPED'
    WHERE
        ID = O_ID;
    INSERT INTO ACTIVE_DELIVERY (
        ORDER_ID,
        DELIVERY_PARTNER_ID
    ) VALUES (
        O_ID,
        S_ID
    );
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'ORDER_SHIPPED',
        'Order Shipped - '
        || O_ID,
        'SUCCESS'
    );
END;
/

-- CONST RESULT = AWAIT RUNQUERY("UPDATE ORDERS SET DATE_DELIVERED = SYSDATE, STATUS = 'DELIVERED' WHERE ID = :oid", { OID });

-- AWAIT RUNQUERY("UPDATE ACTIVE_DELIVERY SET STATUS = 'COMPLETED' WHERE ORDER_ID = :oid", { OID });

CREATE OR REPLACE PROCEDURE DELIVER_ORDER(
    O_ID VARCHAR2
) IS
BEGIN
    UPDATE ORDERS
    SET
        DATE_DELIVERED = SYSDATE,
        STATUS = 'DELIVERED'
    WHERE
        ID = O_ID;
    UPDATE ACTIVE_DELIVERY
    SET
        STATUS = 'COMPLETED'
    WHERE
        ORDER_ID = O_ID;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'ORDER_DELIVERED',
        'Order Delivered - '
        || O_ID,
        'SUCCESS'
    );
END;
/

-- CONST RESULT = AWAIT RUNQUERY("UPDATE ORDERS SET STATUS = 'CANCELLED' WHERE ID = :oid", { OID });

-- AWAIT RUNQUERY("UPDATE ACTIVE_DELIVERY SET STATUS = 'REJECTED' WHERE ORDER_ID = :oid", { OID });
CREATE OR REPLACE PROCEDURE CANCEL_ORDER(
    O_ID VARCHAR2
) IS
BEGIN
    UPDATE ORDERS
    SET
        STATUS = 'CANCELLED'
    WHERE
        ID = O_ID;
    UPDATE ACTIVE_DELIVERY
    SET
        STATUS = 'REJECTED'
    WHERE
        ORDER_ID = O_ID;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'ORDER_CANCELLED',
        'Order Cancelled - '
        || O_ID,
        'WARNING'
    );
END;
/

-- AWAIT RUNQUERY('INSERT INTO ORDERS(ID,USER_ID, TOTAL, SHIPPING_ADD, SHIPPING_PHONE,SHIPPING_NAME) VALUES(:ord_id, :id, :ammount, :address, :mobile,:name)', { ORD_ID, ID, AMMOUNT, ADDRESS, MOBILE, NAME });

-- AWAIT RUNQUERY('UPDATE CART SET DELETED = 1, DELETED_ID = :ord_id WHERE USER_ID = :id AND DELETED=0', { ORD_ID, ID });

--enable dbms_output

CREATE OR REPLACE PROCEDURE CHECKOUT(
    O_ID VARCHAR2,
    O_UID VARCHAR2,
    O_AMMOUNT NUMBER,
    O_ADDRESS VARCHAR2,
    O_MOBILE VARCHAR2,
    O_NAME VARCHAR2
) IS
BEGIN
    INSERT INTO ORDERS (
        ID,
        USER_ID,
        TOTAL,
        SHIPPING_ADD,
        SHIPPING_PHONE,
        SHIPPING_NAME
    ) VALUES (
        O_ID,
        O_UID,
        O_AMMOUNT,
        O_ADDRESS,
        O_MOBILE,
        O_NAME
    );
    DBMS_OUTPUT.PUT_LINE('ORDER INSERTED');
    COMMIT;
    UPDATE CART
    SET
        DELETED = 1,
        DELETED_ID = O_ID
    WHERE
        USER_ID = O_UID
        AND DELETED = 0;
    DBMS_OUTPUT.PUT_LINE('CART UPDATED');
    COMMIT;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'ORDER_PLACED',
        'Order Placed - '
        || O_ID,
        'INFO'
    );
END;
/

--INSERT INTO DELIVERY_PARTNER(USER_ID, LICENSE, VEHICLE) VALUES(:id, :license, :vehicle)
CREATE OR REPLACE PROCEDURE REGISTER_DELIVERY_PARTNER(
    U_ID VARCHAR2,
    LICENSE VARCHAR2,
    VEHICLE VARCHAR2
) IS
BEGIN
    INSERT INTO DELIVERY_PARTNER (
        USER_ID,
        LICENSE,
        VEHICLE
    ) VALUES (
        U_ID,
        LICENSE,
        VEHICLE
    );
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'DELIVERY_PARTNER_REGISTER',
        'Delivery Partner Registered - '
        || U_ID,
        'INFO'
    );
END;
/

--UPDATE FOOD_RATING SET RATING = :rating, REVIEW = :review WHERE FOOD_ID = :food_id AND USER_ID = :id
CREATE OR REPLACE PROCEDURE RATE_FOOD(
    R_FOOD_ID VARCHAR2,
    R_ID VARCHAR2,
    R_RATING NUMBER,
    R_REVIEW VARCHAR2
) IS
BEGIN
    UPDATE FOOD_RATING
    SET
        RATING = R_RATING,
        REVIEW = R_REVIEW
    WHERE
        FOOD_ID = R_FOOD_ID
        AND USER_ID = R_ID;
END;
/

-- INSERT INTO FOOD_RATING(FOOD_ID, USER_ID, RATING, REVIEW) VALUES(:food_id, :id, :rating, :review)
CREATE OR REPLACE PROCEDURE RATE_FOOD_NEW(
    FOOD_ID VARCHAR2,
    ID VARCHAR2,
    RATING NUMBER,
    REVIEW VARCHAR2
) IS
BEGIN
    INSERT INTO FOOD_RATING (
        FOOD_ID,
        USER_ID,
        RATING,
        REVIEW
    ) VALUES (
        FOOD_ID,
        ID,
        RATING,
        REVIEW
    );
END;
/

--DELETE FROM FOOD_RATING WHERE ID = :rid
CREATE OR REPLACE PROCEDURE DELETE_FOOD_RATING(
    R_ID VARCHAR2
) IS
BEGIN
    DELETE FROM FOOD_RATING
    WHERE
        ID = R_ID;
END;
/

--UPDATE ORDERS SET DATE_PREPARED = SYSDATE, STATUS = \'PREPEARED\' WHERE ID = :oid
CREATE OR REPLACE PROCEDURE PREPARE_ORDER(
    O_ID VARCHAR2
) IS
BEGIN
    UPDATE ORDERS
    SET
        DATE_PREPARED = SYSDATE,
        STATUS = 'PREPEARED'
    WHERE
        ID = O_ID;
    COMMIT;
END;
/

--UPDATE ORDERS SET STATUS = \'CANCELLED\' WHERE ID = :oid AND USER_ID = :id
CREATE OR REPLACE PROCEDURE CANCEL_ORDER_USER(
    O_ID VARCHAR2,
    C_ID VARCHAR2
) IS
BEGIN
    UPDATE ORDERS
    SET
        STATUS = 'CANCELLED'
    WHERE
        ID = O_ID
        AND USER_ID = C_ID;
    COMMIT;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'ORDER_CANCELLED',
        'Order Cancelled - '
        || O_ID,
        'WARNING'
    );
END;
/

--GET_KITCHEN_IMAGE(KITCHEN.ID) AS KITCHEN_IMAGE,

-- -- DROP SEQUENCES
-- DROP SEQUENCE SEQUENCE1;

-- DROP SEQUENCE SEQUENCE2;

-- DROP SEQUENCE SEQUENCE3;

-- DROP SEQUENCE SEQUENCE4;

-- DROP SEQUENCE SEQUENCE7;

-- DROP SEQUENCE SEQUENCE8;

-- DROP SEQUENCE SEQUENCE9;

-- DROP SEQUENCE ACTIVE_DELIVERY_SEQ;

-- DROP SEQUENCE CART_SEQUENCE;

-- DROP SEQUENCE INGREDIENT_SEQUENCE;

-- DROP SEQUENCE FOOD_SEQUENCE;

-- DROP SEQUENCE DELIVERY_PARTNER_SEQUENCE;

-- DROP SEQUENCE FOOD_RATING_SEQUENCE;

-- DROP SEQUENCE MESSAGE_SEQUENCE;

-- DROP SEQUENCE CONVERSATION_SEQUENCE;

-- -- DROP TRIGGERS
-- DROP TRIGGER DELIVERY_COMMISION_TRIGGER;

-- DROP TRIGGER CHEF_COMMISION_TRIGGER;

-- -- Drop tables
-- DROP TABLE ACTIVE_DELIVERY CASCADE CONSTRAINTS;

-- DROP TABLE CART CASCADE CONSTRAINTS;

-- DROP TABLE CERTIFICATION CASCADE CONSTRAINTS;

-- DROP TABLE CATEGORY CASCADE CONSTRAINTS;

-- DROP TABLE CHEF CASCADE CONSTRAINTS;

-- DROP TABLE DELIVERY_PARTNER CASCADE CONSTRAINTS;

-- DROP TABLE FOOD CASCADE CONSTRAINTS;

-- DROP TABLE INGREDIENT CASCADE CONSTRAINTS;

-- DROP TABLE KITCHEN CASCADE CONSTRAINTS;

-- DROP TABLE KITCHEN_IMAGES CASCADE CONSTRAINTS;

-- DROP TABLE ORDERS CASCADE CONSTRAINTS;

-- DROP TABLE QA_OFFICER CASCADE CONSTRAINTS;

-- DROP TABLE USERS CASCADE CONSTRAINTS;

-- DROP TABLE CONVERSATIONS CASCADE CONSTRAINTS;

-- DROP TABLE MESSAGES CASCADE CONSTRAINTS;

-- DROP TABLE FOOD_RATING CASCADE CONSTRAINTS;

-- DROP TABLE DELIVERY_COMMISION CASCADE CONSTRAINTS;

-- DROP TABLE CHEF_COMMISION CASCADE CONSTRAINTS;