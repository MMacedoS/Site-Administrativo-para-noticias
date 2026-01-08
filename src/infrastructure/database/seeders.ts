// Infrastructure - Database Seeders
import { getDatabase } from "./connection";
import bcrypt from "bcryptjs";
import { generateSlug } from "@/lib/slugify";

export function runSeeders(): void {
  const db = getDatabase();

  // Check if we already have data
  const newsCount = db.prepare("SELECT COUNT(*) as count FROM news").get() as {
    count: number;
  };

  if (newsCount.count > 0) {
    return;
  }

  // Create Super Admin User (protected system user)
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  const adminResult = db
    .prepare(
      "INSERT INTO users (name, email, password, is_system) VALUES (?, ?, ?, ?)"
    )
    .run("Super Admin", "admin@unooba.com.br", hashedPassword, 1);

  const adminId = adminResult.lastInsertRowid;

  // Seed Directors
  const directorsData = [
    {
      name: "Dr. João Silva",
      position: "Presidente",
      email: "joao.silva@unooba.com.br",
      phone: "(00) 98765-4321",
      bio: "Doutor em Administração Pública com mais de 20 anos de experiência.",
      order_index: 1,
    },
    {
      name: "Dra. Maria Santos",
      position: "Vice-Presidente",
      email: "maria.santos@unooba.com.br",
      phone: "(00) 98765-4322",
      bio: "Especialista em Gestão Pública e Políticas Sociais.",
      order_index: 2,
    },
    {
      name: "Carlos Oliveira",
      position: "Diretor Financeiro",
      email: "carlos.oliveira@unooba.com.br",
      phone: "(00) 98765-4323",
      bio: "Contador com MBA em Finanças Corporativas.",
      order_index: 3,
    },
    {
      name: "Ana Paula Costa",
      position: "Diretora de Comunicação",
      email: "ana.costa@unooba.com.br",
      phone: "(00) 98765-4324",
      bio: "Jornalista com experiência em comunicação institucional.",
      order_index: 4,
    },
    {
      name: "Roberto Ferreira",
      position: "Diretor Administrativo",
      email: "roberto.ferreira@unooba.com.br",
      phone: "(00) 98765-4325",
      bio: "Administrador com especialização em Gestão de Pessoas.",
      order_index: 5,
    },
    {
      name: "Juliana Almeida",
      position: "Diretora Jurídica",
      email: "juliana.almeida@unooba.com.br",
      phone: "(00) 98765-4326",
      bio: "Advogada especializada em Direito Administrativo.",
      order_index: 6,
    },
  ];

  const insertDirector = db.prepare(`
    INSERT INTO directors (name, position, email, phone, bio, order_index)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const director of directorsData) {
    insertDirector.run(
      director.name,
      director.position,
      director.email,
      director.phone,
      director.bio,
      director.order_index
    );
  }

  // Seed default user for news author
  const adminUser = { id: adminId };

  // Seed News
  const newsData = [
    {
      title: "Nova Lei de Transparência é Aprovada",
      summary:
        "Legislação garante maior acesso às informações públicas e fortalece o controle social.",
      content:
        "A nova lei de transparência foi aprovada por unanimidade e representa um marco importante para a democracia. O texto garante que todos os cidadãos tenham acesso facilitado às informações públicas, fortalecendo o controle social e a participação popular nas decisões governamentais.",
      category: "Legislação",
      image_url:
        "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
      views: 15420,
      published: 1,
    },
    {
      title: "Inauguração do Centro Cultural",
      summary:
        "Espaço promete ser referência em cultura e educação para toda a comunidade.",
      content:
        "O novo Centro Cultural foi inaugurado com grande festa e promete ser um espaço de referência para atividades culturais e educacionais. O local conta com teatro, biblioteca, salas de exposição e oficinas.",
      category: "Cultura",
      image_url:
        "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&q=80",
      views: 12350,
      published: 1,
    },
    {
      title: "Programa de Saúde Preventiva é Lançado",
      summary:
        "Iniciativa visa atender mais de 10 mil famílias com foco em prevenção de doenças.",
      content:
        "O programa de saúde preventiva tem como objetivo principal reduzir a incidência de doenças crônicas através de ações educativas e acompanhamento médico regular.",
      category: "Saúde",
      image_url:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
      views: 11200,
      published: 1,
    },
    {
      title: "Investimentos em Infraestrutura Urbana",
      summary:
        "Obras de pavimentação e saneamento beneficiarão diversos bairros da cidade.",
      content:
        "As obras de infraestrutura contemplam pavimentação de ruas, instalação de redes de esgoto e drenagem pluvial, beneficiando aproximadamente 50 mil moradores.",
      category: "Infraestrutura",
      image_url:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
      views: 9800,
      published: 1,
    },
    {
      title: "Programa de Capacitação Profissional",
      summary:
        "Cursos gratuitos oferecerão qualificação para o mercado de trabalho.",
      content:
        "O programa oferece cursos nas áreas de tecnologia, administração, saúde e serviços, com certificação reconhecida pelo mercado e foco na empregabilidade.",
      category: "Educação",
      image_url:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
      views: 8750,
      published: 1,
    },
    {
      title: "Meio Ambiente: Projeto de Reflorestamento",
      summary: "Meta é plantar 50 mil árvores nativas até o final do ano.",
      content:
        "O projeto de reflorestamento prevê o plantio de espécies nativas em áreas degradadas, envolvendo a comunidade local e escolas em ações de educação ambiental.",
      category: "Meio Ambiente",
      image_url:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
      views: 7600,
      published: 1,
    },
    {
      title: "Esporte e Lazer: Reforma de Praças",
      summary:
        "Espaços públicos recebem melhorias para atividades esportivas e recreativas.",
      content:
        "As praças estão sendo revitalizadas com novos equipamentos de ginástica, quadras poliesportivas, playgrounds e iluminação LED, promovendo qualidade de vida.",
      category: "Esporte",
      image_url:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80",
      views: 6900,
      published: 1,
    },
    {
      title: "Economia: Incentivo para Pequenas Empresas",
      summary:
        "Programa oferece crédito facilitado e consultoria para empreendedores locais.",
      content:
        "O programa de incentivo ao empreendedorismo disponibiliza linhas de crédito com juros subsidiados e consultoria gratuita em gestão empresarial.",
      category: "Economia",
      image_url:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
      views: 6200,
      published: 1,
    },
    {
      title: "Segurança: Ampliação do Videomonitoramento",
      summary: "Sistema de câmeras será expandido para mais regiões da cidade.",
      content:
        "O projeto de videomonitoramento inclui a instalação de 200 novas câmeras de alta resolução com reconhecimento facial e integração com as forças de segurança.",
      category: "Segurança",
      image_url:
        "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80",
      views: 5800,
      published: 1,
    },
    {
      title: "Transporte: Nova Linha de Ônibus",
      summary:
        "Rota facilitará deslocamento entre bairros e reduzirá tempo de viagem.",
      content:
        "A nova linha de ônibus conecta regiões periféricas ao centro da cidade, reduzindo o tempo de deslocamento em até 40% e atendendo mais de 5 mil passageiros diários.",
      category: "Transporte",
      image_url:
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
      views: 5300,
      published: 1,
    },
  ];

  const insertNews = db.prepare(`
    INSERT INTO news (title, slug, summary, content, category, image_url, views, published, author_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const news of newsData) {
    const slug = generateSlug(news.title);
    insertNews.run(
      news.title,
      slug,
      news.summary,
      news.content,
      news.category,
      news.image_url,
      news.views,
      news.published,
      adminUser.id
    );
  }

  // Seed Events
  const eventsData = [
    {
      title: "Audiência Pública - Plano Diretor 2026",
      description:
        "Participe da discussão sobre o desenvolvimento urbano da cidade",
      date: "2026-01-15",
      location: "Auditório Central",
      image_url:
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
      order_index: 1,
    },
    {
      title: "Sessão Extraordinária",
      description: "Discussão de projetos importantes para a comunidade",
      date: "2026-01-20",
      location: "Plenário Principal",
      image_url:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      order_index: 2,
    },
    {
      title: "Consulta Pública - Orçamento 2026",
      description:
        "Sua opinião é importante para a gestão dos recursos públicos",
      date: "2026-01-25",
      location: "Salão Nobre",
      image_url:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
      order_index: 3,
    },
  ];

  const insertEvent = db.prepare(`
    INSERT INTO events (title, description, date, location, image_url, order_index)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const event of eventsData) {
    insertEvent.run(
      event.title,
      event.description,
      event.date,
      event.location,
      event.image_url,
      event.order_index
    );
  }

  // Seed About Us
  db.prepare(
    `
    INSERT INTO about_us (title, content, mission, vision, company_values, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `
  ).run(
    "Sobre Nós",
    "O Unooba é uma organização comprometida com a transparência e a excelência na gestão pública. Nossa história começou com o objetivo de transformar a relação entre governo e sociedade através da tecnologia e comunicação eficiente.",
    "Promover a transparência e eficiência na gestão pública, facilitando o acesso da população às informações e serviços.",
    "Ser referência em gestão pública transparente e participativa, servindo de modelo para outras instituições.",
    "Transparência | Ética | Inovação | Compromisso Social | Excelência",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
  );

  // Seed Contact
  db.prepare(
    `
    INSERT INTO contact (email, phone, address, working_hours, map_url)
    VALUES (?, ?, ?, ?, ?)
  `
  ).run(
    "contato@unooba.com.br",
    "(00) 0000-0000",
    "Rua Principal, 123 - Centro - CEP 00000-000",
    "Segunda a Sexta: 8h às 18h",
    "https://maps.google.com/?q=-23.550520,-46.633308"
  );

  // Seed Settings
  db.prepare(
    `INSERT INTO settings (
      site_name,
      show_carousel,
      show_recent_news,
      show_top_news,
      show_directors,
      menu_home,
      menu_news,
      menu_about,
      menu_contact
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run("Unooba", 1, 1, 1, 1, 1, 1, 1, 1);
}
