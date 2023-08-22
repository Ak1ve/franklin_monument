import classNames from "classnames";
import { ReactNode } from "react";


export default function Collapse({visible, children, className}: {visible: boolean, children: ReactNode, className?: string}) {
    const cls = classNames({
        "hidden": !visible,
        "animate-fade-in": visible,
    }, className);
    return (
        <div className={cls}>
            {children}
        </div>
    );
}