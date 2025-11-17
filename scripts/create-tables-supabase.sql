-- Create Property Management System Tables in Supabase
-- Run this SQL in your Supabase Dashboard → SQL Editor

-- Create enums
CREATE TYPE property_type AS ENUM ('RESIDENTIAL', 'COMMERCIAL');
CREATE TYPE unit_type AS ENUM ('STUDIO', 'ONE_BR', 'TWO_BR', 'THREE_BR', 'FOUR_BR', 'COMMERCIAL');
CREATE TYPE unit_status AS ENUM ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED');
CREATE TYPE document_category AS ENUM ('LEGAL', 'PHOTOS', 'MAINTENANCE', 'OTHER');

-- Create properties table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20),
    property_type property_type NOT NULL,
    total_units INTEGER DEFAULT 0,
    description TEXT,
    manager_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create units table
CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    unit_number VARCHAR(50) NOT NULL,
    unit_type unit_type NOT NULL,
    rent_amount DECIMAL(10, 2) NOT NULL,
    square_footage INTEGER,
    status unit_status DEFAULT 'AVAILABLE',
    description TEXT,
    current_tenant_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, unit_number)
);

-- Create property_documents table
CREATE TABLE property_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    category document_category NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by UUID NOT NULL,
    storage_url TEXT NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_properties_manager_id ON properties(manager_id);
CREATE INDEX idx_units_property_id ON units(property_id);
CREATE INDEX idx_units_status ON units(status);
CREATE INDEX idx_property_documents_property_id ON property_documents(property_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
INSERT INTO properties (name, address, city, state, zip_code, property_type, total_units, description, manager_id) VALUES
('Sunset Apartments', '123 Main St', 'Los Angeles', 'CA', '90210', 'RESIDENTIAL', 2, 'Beautiful apartment complex', gen_random_uuid()),
('Downtown Office Complex', '456 Business Ave', 'San Francisco', 'CA', '94102', 'COMMERCIAL', 1, 'Modern office space', gen_random_uuid());

-- Success message
SELECT 'Property Management System tables created successfully!' as message;