export type BlogAuthor = {
  name: string;
  role: string;
  avatar: string;
};

export type BlogListItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  featured_image: string;
  publish_date: string;
  read_time: string;
  author: BlogAuthor;
};

export type BlogDetail = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  featured_image: string;
  publish_date: string;
  read_time: string;
  tags: string[];
  author: BlogAuthor;
};

export type BlogListMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type BlogListResponse = {
  data: BlogListItem[];
  meta: BlogListMeta;
};

export type BlogDetailResponse = {
  data: BlogDetail;
};

export type BlogListParams = {
  page?: number;
  per_page?: number;
  category?: string;
};
