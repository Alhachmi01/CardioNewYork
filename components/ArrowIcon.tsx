import type { CSSProperties, SVGProps } from "react";

export function ArrowIcon({
  width = 18,
  height = 18,
  style,
  ...props
}: SVGProps<SVGSVGElement>) {
  const iconStyle: CSSProperties = {
    display: "block",
    flex: "0 0 auto",
    ...style,
  };

  return (
    <svg
      viewBox="0 0 20 20"
      width={width}
      height={height}
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={iconStyle}
      {...props}
    >
      <path
        d="M4 10h11M11 6l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
