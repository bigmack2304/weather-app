import React from "react";
// import "./IconChart.scss";

interface IIconChartProps {
    addClassName?: string[];
}

type TProps = Readonly<IIconChartProps>;

function IconChart({ addClassName = [""] }: TProps) {
    let componentClassName = [...addClassName, "IconChart"].join(" ");
    return (
        <svg
            className={componentClassName}
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            enableBackground="new 0 0 64 64"
            xmlSpace="preserve"
        >
            <g>
                <g>
                    <path
                        fill="#F9EBB2"
                        d="M62,60c0,1.104-0.896,2-2,2H4c-1.104,0-2-0.896-2-2V4c0-1.104,0.896-2,2-2h56c1.104,0,2,0.896,2,2V60z"
                    />
                    <g>
                        <path
                            fill="#394240"
                            d="M60,0H4C1.789,0,0,1.789,0,4v56c0,2.211,1.789,4,4,4h56c2.211,0,4-1.789,4-4V4C64,1.789,62.211,0,60,0z
				 M62,60c0,1.104-0.896,2-2,2H4c-1.104,0-2-0.896-2-2V4c0-1.104,0.896-2,2-2h56c1.104,0,2,0.896,2,2V60z"
                        />
                        <path
                            fill="#394240"
                            d="M35,8h-6c-0.553,0-1,0.447-1,1v47h8V9C36,8.447,35.553,8,35,8z M34,54h-4V40h4V54z M34,38h-4V10h4V38z"
                        />
                        <path
                            fill="#394240"
                            d="M25,16h-6c-0.553,0-1,0.447-1,1v39h8V17C26,16.447,25.553,16,25,16z M24,54h-4V44h4V54z M24,42h-4V18h4
				V42z"
                        />
                        <path
                            fill="#394240"
                            d="M55,24h-6c-0.553,0-1,0.447-1,1v31h8V25C56,24.447,55.553,24,55,24z M54,54h-4V44h4V54z M54,42h-4V26h4
				V42z"
                        />
                        <path
                            fill="#394240"
                            d="M45,32h-6c-0.553,0-1,0.447-1,1v23h8V33C46,32.447,45.553,32,45,32z M44,54h-4v-6h4V54z M44,46h-4V34h4
				V46z"
                        />
                        <path
                            fill="#394240"
                            d="M15,24H9c-0.553,0-1,0.447-1,1v31h8V25C16,24.447,15.553,24,15,24z M14,54h-4v-6h4V54z M14,46h-4V26h4V46
				z"
                        />
                    </g>
                </g>
                <g>
                    <rect x="10" y="26" fill="#B4CCB9" width="4" height="20" />
                    <rect x="20" y="18" fill="#45AAB8" width="4" height="24" />
                    <rect x="40" y="34" fill="#F76D57" width="4" height="12" />
                    <rect x="30" y="40" fill="#45AAB8" width="4" height="14" />
                    <rect x="50" y="26" fill="#B4CCB9" width="4" height="16" />
                    <rect x="30" y="10" fill="#45AAB8" width="4" height="28" />
                    <rect x="10" y="48" fill="#B4CCB9" width="4" height="6" />
                    <rect x="40" y="48" fill="#F76D57" width="4" height="6" />
                    <rect x="50" y="44" fill="#B4CCB9" width="4" height="10" />
                    <rect x="20" y="44" fill="#45AAB8" width="4" height="10" />
                </g>
                <g opacity="0.2">
                    <rect x="30" y="40" width="4" height="14" />
                    <rect x="10" y="48" width="4" height="6" />
                    <rect x="40" y="48" width="4" height="6" />
                    <rect x="50" y="44" width="4" height="10" />
                    <rect x="20" y="44" width="4" height="10" />
                </g>
            </g>
        </svg>
    );
}

export { IconChart };
