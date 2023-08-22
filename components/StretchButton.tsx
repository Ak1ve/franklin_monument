import classNames from "classnames";
import React from "react";
import { ReactElement, useState } from "react";


export interface StretchButtonProps extends Omit<React.HTMLProps<HTMLButtonElement>, "className"> {
    containerClass?: string,
    initialState?: boolean,
    buttonClass?: string
}

export default function StretchButton(props: StretchButtonProps) {
    const [isLong, setIsLong] = useState(props.initialState);
    const barClasses = classNames("stretch-bar", props.buttonClass, {
        "animate-condense": !isLong,
        "animate-stretch": isLong
    });

    const buttonClasses = classNames("stretch-button", props.buttonClass, {
        "animate-right": isLong,
        "animate-translate-normal": !isLong
    });
    return (
        <div className={classNames("flex w-full", props.containerClass)} onClick={() => {(props.onClick as any)(); setIsLong(x => !x)}}>
            <div className={barClasses} >
                ​
            </div>
            <button className={buttonClasses}>
                {props.children}
            </button>
        </div>
    );

}