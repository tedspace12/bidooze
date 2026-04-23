import { useQuery } from "@tanstack/react-query";
import { blogService } from "../services/blogService";
import type { BlogListParams } from "../types";

export const useBlog = (slug?: string) => {
  const useBlogs = (params?: BlogListParams) =>
    useQuery({
      queryKey: ["blogs", params],
      queryFn: () => blogService.getBlogs(params),
    });

  const useBlogDetail = () =>
    useQuery({
      queryKey: ["blog", slug],
      queryFn: () => blogService.getBlogBySlug(slug as string),
      enabled: !!slug,
    });

  const useRelatedBlogs = (category?: string) =>
    useQuery({
      queryKey: ["related-blogs", slug, category],
      queryFn: async () => {
        const res = await blogService.getBlogs({ category, per_page: 4 });
        return res.data.filter((post) => post.slug !== slug).slice(0, 3);
      },
      enabled: !!category,
    });

  return { useBlogs, useBlogDetail, useRelatedBlogs };
};
