DO
$$
BEGIN
    IF register_patch('AddSafetyManagerRole.sql', 'krzysztofklimczyk', 'Add a safety-manager role', '2024-02-15') THEN
    BEGIN

    INSERT INTO roles (short_code, title) VALUES ('safety_manager', 'Safety Manager');

    END;
    END IF;
END;
$$
LANGUAGE plpgsql;
