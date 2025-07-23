// src/lib/markdown.ts
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm) // GitHub Flavored Markdown
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug) // 見出しにIDを追加
    .use(rehypeHighlight) // コードハイライト
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return result.toString();
}

// 記事の目次を生成
export function generateToc(markdown: string): Array<{
  id: string;
  title: string;
  level: number;
}> {
  const headings = markdown.match(/^#{1,6}\s+(.+)$/gm) || [];
  
  return headings.map(heading => {
    const level = heading.match(/^#+/)?.[0].length || 1;
    const title = heading.replace(/^#+\s+/, '');
    const id = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    return { id, title, level };
  });
}

// 記事の読了時間を計算（日本語対応）
export function calculateReadingTime(content: string): number {
  // 日本語の場合は文字数、英語の場合は単語数で計算
  const japaneseChars = content.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) || [];
  const englishWords = content.match(/\b\w+\b/g) || [];
  
  // 日本語：400文字/分、英語：200単語/分として計算
  const japaneseTime = japaneseChars.length / 400;
  const englishTime = englishWords.length / 200;
  
  const totalMinutes = japaneseTime + englishTime;
  return Math.max(1, Math.ceil(totalMinutes));
}

// 記事の抜粋を生成
export function generateExcerpt(content: string, maxLength: number = 160): string {
  const plainText = content
    .replace(/#+\s+/g, '') // 見出しマークを削除
    .replace(/\*\*(.*?)\*\*/g, '$1') // ボールドを削除
    .replace(/\*(.*?)\*/g, '$1') // イタリックを削除
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // リンクを削除
    .replace(/```[\s\S]*?```/g, '') // コードブロックを削除
    .replace(/`([^`]+)`/g, '$1') // インラインコードを削除
    .replace(/\n\n+/g, ' ') // 改行を空白に変換
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength) + '...';
}