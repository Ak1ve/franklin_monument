import { useEffect, useState } from "react";
import { StatusIcon } from "./Icons";
import { useImmer } from "use-immer";
import getRandomPass from "@/utilities/words";
import { BasicInput } from "@/utilities/form";

const dummy =
    "bg-red-50 bg-red-500 hover:bg-red-600 disabled:hover:bg-red-500 text-red-900"
    || "bg-yellow-50 bg-yellow-500 hover:bg-yellow-600 disabled:hover:bg-yellow-500 text-yellow-900"
    || "bg-green-50 bg-green-500 hover:bg-green-600 disabled:hover:bg-green-500 text-green-900"
    || "bg-sky-50 bg-sky-500 hover:bg-sky-600 disabled:hover:bg-gray-500 text-sky-900"
    || "bg-gray-100 hover:bg-gray-200 disabled:hover:bg-gray-500 text-gray-800";


export interface MessageButtonProps extends Omit<React.HTMLProps<HTMLButtonElement>, "className"> {
    color: "red" | "yellow" | "green" | "sky" | "base"
}

export function MessageButton(props: MessageButtonProps) {
    const colorClasses = props.color === "base" ? "bg-gray-100 hover:bg-gray-200 text-gray-800" : `bg-${props.color}-500 hover:bg-${props.color}-600 disabled:hover:bg-${props.color}-500 text-${props.color}-900`;

    const { color, ...rest } = props;
    return (
        <button type={"button" as any} className={"flex-1 px-4 py-2 text-sm font-medium hover:scale-105 disabled:hover:scale-100 disabled:opacity-40 rounded-xl " + colorClasses} {...rest} />
    )
}

export interface MessageProps {
    title: string,
    type: "danger" | "warning" | "success" | "info"
    buttons?: JSX.Element
    children: any
}

function getColor(type: MessageProps["type"]): "red" | "sky" | "green" | "yellow" {
    return { danger: "red", info: "sky", success: "green", warning: "yellow" }[type] as any;
}

export default function Message({ title, children, type, buttons }: MessageProps) {
    const color = getColor(type);
    return (
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-hidden fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="w-full md:w-1/3 mx-auto ">
                <div className="flex flex-col p-5 rounded-lg bg-white shadow shadow-gray-200 drop-shadow-xl outline outline-1 outline-gray-300">
                    <div className="flex flex-col items-center text-center">
                        <div className={`inline-block p-4 bg-${color}-50 rounded-full`}>
                            <StatusIcon status={type} iconClassName={`w-12 h-12 fill-current text-${color}-500`} />
                        </div>
                        <h2 className="mt-2 font-semibold text-gray-800">{title}</h2>
                        <div className="mt-2 text-sm text-gray-600 leading-relaxed">{children}</div>
                    </div>

                    <div className="flex items-center mt-3">
                        {buttons}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function StandardMessage(props: Omit<MessageProps, "buttons"> & {
    actions: Array<{
        content: string,
        action: () => any
    }>
}) {
    const buttons = (<>
        {props.actions.map((val, i) => (
            <MessageButton color={i !== props.actions.length - 1 || props.actions.length === 1 ? "base" : getColor(props.type)} key={i} onClick={val.action}>
                {val.content}
            </MessageButton>
        ))}
    </>)
    return (
        <Message {...props} buttons={buttons} />
    )
}


export function StandardError(props: Omit<MessageProps, "title" | "button" | "type"> & {
    error?: string,
    ok?: string,
    onOk: () => any
}) {
    const title = props.error ? "Error: " + props.error : "Error"
    return <StandardMessage title={title} {...props} type="danger" actions={[{
        content: props.ok || "Okay",
        action: props.onOk
    }]} />
}

export function StandardInfo(props: Omit<MessageProps, "title" | "button" | "type"> & {
    info?: string,
    dismiss?: string,
    onDismiss?: () => any
    continue?: string
    onContinue: () => any
}) {
    const [showInfo, setShowInfo] = useState(true);
    if (!showInfo) {
        return <></>;
    }
    return <StandardMessage title={props.info || "Info"} type="info" actions={[
        {
            content: props.dismiss || "Dismiss",
            action: props.onDismiss || (() => setShowInfo(false))
        },
        {
            content: props.continue || "Continue",
            action: props.onContinue
        }
    ]}  {...props} />
}

export function StandardConfirm(props: Omit<MessageProps, "title" | "button" | "type"> & {
    title?: string
    cancel?: string,
    confirm?: string,
    onCancel: () => any,
    onConfirm: () => any,
    type?: MessageProps["type"]
}) {
    const title = props.title || "Do you want to continue";
    return (<StandardMessage type="danger" title={title} actions={[
        {
            content: props.cancel || "Cancel",
            action: props.onCancel
        },
        {
            content: props.confirm || "Confirm",
            action: props.onConfirm
        }
    ]} {...props} />);
}

export function StandardImportantConfirm(props: Omit<MessageProps, "title" | "button" | "type"> & {
    title?: string
    cancel?: string,
    confirm?: string,
    onCancel: () => any,
    onConfirm: () => any
}) {
    const inputHook = useImmer({
        input: "",
        required: "*****************************************************************************"
    });
    useEffect(() => {
        inputHook[1](x => {x.required = getRandomPass()});
    }, []);

    const buttons = (
        <>
            <MessageButton color="base" onClick={props.onCancel}>
                {props.cancel || "Cancel"}
            </MessageButton>
            <MessageButton color="red" onClick={props.onConfirm} disabled={inputHook[0].input !== inputHook[0].required}>
                {props.confirm || "Confirm"}
            </MessageButton>
        </>
    )
    return (
        <Message title={props.title || "Are you sure?"} type="danger" buttons={buttons}>
            {...props.children}
            <br/><br/>Type the following key to confirm:<br/>
            <b className="select-none">{inputHook[0].required}</b>
            <BasicInput label="" prop="input" hook={inputHook} placeholder="type..."/>
        </Message>
    )
}