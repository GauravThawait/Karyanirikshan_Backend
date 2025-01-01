
ALTER SEQUENCE document_number_seq RESTART WITH 1;

DROP FUNCTION generate_document_number() CASCADE;

CREATE OR REPLACE FUNCTION generate_document_number() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.document_number := 'DN' || nextval('document_number_seq');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;