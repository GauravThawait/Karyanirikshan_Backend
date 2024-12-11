-- create user table 
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
    name VARCHAR(50) NOT NULL,                      
    username VARCHAR(50) NOT NULL UNIQUE,  
	password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,                       
    department_id UUID NOT NULL,                     
    FOREIGN KEY (department_id) REFERENCES departments(id),
	created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE registers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    hindi_name VARCHAR(50) NOt NULL,
)


CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                    -- Unique identifier for the document
    register_id UUID NOT NULL,                                        -- Register ID
    document_number VARCHAR(50) NOT NULL UNIQUE DEFAULT '',           -- Document number in KN format
    dispatch_doc_number VARCHAR(50),                                  -- Optional dispatch document number
    department_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,                                      -- Document title
    description TEXT,                                                 -- Document description
    created_by UUID NOT NULL,                                         -- Reference to users table
    created_at TIMESTAMP DEFAULT NOW(),                               -- Timestamp of creation
    status VARCHAR(50) NOT NULL,                                      -- Document status
    priority VARCHAR(50),                                             -- Document priority
    grade VARCHAR(50),                                                -- Document grade
    tags TEXT[],                                                      -- Tags as an array of text
    current_department UUID NOT NULL,
    FOREIGN KEY (register_id) REFERENCES registers(id),                                 -- Reference to departments table
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (created_by) REFERENCES users(id),                    -- Foreign key to users table
    FOREIGN KEY (current_department) REFERENCES departments(id)       -- Foreign key to departments table
);

-- Sequence for auto-incrementing document numbers
CREATE SEQUENCE document_number_seq START 1 INCREMENT 1;

-- Trigger to generate document_number in KN format
CREATE OR REPLACE FUNCTION generate_document_number() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.document_number := 'KN' || nextval('document_number_seq');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to execute the function before insert
CREATE TRIGGER set_document_number
BEFORE INSERT ON documents
FOR EACH ROW
WHEN (NEW.document_number IS NULL OR NEW.document_number = '')
EXECUTE FUNCTION generate_document_number();


CREATE TABLE Transfer_Logs(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),               
    document_id UUID NOT NULL,                   
    from_department_id UUID NOT NULL,            
    to_department_id UUID NOT NULL,
    forwarded_by UUID NOT NULL,
    recived_by UUID,              
    forward_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    is_acknowledged BOOLEAN DEFAULT FALSE,      -- Acknowledgment status (true = received, false = pending)
    acknowledged_date TIMESTAMP,                -- Date and time of acknowledgment
    remarks TEXT,                               -- Optional remarks for the forwarding action
    CONSTRAINT fk_document FOREIGN KEY (document_id)
        REFERENCES documents (id)      -- References a Documents table
        ON DELETE CASCADE,
    CONSTRAINT fk_from_department FOREIGN KEY (from_department_id)
        REFERENCES departments (id)  -- References a Departments table
        ON DELETE SET NULL,
    CONSTRAINT fk_to_department FOREIGN KEY (to_department_id)
        REFERENCES departments (id)  -- References a Departments table
        ON DELETE SET NULL,
    CONSTRAINT fk_forwarded_by FOREIGN KEY (forwarded_by)
        REFERENCES users (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_recived_by FOREIGN KEY (recived_by)
        REFERENCES users (id)
        ON DELETE SET NULL
);