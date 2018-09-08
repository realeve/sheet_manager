# ERP 查询

## 数据库连接

> 数据库连接 1：ERP  
> 账户：guest/welcome  
> SID：PROD  
> PORT: 1900

> 数据库连接 2：10.8.2.188（临时，测试通过后迁移至正式环境）  
> 账户：mac2/mac3  
> SID：BPAUTO  
> PORT：1521

## 收付存报表

### 查询当前财务年的具体期间内所有物料的收付存情况

> 截止 2017-12-31 日前物料结存为 0 的物料不显示。

1.  根据用户输入的期间名称`02-18`，查询出当期 max(period_id)，数据库连接 1
    http://10.8.1.25:100/api/150/bc2e7d3404.html?period=02-18

    `select max(period_id) "periodid" from inv.org_acct_periods where period_name='02-18'`

2.  根据用户输入的期间名称`02-18`，查询出上期`01-18` max(period_id)，数据库连接 1
    http://10.8.1.25:100/api/150/bc2e7d3404.html?period=01-18

    `select max(period_id) "periodid" from inv.org_acct_periods where period_name='01-18'`

3.  接口 1(数据库连接 2)： 根据期间 ID，查询物料期初数量、金额（没有子库信息）
    http://10.8.1.25:100/api/151/f0d7f4eab9.html?periodid=3796&sn=%254101%25&name=%25五金%25

    ```sql
    SELECT SN "sn", NAME "name", SUM(QUANTITY) "quantity", ROUND(SUM(FIGURE), 2) "figure", '' "remark", '0' "type"  FROM TBERP_INV_PERIOD
       WHERE MAX_ID <= 3851 			-- 此处替换 期间ID
       AND (QUANTITY > 0 OR FIGURE > 0)
    GROUP BY SN, NAME;
    ```

4.  接口 2(数据库连接 2)：根据期间 ID，查询物料结存数量、金额（包含子库信息）
    http://10.8.1.25:100/api/151/f0d7f4eab9.html?periodid=3796&sn=%254101%25&name=%25五金%25

    ```sql
    SELECT SN "sn", NAME "name", SUM(QUANTITY) "quantity", ROUND(SUM(FIGURE), 2) "figure", DESCRIPTION "remark", '3' "type" FROM TBERP_INV_PERIOD
       WHERE MAX_ID <= 3851 			-- 此处替换 期间ID
       AND (QUANTITY > 0 OR FIGURE > 0)
    GROUP BY SN, NAME, DESCRIPTION;
    ```

5.  接口 3(数据库连接 2)：根据期间 ID，查询物料收入数量、金额，事务 ID、名称
    http://10.8.1.25:100/api/151/f0d7f4eab9.html?periodid=3796&sn=%254101%25&name=%25五金%25

    ```sql
    SELECT t.SN "sn", t.NAME "name", SUM(t.QUANTITY) "quantity", SUM(t.figure) "figure", t.TRANSACTION_TYPE_NAME "remark", '1' TYPE
    FROM TBERP_INV_INCOME t
    WHERE t.MAX_ID <= 3851				--此处替换 期间ID
    --AND t.INVENTORY_ITEM_ID = 4
    GROUP BY t.SN, t.NAME, t.TRANSACTION_TYPE_NAME;
    ```

6.  接口 4(数据库连接 2)：根据前期间 ID，查询物料付出数量、金额，账户别名
    http://10.8.1.25:100/api/151/f0d7f4eab9.html?periodid=3796&sn=%254101%25&name=%25五金%25

    ```sql
    SELECT t.SN "sn", t.NAME "name", SUM(t.QUANTITY) "quantity", SUM(t.figure) "figure", t.DESCRIPTION "remark", '2' "type"
    FROM TBERP_INV_PAYOUT t
    WHERE t.MAX_ID <= 3851				--此处替换 期间ID
    --AND t.INVENTORY_ITEM_ID = 4
    GROUP BY t.SN, t.NAME, t.DESCRIPTION;
    ```

7.  接口 5（数据库连接 1）：ERP 主组织代码
    http://10.8.1.25:100/api/157/5f830d1833.html

## 呆滞库存分析

查询距今时间段（1-2，2-3，3-4，4-5，5 以上）的库存信息

1.  根据用户选择的时间段，计算出时间段的起止日期（比如 start_date, end_date）

2.  根据起止日期，查询物料最后一次事务处理的信息
    periodid 为当前时间最后一次 id 信息，
    http://10.8.1.25:100/api/155/117dd652a7/array.html?from=4&to=5&periodid=3796

                ```sql
                SELECT
        a.sn,a.name,a.account,a.quantity,a.figure,a.source,b.remain_figure,b.remain_quantity,b.remain_remark,a.duration

    FROM
    (
    SELECT
    T .sn ,
    T . NAME ,
    T .transaction_type_name source,
    T .quantity ,
    T .figure ,
    T .description account,
    ROUND (
    (SYSDATE - T .CREATION_DATE) / 365,
    2
    ) duration
    FROM
    TBERP_LAST_TRANSACTION T
    WHERE
    (SYSDATE - T .CREATION_DATE) / 365 BETWEEN 2
    AND 3
    ) A
    LEFT JOIN (
    SELECT
    SN remain_sn,
    SUM (QUANTITY) remain_quantity,
    ROUND (SUM(FIGURE), 2) remain_figure,
    DESCRIPTION remain_remark
    FROM
    TBERP_INV_PERIOD
    WHERE
    MAX_ID <= 3796
    AND (QUANTITY > 0 OR FIGURE > 0)
    GROUP BY
    SN,
    NAME,
    DESCRIPTION
    ) b ON A .sn = b.remain_sn where nvl(b.remain_quantity,0)>0

        ```

3.  根据起止日期，查询物料的结存数量、金额、子库，同前接口 3

# 收付存 20180705

http://10.8.1.25:100/api/156/4653126720.html?periodid=3829&baseid=3519&sn=%25%25&name=%25墨%25&orgid=27

```sql
with tmp_tbl as
 (select distinct 3829 as m_id, 3519 as base_id,p.inventory_item_id,p.sn m_sn,p.name m_name from tberp_inv_period p where p.sn like '%%' and p.name like '%墨%' and p.organization_id=27)
SELECT a.SN "sn",
       a.NAME "name",
       SUM(a.QUANTITY) "quantity",
       ROUND(SUM(a.FIGURE), 2) "figure",
       '' "remark",
       '0' "type"
  FROM TBERP_INV_PERIOD a
 inner join tmp_tbl b
    on a.MAX_ID <= b.base_id
   AND (a.QUANTITY > 0 OR a.FIGURE > 0)
   AND a.sn = b.m_sn
 GROUP BY a.SN, a.NAME
union
SELECT T.SN "sn",
       T . NAME "name",
       SUM(T.QUANTITY) "quantity",
       SUM(T.figure) "figure",
       T.TRANSACTION_TYPE_NAME "remark",
       '1' "type"
  FROM TBERP_INV_INCOME T
 inner join tmp_tbl b
    on MAX_ID <= b.m_id AND sn = b.m_sn
 GROUP BY T.SN, T . NAME, T.TRANSACTION_TYPE_NAME
union
SELECT T.SN "sn",
       T . NAME "name",
       SUM(T.QUANTITY) "quantity",
       SUM(T.figure) "figure",
       T.DESCRIPTION "remark",
       '2' "type"
  FROM TBERP_INV_PAYOUT T
 inner join tmp_tbl b
    on MAX_ID <= b.m_id
    AND sn = b.m_sn
 GROUP BY T.SN, T . NAME, T.DESCRIPTION
union
SELECT e.SN "sn",
       e.NAME "name",
       SUM(e.QUANTITY) "quantity",
       ROUND(SUM(e.FIGURE), 2) "figure",
       e.DESCRIPTION "remark",
       '3' "type"
  FROM TBERP_INV_PERIOD e
 inner join tmp_tbl b
    on MAX_ID <= b.m_id
    AND e.sn = b.m_sn
    AND (e.QUANTITY > 0 OR e.FIGURE > 0)
 GROUP BY e.SN, e.NAME, e.DESCRIPTION
```

# 组织代码列表

http://10.8.1.25:100/api/157/5f830d1833.html

```sql
select t.ORGANIZATION_ID "value",t.ORGANIZATION_CODE "code",t.ORGANIZATION_NAME "name" from APPS.ORG_ORGANIZATION_DEFINITIONS t where (t.DISABLE_DATE is null or t.DISABLE_DATE>sysdate) and t.INVENTORY_ENABLED_FLAG='Y'
```

# 收付存，别名查询

```sql
WITH tmp_tbl AS (
	SELECT DISTINCT
		3882 AS m_id,
		3807 AS base_id,
		P.sn m_sn
	FROM
		tberp_inv_period P
	WHERE
		(
			P .sn LIKE '%%'
			AND P . NAME LIKE '%%'
		)
	AND P .organization_id = 31
),
 pay_out AS (
	SELECT
		T .SN "sn",
		T . NAME "name",
		SUM (T .QUANTITY) "quantity",
		SUM (T .figure) "figure",
		T .DESCRIPTION "remark",
		'2' "type"
	FROM
		TBERP_PAYOUT T
	INNER JOIN tmp_tbl b ON MAX_ID <= b.m_id
	AND MAX_ID > b.base_id
	AND sn = b.m_sn
	-- where t.DESCRIPTION like '%维修%'
	GROUP BY
		T .SN,
		T . NAME,
		T .DESCRIPTION
),
 sn_list AS (
	SELECT DISTINCT
		"sn"
	FROM
		pay_out
) SELECT
	A .SN "sn",
	A . NAME "name",
	SUM (A .QUANTITY) "quantity",
	ROUND (SUM(A .FIGURE), 2) "figure",
	'' "remark",
	'0' "type"
FROM
	TBERP_INV_PERIOD A
INNER JOIN tmp_tbl b ON A .MAX_ID <= b.base_id
AND A .sn = b.m_sn
AND A .sn IN (SELECT * FROM sn_list)
GROUP BY
	A .SN,
	A . NAME
UNION
	SELECT
		T .SN "sn",
		T . NAME "name",
		SUM (T .QUANTITY) "quantity",
		SUM (T .figure) "figure",
		T .TRANSACTION_TYPE_NAME "remark",
		'1' "type"
	FROM
		TBERP_RECEIPT T
	INNER JOIN tmp_tbl b ON MAX_ID <= b.m_id
	AND MAX_ID > b.base_id
	AND sn = b.m_sn
	AND T .sn IN (SELECT * FROM sn_list)
	GROUP BY
		T .SN,
		T . NAME,
		T .TRANSACTION_TYPE_NAME
	UNION
		SELECT
			*
		FROM
			pay_out
		UNION
			SELECT
				E .SN "sn",
				E . NAME "name",
				SUM (E .QUANTITY) "quantity",
				ROUND (SUM(E .FIGURE), 2) "figure",
				E .DESCRIPTION "remark",
				'3' "type"
			FROM
				TBERP_INV_PERIOD E
			INNER JOIN tmp_tbl b ON MAX_ID <= b.m_id
			AND E .sn = b.m_sn
			AND E .sn IN (SELECT * FROM sn_list)
			GROUP BY
				E .SN,
				E . NAME,
				E .DESCRIPTION
```
