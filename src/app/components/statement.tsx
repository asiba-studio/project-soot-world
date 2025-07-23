
import { ReactNode } from 'react';

const styles = {
  normalText: {
    fontFamily: '"Zen Kaku Gothic New", sans-serif',
    fontSize: '22px',
    lineHeight: '2.0',
    margin: '0 0 30px 0',
    color: '#333333',
    fontWeight: 700,
    WebkitFontSmoothing: 'antialiased' as const,
    MozOsxFontSmoothing: 'grayscale' as const,
    textRendering: 'optimizeLegibility' as const,
  },

  pixelImage: {
    height: '2.6em',
    width: 'auto',
    verticalAlign: 'baseline',
    transform: 'translateY(2px)',
    margin: '0 10px',
    display: 'inline-block',
  }
};


interface TextProps {
  children: ReactNode;
  className?: string;
}


interface PixelImageProps {
  src: string;
  alt: string;
  className?: string;
}


// 通常テキスト用コンポーネント
export function NormalText({ children, className = "" }: TextProps) {
  return (
    <p style={styles.normalText} className={className}>
      {children}
    </p>
  );
}


// ピクセル画像用コンポーネント
export function PixelImage({ src, alt, className = "" }: PixelImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      style={styles.pixelImage}
      className={className}
    />
  );
}


export function StatementLeft() {
  return (
    <div>
      <NormalText>
        同じ教室、同じ学年、同じ言葉を話しているはずなのに、なぜか視線が合わない。
      </NormalText>
      <NormalText>
        心のどこかで、「自分の居場所はここではない」と感じてしまう。
      </NormalText>
      <NormalText>
        そんな人々にとって、自分で<PixelImage src="/gifs/tsukurukoto.gif" className="translate-y-[8px]" alt="「つくること」" />とは、表現と思考の必死なあらわれであり、
      </NormalText>
      <NormalText>
        まっすぐな<PixelImage src="/gifs/ikikata.gif" className="translate-y-[8px]" alt="「生き方」" />の表現だったはず。
      </NormalText>

    </div>


  );
}

export function StatementCenter() {
  return (
    <div>
      <NormalText>
        それなのに、いつの間にか、「評価」や「正しさ」が、<PixelImage src="/gifs/tsukurukoto.gif" className="translate-y-[8px]" alt="「つくること」" />の輪郭を決めるようになった。
      </NormalText>
      <NormalText>
        誰かに決められた課題や問題を解くために<PixelImage src="/gifs/tsukurukoto.gif" className="translate-y-[8px]" alt="「つくること」" />ばかりになってしまった。
      </NormalText>
      <NormalText>
        つくると悩む。つくると考える。つくると何が良いのかわからなくなる。
      </NormalText>
      <NormalText>
        それでも、自分でつくらないと見えない、本当の世界や社会の姿がそこにはある。
      </NormalText>

    </div>
  );
}

export function StatementRight() {
  return (
    <div>
      <NormalText>
        TSG Creative-LAB.は、<PixelImage src="/gifs/tsukurukoto.gif" className="translate-y-[8px]" alt="「つくること」" />を通して、
        あなたの<PixelImage src="/gifs/ikikata.gif" className="translate-y-[8px]" alt="「生き方」" />を探していく場所です。
        ここでは、作品だけでなく、
        その奥にあるあなたの<PixelImage src="/gifs/ikikata.gif" className="translate-y-[8px]" alt="「生き方」" />としてのクリエイションに向き合います。
      </NormalText>
      <NormalText>
        安全地帯を出て、まだ誰にも見せていない100%でつくってみる。
        まだ知らない場所や人と出会い、その人の<PixelImage src="/gifs/ikikata.gif" className="translate-y-[8px]" alt="「生き方」" />に触れてみる。
        好奇心でドキドキする瞬間に、共感をして身体が動いてしまう瞬間に、自分で気づいてみる。
      </NormalText>
      <NormalText>
        必要なのは、「正しい答え」を探すのではなく「自分の問い」から始めること。
        自分の問いにまっすぐに答えるように<PixelImage src="/gifs/tsukurukoto.gif" className="translate-y-[8px]" alt="「つくること」" />で、社会の課題や問題に出会うはずです。
      </NormalText>
      <NormalText>
        同じように孤独を抱え、同じように諦めきれない仲間とともに、
        あなた自身の手で、<PixelImage src="/gifs/tsukurukoto.gif" className="translate-y-[8px]" alt="「つくること」" />と
        <PixelImage src="/gifs/ikikata.gif" className="translate-y-[8px]" alt="「生き方」" />を重ねていく。
      </NormalText>
      <NormalText>
        この場所から、あなたの“まだ出し切れていない何か”を、仲間とともに世界へ投げ出してみませんか？
      </NormalText>

    </div>
  );
}

export function StatementShort() {
  return (
    <div className="text-fluid-base font-bold leading-loose space-y-6">
      <p>
        TSG Creative-LAB.は、<br />
        「つくること」を通して、<br />
        あなたの「生き方」を探していく場所です。
      </p>
      <p>
        ここでは、<br />
        作品だけでなく、<br />
        その奥にある<br />
        あなたの「生き方」としての<br />
        クリエイションに向き合います。
      </p>
      <p>
        好奇心でドキドキする瞬間に、<br />
        共感をして身体が動いてしまう瞬間に、<br />
        自分で気づいてみる。
      </p>
      <p>
        「正しい答え」を探すのではなく<br />
        「自分の問い」から始めること
      </p>
      <p>
        この場所から、<br />
        あなたの「まだ出し切れていない何か」を、<br />
        仲間とともに世界へ投げ出してみよう。
      </p>
    </div>
  )
}


