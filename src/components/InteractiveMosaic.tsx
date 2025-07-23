import getAspectRatioFromFilename from '@/lib/getAspectRatioFromFilename'

interface InteractiveMosaicProps {
  imageUrl: string;
  width?: string;
  height?: string;
  className?: string
}

export default function InteractiveMosaic({
  imageUrl,
  width = "100%",
  height,
  className = ""
}: InteractiveMosaicProps) {
  const aspectRatio = getAspectRatioFromFilename(imageUrl)
  const defaultStyle = height ? {} : { aspectRatio }

  const iframeSrc = `/p5sketches/mosaic-picture-hover/index.html?image=${encodeURIComponent(imageUrl)}&width=${width}&height=${height || 'auto'}&aspectRatio=${aspectRatio}`

  return (
    <iframe
      src={iframeSrc}
      width={width}
      {...(height && { height })}
      scrolling='no'
      style={{
        border: 'none',
        overflow: 'hidden',
        ...defaultStyle
      }}
      className={className}
      title="Mosaic Shader Effect"
    />
  )
}