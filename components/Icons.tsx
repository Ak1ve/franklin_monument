import classNames from "classnames"

export interface IconProps {
    width?: string,
    height?: string,
    iconClassName?: string
}



export interface IconButtonProps extends IconProps, Omit<React.HTMLProps<HTMLButtonElement>, "width" | "height"> {
    textFacing?: "left" | "right"
    addClass?: string
}

export interface IconButtonComponent {
    (props: IconButtonProps): any
    DEFAULT: IconButtonProps
}


function generateIconButton(component: (props: IconProps) => React.ReactNode, defaultProps: IconButtonProps): IconButtonComponent {
    const func = (componentProps: IconButtonProps) => {
        const defaultedProps = { ...defaultProps, ...componentProps };
        const { width, height, iconClassName, children, textFacing, href, addClass, ...buttonProps } = defaultedProps;
        buttonProps.className = classNames(buttonProps.className, addClass);
        const child = textFacing === "left" ? (
            <button {...buttonProps} type="button">
                {children} {component({ width, height, iconClassName })}
            </button>
        ) : (
            <button {...buttonProps} type="button">
                {component({ width, height, iconClassName })} {children}
            </button>
        );
        if (href !== undefined) {
            return <a href={href}>{child}</a>
        }
        return child;
    }
    func.DEFAULT = defaultProps;
    return func;
}

export function Trash(props: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={props.iconClassName} width={props.width} height={props.height} fill="currentColor" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /> <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" /> </svg>
    );
}

export function Edit(props: IconProps) {
    return (
        <svg className={props.iconClassName} fill="none" height={props.height} width={props.width} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
    );
}

export function Back(props: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={props.iconClassName} width={props.width} height={props.height} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1" /> </svg>
    );
}

export function User(props: IconProps) {
    return (
        <svg className={props.iconClassName} width={props.width} height={props.height} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g data-name="Layer 7" ><path d="M19.75,15.67a6,6,0,1,0-7.51,0A11,11,0,0,0,5,26v1H27V26A11,11,0,0,0,19.75,15.67ZM12,11a4,4,0,1,1,4,4A4,4,0,0,1,12,11ZM7.06,25a9,9,0,0,1,17.89,0Z" /></g></svg>
    )
}

export function X(props: IconProps) {
    return (
        <svg className={props.iconClassName} height={props.height} viewBox="0 0 16 16" width={props.width} xmlns="http://www.w3.org/2000/svg"><polygon points="8 9.414 3.707 13.707 2.293 12.293 6.586 8 2.293 3.707 3.707 2.293 8 6.586 12.293 2.293 13.707 3.707 9.414 8 13.707 12.293 12.293 13.707 8 9.414" /></svg>
    )
}

export function PDF(props: IconProps) {
    return (
        <svg className={props.iconClassName} width={props.width} height={props.height} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><g><path d="M325,105H250a5,5,0,0,1-5-5V25a5,5,0,0,1,10,0V95h70a5,5,0,0,1,0,10Z" /><path d="M325,154.83a5,5,0,0,1-5-5V102.07L247.93,30H100A20,20,0,0,0,80,50v98.17a5,5,0,0,1-10,0V50a30,30,0,0,1,30-30H250a5,5,0,0,1,3.54,1.46l75,75A5,5,0,0,1,330,100v49.83A5,5,0,0,1,325,154.83Z" /><path d="M300,380H100a30,30,0,0,1-30-30V275a5,5,0,0,1,10,0v75a20,20,0,0,0,20,20H300a20,20,0,0,0,20-20V275a5,5,0,0,1,10,0v75A30,30,0,0,1,300,380Z" /><path d="M275,280H125a5,5,0,0,1,0-10H275a5,5,0,0,1,0,10Z" /><path d="M200,330H125a5,5,0,0,1,0-10h75a5,5,0,0,1,0,10Z" /><path d="M325,280H75a30,30,0,0,1-30-30V173.17a30,30,0,0,1,30-30h.2l250,1.66a30.09,30.09,0,0,1,29.81,30V250A30,30,0,0,1,325,280ZM75,153.17a20,20,0,0,0-20,20V250a20,20,0,0,0,20,20H325a20,20,0,0,0,20-20V174.83a20.06,20.06,0,0,0-19.88-20l-250-1.66Z" /><path d="M145,236h-9.61V182.68h21.84q9.34,0,13.85,4.71a16.37,16.37,0,0,1-.37,22.95,17.49,17.49,0,0,1-12.38,4.53H145Zm0-29.37h11.37q4.45,0,6.8-2.19a7.58,7.58,0,0,0,2.34-5.82,8,8,0,0,0-2.17-5.62q-2.17-2.34-7.83-2.34H145Z" /><path d="M183,236V182.68H202.7q10.9,0,17.5,7.71t6.6,19q0,11.33-6.8,18.95T200.55,236Zm9.88-7.85h8a14.36,14.36,0,0,0,10.94-4.84q4.49-4.84,4.49-14.41a21.91,21.91,0,0,0-3.93-13.22,12.22,12.22,0,0,0-10.37-5.41h-9.14Z" /><path d="M245.59,236H235.7V182.68h33.71v8.24H245.59v14.57h18.75v8H245.59Z" /></g></svg>
    );
}

export function FileIcon(props: IconProps) {
    return (
        <svg enableBackground="new 0 0 48 48" height={props.height} version="1.1" viewBox="0 0 48 48" width={props.width} xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><path clipRule="evenodd" d="M37,47H11c-2.209,0-4-1.791-4-4V5c0-2.209,1.791-4,4-4h18.973  c0.002,0,0.005,0,0.007,0h0.02H30c0.32,0,0.593,0.161,0.776,0.395l9.829,9.829C40.84,11.407,41,11.68,41,12l0,0v0.021  c0,0.002,0,0.003,0,0.005V43C41,45.209,39.209,47,37,47z M31,4.381V11h6.619L31,4.381z M39,13h-9c-0.553,0-1-0.448-1-1V3H11  C9.896,3,9,3.896,9,5v38c0,1.104,0.896,2,2,2h26c1.104,0,2-0.896,2-2V13z M33,39H15c-0.553,0-1-0.447-1-1c0-0.552,0.447-1,1-1h18  c0.553,0,1,0.448,1,1C34,38.553,33.553,39,33,39z M33,31H15c-0.553,0-1-0.447-1-1c0-0.552,0.447-1,1-1h18c0.553,0,1,0.448,1,1  C34,30.553,33.553,31,33,31z M33,23H15c-0.553,0-1-0.447-1-1c0-0.552,0.447-1,1-1h18c0.553,0,1,0.448,1,1C34,22.553,33.553,23,33,23  z" fillRule="evenodd" /></svg>
    );
}

export function ImageIcon(props: IconProps) {
    return (
        <svg height={props.height} width={props.height} className={props.iconClassName} version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g fillRule="evenodd" stroke="none" strokeWidth="1"><g><path d="M22,24.0457281 L22,18 L11,18 L11,25 L11,25 L13.5,23 L14.9579388,24.2496618 L18.5930302,21 L22,24.0457281 L22,24.0457281 L22,24.0457281 Z M19.5,3 L9.00276013,3 C7.89666625,3 7,3.89833832 7,5.00732994 L7,27.9926701 C7,29.1012878 7.89092539,30 8.99742191,30 L24.0025781,30 C25.1057238,30 26,29.1017876 26,28.0092049 L26,10.5 L26,10 L20,3 L19.5,3 L19.5,3 L19.5,3 Z M19,4 L8.9955775,4 C8.44573523,4 8,4.45526288 8,4.99545703 L8,28.004543 C8,28.5543187 8.45470893,29 8.9999602,29 L24.0000398,29 C24.5523026,29 25,28.5550537 25,28.0066023 L25,11 L20.9979131,11 C19.8944962,11 19,10.1134452 19,8.99408095 L19,4 L19,4 Z M20,4.5 L20,8.99121523 C20,9.54835167 20.4506511,10 20.9967388,10 L24.6999512,10 L20,4.5 L20,4.5 Z M10,17 L10,27 L23,27 L23,17 L10,17 L10,17 Z M14,21 C14.5522848,21 15,20.5522848 15,20 C15,19.4477152 14.5522848,19 14,19 C13.4477152,19 13,19.4477152 13,20 C13,20.5522848 13.4477152,21 14,21 L14,21 Z" /></g></g></svg>
    )
}

export function Kite(props: IconProps) {
    return (
        <svg fill="currentColor" height={props.height} width={props.width} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve"><g strokeWidth="0"></g><g strokeLinecap="round" strokeLinejoin="round"></g><g > <g> <g> <polygon points="227.256,27.846 184.071,295.593 339.537,140.126 "></polygon> </g> </g> <g> <g> <polygon points="371.874,172.463 216.407,327.929 484.154,284.744 "></polygon> </g> </g> <g> <g> <polygon points="264.084,0 371.874,107.79 479.664,0 "></polygon> </g> </g> <g> <g> <polygon points="404.21,140.126 512,247.916 512,32.336 "></polygon> </g> </g> <g> <g> <path d="M161.684,317.979c-14.539,14.539-25.84,15.794-42.946,17.695c-19.76,2.197-44.35,4.928-70.232,30.811 c-25.884,25.882-28.615,50.473-30.811,70.232C15.794,453.822,14.539,465.124,0,479.664L32.336,512 c25.882-25.882,28.614-50.473,30.811-70.232c1.901-17.105,3.155-28.407,17.695-42.946c14.539-14.539,25.84-15.794,42.946-17.695 c19.76-2.197,44.35-4.928,70.232-30.811L161.684,317.979z"></path> </g> </g> </g></svg>
    );
}

export function Plus(props: IconProps) {
    return (
        <svg className={props.iconClassName} fill="currentColor" width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M11.5 0c6.347 0 11.5 5.153 11.5 11.5s-5.153 11.5-11.5 11.5-11.5-5.153-11.5-11.5 5.153-11.5 11.5-11.5zm0 1c5.795 0 10.5 4.705 10.5 10.5s-4.705 10.5-10.5 10.5-10.5-4.705-10.5-10.5 4.705-10.5 10.5-10.5zm.5 10h6v1h-6v6h-1v-6h-6v-1h6v-6h1v6z" /></svg>
    );
}

export function ErrorIcon(props: IconProps) {
    return (
        <svg className={props.iconClassName} fill="currentColor" width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z" /></svg>
    );
}

export function WarningIcon(props: IconProps) {
    return (
        <svg className={props.iconClassName} fill="currentColor" width={props.width} height={props.height} clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12.002 21.534c5.518 0 9.998-4.48 9.998-9.998s-4.48-9.997-9.998-9.997c-5.517 0-9.997 4.479-9.997 9.997s4.48 9.998 9.997 9.998zm0-1.5c-4.69 0-8.497-3.808-8.497-8.498s3.807-8.497 8.497-8.497 8.498 3.807 8.498 8.497-3.808 8.498-8.498 8.498zm0-6.5c-.414 0-.75-.336-.75-.75v-5.5c0-.414.336-.75.75-.75s.75.336.75.75v5.5c0 .414-.336.75-.75.75zm-.002 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" fillRule="nonzero"/></svg>
    );
}

export function SuccessIcon(props: IconProps) {
    return (
        <svg className={props.iconClassName} fill="currentColor" width={props.width} height={props.height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm7 7.457l-9.005 9.565-4.995-5.865.761-.649 4.271 5.016 8.24-8.752.728.685z"/></svg>
    )
}

export function InfoIcon(props: IconProps) {
    return (
        <svg className={props.iconClassName} fill="currentColor" width={props.width} height={props.height} clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm0 6.5c-.414 0-.75.336-.75.75v5.5c0 .414.336.75.75.75s.75-.336.75-.75v-5.5c0-.414-.336-.75-.75-.75zm-.002-3c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1z" fillRule="nonzero"/></svg>
    )
}

export function StatusIcon(props: IconProps & {status: "info"|"success"|"warning"|"danger"}) {
    if (props.status === "warning") {
        return <WarningIcon {...props} />
    } else if (props.status === "danger") {
        return <ErrorIcon {...props} />
    } else if (props.status === "info") {
        return <InfoIcon {...props} />
    } else if (props.status === "success") {
        return <SuccessIcon {...props} />
    }
}

export function Search(props: IconProps) {
    return (
        <svg
            aria-hidden="true"
            className={props.iconClassName}
            fill="none"
            width={props.width}
            height={props.height}
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
        </svg>
    );
}

export const PlusButton = generateIconButton(Plus, {
    width: "24",
    height: "24",
    className: "color-active badge transition-all hover:scale-125 flex",
    textFacing: "left"
});
export const SearchButton = generateIconButton(Search, {
    width: "",
    height: "",
    iconClassName: "w-5 h-5 text-gray-500 dark:text-gray-400"
});
export const UserButton = generateIconButton(User, {
    width: "30",
    height: "30",
    className: "hover:scale-125 transition-all"
});
export const TrashButton = generateIconButton(Trash, {
    width: "20",
    height: "20",
    className: "hover:text-red-600 transition-all hover:scale-125 flex"
});
export const EditButton = generateIconButton(Edit, {
    width: "20",
    height: "20",
    className: "hover:text-blue-600 transition-all hover:scale-125 flex"
});
export const BackButton = generateIconButton(Back, {
    width: "20",
    height: "20",
    className: "hover:scale-125 transition-all hover:underline flex",
    textFacing: "right"
});
export const XButton = generateIconButton(X, {
    width: "20",
    height: "20",
    className: "hover:text-red-600 transition-all hover:scale-125 flex",
    textFacing: "left"
});
export const KiteButton = generateIconButton(Kite, {
    width: "40",
    height: "40",
    textFacing: "right",
    className: "flex"
});

export const InfoButton = generateIconButton(InfoIcon, {
    width: "24",
    height: "24",
    textFacing: "right",
    className: "hover:text-blue-600 transition-all hover:scale-125 flex"
})