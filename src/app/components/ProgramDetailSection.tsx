import { SimpleButton } from "@/components/button"
import InteractiveMosaic02 from "@/components/InteractiveMosaic02"

export default function ProgramDetailSection() {
    return (
        <div>
            <h2>
                <img src="/gifs/program.gif" className="h-10 lg:h-16 mb-10" alt="" />
                <span className="sr-only">Program</span>
            </h2>
            <div className="w-full gap-6 px-[2.5vw]">
                <ul className="custom-ul space-y-6 pl-[2.5vw]">
                    <li className="space-y-1">
                        <p className="font-bold">クリエイティブ領域に特化した、若者向けのコミュニティです。</p>
                        <p className="text-fluid-sm">建築・デザイン・アートといった、クリエイションに向き合いながら、
                            起業やビジネスを考えている若者/学生向け（15歳〜25歳前後を対象）のコミュニティです。
                            自己表現と真剣に向き合いながら、他者との対話や越境も大切にする場を作ります。
                        </p>
                    </li>
                    <li className="space-y-1">
                        <p className="font-bold">「つくること」だけでなく「生き方」にもフォーカス</p>
                        <p className="text-fluid-sm">Creative Lab.は「何を、どのようにつくるか」だけでなく、
                            「これから、どう生きていきたいか？」という問いを起点に、自分のクリエイションと生き方を結び直す場です。
                            社会の中で自分だけのモノづくりをしながら生きている人々や、同世代の仲間との対話と挑戦を通じて、
                            本当に選びたい生き方やまなざしを見つけるプロセスを後押しします。
                        </p>
                    </li>
                    <li className="space-y-1">
                        <p className="font-bold"> クリエイティブ・モードに入るために「MEs」を活用</p>
                        <p className="text-fluid-sm">オンラインであっても、互いのクリエイティビティに触れ合い、
                            自然とコラボレーションが生まれる状態を作るために、3Dデジタルコラボレーションツール「MEs」を導入します。
                            モノづくりに没入する時間こそ最も重要だからこそ、仲間のクリエイションに触れながら、
                            自然にフロー状態へと導かれるクリエイティブな環境をつくります。
                        </p>
                        <div className="pt-2">
                            <InteractiveMosaic02
                                imageUrl="/images/mes_2-1.jpg"
                                width="100%"
                                className="overflow-hidden aspect-square"
                            />
                        </div>
                        <div className="w-full flex justify-end">
                            <SimpleButton icon="right" href="https://www.o-me.io/" external>https://www.o-me.io/</SimpleButton>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="w-full gap-6 px-[2.5vw] pt-20">
                <h3 className="font-bold pb-10">実施内容</h3>
                <p className=" pl-[2.5vw] text-fluid-base">
                    プログラム内容は、上記のPhase1~3をご確認ください。
                </p>

            </div>

            <div className="w-full gap-6 px-[2.5vw] pt-20">
                <h3 className="font-bold pb-10">オンライン・任意参加のコンテンツ</h3>
                <ul className="custom-ul  pl-[2.5vw] space-y-8">
                    <li>
                        <div className="font-bold">オープンレクチャー</div>
                        <div className="text-fluid-sm leading-snug">
                            プログラム前半を中心に、合計3回程度のオープンレクチャーセッションをオンラインで実施します。
                        </div>
                    </li>
                    <li>
                        <div className="font-bold">メンタリング</div>
                        <div className="text-fluid-sm leading-snug">
                            グッドデザイン・ニューホープ賞、未踏アドバンストをはじめ、クリエイティブ領域で受賞歴があり、
                            実際に起業家として活躍している若手メンター陣によるメンタリングを行います。
                        </div>
                    </li>
                    <li>
                        <div className="font-bold">オンライン・ギャラリーウォーク</div>
                        <div className="text-fluid-sm leading-snug">
                            ラボの後半には、それぞれの制作物をメタバース空間「MEs」に展示し、
                            互いにフィードバックを行う「オンライン・ギャラリーウォーク」を実施し、
                            切磋琢磨しながらクリエイティブ・モードを深めていきます。
                        </div>
                    </li>
                </ul>
            </div>


        </div>
    )
}