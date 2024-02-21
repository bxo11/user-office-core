DO
$$
BEGIN
    IF register_patch('ReviewMeetingsPage.sql', 'krzysztofklimczyk', 'Add review_meetings and review_meeting_has_users tables', '2024-02-21') THEN
        
		CREATE TABLE review_meetings (
			review_meeting_id SERIAL PRIMARY KEY,
			name VARCHAR(100) NOT NULL,
			details TEXT,
			instrument_id INT NOT NULL,
			creator_id INT NOT NULL,
			occurs_at TIMESTAMPTZ NOT NULL,
			notified BOOLEAN NOT NULL DEFAULT FALSE,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			FOREIGN KEY (instrument_id) REFERENCES instruments (instrument_id),
			FOREIGN KEY (creator_id) REFERENCES users (user_id)
		);
	
		CREATE TABLE review_meeting_has_users (
			review_meeting_id INTEGER NOT NULL,
			user_id INTEGER NOT NULL,
			PRIMARY KEY (review_meeting_id, user_id),
			FOREIGN KEY (review_meeting_id) REFERENCES review_meetings (review_meeting_id) ON DELETE CASCADE,
			FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
		);

    END IF;
END;
$$
LANGUAGE plpgsql;
