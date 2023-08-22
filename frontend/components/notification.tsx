import { UseStateHook } from "@/utilities/api";
import { useEffect, useState } from "react";
import { getColor } from "./message";
import { StatusIcon } from "./Icons";


export interface NotificationProps extends React.HTMLProps<HTMLDivElement> {
    hook: UseStateHook<boolean>
    dismissAfter?: number | "never" /// Default is 5,000 ms
    type: "danger" | "warning" | "success" | "info"
};

export default function Notification(props: NotificationProps) {
    useEffect(() => {
        if (props.hook[0] && props.dismissAfter !== "never") {
            setTimeout(() => {props.hook[1](false)}, props.dismissAfter || 5000);
        }
    }, [props.hook[0]]);
    if (!props.hook[0]) {
        return <></>;
    }
    const color = getColor(props.type);
    return (
        <div className={`bg-${color}-50 border border-${color}-400 rounded text-${color}-800 border-1 shadow shadow-gray-200 drop-shadow-xl p-3 flex justify-between fixed -bottom-10 z-50 w-10/12 animate-up rounded-xl`}>
            {/* "bg-red-50 bg-red-500 hover:bg-red-600 disabled:hover:bg-red-500 text-red-900" */}
            <div>
                <div className="flex items-center">
                    <StatusIcon status={props.type} iconClassName={`w-8 fill-current mr-5 text-${color}-500`} />
                    {props.children}
                </div>
            </div>
            <div className="hover:cursor-pointer hover:scale-110 self-center" onClick={() => props.hook[1](false)}>
                X
            </div>
        </div>
    )
}