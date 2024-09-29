CREATE OR REPLACE PROCEDURE GET_USER_DETAILS (
    P_ID IN USERS.ID%TYPE,
    P_EMAIL IN USERS.EMAIL%TYPE,
    P_CURSOR OUT SYS_REFCURSOR
) IS
    EMAIL_EMPTY EXCEPTION;
BEGIN
    OPEN P_CURSOR FOR
        SELECT
            NAME,
            DOB,
            ADDRESS,
            MOBILE,
            CITY_CODE,
            EMAIL,
            TYPE,
            PROFILE_IMAGE,
            CHEF.ID       AS CHEF_ID,
            SPECIALITY
        FROM
            USERS,
            CHEF
        WHERE
            USERS.ID = P_ID
            AND USERS.EMAIL = P_EMAIL
            AND CHEF.USER_ID(+) = USERS.ID;
EXCEPTION
    WHEN EMAIL_EMPTY THEN
        RAISE_APPLICATION_ERROR(-20001, 'Email cannot be empty.');
END;
/

CREATE OR REPLACE PROCEDURE GET_USER_WITH_PASSWORD (
    P_EMAIL IN USERS.EMAIL%TYPE,
    P_PASSWORD IN USERS.PASSWORD%TYPE,
    P_CURSOR OUT SYS_REFCURSOR
) IS
    EMAIL_EMPTY EXCEPTION;
BEGIN
    IF P_EMAIL IS NULL OR TRIM(P_EMAIL) = '' THEN
        RAISE EMAIL_EMPTY;
    END IF;

    OPEN P_CURSOR FOR
        SELECT
            *
        FROM
            USERS
        WHERE
            EMAIL = P_EMAIL
            AND PASSWORD = P_PASSWORD;
EXCEPTION
    WHEN EMAIL_EMPTY THEN
        RAISE_APPLICATION_ERROR(-20001, 'Email cannot be empty.');
END;
/

CREATE OR REPLACE PROCEDURE GET_CONVERSATIONS (
    P_USER_ID IN CONVERSATIONS.USER_ID%TYPE,
    P_DELIVERY_PARTNER_ID IN CONVERSATIONS.DELIVERY_PARTNER_ID%TYPE,
    P_CURSOR OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN P_CURSOR FOR
        SELECT
            *
        FROM
            CONVERSATIONS
        WHERE
            USER_ID = P_USER_ID
            AND DELIVERY_PARTNER_ID = P_DELIVERY_PARTNER_ID;
END;
/

CREATE OR REPLACE PROCEDURE GET_CHEF_DETAILS (
    P_CHEF_ID IN CHEF.ID%TYPE,
    P_CURSOR OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN P_CURSOR FOR
        SELECT
            USERS.NAME,
            USERS.DOB,
            USERS.ADDRESS,
            USERS.MOBILE,
            USERS.CITY_CODE,
            USERS.EMAIL,
            USERS.PROFILE_IMAGE,
            CHEF_NAME,
            CHEF.ID                       AS CHEF_ID,
            CHEF.SPECIALITY,
            CHEF.EXPERIENCE,
            KITCHEN.ID                    AS KITCHEN_ID,
            KITCHEN.ADDRESS               AS KITCHEN_ADDRESS,
            APPROVED,
            GET_KITCHEN_IMAGE(KITCHEN.ID) AS KITCHEN_IMAGE,
            KITCHEN.NAME                  AS KITCHEN_NAME,
            KITCHEN.CITY_NAME
        FROM
            USERS,
            CHEF,
            KITCHEN
        WHERE
            USERS.ID = CHEF.USER_ID
            AND CHEF.ID = P_CHEF_ID
            AND CHEF.ID = KITCHEN.CHEF_ID(+);
END;
/

CREATE OR REPLACE PROCEDURE GET_CONVERSATION_MESSAGES (
    P_USER_ID IN CONVERSATIONS.USER_ID%TYPE,
    P_DELIVERY_PARTNER_ID IN CONVERSATIONS.DELIVERY_PARTNER_ID%TYPE,
    P_CONVERSATION_ID IN MESSAGES.CONVERSATION_ID%TYPE,
    P_CURSOR OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN P_CURSOR FOR
        SELECT
            DATE_ADDED AS TIMESTAMP,
            SENDER_ID  AS SENDER,
            MESSAGE    AS CONTENT
        FROM
            CONVERSATIONS,
            MESSAGES
        WHERE
            USER_ID = P_USER_ID
            AND DELIVERY_PARTNER_ID = P_DELIVERY_PARTNER_ID
            AND MESSAGES.CONVERSATION_ID = P_CONVERSATION_ID;
END;
/

CREATE OR REPLACE PROCEDURE GET_USER_CHEF_KITCHEN_DETAILS (
    P_USER_ID IN USERS.ID%TYPE,
    P_CURSOR OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN P_CURSOR FOR
        SELECT
            USERS.NAME,
            USERS.DOB,
            USERS.ADDRESS,
            USERS.MOBILE,
            USERS.CITY_CODE,
            USERS.EMAIL,
            USERS.PROFILE_IMAGE,
            CHEF.CHEF_NAME,
            CHEF.ID                       AS CHEF_ID,
            CHEF.SPECIALITY,
            CHEF.EXPERIENCE,
            KITCHEN.ID                    AS KITCHEN_ID,
            KITCHEN.ADDRESS               AS KITCHEN_ADDRESS,
            KITCHEN.APPROVED,
            GET_KITCHEN_IMAGE(KITCHEN.ID) AS KITCHEN_IMAGE,
            KITCHEN.NAME                  AS KITCHEN_NAME,
            KITCHEN.CITY_NAME
        FROM
            USERS
            LEFT JOIN CHEF
            ON USERS.ID = CHEF.USER_ID
            LEFT JOIN KITCHEN
            ON CHEF.ID = KITCHEN.CHEF_ID
        WHERE
            USERS.ID = P_USER_ID;
EXCEPTION
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(-20002, 'An unexpected error occurred: '
                                        || SQLERRM);
END;
/

CREATE OR REPLACE PROCEDURE GET_KITCHEN_DETAILS (
    P_KITCHEN_ID IN KITCHEN.ID%TYPE,
    P_CURSOR OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN P_CURSOR FOR
        SELECT
            CHEF.ID           AS CHEF_ID,
            USERS.ID,
            USERS.NAME,
            KITCHEN.ID        AS KITCHEN_ID,
            KITCHEN.ADDRESS   AS KITCHEN_ADDRESS,
            KITCHEN.CITY_NAME AS KITCHEN_CITY_NAME,
            KITCHEN.APPROVED  AS KITCHEN_APPROVED,
            KITCHEN.NAME      AS KITCHEN_NAME
        FROM
            KITCHEN,
            USERS,
            CHEF
        WHERE
            KITCHEN.ID = P_KITCHEN_ID
            AND KITCHEN.CHEF_ID = CHEF.ID
            AND CHEF.USER_ID = USERS.ID;
EXCEPTION
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(-20002, 'An unexpected error occurred: '
                                        || SQLERRM);
END;
/

CREATE OR REPLACE PROCEDURE GET_TOP_FOOD_ITEMS (
    P_HOUR IN NUMBER,
    P_CURSOR OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN P_CURSOR FOR
        SELECT
            FOOD.NAME,
            FOOD.PRICE,
            USERS.ID         AS USERS_ID,
            FOOD.ID          AS ID,
            USERS.NAME,
            PROFILE_IMAGE,
            CHEF_NAME,
            FOOD.DESCRIPTION,
            FOOD.FOOD_IMAGE  AS FOOD_IMAGE
        FROM
            USERS,
            CHEF,
            CATEGORY,
            KITCHEN,
            FOOD,
            (
                SELECT
                    FOOD_ID,
                    COUNT(FOOD_ID) AS COUNT
                FROM
                    CART
                WHERE
                    DATE_ADDED >= SYSDATE - P_HOUR / 24
                GROUP BY
                    FOOD_ID
                ORDER BY
                    COUNT DESC FETCH FIRST 10 ROWS ONLY
            )        B
        WHERE
            B.FOOD_ID = FOOD.ID
            AND FOOD.CATEGORY_ID = CATEGORY.ID
            AND CATEGORY.KITCHEN_ID = KITCHEN.ID
            AND CHEF.ID = KITCHEN.CHEF_ID
            AND CHEF.USER_ID = USERS.ID;
EXCEPTION
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(-20002, 'An unexpected error occurred: '
                                        || SQLERRM);
END;
/

CREATE OR REPLACE PROCEDURE GET_TOP_CATEGORIES_BY_CHEF (
    P_CHEF_ID IN CHEF.ID%TYPE,
    P_CURSOR OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN P_CURSOR FOR
        SELECT
            CATEGORY.*
        FROM
            CATEGORY,
            (
                SELECT
                    CATEGORY_ID,
                    COUNT(CATEGORY_ID) AS COUNT
                FROM
                    FOOD
                WHERE
                    CATEGORY_ID IN (
                        SELECT
                            ID
                        FROM
                            CATEGORY
                        WHERE
                            KITCHEN_ID IN (
                                SELECT
                                    ID
                                FROM
                                    KITCHEN
                                WHERE
                                    CHEF_ID = P_CHEF_ID
                            )
                    )
                GROUP BY
                    CATEGORY_ID
                ORDER BY
                    COUNT DESC FETCH FIRST 5 ROWS ONLY
            )        B
        WHERE
            B.CATEGORY_ID = CATEGORY.ID;
END;
/

CREATE OR REPLACE PROCEDURE GET_TOP_FOOD_ITEMS_BY_CHEF (
    P_CHEF_ID IN CHEF.ID%TYPE,
    P_CURSOR OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN P_CURSOR FOR
        SELECT
            FOOD.*
        FROM
            FOOD,
            (
                SELECT
                    FOOD_ID,
                    COUNT(FOOD_ID) AS COUNT
                FROM
                    CART
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
                                    KITCHEN_ID IN (
                                        SELECT
                                            ID
                                        FROM
                                            KITCHEN
                                        WHERE
                                            CHEF_ID = P_CHEF_ID
                                    )
                            )
                    )
                GROUP BY
                    FOOD_ID
                ORDER BY
                    COUNT DESC FETCH FIRST 4 ROWS ONLY
            )    B
        WHERE
            B.FOOD_ID = FOOD.ID;
END;
/

CREATE OR REPLACE PROCEDURE GET_ORDER_DETAILS (
    P_ORDER_ID IN ORDERS.ID%TYPE,
    P_CURSOR OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN P_CURSOR FOR
        SELECT
            *
        FROM
            (
                SELECT
                    NAME,
                    PROFILE_IMAGE,
                    ORDERS.ID      AS ORDER_ID,
                    ORDERS.TOTAL,
                    SHIPPING_NAME,
                    SHIPPING_PHONE,
                    SHIPPING_ADD
                FROM
                    ACTIVE_DELIVERY,
                    USERS,
                    ORDERS
                WHERE
                    ACTIVE_DELIVERY.DELIVERY_PARTNER_ID = USERS.ID
                    AND ACTIVE_DELIVERY.ORDER_ID = P_ORDER_ID
                    AND ORDERS.ID = P_ORDER_ID
            ) R,
            (
                SELECT
                    KI.ID                        AS KITCHEN_ID,
                    ORDER_ID,
                    FOOD_NAMES,
                    TOTAL,
                    DATE_ADDED,
                    DATE_SHIPPED,
                    DATE_DELIVERED,
                    SHIPPING_ADD,
                    SHIPPING_PHONE,
                    SHIPPING_NAME,
                    GET_ORDER_STATUS(ORD.STATUS) AS ORDER_STATUS
                FROM
                    (
                        SELECT
                            C.DELETED_ID                 AS ORDER_ID,
                            K.ID,
                            GET_FOOD_NAMES(C.DELETED_ID) AS FOOD_NAMES
                        FROM
                            CART     C
                            JOIN FOOD F
                            ON C.FOOD_ID = F.ID
                            JOIN CATEGORY CAT
                            ON F.CATEGORY_ID = CAT.ID
                            JOIN KITCHEN K
                            ON CAT.KITCHEN_ID = K.ID
                        WHERE
                            C.DELETED_ID IS NOT NULL
                        GROUP BY
                            C.DELETED_ID,
                            K.ID
                    )       Q,
                    ORDERS  ORD,
                    KITCHEN KI,
                    CHEF,
                    USERS
                WHERE
                    Q.ID = KI.ID
                    AND CHEF.ID = KI.CHEF_ID
                    AND USERS.ID = CHEF.USER_ID
                    AND Q.ORDER_ID = ORD.ID
                    AND ORD.ID = P_ORDER_ID
                ORDER BY
                    CASE
                        WHEN ORD.STATUS = 'DELIVERED' THEN
                            1
                        ELSE
                            0
                    END ASC,
                    ORD.DATE_ADDED ASC
            ) S
        WHERE
            R.ORDER_ID = S.ORDER_ID;
END;
/

SELECT
            KI.ID                        AS KITCHEN_ID,
            ORDER_ID,
            FOOD_NAMES,
            TOTAL,
            DATE_ADDED,
            DATE_SHIPPED,
            DATE_DELIVERED,
            SHIPPING_ADD,
            SHIPPING_PHONE,
            SHIPPING_NAME,
            GET_ORDER_STATUS(ORD.STATUS) AS ORDER_STATUS
        FROM
            (
                SELECT
                    C.DELETED_ID                 AS ORDER_ID,
                    K.ID,
                    GET_FOOD_NAMES(C.DELETED_ID) AS FOOD_NAMES
                FROM
                    CART     C
                    JOIN FOOD F
                    ON C.FOOD_ID = F.ID
                    JOIN CATEGORY CAT
                    ON F.CATEGORY_ID = CAT.ID
                    JOIN KITCHEN K
                    ON CAT.KITCHEN_ID = K.ID
                WHERE
                    C.DELETED_ID IS NOT NULL
                GROUP BY
                    C.DELETED_ID,
                    K.ID
            )       Q,
            ORDERS  ORD,
            KITCHEN KI,
            CHEF,
            USERS
        WHERE
            Q.ID = KI.ID
            AND CHEF.ID = KI.CHEF_ID
            AND USERS.ID = CHEF.USER_ID
            AND Q.ORDER_ID = ORD.ID
            AND CHEF.USER_ID = 'U3'
            AND KI.ID = 'K1'
        ORDER BY
            CASE
                WHEN ORD.STATUS = 'DELIVERED' THEN
                    1
                ELSE
                    0
            END ASC,
            ORD.DATE_ADDED ASC;


CREATE OR REPLACE PROCEDURE GET_ORDER_DETAILS_BY_CHEF_AND_KITCHEN (
    P_USER_ID IN USERS.ID%TYPE,
    P_KITCHEN_ID IN KITCHEN.ID%TYPE,
    P_CURSOR OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN P_CURSOR FOR
        SELECT
            KI.ID                        AS KITCHEN_ID,
            ORDER_ID,
            FOOD_NAMES,
            TOTAL,
            DATE_ADDED,
            DATE_SHIPPED,
            DATE_DELIVERED,
            SHIPPING_ADD,
            SHIPPING_PHONE,
            SHIPPING_NAME,
            GET_ORDER_STATUS(ORD.STATUS) AS ORDER_STATUS
        FROM
            (
                SELECT
                    C.DELETED_ID                 AS ORDER_ID,
                    K.ID,
                    GET_FOOD_NAMES(C.DELETED_ID) AS FOOD_NAMES
                FROM
                    CART     C
                    JOIN FOOD F
                    ON C.FOOD_ID = F.ID
                    JOIN CATEGORY CAT
                    ON F.CATEGORY_ID = CAT.ID
                    JOIN KITCHEN K
                    ON CAT.KITCHEN_ID = K.ID
                WHERE
                    C.DELETED_ID IS NOT NULL
                GROUP BY
                    C.DELETED_ID,
                    K.ID
            )       Q,
            ORDERS  ORD,
            KITCHEN KI,
            CHEF,
            USERS
        WHERE
            Q.ID = KI.ID
            AND CHEF.ID = KI.CHEF_ID
            AND USERS.ID = CHEF.USER_ID
            AND Q.ORDER_ID = ORD.ID
            AND CHEF.USER_ID = P_USER_ID
            AND KI.ID = P_KITCHEN_ID
        ORDER BY
            CASE
                WHEN ORD.STATUS = 'DELIVERED' THEN
                    1
                ELSE
                    0
            END ASC,
            ORD.DATE_ADDED ASC;
            EXCEPTION
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(-20002, 'An unexpected error occurred: '
                                        || SQLERRM);
END;
/

CREATE OR REPLACE PROCEDURE GET_ORDER_DETAILS_BY_USER_ID (
    P_USER_ID IN USERS.ID%TYPE,
    P_CURSOR OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN P_CURSOR FOR
        SELECT
            KI.ID                        AS KITCHEN_ID,
            ORDER_ID,
            FOOD_NAMES,
            TOTAL,
            DATE_ADDED,
            DATE_SHIPPED,
            DATE_DELIVERED,
            SHIPPING_ADD,
            SHIPPING_PHONE,
            SHIPPING_NAME,
            GET_ORDER_STATUS(ORD.STATUS) AS ORDER_STATUS
        FROM
            (
                SELECT
                    C.DELETED_ID                 AS ORDER_ID,
                    K.ID,
                    GET_FOOD_NAMES(C.DELETED_ID) AS FOOD_NAMES
                FROM
                    CART     C
                    JOIN FOOD F
                    ON C.FOOD_ID = F.ID
                    JOIN CATEGORY CAT
                    ON F.CATEGORY_ID = CAT.ID
                    JOIN KITCHEN K
                    ON CAT.KITCHEN_ID = K.ID
                WHERE
                    C.DELETED_ID IS NOT NULL
                GROUP BY
                    C.DELETED_ID,
                    K.ID
            )       Q,
            ORDERS  ORD,
            KITCHEN KI,
            CHEF,
            USERS
        WHERE
            Q.ID = KI.ID
            AND CHEF.ID = KI.CHEF_ID
            AND USERS.ID = CHEF.USER_ID
            AND Q.ORDER_ID = ORD.ID
            AND ORD.USER_ID = P_USER_ID
        ORDER BY
            ORD.DATE_ADDED DESC;
END;
/

CREATE OR REPLACE PROCEDURE GET_TABLE_COLUMNS (
    P_CURSOR OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN P_CURSOR FOR
        SELECT
            TABLE_NAME,
            LISTAGG(COLUMN_NAME, ',') WITHIN GROUP (ORDER BY COLUMN_ID) AS COLUMNS
        FROM
            USER_TAB_COLUMNS
        WHERE
            TABLE_NAME NOT LIKE '%$%' -- Exclude tables with '$'
            AND TABLE_NAME NOT LIKE '%SCHEDULER%' -- Exclude tables with 'SCHEDULER' in their names
            AND TABLE_NAME NOT IN ( 'LOGMNRC_CONCOL_GG', 'LOGMNRC_CON_GG', 'LOGMNRC_DBNAME_UID_MAP', 'LOGMNRC_GSBA', 'LOGMNRC_GSII', 'LOGMNRC_GTCS', 'LOGMNRC_GTLO', 'LOGMNRC_INDCOL_GG', 'LOGMNRC_IND_GG', 'LOGMNRC_SEQ_GG', 'LOGMNRC_SHARD_TS', 'LOGMNRC_TS', 'LOGMNRC_TSPART', 'LOGMNRGGC_GTCS', 'LOGMNRGGC_GTLO', 'LOGMNRP_CTAS_PART_MAP', 'LOGMNR_LOGMNR_BUILDLOG', 'LOGMNR_SHARD_TS', 'MVIEW_EVALUATIONS', 'MVIEW_EXCEPTIONS', 'MVIEW_FILTER', 'MVIEW_FILTERINSTANCE', 'MVIEW_LOG', 'MVIEW_RECOMMENDATIONS', 'MVIEW_WORKLOAD', 'PRODUCT_PRIVS', 'REDO_DB', 'REDO_LOG', 'SQLPLUS_PRODUCT_PROFILE' )
        GROUP BY
            TABLE_NAME
        ORDER BY
            TABLE_NAME;
END;
/

CREATE OR REPLACE PROCEDURE GET_TOTAL_EARNINGS_BY_DELIVERY_PARTNER (
    P_USER_ID IN DELIVERY_PARTNER.USER_ID%TYPE,
    P_DAYS IN NUMBER,
    P_CURSOR OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN P_CURSOR FOR
        SELECT
            SUM(ORDERS.TOTAL * DELIVERY_COMMISION.AMOUNT) AS TOTAL_EARNING,
            TRUNC(ORDERS.DATE_ADDED)                      AS DAY
        FROM
            ORDERS,
            ACTIVE_DELIVERY,
            DELIVERY_COMMISION,
            DELIVERY_PARTNER
        WHERE
            ORDERS.DATE_ADDED >= TRUNC(SYSDATE) - P_DAYS
            AND DELIVERY_COMMISION.DELIVERY_PARTNER_ID = DELIVERY_PARTNER.ID
            AND DELIVERY_PARTNER.USER_ID = P_USER_ID
            AND ACTIVE_DELIVERY.DELIVERY_PARTNER_ID = P_USER_ID
            AND ORDERS.STATUS = 'DELIVERED'
            AND ACTIVE_DELIVERY.ORDER_ID = ORDERS.ID
        GROUP BY
            TRUNC(ORDERS.DATE_ADDED)
        ORDER BY
            TRUNC(ORDERS.DATE_ADDED);
END;
/

SELECT * from ORDERS;