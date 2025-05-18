import { useQuery } from "@tanstack/react-query";
import { Content } from "@/types";

export function useContent(id?: number | null) {
  const enabled = id !== undefined && id !== null;

  return useQuery<Content>({
    queryKey: [`/api/content/${id}`],
    enabled,
  });
}

export function useTrendingContent(limit = 6) {
  return useQuery<Content[]>({
    queryKey: [`/api/content/trending`, limit],
  });
}

export function useLatestContent(limit = 6) {
  return useQuery<Content[]>({
    queryKey: [`/api/content/latest`, limit],
  });
}
