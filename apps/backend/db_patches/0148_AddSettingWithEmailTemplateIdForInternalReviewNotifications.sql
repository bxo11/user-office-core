DO
$$
BEGIN
    IF register_patch(
        'AddSettingWithEmailTemplateIdForInternalReviewNotifications.sql',
        'krzysztofklimczyk',
        'Introduces a new setting for specifying the email template ID to be used for notifications sent to internal reviewers after an internal review event is added.',
        '2024-02-21'
    ) THEN
        INSERT INTO settings (settings_id, description)
        VALUES ('INTERNAL_REVIEW_NOTIFICATION_EMAIL_TEMPLATE_ID', 'Email template ID sent to internal reviewers upon creation of a review');
    END IF;
END;
$$
LANGUAGE plpgsql;
