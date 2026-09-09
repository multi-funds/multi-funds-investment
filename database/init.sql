-- Table: users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: wallets
CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    wallet_address VARCHAR(120),
    balance DECIMAL(10, 2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id)
);

-- Table: transactions
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    wallet_id INT REFERENCES wallets(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- e.g., 'deposit', 'withdrawal'
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL
);

-- Table: kyc_documents
CREATE TABLE kyc_documents (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    document_number VARCHAR(255) NOT NULL,
    issued_date DATE NOT NULL,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: audit_logs
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

-- Table: fees_config
CREATE TABLE fees_config (
    id SERIAL PRIMARY KEY,
    transaction_type VARCHAR(50) UNIQUE NOT NULL,
    fee_percentage DECIMAL(5, 2) NOT NULL
);

-- Table: sessions
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- Create indexes for optimized queries
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_wallet_user_id ON wallets(user_id);
CREATE INDEX idx_transaction_wallet_id ON transactions(wallet_id);
CREATE INDEX idx_kyc_user_id ON kyc_documents(user_id);
CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX idx_session_user_id ON sessions(user_id);
CREATE INDEX idx_wallet_address ON wallets(wallet_address);