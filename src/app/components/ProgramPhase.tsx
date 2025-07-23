import MosaicIcon from "@/components/MosaicIcon";
import ProgramCard from "./ProgramCard";




export function ProgramPhase1() {

    return (

        <div className="w-full flex flex-col">
            <div className="flex flex-wrap gap-4 lg:gap-10 items-end">
                <h3>
                    <img src="/gifs/phase1.gif" className="h-8 lg:h-[1.8em] mb-0" alt="" />
                    <span className="sr-only mb-0">Phase1</span>
                </h3>
                <div className="w-auto flex flex-col lg:flex-row gap-2 lg:gap-10 pl-8 lg:pl-0 mb-0.5 pr-3 font-medium text-sm lg:text-base">
                    <div className="leading-none font-zen">世界を広げる</div>
                    <div className="font-en leading-none">Expand The World</div>
                </div>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 w-full gap-4 md:gap-15 md:px-[3vw] py-14">
                <div className=""><MosaicIcon number={1} /></div>
                <div className=""><MosaicIcon number={2} /></div>
                <div className=""><MosaicIcon number={3} /></div>
            </div>

            <div className="w-full px-[3vw] py-14">
                <h4 className="sr-only">Phase 1 Program</h4>
                <ul className="px-[5%] space-y-14">
                    <li>
                        <ProgramCard
                            imageUrl="/images/home/program-1-1.png"
                            title="ラボ合同キックオフ"
                            dateTime="2025.08.24 13:00-17:00"
                            location="Tokyo Innovation Base"
                        >
                            <div className="text-fluid-sm leading-snug">
                                6種類のラボの参加者が一堂に会す合同キックオフ。実施事項は以下の通りです。
                            </div>
                            <ul className="text-fluid-sm leading-snug pt-4 ml-4 list-disc">
                                <li>3か月間のプログラム内容共有と目標設定</li>
                                <li>自分のアイデアをビジュアルに表現し、フィードバックを得るギャラリーウォーク</li>
                                <li>「オリジンシート」「ライフグラフ」を用いたリフレクション</li>
                            </ul>
                        </ProgramCard>
                    </li>
                    <li>
                        <ProgramCard
                            imageUrl="/images/home/program-1-2.png"
                            title="フィールドワーク合宿"
                            dateTime="2025.08.31"
                            location="総武線亀戸駅より徒歩10分"
                        >
                            <p className="text-fluid-sm leading-snug">
                                見る」「感じる」「つくる」を繰り返す1泊2日のフィールドワーク合宿。
                                クリエイターにとって、「心の機敏さ」「じっくり見る体験」は欠かせない感覚です。世界の微細な違和感に気づくこと。
                                誰もが見過ごす風景の中に、自分だけの発見を見つけ出すこと。クリエイションの原点に立ち返る合宿です。
                            </p>
                            <p className="text-fluid-sm leading-snug pt-1">
                                ※プログラムに宿泊を含むか否かは8月上旬には決定いたします。宿泊を含まない場合、遠方の方の参加は柔軟に対応させていただきます。
                                宿泊有無に関わらず2日間のプログラムは実施いたします。
                            </p>
                        </ProgramCard>
                    </li>
                </ul>
            </div>
        </div>
    );
}


export function ProgramPhase2() {

    return (

        <div className="w-full flex flex-col gap-4">
            <div className="flex flex-wrap gap-4 lg:gap-10 items-end">
                <h3>
                    <img src="/gifs/phase2.gif" className="h-8 lg:h-[1.8em] mb-0" alt="" />
                    <span className="sr-only mb-0">Phase2</span>
                </h3>
                <div className="w-auto flex flex-col lg:flex-row gap-2 lg:gap-10 pl-8 lg:pl-0 mb-0.5 pr-3 font-medium text-sm lg:text-base">
                    <div className="leading-none font-zen">真っすぐにつくる</div>
                    <div className="font-en leading-none">Make Straight</div>
                </div>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 w-full gap-4 md:gap-15 md:px-[3vw] py-14">
                <div className=""><MosaicIcon number={4} /></div>
                <div className=""><MosaicIcon number={5} /></div>
                <div className=""><MosaicIcon number={6} /></div>
            </div>

            

            <div className="w-full px-[3vw] py-14">
                <h4 className="sr-only">Phase 2 Program</h4>
                <ul className="px-[5%] space-y-14">
                    <li>
                        <ProgramCard
                            imageUrl="/images/home/program-2-1.png"
                            title="レクチャー & Meetup #01"
                            dateTime="2025.09.28"
                            location="TBD in Tokyo"
                        >
                            <div className="text-fluid-sm leading-snug">
                                Phase 1「世界を広げる」からPhase 2「真っすぐにつくる」へ
                            </div>
                        </ProgramCard>
                    </li>
                    <li>
                        <ProgramCard
                            imageUrl="/images/home/program-2-2.png"
                            title="制作集中期間"
                            dateTime="2025.10.11-13"
                            location="総武線亀戸駅より徒歩10分"
                        >
                            <div className="text-fluid-sm leading-snug">
                                とにかくつくる！メンター陣とともに自分のアウトプットを極限まで高めます。
                            </div>
                        </ProgramCard>
                    </li>
                </ul>
            </div>

        </div>
    );
}

export function ProgramPhase3() {

    return (

        <div className="w-full flex flex-col gap-4">

            <div className="flex flex-wrap gap-4 lg:gap-10 items-end">
                <h3>
                    <img src="/gifs/phase3.gif" className="h-8 lg:h-[1.8em] mb-0" alt="" />
                    <span className="sr-only mb-0">Phase3</span>
                </h3>
                <div className="w-auto flex flex-col lg:flex-row gap-2 lg:gap-10 pl-8 lg:pl-0 mb-0.5 pr-3 font-medium text-sm lg:text-base">
                    <div className="leading-none font-zen">自分と向き合う</div>
                    <div className="font-en leading-none">Face Yourself</div>
                </div>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 w-full gap-4 md:gap-15 md:px-[3vw] py-14">
                <div className=""><MosaicIcon number={7} /></div>
                <div className=""><MosaicIcon number={8} /></div>
                <div className=""><MosaicIcon number={9} /></div>
                <div className="lg:col-start-3"><MosaicIcon number={10} /></div>
            </div>

            <div className="w-full px-[3vw] py-14">
                <h4 className="sr-only">Phase 3 Program</h4>
                <ul className="px-[5%] space-y-14">
                    <li>
                        <ProgramCard
                            imageUrl="/images/home/program-3-1.png"
                            title="レクチャー&Meetup #02"
                            dateTime="2025.11.02"
                            location="TBD in Tokyo"
                        >
                            <div className="text-fluid-sm leading-snug">
                                Phase 2「真っすぐにつくる」からPhase 3「自分と向き合う」へ
                            </div>
                        </ProgramCard>
                    </li>
                    <li>
                        <ProgramCard
                            imageUrl="/images/home/program-3-2.png"
                            title="成果発表会・展示会「プロジェクト・フェア」"
                            dateTime="2025.11.30"
                            location="TBD in Tokyo"
                        >
                            <p className="text-fluid-sm leading-snug">
                                ラボを通じて磨いてきたアウトプットを発表・体験してもらうことで、共に歩んでくれる仲間を見つけたり、
                                次のステージへと進む足がかりを作ります。
                                個々のプロジェクトの可能性を探り、事業やプロジェクトをさらに磨き上げる機会となります。
                            </p>
                        </ProgramCard>
                    </li>
                </ul>
            </div>

        </div>
    );
}





