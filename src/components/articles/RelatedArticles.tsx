// src/components/RelatedArticles.tsx
import Image from 'next/image';
import Link from 'next/link';
import { getArticles } from '@/lib/cms';
import { formatDate } from '@/lib/date';

interface Props {
  currentSlug: string;
  tags: string[];
}

export default async function RelatedArticles({ currentSlug, tags }: Props) {
  const allArticles = await getArticles();
  
  // 現在の記事を除外
  const otherArticles = allArticles.filter(article => article.slug !== currentSlug);
  
  // タグが一致する記事を優先的に取得
  const relatedArticles = otherArticles
    .map(article => ({
      ...article,
      matchingTags: article.tags.filter(tag => tags.includes(tag)).length
    }))
    .sort((a, b) => {
      // マッチするタグ数で並び替え、同じ場合は日付で並び替え
      if (a.matchingTags !== b.matchingTags) {
        return b.matchingTags - a.matchingTags;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 3);

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">関連記事</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* カバー画像 */}
            <div className="relative aspect-[16/9]">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {article.featured && (
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded">
                    注目
                  </span>
                </div>
              )}
            </div>

            {/* 記事情報 */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                {article.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {article.excerpt}
              </p>

              {/* メタ情報 */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <time>{formatDate(article.date, 'ja-JP')}</time>
                {article.matchingTags > 0 && (
                  <span className="text-blue-600">
                    {article.matchingTags}個の共通タグ
                  </span>
                )}
              </div>

              {/* タグ */}
              <div className="flex flex-wrap gap-1 mt-3">
                {article.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className={`px-2 py-1 text-xs rounded-full ${
                      tags.includes(tag)
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
                {article.tags.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{article.tags.length - 2}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* もっと見るボタン */}
      <div className="text-center mt-6">
        <Link
          href="/articles"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          すべての記事を見る
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}