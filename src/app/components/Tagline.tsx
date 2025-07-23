import Image from "next/image";

export default function Tagline() {

    return (
        <div className="text-xl lg:text-fluid-4xl lg:leading-[clamp(4rem,8vw,7rem)]">
            <p>
                同じ教室、同じ学年、同じ言葉を話しているはずなのに、
                <Image 
                    src = "/gifs/green-mosaic.gif"
                    alt = "green mosaic"
                    width = {500}
                    height = {140}
                    className="inline w-24 -mr-24 lg:w-50 lg:-mr-50"
                />
                なぜか視線が合わない。
            </p>
            <p>
                心のどこかで、「自分の居場所はここではない」と感じてしまう。
            </p>
            <p>
                そんな人々にとって、学校は「生きる場所」ではなく、「生きるための場所」だった。
            </p>
            <p>
                そんな人々にとって、自分で「つくること」とは、
                <Image 
                    src = "/gifs/green-mosaic.gif"
                    alt = "green mosaic"
                    width = {500}
                    height = {140}
                    className="inline w-24 -mr-24 lg:w-50 lg:-mr-50"
                />
                表現と思考の必死なあらわれであり、まさぐな「生き方」の表現だったはず。
            </p>
        </div>
    );
}