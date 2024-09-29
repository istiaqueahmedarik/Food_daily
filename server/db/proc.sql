CREATE OR REPLACE VIEW ORDER_FOOD_VIEW AS
    SELECT
        C.DELETED_ID  AS ORDER_ID,
        F.NAME
        || ' x'
        || C.QUANTITY AS FOOD_NAME
    FROM
        FOOD F
        JOIN CART C
        ON F.ID = C.FOOD_ID;

/

CREATE OR REPLACE VIEW CERTIFICATION_VIEW AS
    SELECT
        CHEF_ID,
        CERTIFICATION,
        ISSUE_DATE,
        LINK,
        CERTIFICATE_IMAGE
    FROM
        CERTIFICATION;

/

CREATE OR REPLACE VIEW ORDERS_VIEW AS
    SELECT
        *
    FROM
        ORDERS;

/

CREATE OR REPLACE VIEW LOGS_VIEW AS
    SELECT
        TYPE,
        MESSAGE,
        STATUS
    FROM
        LOGS;

/

CREATE OR REPLACE VIEW KITCHEN_IMAGE_VIEW AS
    SELECT
        KITCHEN_ID,
        IMAGE
    FROM
        KITCHEN_IMAGES
    WHERE
        (KITCHEN_ID, IMAGE) IN (
            SELECT
                KITCHEN_ID,
                IMAGE
            FROM
                KITCHEN_IMAGES
            WHERE
                ROWNUM = 1
        );

CREATE OR REPLACE VIEW USER_VIEW AS
    SELECT
        NAME,
        DOB,
        ADDRESS,
        MOBILE,
        CITY_CODE,
        EMAIL,
        PASSWORD,
        TYPE
    FROM
        USERS;

/

CREATE OR REPLACE VIEW USER_UPDATE_VIEW AS
    SELECT
        ID,
        EMAIL,
        NAME,
        DOB,
        ADDRESS,
        MOBILE,
        CITY_CODE
    FROM
        USERS;

/

CREATE OR REPLACE VIEW KITCHEN_VIEW AS
    SELECT
        NAME,
        ADDRESS,
        CITY_NAME,
        CHEF_ID
    FROM
        KITCHEN;

/

CREATE OR REPLACE VIEW CHEF_VIEW AS
    SELECT
        USER_ID,
        CHEF_NAME,
        SPECIALITY,
        EXPERIENCE
    FROM
        CHEF;

/

CREATE OR REPLACE VIEW KITCHEN_RELATED_IDS AS
    SELECT
        K.ID AS KITCHEN_ID,
        C.ID AS CATEGORY_ID,
        F.ID AS FOOD_ID
    FROM
        KITCHEN  K
        LEFT JOIN CATEGORY C
        ON K.ID = C.KITCHEN_ID
        LEFT JOIN FOOD F
        ON C.ID = F.CATEGORY_ID;

/

CREATE OR REPLACE VIEW USER_REGISTER_VIEW AS
    SELECT
        NAME,
        DOB,
        ADDRESS,
        MOBILE,
        CITY_CODE,
        EMAIL,
        PASSWORD,
        TYPE
    FROM
        USERS;

/

CREATE OR REPLACE VIEW KITCHEN_RELATED_IDS AS
    SELECT
        K.ID AS KITCHEN_ID,
        C.ID AS CATEGORY_ID,
        F.ID AS FOOD_ID
    FROM
        KITCHEN  K
        LEFT JOIN CATEGORY C
        ON K.ID = C.KITCHEN_ID
        LEFT JOIN FOOD F
        ON C.ID = F.CATEGORY_ID;

/

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
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'Error fetching food names';
END;
/

CREATE OR REPLACE FUNCTION GET_ORDER_STATUS(
    STATUS VARCHAR2
) RETURN VARCHAR2 IS
    ORDER_STATUS VARCHAR2(20);
BEGIN
    CASE STATUS
        WHEN 'DELIVERED' THEN
            ORDER_STATUS := 'DELIVERED';
        WHEN 'PREPEARED' THEN
            ORDER_STATUS := 'PREPEARED';
        WHEN 'SHIPPED' THEN
            ORDER_STATUS := 'SHIPPED';
        WHEN 'CANCELLED' THEN
            ORDER_STATUS := 'CANCELLED';
        ELSE
            ORDER_STATUS := 'PENDING';
    END CASE;

    RETURN ORDER_STATUS;
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'Error determining order status';
END;
/

CREATE OR REPLACE FUNCTION GET_KITCHEN_IMAGE(
    KITCHEN_ID VARCHAR2
) RETURN VARCHAR2 IS
    KITCHEN_IMAGE VARCHAR2(255);
BEGIN
    BEGIN
        SELECT
            IMAGE INTO KITCHEN_IMAGE
        FROM
            KITCHEN_IMAGES
        WHERE
            KITCHEN_IMAGES.KITCHEN_ID = KITCHEN_ID
            AND ROWNUM = 1;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN 'No image found';
        WHEN OTHERS THEN
            RETURN 'Error fetching kitchen image';
    END;

    RETURN KITCHEN_IMAGE;
END;
/

CREATE OR REPLACE PROCEDURE SEND_MESSAGE(
    CONVERSATION_ID VARCHAR2,
    SENDER_ID VARCHAR2,
    MESSAGE VARCHAR2
) IS
BEGIN
    IF MESSAGE IS NULL OR TRIM(MESSAGE) = '' THEN
        RAISE_APPLICATION_ERROR(-20001, 'Message cannot be empty');
    ELSE
        INSERT INTO MESSAGES (
            CONVERSATION_ID,
            SENDER_ID,
            MESSAGE
        ) VALUES (
            CONVERSATION_ID,
            SENDER_ID,
            MESSAGE
        );
    END IF;
END;
/

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
    INSERT INTO USER_REGISTER_VIEW (
        NAME,
        DOB,
        ADDRESS,
        MOBILE,
        CITY_CODE,
        EMAIL,
        PASSWORD,
        TYPE
    ) VALUES (
        FULL_NAME(FIRST_NAME, LAST_NAME),
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
    UPDATE USER_UPDATE_VIEW
    SET
        NAME = FULL_NAME(
            U_FIRST_NAME,
            U_LAST_NAME
        ),
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

CREATE OR REPLACE PROCEDURE REGISTER_CHEF(
    U_ID VARCHAR2,
    U_NAME VARCHAR2,
    U_SPECIALITY VARCHAR2,
    U_EXPERIENCE NUMBER
) IS
BEGIN
    INSERT INTO CHEF_VIEW (
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

CREATE OR REPLACE PROCEDURE REGISTER_KITCHEN(
    K_NAME VARCHAR2,
    K_ADDRESS VARCHAR2,
    K_CITY_NAME VARCHAR2,
    K_CHEF_ID VARCHAR2
) IS
BEGIN
    INSERT INTO KITCHEN_VIEW (
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

CREATE OR REPLACE PROCEDURE DELETE_KITCHEN(
    D_KITCHEN_ID VARCHAR2
) IS
BEGIN
    DELETE FROM KITCHEN_IMAGES
    WHERE
        KITCHEN_ID = D_KITCHEN_ID;
    DELETE FROM INGREDIENT
    WHERE
        FOOD_ID IN (
            SELECT
                FOOD_ID
            FROM
                KITCHEN_RELATED_IDS
            WHERE
                KITCHEN_ID = D_KITCHEN_ID
        );
    DELETE FROM CART
    WHERE
        FOOD_ID IN (
            SELECT
                FOOD_ID
            FROM
                KITCHEN_RELATED_IDS
            WHERE
                KITCHEN_ID = D_KITCHEN_ID
        );
    DELETE FROM FOOD
    WHERE
        CATEGORY_ID IN (
            SELECT
                CATEGORY_ID
            FROM
                KITCHEN_RELATED_IDS
            WHERE
                KITCHEN_ID = D_KITCHEN_ID
        );
    DELETE FROM CATEGORY
    WHERE
        KITCHEN_ID = D_KITCHEN_ID;
    DELETE FROM KITCHEN
    WHERE
        ID = D_KITCHEN_ID;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'KITCHEN_DELETE',
        'Kitchen Deleted - '
        || D_KITCHEN_ID,
        'INFO'
    );
END;
/

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

CREATE OR REPLACE PROCEDURE DELETE_KITCHEN_IMAGE(
    IMAGE_ID VARCHAR2
) IS
BEGIN
    DELETE FROM KITCHEN_IMAGES
    WHERE
        ID = IMAGE_ID;
END;
/

CREATE OR REPLACE PROCEDURE ADD_CERTIFICATION(
    CHEF_ID VARCHAR2,
    NAME VARCHAR2,
    ISSUE_DATE DATE,
    LINK VARCHAR2,
    CERTIFICATION_IMAGE VARCHAR2
) IS
BEGIN
    INSERT INTO CERTIFICATION_VIEW (
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

CREATE OR REPLACE VIEW QA_OFFICER_VIEW AS
    SELECT
        USER_ID,
        ACADEMIC_QUALIFICATION,
        CV_LINK
    FROM
        QA_OFFICER;

/

CREATE OR REPLACE PROCEDURE ADD_QA_OFFICER(
    U_ID VARCHAR2,
    ACADEMIC_QUALIFICATION VARCHAR2,
    CV_LINK VARCHAR2
) IS
BEGIN
    INSERT INTO QA_OFFICER_VIEW (
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

CREATE OR REPLACE PROCEDURE SHIP_ORDER(
    O_ID VARCHAR2,
    S_ID VARCHAR2
) IS
BEGIN
    UPDATE ORDERS_VIEW
    SET
        STATUS = 'SHIPPED',
        DATE_SHIPPED = SYSDATE
    WHERE
        ID = O_ID;
    INSERT INTO ACTIVE_DELIVERY (
        ORDER_ID,
        DELIVERY_PARTNER_ID
    ) VALUES (
        O_ID,
        S_ID
    );
    INSERT INTO LOGS_VIEW (
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

CREATE OR REPLACE PROCEDURE DELIVER_ORDER(
    O_ID VARCHAR2
) IS
BEGIN
    UPDATE ORDERS_VIEW
    SET
        STATUS = 'DELIVERED',
        DATE_DELIVERED = SYSDATE
    WHERE
        ID = O_ID;
    UPDATE ACTIVE_DELIVERY
    SET
        STATUS = 'COMPLETED'
    WHERE
        ORDER_ID = O_ID;
    INSERT INTO LOGS_VIEW (
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

CREATE OR REPLACE PROCEDURE CANCEL_ORDER(
    O_ID VARCHAR2
) IS
BEGIN
    UPDATE ORDERS_VIEW
    SET
        STATUS = 'CANCELLED'
    WHERE
        ID = O_ID;
    UPDATE ACTIVE_DELIVERY
    SET
        STATUS = 'REJECTED'
    WHERE
        ORDER_ID = O_ID;
    INSERT INTO LOGS_VIEW (
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


CREATE OR REPLACE VIEW DELIVERY_PARTNER_VIEW AS
    SELECT
        USER_ID,
        LICENSE,
        VEHICLE
    FROM
        DELIVERY_PARTNER;
      /  

select *from users,delivery_partner where users.id=delivery_partner.user_id;

--INSERT INTO DELIVERY_PARTNER(USER_ID, LICENSE, VEHICLE) VALUES(:id, :license, :vehicle)
CREATE OR REPLACE PROCEDURE REGISTER_DELIVERY_PARTNER(
    U_ID VARCHAR2,
    L_LICENSE VARCHAR2,
    V_VEHICLE VARCHAR2
) IS
BEGIN
    INSERT INTO DELIVERY_PARTNER_VIEW (
        USER_ID,
        LICENSE,
        VEHICLE
    ) VALUES (
        U_ID,
        L_LICENSE,
        V_VEHICLE
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

CREATE OR REPLACE PROCEDURE RATE_FOOD(
    R_FOOD_ID VARCHAR2,
    R_ID VARCHAR2,
    R_RATING NUMBER,
    R_REVIEW VARCHAR2
) IS
BEGIN
    UPDATE FOOD_RATING_VIEW
    SET
        RATING = R_RATING,
        REVIEW = R_REVIEW
    WHERE
        FOOD_ID = R_FOOD_ID
        AND USER_ID = R_ID;
END;
/

CREATE OR REPLACE PROCEDURE RATE_FOOD_NEW(
    FOOD_ID VARCHAR2,
    ID VARCHAR2,
    RATING NUMBER,
    REVIEW VARCHAR2
) IS
BEGIN
    INSERT INTO FOOD_RATING_VIEW (
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

CREATE OR REPLACE PROCEDURE PREPARE_ORDER(
    O_ID VARCHAR2
) IS
BEGIN
    UPDATE ORDERS_VIEW
    SET
        STATUS = 'PREPEARED',
        DATE_PREPARED = SYSDATE
    WHERE
        ID = O_ID;
    COMMIT;
END;
/

CREATE OR REPLACE PROCEDURE CANCEL_ORDER_USER(
    O_ID VARCHAR2,
    C_ID VARCHAR2
    
) IS
BEGIN
    UPDATE ORDERS_VIEW
    SET
        STATUS = 'CANCELLED' 
    WHERE
        ID = O_ID
        AND USER_ID = C_ID;
    COMMIT;
    INSERT INTO LOGS_VIEW (
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

CREATE OR REPLACE PROCEDURE BAN_DELIVERY_PARTNER(
    B_ID VARCHAR2
) IS
BEGIN
    UPDATE DELIVERY_PARTNER
    SET
        VERIFIED = 0
    WHERE
        ID = B_ID;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'DELIVERY_PARTNER_BAN',
        'Delivery Partner Banned - '
        || B_ID,
        'WARNING'
    );
END;
/

CREATE OR REPLACE PROCEDURE UNBAN_DELIVERY_PARTNER(
    U_ID VARCHAR2
) IS
BEGIN
    UPDATE DELIVERY_PARTNER
    SET
        VERIFIED = 1
    WHERE
        ID = U_ID;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'DELIVERY_PARTNER_UNBAN',
        'Delivery Partner Unbanned - '
        || U_ID,
        'SUCCESS'
    );
END;
/

CREATE OR REPLACE PROCEDURE UPDATE_CATEGORY(
    C_CAT_ID VARCHAR2,
    C_CAT_NAME VARCHAR2,
    C_CAT_DESCRIPTION VARCHAR2,
    C_IMAGE VARCHAR2
) IS
BEGIN
    UPDATE CATEGORY
    SET
        CATEGORY.NAME = C_CAT_NAME,
        CATEGORY.DESCRIPTION = C_CAT_DESCRIPTION,
        CATEGORY.CATEGORY_IMAGE = C_IMAGE
    WHERE
        CATEGORY.ID = C_CAT_ID;
    COMMIT;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'CATEGORY_UPDATE',
        'Category Updated - '
        || C_CAT_ID
        || ' '
        || C_CAT_NAME,
        'SUCCESS'
    );
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error updating category');
        RAISE;
END;
/

CREATE OR REPLACE PROCEDURE DELETE_CATEGORY(
    D_CAT_ID VARCHAR2
) IS
BEGIN
    DELETE FROM INGREDIENT
    WHERE
        FOOD_ID IN (
            SELECT
                ID
            FROM
                FOOD
            WHERE
                CATEGORY_ID = D_CAT_ID
        );
    COMMIT;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'INGREDIENT DELETED BECAUSE OF CATEGORY',
        'Ingredients Deleted - '
        || D_CAT_ID,
        'SUCCESS'
    );
    DELETE FROM CART
    WHERE
        FOOD_ID IN (
            SELECT
                ID
            FROM
                FOOD
            WHERE
                CATEGORY_ID = D_CAT_ID
        );
    COMMIT;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'CART DELETED BECAUSE OF CATEGORY',
        'Cart Deleted - '
        || D_CAT_ID,
        'SUCCESS'
    );
    DELETE FROM FOOD_RATING
    WHERE
        FOOD_ID IN (
            SELECT
                ID
            FROM
                FOOD
            WHERE
                CATEGORY_ID = D_CAT_ID
        );
    COMMIT;
    DELETE FROM REPORT_FOOD
    WHERE
        FOOD_ID IN (
            SELECT
                ID
            FROM
                FOOD
            WHERE
                CATEGORY_ID = D_CAT_ID
        );
    COMMIT;
    DELETE FROM FOOD
    WHERE
        CATEGORY_ID = D_CAT_ID;
    COMMIT;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'FOOD DELETED BECAUSE OF CATEGORY',
        'Food Deleted - '
        || D_CAT_ID,
        'SUCCESS'
    );
    DELETE FROM CATEGORY
    WHERE
        ID = D_CAT_ID;
    COMMIT;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'CATEGORY_DELETE',
        'Category Deleted - '
        || D_CAT_ID,
        'SUCCESS'
    );
END;
/

/**
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
**/

CREATE OR REPLACE PROCEDURE UPDATE_FOOD(
    F_ID VARCHAR2,
    F_NAME VARCHAR2,
    F_DESCRIPTION VARCHAR2,
    F_PRICE NUMBER,
    F_IMAGE VARCHAR2
) IS
BEGIN
    UPDATE FOOD
    SET
        NAME = F_NAME,
        DESCRIPTION = F_DESCRIPTION,
        PRICE = F_PRICE,
        FOOD_IMAGE = F_IMAGE
    WHERE
        ID = F_ID;
    COMMIT;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'FOOD_UPDATE',
        'Food Updated - '
        || F_ID
        || ' '
        || F_NAME,
        'SUCCESS'
    );
END;
/

CREATE OR REPLACE PROCEDURE DELETE_FOOD(
    D_FOOD_ID VARCHAR2
) IS
BEGIN
    DELETE FROM INGREDIENT
    WHERE
        FOOD_ID = D_FOOD_ID;
    COMMIT;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'INGREDIENT DELETED BECAUSE OF FOOD',
        'Ingredients Deleted - '
        || D_FOOD_ID,
        'SUCCESS'
    );
    DELETE FROM CART
    WHERE
        FOOD_ID = D_FOOD_ID;
    COMMIT;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'CART DELETED BECAUSE OF FOOD',
        'Cart Deleted - '
        || D_FOOD_ID,
        'SUCCESS'
    );
    DELETE FROM FOOD_RATING
    WHERE
        FOOD_ID = D_FOOD_ID;
    COMMIT;
    DELETE FROM REPORT_FOOD
    WHERE
        FOOD_ID = D_FOOD_ID;
    COMMIT;
    DELETE FROM FOOD
    WHERE
        ID = D_FOOD_ID;
    COMMIT;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'FOOD_DELETE',
        'Food Deleted - '
        || D_FOOD_ID,
        'SUCCESS'
    );
END;
/