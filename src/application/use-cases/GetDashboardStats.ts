// Application - Get Dashboard Stats Use Case for Vercel Postgres
import { DashboardStats } from "@/domain/entities/Dashboard";
import { sql } from "@/infrastructure/database/connection";

export class GetDashboardStats {
  async execute(): Promise<DashboardStats> {
    // Get news statistics
    const newsStatsResult = await sql`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN published = true THEN 1 ELSE 0 END) as published,
        SUM(CASE WHEN published = false THEN 1 ELSE 0 END) as draft,
        COALESCE(SUM(views), 0) as total_views
      FROM news
    `;

    const newsStats = newsStatsResult.rows[0];

    // Get directors count
    const directorsResult = await sql`SELECT COUNT(*) as count FROM directors`;
    const directorsCount = directorsResult.rows[0];

    // Get events count
    const eventsResult = await sql`SELECT COUNT(*) as count FROM events`;
    const eventsCount = eventsResult.rows[0];

    // Get recent news
    const recentNewsResult = await sql`
      SELECT id, title, views, created_at as "createdAt"
      FROM news
      WHERE published = true
      ORDER BY created_at DESC
      LIMIT 5
    `;

    const recentNews = recentNewsResult.rows;

    return {
      totalNews: parseInt(newsStats.total) || 0,
      publishedNews: parseInt(newsStats.published) || 0,
      draftNews: parseInt(newsStats.draft) || 0,
      totalDirectors: parseInt(directorsCount.count) || 0,
      totalEvents: parseInt(eventsCount.count) || 0,
      totalViews: parseInt(newsStats.total_views) || 0,
      recentNews: recentNews.map((n: any) => ({
        id: n.id,
        title: n.title,
        views: n.views,
        createdAt: new Date(n.createdAt),
      })),
    };
  }
}
