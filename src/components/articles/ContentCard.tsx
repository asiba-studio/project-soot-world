// src/components/ContentCard.tsx
import Link from 'next/link';
import { formatDateDot } from '@/lib/date';
import { Article, News } from '@/lib/types';
import InteractiveMosaic02 from '../InteractiveMosaic02';

// 共通のプロパティを持つ型を定義
type ContentItem = Article | News;

interface Props {
    content: ContentItem;
    featured?: boolean;
    basePath: '/articles' | '/news'; 
}

export default function ContentCard({ content, featured = false, basePath }: Props) {
    return (
        <Link
            href={`${basePath}/${content.slug}`}
            className="group block no-underline overflow-hidden hover:opacity-100"
        >
            <article>
                {/* Cover Image */}
                <div className="relative w-full">
                    <InteractiveMosaic02
                        imageUrl={content.coverImage}
                        width="100%"
                    />

                    {/* Tags */}
                    <div className="absolute bottom-1.5 left-2 flex flex-col gap-1">
                        {content.tags?.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="text-gray-500 leading-none font-en font-medium 
                                    text-fluid-sm transition-colors duration-200 
                                    group-hover:text-gray-100"
                            >
                                # {tag}
                            </span>
                        ))}
                    </div>

                    {/* Date */}
                    <div className="
                        absolute bottom-1.5 right-2 
                        text-gray-500 font-en font-medium 
                        leading-none text-fluid-sm 
                        transition-colors duration-200 
                        group-hover:text-gray-100
                    ">
                        {formatDateDot(content.date)}
                    </div>
                </div>

                {/* Info */}
                <div>
                    {/* Subtitle */}
                    <p className="font-medium text-fluid-base font-zen mt-0">
                        {content.subtitle}
                    </p>

                    {/* Title */}
                    <h3 className="font-medium font-zen mt-2 text-fluid-lg">
                        {content.title}
                    </h3>
                </div>
            </article>
        </Link>
    );
}