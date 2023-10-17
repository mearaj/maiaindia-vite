import { SVGProps } from 'react';

interface PlaceholderProps extends SVGProps<SVGSVGElement> {
  fillOne?: string;
}

function Placeholder({ fillOne, ...props }: PlaceholderProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 180.12 139.79"
      {...props}
    >
      <g paintOrder="fill markers stroke" transform="translate(-13.59 -66.639)">
        <path fill={fillOne} d="M13.591 66.639h180.12v139.79H13.591z" />
        <path
          fill="#fff"
          d="m118.51 133.51-34.249 34.249-15.968-15.968-41.938 41.937h152.37z"
          opacity={0.675}
        />
        <circle
          cx={58.217}
          cy={108.56}
          r={11.773}
          fill="#fff"
          opacity={0.675}
        />
        <path fill="none" d="M26.111 77.634h152.61v116.1H26.111z" />
      </g>
    </svg>
  );
}

export default Placeholder;
