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
        const { width, height, iconClassName, children, textFacing, addClass, ...buttonProps } = defaultedProps;
        if (addClass !== undefined) {
            buttonProps.className = classNames(buttonProps.className, addClass);
        }
        if (textFacing === "left") {
            return (
                <button {...buttonProps} type="button">
                    {children} {component({ width, height, iconClassName })}
                </button>
            );
        }
        return (
            <button {...buttonProps} type="button">
                {component({ width, height, iconClassName })} {children}
            </button>
        )
    }
    func.DEFAULT = defaultProps;
    return func;
}

export function Trash(props: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={props.iconClassName} width={props.width || "16"} height={props.height || "16"} fill="currentColor" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" /> </svg>
    );
}

export function Edit(props: IconProps) {
    return (
        <svg className={props.iconClassName} fill="none" height={props.height} width={props.width} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
    );
}

export const TrashButton = generateIconButton(Trash, {
    width: "20",
    height: "20",
    className: "hover:text-red-600 transition-all hover:scale-125"
});

export const EditButton = generateIconButton(Edit, {
    width: "20",
    height: "20",
    className: "hover:text-blue-600 transition-all hover:scale-125"
});