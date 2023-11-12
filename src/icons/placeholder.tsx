import { SVGProps } from 'react';

interface PlaceholderProps extends SVGProps<SVGSVGElement> {
  fillOne?: string;
}

function Placeholder({ fillOne = '#d0d0d0', ...props }: PlaceholderProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 180.12 139.79"
      {...props}
    >
      <path
        fill={fillOne}
        d="M.001 0h180.12v139.79H.001z"
        style={{
          paintOrder: 'fill markers stroke',
        }}
      />
      <path
        fill="#fff"
        d="m104.92 66.875-34.249 34.249-15.968-15.968-41.938 41.937h152.37z"
        opacity={0.675}
        style={{
          paintOrder: 'fill markers stroke',
        }}
      />
      <circle
        cx={44.627}
        cy={41.916}
        r={11.773}
        fill="#fff"
        opacity={0.675}
        style={{
          paintOrder: 'fill markers stroke',
        }}
      />
      <path
        fill="none"
        d="M12.521 10.995h152.61v116.1H12.521z"
        style={{
          paintOrder: 'fill markers stroke',
        }}
      />
    </svg>
  );
}

export default Placeholder;
