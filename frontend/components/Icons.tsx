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
        const defaultedProps = {...defaultProps, ...componentProps};
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
        <svg xmlns="http://www.w3.org/2000/svg" className={props.iconClassName} width={props.width} height={props.height} fill="currentColor" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" /> </svg>
    );
}

export function Edit(props: IconProps) {
    return (
        <svg className={props.iconClassName} fill="none" height={props.height} width={props.width} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
    );
}

export function Back(props: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={props.iconClassName} width={props.width} height={props.height} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1" /> </svg>
    );
}

export function User(props: IconProps) {
    return (
        <svg className={props.iconClassName}  width={props.width} height={props.height} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g data-name="Layer 7" id="Layer_7"><path d="M19.75,15.67a6,6,0,1,0-7.51,0A11,11,0,0,0,5,26v1H27V26A11,11,0,0,0,19.75,15.67ZM12,11a4,4,0,1,1,4,4A4,4,0,0,1,12,11ZM7.06,25a9,9,0,0,1,17.89,0Z"/></g></svg>
    )
}

export function X(props: IconProps) {
    return (
        <svg className={props.iconClassName} height={props.height} viewBox="0 0 16 16" width={props.width} xmlns="http://www.w3.org/2000/svg"><polygon points="8 9.414 3.707 13.707 2.293 12.293 6.586 8 2.293 3.707 3.707 2.293 8 6.586 12.293 2.293 13.707 3.707 9.414 8 13.707 12.293 12.293 13.707 8 9.414"/></svg>
    )
}

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
})