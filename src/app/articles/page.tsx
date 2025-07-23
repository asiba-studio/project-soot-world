import { getArticles, getFeaturedArticles } from '@/lib/cms';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '記事一覧',
  description: '最新の記事をご覧ください',
};

export default async function ArticlesPage() {
  const [articles, featuredArticles] = await Promise.all([
    getArticles(),
    getFeaturedArticles()
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">記事一覧</h1>
        <p className="text-lg text-gray-600">
          最新の記事や注目のコンテンツをお楽しみください
        </p>
      </header>

      {/* 注目記事 */}
      {featuredArticles.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">注目記事</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/${article.slug}`}
                className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200"
              >
                {article.coverImage && (
                  <div className="relative w-full h-48">
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                      注目
                    </span>
                    <time className="text-sm text-gray-500">
                      {formatDate(article.date)}
                    </time>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  {article.subtitle && (
                    <p className="text-sm text-gray-600 mb-3">
                      {article.subtitle}
                    </p>
                  )}
                  {article.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 全記事一覧 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">全記事</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/${article.slug}`}
              className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200"
            >
              {article.coverImage && (
                <div className="relative w-full h-48">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <time className="text-sm text-gray-500">
                    {formatDate(article.date)}
                  </time>
                  {article.featured && (
                    <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded-full">
                      ★
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                {article.subtitle && (
                  <p className="text-sm text-gray-600 mb-3">
                    {article.subtitle}
                  </p>
                )}
                {article.excerpt && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {article.excerpt}
                  </p>
                )}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}