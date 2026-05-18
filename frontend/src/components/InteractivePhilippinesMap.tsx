import '../styles/design-system.css';

export type BranchMarker = {
  id: string;
  label: string;
  x: number;
  y: number;
};

type Props = {
  activeBranchId?: string | null;
  markers: BranchMarker[];
};

export default function InteractivePhilippinesMap({ activeBranchId, markers }: Props) {
  return (
    <svg
      className="find-ymca__map"
      viewBox="0 0 400 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Philippines map"
      role="img"
    >
      {/* Simplified Philippines outline */}

      {/* Branch markers */}
      {markers.map((m) => {
        const isActive = activeBranchId === m.id;
        return (
          <g key={m.id} transform={`translate(${m.x} ${m.y})`} className="find-ymca__marker">
            {isActive && <circle className="find-ymca__marker-pulse" r="18" />}
            <circle
              className={isActive ? 'find-ymca__marker-dot find-ymca__marker-dot--active' : 'find-ymca__marker-dot'}
              r="10"
            />
            {/* Y symbol (template). Swap to an image later if you prefer. */}
            <text
              x="0"
              y="4"
              textAnchor="middle"
              fontSize="12"
              fontWeight="800"
              fill="white"
              fontFamily="var(--font-sans)"
            >
              Y
            </text>
            <title>{m.label}</title>
          </g>
        );
      })}
    </svg>
  );
}

