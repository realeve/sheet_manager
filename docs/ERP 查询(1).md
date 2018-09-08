# ERP 查询

## 数据库连接
> 数据库连接1：ERP  
> 账户：guest/welcome   
> SID：PROD     
> PORT: 1900

> 数据库连接2：10.8.2.188（临时，测试通过后迁移至正式环境）     
> 账户：mac2/mac3       
> SID：BPAUTO       
> PORT：1521 

## 收付存报表

### 用户需求

#### 查询当前财务年的具体期间内所有物料的收付存情况

> 截止2017-12-31日前物料结存为0的物料不显示。

1. 根据用户输入的期间名称`02-18`，查询出当期 max(period_id)，数据库连接1
http://10.8.1.25:100/api/150/bc2e7d3404.html?period=02-18
   `select max(period_id) from inv.org_acct_periods where period_name='02-18' `

2. 根据用户输入的期间名称`02-18`，查询出上期 max(period_id)，数据库连接1
http://10.8.1.25:100/api/150/bc2e7d3404.html?period=01-18
   `select max(period_id) from inv.org_acct_periods where period_name='01-18'`

3. 根据当期期间ID，上期期间ID，查询物料期初数量金额、结存数量金额，数据库连接2

返回结果中结存为零的项，在后面的收付接口返回中如果没有对应项则可以不显示。
http://10.8.1.25:100/api/151/f0d7f4eab9.html?tstart=3851&tend=3862
   ```sql
   select DISTINCT t.INVENTORY_ITEM_ID, t.SEGMENT1, t.ITEM_NAME, a.qichu_quantity, a.qichu_money, b.jiecun_quantity, b.jiecun_money FROM TBERP_INV_PERIOD t
   LEFT JOIN
   (select inventory_item_id, sum(QUANTITY) as qichu_quantity, sum(money) as qichu_money from tberp_inv_period 
   where MAX_ID <= 3851 			-- 此处替换 上期期间ID
   GROUP BY inventory_item_id) a
   ON a.inventory_item_id = t.inventory_item_id
   LEFT JOIN
   (select inventory_item_id, sum(QUANTITY) as jiecun_quantity, sum(money) as jiecun_money from tberp_inv_period 
   where MAX_ID <= 3862 			-- 此处替换 当期期间ID
   GROUP BY inventory_item_id) b
   ON b.inventory_item_id = t.inventory_item_id
   -- WHERE t.INVENTORY_ITEM_ID = 296
   order by t.INVENTORY_ITEM_ID;
   ```

   > sql 语句中 3851 为 04-18 的期间ID，3862 为 05-18 的期间ID。请自行替换条件。

4. 根据当前期间ID，查询物料收入数量、金额，事务ID、名称，数据库连接2
http://10.8.1.25:100/api/153/16a5f99c46.html?periodid=3851
   ```sql
   SELECT t.INVENTORY_ITEM_ID, SUM(t.QUANTITY), SUM(t.MONEY),t.TRANSACTION_TYPE_ID,t.TRANSACTION_TYPE_NAME FROM TBERP_INV_INCOME t
   WHERE t.MAX_ID <= 3851				--此处替换当期期间ID
   --AND t.INVENTORY_ITEM_ID = 4			
   GROUP BY t.INVENTORY_ITEM_ID,t.TRANSACTION_TYPE_ID,t.TRANSACTION_TYPE_NAME;
   ```

5. 根据当前期间ID，查询物料付出数量、金额，别名，数据库连接2
http://10.8.1.25:100/api/152/9b089d2e3c.html?periodid=3851
   ```sql
   SELECT T.INVENTORY_ITEM_ID, SUM(T.QUANTITY), SUM(T.MONEY),T.description FROM TBERP_INV_PAYOUT T
   WHERE T.MAX_ID <= 3851				--此处替换当期期间ID
   --AND T.INVENTORY_ITEM_ID = 574
   GROUP BY T.INVENTORY_ITEM_ID, T.DESCRIPTION;
   ```

6. 物料ID 下钻,查询该物料ID 的明细，数据库连接1

   ```sql
   SELECT
       DISTINCT T.INVENTORY_ITEM_ID,
       E.SEGMENT1 物料编码,
       E.DESCRIPTION 物料名称,
       T.TRANSACTION_ID 事务处理ID,
       T.ACCT_PERIOD_ID 期间ID,
       to_char(T.TRANSACTION_DATE, 'mm-yy') AS period,
   	T.TRANSACTION_QUANTITY AS 数量,
       T.ACTUAL_COST 单价,
       T.TRANSACTION_UOM 单位,
       ROUND(T.TRANSACTION_QUANTITY * T.ACTUAL_COST, 2) 金额,
       T.TRANSACTION_DATE 事务处理日期,
       T.TRANSACTION_TYPE_ID 事务处理类型,
       T1.TRANSACTION_TYPE_NAME 事务处理名称,
       G.DESCRIPTION 库房名称
   FROM
   	INV.MTL_MATERIAL_TRANSACTIONS T
   LEFT JOIN INV.MTL_SYSTEM_ITEMS_B E ON
       E.INVENTORY_ITEM_ID = T.INVENTORY_ITEM_ID
   LEFT JOIN INV.mtl_transaction_types T1 ON
       T.TRANSACTION_TYPE_ID = T1.TRANSACTION_TYPE_ID
   LEFT JOIN INV.mtl_secondary_inventories G ON
       G.SECONDARY_INVENTORY_NAME = T.SUBINVENTORY_CODE
   WHERE
       T.INVENTORY_ITEM_ID = 574			--此处替换物料ID
   ORDER BY
       T.INVENTORY_ITEM_ID, T.ACCT_PERIOD_ID;
   ```

7. 占位