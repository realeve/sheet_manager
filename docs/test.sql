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
-- AND A .sn IN (SELECT * FROM sn_list)
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
-- AND T .sn IN (SELECT * FROM sn_list)
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
		  -- AND E .sn IN (SELECT * FROM sn_list)
			GROUP BY
				E .SN,
				E . NAME,
				E .DESCRIPTION