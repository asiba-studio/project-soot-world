


const Words: Record<number, string> = {
    1: "ものづくり",
    2: "好奇心ドリブン",
    3: "生き方を考える",
    4: "心の機敏さ",
    5: "観察をする",
    6: "輪郭を見つける",
    7: "曇りから晴れ",
    8: "尖りの共鳴",
    9: "社会性を持つ尖り",
    10: "形へ昇華する"
 }

export default function MosaicIcon({ number }: {number:number}) {
    if (number > 10) {
        return null;
    }

    const gifPath: string = `/gifs/icon/icon-${number.toString().padStart(2,'0')}.gif`;
    const word = Words[number];

    return (
        <div className="w-full flex flex-col items-center gap-2">
            <img src={gifPath} className="w-full" alt=""/>
            <div className="font-bold text-sm lg:text-lg flex gap-2">
                <div className="font-en mt-[1px]">{number.toString().padStart(2,'0')}.</div>
                <div className="font-zen">{word}</div>
            </div>

        </div>
    )

}