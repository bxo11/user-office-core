DO
$$
BEGIN
    IF register_patch('SafetyManagementFeature.sql', 'krzysztofklimczyk', 'Add a safety management feature', '2024-02-15') THEN
    BEGIN

    CREATE TABLE tags (
            tag_id serial PRIMARY KEY,
            tag varchar(30) NOT NULL, 
            category varchar(30) NOT NULL,
            color varchar(30) 
            );

    Insert into tags (tag, category, color) values ('Red', 'PROPOSAL', '#FF0000');
    Insert into tags (tag, category, color) values ('Yellow', 'PROPOSAL', '##FFFF00');
    Insert into tags (tag, category, color) values ('Green', 'PROPOSAL', '##00FF00');
    Insert into tags (tag, category, color) values ('Gas Delivery', 'PROPOSAL', '##34d2eb');
    Insert into tags (tag, category, color) values ('EST Ok', 'PROPOSAL', '##34ebbd');


    CREATE TABLE safety_management (
      safety_management_id serial PRIMARY KEY,
      proposal_pk INTEGER NOT NULL UNIQUE  REFERENCES proposals (proposal_pk) ON DELETE CASCADE,
      safety_level INTEGER DEFAULT NULL,
      esra_status INTEGER DEFAULT NULL,
      notes TEXT DEFAULT NULL
    );

    
      CREATE TABLE proposal_tags (
            proposal_pk INTEGER NOT NULL REFERENCES safety_management (proposal_pk) ON DELETE CASCADE,
            tag_id INTEGER NOT NULL REFERENCES tags (tag_id) ON DELETE CASCADE, 
            PRIMARY KEY (proposal_pk, tag_id)
            );

 
    CREATE TABLE safety_management_users (
      safety_management_id   INTEGER NOT NULL REFERENCES safety_management (safety_management_id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
      PRIMARY KEY (safety_management_id, user_id)
    );




      CREATE TABLE safety_management_comments (
            comment_id serial PRIMARY KEY,
            safety_management_id INTEGER NOT NULL REFERENCES safety_management (safety_management_id) ON DELETE CASCADE,
            comment TEXT NOT NULL,
            user_id INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ NOT NULL
            );

    END;
    END IF;
END;
$$
LANGUAGE plpgsql;
