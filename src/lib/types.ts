
// src/lib/types.ts

export interface Player {
    id: string;
    name: string;
    nameEn: string;
    role: string;
    roleJa: string;
    bio: string;
    bioEn: string;
    avatar: string;
    social: {
        github?: string;
        twitter?: string;
        linkedin?: string;
    };
    skills: string[];
    joinDate: string;
    active: boolean;
}

export interface Event {
    id: string;
    title: string;
    date: string;
    description: string;
    location?: string;
    participants?: string[];
    tags?: string[];
}

export interface News {
    slug: string;
    title: string;
    subtitle: string;
    date: string;
    excerpt: string;
    coverImage: string;
    headerImage: string;
    tags?: string[];
    lang: string;
    content: string;
}

export interface Article {
    slug: string;
    title: string;
    subtitle: string;
    date: string;
    writer: string;
    collaborators?: string[];
    reviewer?: string;
    relatedProjects?: string[];
    excerpt: string;
    coverImage: string;
    headerImage: string;
    tags: string[];
    featured: boolean;
    lang: string;
    content: string;
}

export interface ArticleWithReferences extends Article {
    writerData?: Player;
    collaboratorsData?: Player[];
    reviewerData?: Player;
}

export interface CMSData {
    articles: Article[];
    players: Player[];
    events: Event[];
}


import p5 from "p5";
export interface P5SketchProps {
    preload?: (p5: p5) => void;
    setup?: (p5: p5, canvasParentRef: Element) => void;
    draw?: (p5: p5) => void;
    windowResized?: (p5: p5) => void;
    [key: string]: any;
  }