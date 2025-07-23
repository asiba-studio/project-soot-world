// src/lib/date.ts
export function formatDate(dateString: string, locale: string = 'ja-JP'): string {
    const date = new Date(dateString);

    if (locale === 'ja-JP') {
        return new Intl.DateTimeFormat('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    }

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
}

export function formatDateShort(dateString: string, locale: string = 'ja-JP'): string {
    const date = new Date(dateString);

    if (locale === 'ja-JP') {
        return new Intl.DateTimeFormat('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date);
    }

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);
}

export function isRecent(dateString: string, daysThreshold: number = 7): boolean {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

    return diffInDays <= daysThreshold;
}

export function sortByDate<T extends { date: string }>(items: T[], order: 'asc' | 'desc' = 'desc'): T[] {
    return [...items].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        return order === 'desc' ? dateB - dateA : dateA - dateB;
    });
}

export function getRelativeTime(dateString: string, locale: string = 'ja-JP'): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (locale === 'ja-JP') {
        if (diffInSeconds < 60) return 'たった今';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分前`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}時間前`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}日前`;
        if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}ヶ月前`;
        return `${Math.floor(diffInSeconds / 31536000)}年前`;
    }

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

export function formatDateDot(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
}