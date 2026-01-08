// Domain - Dashboard Statistics
export interface DashboardStats {
  totalNews: number;
  publishedNews: number;
  draftNews: number;
  totalDirectors: number;
  totalEvents: number;
  totalViews: number;
  recentNews: Array<{
    id: number;
    title: string;
    views: number;
    createdAt: Date;
  }>;
}
