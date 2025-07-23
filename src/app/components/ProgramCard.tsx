// components/ProgramCard.tsx
import InteractiveMosaic02 from "@/components/InteractiveMosaic02";

interface ProgramCardProps {
    imageUrl: string;
    title: string;
    children: React.ReactNode; // 内容は自由に
    dateTime: string;
    location: string;
}

export default function ProgramCard({
    imageUrl,
    title,
    children,
    dateTime,
    location,
}: ProgramCardProps) {
    return (
        <div className="flex flex-wrap gap-2 gap-y-4 lg:gap-4">
            <div className="w-full lg:w-[25%]">
                <InteractiveMosaic02
                    imageUrl={imageUrl}
                    width="100%"
                />
            </div>
            <div className="font-bold text-fluid-lg">|||</div>
            <div className="flex-1">
                <div className="font-bold text-fluid-lg">{title}</div>
                <div className="pt-3 lg:pt-6">
                    {children}
                </div>
                <div className="w-full text-fluid-sm font-bold text-right mt-6">
                    {dateTime} @{location}
                </div>
            </div>
        </div>
    );
}