DO
$$
BEGIN
	IF register_patch('LongerVarcharFields.sql', 'krzysztofklimczyk', 'Make fields to accept longer text', '2024-01-30') THEN
	BEGIN
		DROP VIEW proposal_table_view;

        ALTER TABLE users ALTER COLUMN user_title TYPE varchar(20) USING user_title::varchar(20);
		ALTER TABLE proposals ALTER COLUMN title TYPE varchar(500) USING title::varchar(500);
		ALTER TABLE "call" ALTER COLUMN call_short_code TYPE varchar(30) USING call_short_code::varchar(30);
		ALTER TABLE institutions ALTER COLUMN institution TYPE varchar(200) USING institution::varchar(200);

		CREATE VIEW proposal_table_view
		AS
		SELECT  p.proposal_pk AS proposal_pk,
				p.title,
				p.proposer_id AS principal_investigator,
				p.status_id AS proposal_status_id,
				ps.name AS proposal_status_name,
				ps.description AS proposal_status_description,
				p.proposal_id,
				smd.rank_order as rank_order,
				p.final_status,
				p.notified,
				p.questionary_id,
				t.time_allocation as technical_time_allocation,
				p.management_time_allocation,
				t.technical_review_assignee_id,
				t.technical_review_id,
				u.firstname as technical_review_assignee_firstname,
				u.lastname as technical_review_assignee_lastname,
				t.status AS technical_review_status,
				t.submitted as technical_review_submitted,
				i.name AS instrument_name,
				c.call_short_code,
				s.code AS sep_code,
				s.fap_id AS fap_id,
				c.allocation_time_unit,
				c.call_id,
				c.proposal_workflow_id,
				i.instrument_id,
				( SELECT round(avg("fap_reviews".grade)::numeric, 2) AS round
						FROM "fap_reviews"
						WHERE "fap_reviews".proposal_pk = p.proposal_pk) AS average,
				( SELECT round(stddev_pop("fap_reviews".grade)::numeric, 2) AS round
						FROM "fap_reviews"
						WHERE "fap_reviews".proposal_pk = p.proposal_pk) AS deviation,
				p.submitted
		FROM proposals p
		LEFT JOIN technical_review t ON t.proposal_pk = p.proposal_pk
		LEFT JOIN users u ON u.user_id = t.technical_review_assignee_id
		LEFT JOIN instrument_has_proposals ihp ON ihp.proposal_pk = p.proposal_pk
		LEFT JOIN proposal_statuses ps ON ps.proposal_status_id = p.status_id
		LEFT JOIN instruments i ON i.instrument_id = ihp.instrument_id
		LEFT JOIN call c ON c.call_id = p.call_id
		LEFT JOIN "fap_proposals" sp ON sp.proposal_pk = p.proposal_pk
		LEFT JOIN "faps" s ON s.fap_id = sp.fap_id
		LEFT JOIN "fap_meeting_decisions" smd ON smd.proposal_pk = p.proposal_pk;

    END;
	END IF;
END;
$$
LANGUAGE plpgsql;