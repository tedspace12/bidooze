import { useState } from "react";
import { unitedStatesAuctionMap, unitedStatesMap } from "../../constants/data";
import { useRouter } from "next/navigation";

export const USMap = () => {
    const [hoveredState, setHoveredState] = useState<{
        name: string;
        count: number;
        x: number;
        y: number;
    } | null>(null);

    const router = useRouter();

    const handleMouseEnter = (e: React.MouseEvent<SVGPathElement>) => {
        const path = e.currentTarget;
        const stateId = path.id;
        const stateName = path.getAttribute('data-state');

        const count = unitedStatesAuctionMap[stateId];
        if (!count) return;

        const rect = path.getBoundingClientRect();

        setHoveredState({
            name: stateName || '',
            count,
            x: rect.left + rect.width / 2,
            y: rect.top,
        });
    };

    const handleMouseLeave = () => {
        setHoveredState(null);
    };

    const handleClick = (e: React.MouseEvent<SVGPathElement>) => {
        const path = e.currentTarget;
        const stateName = path.getAttribute('data-state');
        router.push(`/auctions/${stateName}`)
    }


    return (
        <div className="relative">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                className="h-[800px] w-full"
            >
                <g>
                    {unitedStatesMap.map((state) => (
                        <path key={state.id} id={state.id} data-state={state.name} className="land" onClick={handleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} d={state.d} />
                    ))}
                </g>
            </svg>

            {hoveredState && (
                <div
                    className="fixed z-50 rounded-md px-3 py-2 text-sm shadow-lg"
                    style={{
                        top: hoveredState.y - 40,
                        left: hoveredState.x,
                        transform: "translateX(-50%)",
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                    }}
                >
                    <div className="font-semibold">{hoveredState.name}</div>
                    <div className="text-muted-foreground">
                        {hoveredState.count} auctions
                    </div>
                </div>
            )}
        </div>
    )
}