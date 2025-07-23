
export default function getAspectRatioFromFilename(imageUrl: string): string {
    const filename = imageUrl.split('/').pop() || ''
    
    // アスペクト比のパターンを検索
    const aspectRatioMatch = filename.match(/_(\d+)-(\d+)\.(jpg|jpeg|png|webp)$/i)
    
    if (aspectRatioMatch) {
      const [, width, height] = aspectRatioMatch
      return `${width}/${height}`
    }
    
    // デフォルトは正方形
    return "1/1"
  }