import React, { SVGProps } from 'react';

export interface OwnProps {
    type?: 'advarsel' | 'feil';
}

type Props = OwnProps & SVGProps<any>;

const AdvarselIkon = (props: Props) => {
    const farge = props.type === 'feil' ? '#ba3a26' : '#ff9100';

    return (
        <svg
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            {...props}>
            <defs>
                <path
                    id="a"
                    d="M23.892 22.23L12.462 1.243c-.178-.324-.758-.324-.934 0L.055 22.307a.445.445 0 0 0 .022.465c.094.14.264.228.446.228h22.955c.287 0 .522-.214.522-.479 0-.109-.04-.21-.108-.29zM11.474 8.784c0-.264.233-.479.521-.479.287 0 .522.215.522.48v7.326c0 .264-.235.479-.522.479-.288 0-.521-.215-.521-.479V8.784zm.521 11.447c-.551 0-.998-.41-.998-.915 0-.505.447-.916.998-.916.55 0 .997.411.997.916 0 .506-.447.915-.997.915z"
                />
            </defs>
            <g fill="none" fillRule="evenodd">
                <mask id="b" fill="#fff">
                    <use xlinkHref="#a" />
                </mask>
                <g fill={farge} mask="url(#b)">
                    <path d="M0 24h24V0H0z" />
                </g>
            </g>
        </svg>
    );
};

export default AdvarselIkon;
