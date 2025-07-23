

export default function Footer() {

    return (
        <footer className="w-full h-auto pt-20 pb-40 px-4 bg-[#1B1B24] flex flex-col items-center justify-center gap-20">
            <div className="text-fluid-base text-white">
                LOGO LOGO LOGO
            </div>
            <div className="flex flex-wrap text-fluid-base gap-x-10 gap-y-2">
                <div className="text-white">About</div>
                <div className="text-white">News</div>
                <div className="text-white">Articles</div>
                <div className="text-white">Players</div>
            </div>
            <div className="text-fluid-sm text-white">
                © {new Date().getFullYear()} あああああ. All rights reserved.
            </div>
        </footer>
    );
}