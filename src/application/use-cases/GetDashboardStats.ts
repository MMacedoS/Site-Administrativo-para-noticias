// Application - Get Dashboard Stats Use Case
import { DashboardStats } from "@/domain/entities/Dashboard";
import { getDatabase } from "@/infrastructure/database/connection";

export class GetDashboardStats {
  execute(): DashboardStats {
    const db = getDatabase();

    // Get news statistics
    const newsStats = db
      .prepare(
        `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN published = 1 THEN 1 ELSE 0 END) as published,
        SUM(CASE WHEN published = 0 THEN 1 ELSE 0 END) as draft,
        SUM(views) as total_views
      FROM news
    `
      )
      .get() as {
      total: number;
      published: number;
      draft: number;
      total_views: number;
    };

    // Get directors count
    const directorsCount = db
      .prepare("SELECT COUNT(*) as count FROM directors")
      .get() as { count: number };

    // Get events count
    const eventsCount = db
      .prepare("SELECT COUNT(*) as count FROM events")
      .get() as { count: number };

    // Get recent news
    const recentNews = db
      .prepare(
        `
      SELECT id, title, views, created_at as createdAt
      FROM news
      WHERE published = 1
      ORDER BY created_at DESC
      LIMIT 5
    `
      )
      .all() as Array<{
      id: number;
      title: string;
      views: number;
      createdAt: string;
    }>;

    return {
      totalNews: newsStats.total || 0,
      publishedNews: newsStats.published || 0,
      draftNews: newsStats.draft || 0,
      totalDirectors: directorsCount.count || 0,
      totalEvents: eventsCount.count || 0,
      totalViews: newsStats.total_views || 0,
      recentNews: recentNews.map((n) => ({
        ...n,
        createdAt: new Date(n.createdAt),
      })),
    };
  }
}
