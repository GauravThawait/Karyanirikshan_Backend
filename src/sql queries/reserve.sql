
ALTER SEQUENCE document_number_seq RESTART WITH 1;

DROP FUNCTION generate_document_number() CASCADE;

CREATE OR REPLACE FUNCTION generate_document_number() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.document_number := 'DN' || nextval('document_number_seq');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- for setting trigger again
CREATE TRIGGER set_document_number
BEFORE INSERT ON documents
FOR EACH ROW
WHEN (NEW.document_number IS NULL OR NEW.document_number = '')
EXECUTE FUNCTION generate_document_number();
