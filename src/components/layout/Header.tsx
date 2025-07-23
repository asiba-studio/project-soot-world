

export default function Header() {

    return (
        <div className="
            sticky top-0 z-50 w-full h-12
            flex items-center
            backdrop-blur-md backdrop-saturate-300 bg-white/25
        ">
            <header className="w-full">
                {/* PC */}
                <nav className="hidden lg:flex justify-end items-center gap-8 font-en font-medium text-lg px-6">
                    <div>About</div>
                    <div>Events</div>
                    <div>Players</div>
                    <div>Application</div>
                </nav>

                {/* Mobile */}
                <nav className="flex lg:hidden justify-end items-center gap-4 font-en font-medium text-base px-4">
                    <div>About</div>
                </nav>


            </header>
        </div>
    )
}

