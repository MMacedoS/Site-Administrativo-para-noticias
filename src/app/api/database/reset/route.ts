import { NextResponse } from "next/server";
import { getPool } from "@/infrastructure/database/connection";
import bcrypt from "bcryptjs";

export async function GET() {
  const pool = getPool();

  try {
    await pool.query(`DELETE FROM news`);
    await pool.query(`DELETE FROM events`);
    await pool.query(`DELETE FROM directors`);
    await pool.query(`DELETE FROM pendencias`);
    await pool.query(`DELETE FROM about_us`);
    await pool.query(`DELETE FROM contact`);
    await pool.query(`DELETE FROM users`);
    await pool.query(`DELETE FROM settings`);

    const hashedPassword = bcrypt.hashSync("admin123", 10);
    const userResult = await pool.query(
      `INSERT INTO users (name, email, password, is_system)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ["Super Admin", "admin@unooba.com.br", hashedPassword, true]
    );
    const adminId = userResult.rows[0].id;

    await pool.query(`
      INSERT INTO settings (
        site_name,
        show_carousel,
        show_recent_news,
        show_top_news,
        show_directors,
        menu_home,
        menu_news,
        menu_about,
        menu_contact
      ) VALUES (
        'Unooba',
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true
      )
    `);

    await pool.query(`
      INSERT INTO about_us (title, content, mission, vision, company_values)
      VALUES (
        'Sobre a Unooba',
        'A Unooba é uma organização dedicada ao desenvolvimento e inovação.',
        'Nossa missão é transformar ideias em realidade.',
        'Ser referência em inovação e excelência.',
        'Transparência, Inovação, Compromisso'
      )
    `);

    await pool.query(`
      INSERT INTO contact (email, phone, address, working_hours)
      VALUES (
        'contato@unooba.com.br',
        '(11) 1234-5678',
        'Rua Exemplo, 123 - São Paulo, SP',
        'Segunda a Sexta: 9h às 18h'
      )
    `);

    await pool.query(`
      INSERT INTO directors (name, position, email, phone, bio, order_index)
      VALUES 
        ('João Silva', 'Diretor Executivo', 'joao@unooba.com.br', '(11) 91111-1111', 'Profissional com mais de 20 anos de experiência.', 1),
        ('Maria Santos', 'Diretora Financeira', 'maria@unooba.com.br', '(11) 92222-2222', 'Especialista em gestão financeira.', 2),
        ('Carlos Oliveira', 'Diretor de Tecnologia', 'carlos@unooba.com.br', '(11) 93333-3333', 'Expert em inovação tecnológica.', 3)
    `);

    await pool.query(
      `INSERT INTO news (title, slug, content, summary, category, author_id, published, views)
       VALUES 
         ($1, $2, $3, $4, $5, $6, $7, $8),
         ($9, $10, $11, $12, $13, $14, $15, $16),
         ($17, $18, $19, $20, $21, $22, $23, $24)`,
      [
        "Primeira Notícia",
        "primeira-noticia",
        "Conteúdo completo da primeira notícia.",
        "Resumo da primeira notícia",
        "Geral",
        adminId,
        true,
        150,
        "Segunda Notícia",
        "segunda-noticia",
        "Conteúdo completo da segunda notícia.",
        "Resumo da segunda notícia",
        "Tecnologia",
        adminId,
        true,
        200,
        "Terceira Notícia",
        "terceira-noticia",
        "Conteúdo completo da terceira notícia.",
        "Resumo da terceira notícia",
        "Inovação",
        adminId,
        true,
        100,
      ]
    );

    await pool.query(`
      INSERT INTO events (title, description, date, location, order_index)
      VALUES 
        ('Evento de Lançamento', 'Lançamento do novo produto', NOW() + INTERVAL '30 days', 'Auditório Central', 1),
        ('Workshop de Inovação', 'Workshop sobre novas tecnologias', NOW() + INTERVAL '45 days', 'Sala de Conferências', 2)
    `);

    await pool.query(`
      INSERT INTO pendencias (cpf, name, description, amount, due_date, status)
      VALUES 
        ('12345678901', 'João da Silva', 'Pagamento pendente de taxa', 150.00, NOW() + INTERVAL '15 days', 'pendente'),
        ('98765432100', 'Maria Souza', 'Documentação em análise', 0.00, NOW() + INTERVAL '7 days', 'em_analise')
    `);

    return NextResponse.json({
      success: true,
      message: "Database reset and seeded successfully",
      data: {
        users: 1,
        news: 3,
        events: 2,
        directors: 3,
        pendencias: 2,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
