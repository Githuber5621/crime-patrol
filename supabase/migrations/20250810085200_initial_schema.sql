-- Stores the different types of incidents (Theft, Assault, etc.)
CREATE TABLE incident_types (
    incident_type_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100) -- e.g., 'Property Crime', 'Violent Crime', 'Public Order'
);

-- Stores the different types of locations (Residence, Business, etc.)
CREATE TABLE location_types (
    location_type_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Stores information about the person filing the report.
CREATE TABLE reporters (
    reporter_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    phone VARCHAR(50) UNIQUE, -- Unique phone number is a good way to identify repeat reporters
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- The main table for storing crime reports.
CREATE TABLE reports (
    report_id SERIAL PRIMARY KEY,
    incident_type_id INT REFERENCES incident_types(incident_type_id),
    reporter_id INT REFERENCES reporters(reporter_id),
    location_type_id INT REFERENCES location_types(location_type_id),

    -- Incident Details
    incident_datetime TIMESTAMPTZ, -- Storing date and time together is more efficient. Can be NULL if not known.
    is_in_progress BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT, -- Can hold both brief and detailed descriptions.

    -- Location Details
    location_address TEXT,
    location_details TEXT,
    latitude DECIMAL(9, 6), -- For GPS coordinates
    longitude DECIMAL(9, 6),

    -- Reporter Relationship
    is_victim_reporter BOOLEAN DEFAULT FALSE,

    -- System Metadata
    status VARCHAR(50) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'triage', 'detailed', 'investigating', 'resolved', 'closed')),
    priority_level VARCHAR(50) DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Stores information about victims associated with a report.
CREATE TABLE victims (
    victim_id SERIAL PRIMARY KEY,
    report_id INT NOT NULL REFERENCES reports(report_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255) -- Optional contact info
);

-- Stores information about suspects associated with a report.
CREATE TABLE suspects (
    suspect_id SERIAL PRIMARY KEY,
    report_id INT NOT NULL REFERENCES reports(report_id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    vehicle_description TEXT -- Optional vehicle information
);

-- Stores information about witnesses associated with a report.
CREATE TABLE witnesses (
    witness_id SERIAL PRIMARY KEY,
    report_id INT NOT NULL REFERENCES reports(report_id) ON DELETE CASCADE,
    info TEXT NOT NULL -- Information/statement from the witness
);

-- Stores metadata for media files attached to a report.
CREATE TABLE media_attachments (
    media_id SERIAL PRIMARY KEY,
    report_id INT NOT NULL REFERENCES reports(report_id) ON DELETE CASCADE,
    file_id VARCHAR(255) NOT NULL UNIQUE, -- The ID from the cloud service (e.g., Cloudinary public_id)
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('photo', 'video', 'audio')),
    secure_url TEXT NOT NULL, -- The direct URL to access the file
    file_name_original TEXT,
    format VARCHAR(20),
    mime_type VARCHAR(100),
    display_order INT, -- To control the order in which media is shown
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);