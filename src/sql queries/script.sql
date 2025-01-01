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


-- Step 1: Create the ENUM type for departments type
CREATE TYPE department_type AS ENUM ('inside', 'outside');

-- Step 2: Create the table with the ENUM column
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    hindi_name VARCHAR(50) NOT NULL,
    type department_type NOT NULL, 
    created_at TIMESTAMP DEFAULT NOW()
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
    category_id UUID,
    FOREIGN KEY (register_id) REFERENCES registers(id),                                 -- Reference to departments table
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (created_by) REFERENCES users(id),                    -- Foreign key to users table
    FOREIGN KEY (current_department) REFERENCES departments(id),       -- Foreign key to departments table
    FOREIGN KEY (category_id) REFERENCES category(id)
);

-- Sequence for auto-incrementing document numbers
CREATE SEQUENCE document_number_seq START 1 INCREMENT 1;

-- Trigger to generate document_number in KN format
CREATE OR REPLACE FUNCTION generate_document_number() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.document_number := 'DN' || nextval('document_number_seq');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to execute the function before insert
CREATE TRIGGER set_document_number
BEFORE INSERT ON documents
FOR EACH ROW
WHEN (NEW.document_number IS NULL OR NEW.document_number = '')
EXECUTE FUNCTION generate_document_number();


-- Step 1: Create the ENUM type for status of transfer logs
CREATE TYPE transfer_logs_status AS ENUM ('pending', 'accepted', 'declined');

CREATE TABLE Transfer_Logs(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),               
    document_id UUID NOT NULL,                   
    from_department_id UUID NOT NULL,            
    to_department_id UUID NOT NULL,
    forwarded_by UUID NOT NULL,
    recived_by UUID,              
    forward_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    status transfer_logs_status DEFAULT 'pending',      
    acknowledged_date TIMESTAMP,                
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


-- Step 1: Create the ENUM type for departments type
CREATE TYPE document_logs_status AS ENUM ('completed', 'pending');

CREATE TABLE document_logs(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL,
    handled_department_id UUID NOT NULL,
    handled_user_id UUID NOT NULL,
    action TEXT NOT NULL,
    status document_logs_status NOT NULL DEFAULT 'pending',
    remark TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_document FOREIGN KEY (document_id)
        REFERENCES documents(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_handled_department FOREIGN KEY (handled_department_id)
        REFERENCES departments (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_handled_user FOREIGN KEY (handled_user_id)
        REFERENCES users (id)
        ON DELETE SET NULL  
)

CREATE TYPE work_status AS ENUM ('completed', 'pending');

CREATE TABLE Work_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL,
    department_id UUID NOT NULL,
    accepted_by_id UUID NOT NULL,
    accepted_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_by_id UUID,
    completed_time TIMESTAMP,
    status work_status DEFAULT 'pending',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    register_document_number VARCHAR(50),

    CONSTRAINT fk_document FOREIGN KEY (document_id)
        REFERENCES documents(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_department_id FOREIGN KEY (department_id)
        REFERENCES departments (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_accepted_by_id FOREIGN KEY (accepted_by_id)
        REFERENCES users (id)
        ON DELETE SET NULL
    CONSTRAINT fk_completed_by_id FOREIGN KEY (completed_by_id)
        REFERENCES users (id)
        ON DELETE SET NULL
)