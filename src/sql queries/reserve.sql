
ALTER SEQUENCE document_number_seq RESTART WITH 1;

DROP FUNCTION generate_document_number() CASCADE;

CREATE OR REPLACE FUNCTION generate_document_number() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.document_number := 'DN' || nextval('document_number_seq');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



select * from documents;

alter table documents
add applicant_name VARCHAR(255) NULL;

alter table documents
add respondent_name VARCHAR(255) NULL;

alter table documents
add document_subject VARCHAR(255) NULL;

alter table documents
add investigator VARCHAR(50) NULL;

alter table documents
add investigator_report_sending_date TIMESTAMPTZ NULL;

alter table documents
add investigator_report_receiving_date TIMESTAMPTZ NULL;

alter table documents
add supplementary_letter_receiving_date TIMESTAMPTZ NULL;

alter table documents
add document_report_result varchar(255) NULL;

alter table documents
add document_work_status varchar(50) NULL;

alter table documents
add document_references varchar(255) NULL;

alter table documents
add document_category varchar(50) NULL;


