// src/lib/cms.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import { Article, News, Player, Event, ArticleWithReferences } from './types';

const CMS_DIR = path.join(process.cwd(), 'cms');
const ARTICLES_DIR = path.join(CMS_DIR, 'articles');
const NEWS_DIR = path.join(CMS_DIR, 'news');
const PLAYERS_DIR = path.join(CMS_DIR, 'players');
const EVENTS_DIR = path.join(CMS_DIR, 'events');

// Articles
export async function getArticles(): Promise<Article[]> {
  const fileNames = fs.readdirSync(ARTICLES_DIR);
  const articles = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const filePath = path.join(ARTICLES_DIR, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      
      return {
        slug: data.slug,
        title: data.title,
        subtitle: data.subtitle,
        date: data.date,
        writer: data.writer,
        collaborators: data.collaborators || [],
        reviewer: data.reviewer,
        relatedProjects: data.relatedProjects || [],
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        headerImage: data.headerImage,
        tags: data.tags || [],
        featured: data.featured || false,
        lang: data.lang || 'ja',
        content,
      } as Article;
    });

  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles();
  return articles.find(article => article.slug === slug) || null;
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const articles = await getArticles();
  return articles.filter(article => article.featured);
}

export async function getArticlesByTag(tag: string): Promise<Article[]> {
  const articles = await getArticles();
  return articles.filter(article => article.tags.includes(tag));
}

// News
export async function getNews(): Promise<News[]> {
    const fileNames = fs.readdirSync(NEWS_DIR);
    const news = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const filePath = path.join(NEWS_DIR, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);
        
        return {
          slug: data.slug,
          title: data.title,
          subtitle: data.subtitle,
          date: data.date,
          excerpt: data.excerpt,
          coverImage: data.coverImage,
          tags: data.tags || [],
          lang: data.lang || 'ja',
          content,
        } as News;
      });
  
    return news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }


// Players
export async function getPlayers(): Promise<Player[]> {
  const fileNames = fs.readdirSync(PLAYERS_DIR);
  const players = fileNames
    .filter(fileName => fileName.endsWith('.yaml') || fileName.endsWith('.yml'))
    .map(fileName => {
      const filePath = path.join(PLAYERS_DIR, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const data = yaml.load(fileContents) as Player;
      return data;
    });

  return players.filter(player => player.active);
}

export async function getPlayerById(id: string): Promise<Player | null> {
  const players = await getPlayers();
  return players.find(player => player.id === id) || null;
}

// Events
export async function getEvents(): Promise<Event[]> {
  const fileNames = fs.readdirSync(EVENTS_DIR);
  const events = fileNames
    .filter(fileName => fileName.endsWith('.yaml') || fileName.endsWith('.yml'))
    .map(fileName => {
      const filePath = path.join(EVENTS_DIR, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const data = yaml.load(fileContents) as Event;
      return data;
    });

  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getUpcomingEvents(): Promise<Event[]> {
  const events = await getEvents();
  const now = new Date();
  return events.filter(event => new Date(event.date) >= now);
}

// 関連データを含む記事取得
export async function getArticleWithReferences(slug: string): Promise<ArticleWithReferences | null> {
  const article = await getArticleBySlug(slug);
  if (!article) return null;

  const players = await getPlayers();
  
  const writerData = players.find(p => p.id === article.writer);
  const collaboratorsData = article.collaborators 
    ? article.collaborators.map(id => players.find(p => p.id === id)).filter(Boolean) as Player[]
    : [];
  const reviewerData = article.reviewer 
    ? players.find(p => p.id === article.reviewer)
    : undefined;

  return {
    ...article,
    writerData,
    collaboratorsData,
    reviewerData,
  };
}

// 記事のスラッグ一覧を取得（静的生成用）
export async function getArticleSlugs(): Promise<string[]> {
  const articles = await getArticles();
  return articles.map(article => article.slug);
}

// タグ一覧を取得
export async function getAllTags(): Promise<string[]> {
  const articles = await getArticles();
  const tags = new Set<string>();
  
  articles.forEach(article => {
    article.tags.forEach(tag => tags.add(tag));
  });
  
  return Array.from(tags).sort();
}