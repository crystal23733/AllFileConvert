import { MetadataRoute } from "next";

/**
 * 사이트맵 생성
 * - 단일 페이지 애플리케이션 (SPA)
 * - 모든 기능이 홈페이지에서 처리됨
 * - 다국어는 메타데이터로 처리
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.filpfile.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
  ];
}
