-- Stores the different types of incidents (Theft, Assault, etc.)
CREATE TABLE tblincident_types (
    itp_id SERIAL PRIMARY KEY,
    itp_name VARCHAR(100) NOT NULL UNIQUE,
    itp_category VARCHAR(100) -- e.g., 'Property Crime', 'Violent Crime', 'Public Order'
);

-- Stores the different types of locations (Residence, Business, etc.)
CREATE TABLE tbllocation_types (
    ltp_id SERIAL PRIMARY KEY,
    ltp_name VARCHAR(100) NOT NULL UNIQUE
);

-- Stores user information, including citizens who file reports and system administrators.
CREATE TABLE tblusers (
    usr_id SERIAL PRIMARY KEY,
    usr_auth_id UUID UNIQUE, -- Links to the id in the auth.users table
    usr_name VARCHAR(255),
    usr_email VARCHAR(255) NOT NULL UNIQUE,
    usr_phone VARCHAR(50),
    usr_role VARCHAR(50) NOT NULL DEFAULT 'citizen' CHECK (usr_role IN ('citizen', 'admin', 'moderator')),
    usr_created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    usr_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- The main table for storing crime reports.
CREATE TABLE tblreports (
    rep_id SERIAL PRIMARY KEY,
    rep_incident_type_id INT REFERENCES tblincident_types(itp_id),
    rep_user_id INT REFERENCES tblusers(usr_id),
    rep_location_type_id INT REFERENCES tbllocation_types(ltp_id),

    -- Incident Details
    rep_incident_datetime TIMESTAMPTZ, -- Storing date and time together is more efficient. Can be NULL if not known.
    rep_description TEXT, -- Can hold both brief and detailed descriptions.

    -- Location Details
    rep_location_address TEXT,
    rep_location_details TEXT,
    rep_latitude DECIMAL(9, 6), -- For GPS coordinates
    rep_longitude DECIMAL(9, 6),

    -- System Metadata
    rep_status VARCHAR(50) NOT NULL DEFAULT 'new' CHECK (rep_status IN ('new', 'triage', 'detailed', 'investigating', 'resolved', 'closed')),
    rep_priority_level VARCHAR(50) DEFAULT 'medium' CHECK (rep_priority_level IN ('low', 'medium', 'high')),
    rep_created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    rep_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Stores information about suspects associated with a report.
CREATE TABLE tblsuspects (
    sus_id SERIAL PRIMARY KEY,
    sus_report_id INT NOT NULL REFERENCES tblreports(rep_id) ON DELETE CASCADE,
    sus_description TEXT NOT NULL
);

-- Stores metadata for media files attached to a report.
CREATE TABLE tblmedia_attachments (
    med_id SERIAL PRIMARY KEY,
    med_report_id INT NOT NULL REFERENCES tblreports(rep_id) ON DELETE CASCADE,
    med_file_id VARCHAR(255) NOT NULL UNIQUE, -- The ID from the cloud service (e.g., Cloudinary public_id)
    med_media_type VARCHAR(20) NOT NULL CHECK (med_media_type IN ('photo', 'video', 'audio')),
    med_secure_url TEXT NOT NULL, -- The direct URL to access the file
    med_file_name_original TEXT,
    med_format VARCHAR(20),
    med_mime_type VARCHAR(100),
    med_display_order INT, -- To control the order in which media is shown
    med_created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
