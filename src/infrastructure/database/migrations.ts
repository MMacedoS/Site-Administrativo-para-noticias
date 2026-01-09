import { getPool } from "./connection";

export async function runMigrations(): Promise<void> {
  const pool = getPool();

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        is_system BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        summary TEXT NOT NULL,
        category TEXT,
        author_id INTEGER NOT NULL,
        published BOOLEAN DEFAULT false,
        views INTEGER DEFAULT 0,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS directors (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        position TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        bio TEXT,
        photo_url TEXT,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS about_us (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        mission TEXT,
        vision TEXT,
        company_values TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        working_hours TEXT,
        map_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date TIMESTAMP NOT NULL,
        location TEXT NOT NULL,
        image_url TEXT,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        site_name TEXT DEFAULT 'Unooba',
        site_logo TEXT,
        show_carousel BOOLEAN DEFAULT true,
        show_recent_news BOOLEAN DEFAULT true,
        show_top_news BOOLEAN DEFAULT true,
        show_directors BOOLEAN DEFAULT true,
        menu_home BOOLEAN DEFAULT true,
        menu_news BOOLEAN DEFAULT true,
        menu_about BOOLEAN DEFAULT true,
        menu_contact BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS pendencias (
        id SERIAL PRIMARY KEY,
        cpf TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        amount DECIMAL(10, 2),
        due_date DATE,
        status TEXT DEFAULT 'pendente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de Profissionais CBOO (substitui o sistema de pendências)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS professionals (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        cpf TEXT NOT NULL UNIQUE,
        registration_number TEXT NOT NULL UNIQUE,
        status TEXT NOT NULL,
        formation TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        registration_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_news_author ON news(author_id)`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_news_published ON news(published)`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_news_views ON news(views)`
    );
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug)`);
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_directors_order ON directors(order_index)`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_events_date ON events(date)`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_events_order ON events(order_index)`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_pendencias_cpf ON pendencias(cpf)`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_pendencias_status ON pendencias(status)`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_professionals_cpf ON professionals(cpf)`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_professionals_registration ON professionals(registration_number)`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_professionals_name ON professionals(name)`
    );
  } catch (error) {
    console.error("Migration error:", error);
    throw error;
  }
}
