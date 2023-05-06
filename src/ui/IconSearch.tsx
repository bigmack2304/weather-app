import React from "react";
import "./IconSearch.scss";

interface IIconSearchProps {
    addClassName?: string[];
}

type TProps = Readonly<IIconSearchProps>;

function IconSearch({ addClassName = [""] }: TProps) {
    let componentClassName = [...addClassName, "IconSearch"].join(" ");
    return (
        <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            xmlSpace="preserve"
            className={componentClassName}
        >
            <g>
                <path
                    d="M66.8,62.1l-0.5,0.5L59,55.3c4.3-5.1,6.9-11.7,6.9-18.9c0-7.7-3.1-15.2-8.6-20.7C51.8,10.1,44.2,7,36.5,7
		C20.3,7,7.2,20.2,7.2,36.4c0,7.9,3.1,15.3,8.7,20.9c5.5,5.5,12.8,8.5,20.5,8.5c0.1,0,0.1,0,0.2,0c7.2,0,13.8-2.6,18.9-6.9l7.3,7.3
		L62,66.9c-1,1-1,2.6,0,3.5l20.8,20.8c2.3,2.3,6.1,2.3,8.4,0l0,0c2.3-2.3,2.3-6.1,0-8.4L70.3,62.1C69.3,61.1,67.8,61.1,66.8,62.1z
		 M36.5,60.7c0,0-0.1,0-0.1,0c-6.4,0-12.5-2.5-17-7c-4.6-4.6-7.2-10.8-7.2-17.3C12.2,22.9,23.1,12,36.5,12c6.4,0,12.6,2.6,17.2,7.2
		c4.6,4.6,7.2,10.8,7.2,17.2C60.9,49.8,50,60.7,36.5,60.7z"
                />
                <path
                    d="M16.8,36.4c0,2.1,0.3,4.1,0.9,6.1c0.5,1.4,2.1,2.1,3.5,1.5l0,0c1.1-0.5,1.7-1.8,1.3-3c-0.5-1.5-0.7-3-0.7-4.6
		c0-3.7,1.4-7.2,3.9-9.9c0.8-0.9,0.8-2.3,0.1-3.2l0,0c-1-1.2-2.7-1.2-3.8-0.1C18.7,26.7,16.8,31.4,16.8,36.4z"
                />
            </g>
        </svg>
    );
}

export { IconSearch };
