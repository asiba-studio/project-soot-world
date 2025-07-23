// src/components/TagFilter.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Props {
  tags: string[];
}

export default function TagFilter({ tags }: Props) {
  const [showAll, setShowAll] = useState(false);
  const displayTags = showAll ? tags : tags.slice(0, 8);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">タグで絞り込み</h3>
        <Link
          href="/articles"
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          すべて表示
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {displayTags.map((tag) => (
          <Link
            key={tag}
            href={`/articles/tags/${encodeURIComponent(tag)}`}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-800 transition-colors text-sm"
          >
            {tag}
          </Link>
        ))}
        
        {tags.length > 8 && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="px-3 py-2 text-blue-600 hover:text-blue-800 transition-colors text-sm"
          >
            +{tags.length - 8} もっと見る
          </button>
        )}
        
        {showAll && tags.length > 8 && (
          <button
            onClick={() => setShowAll(false)}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
          >
            折りたたむ
          </button>
        )}
      </div>

      {/* 検索ボックス */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="記事を検索..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}