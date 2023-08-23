import { useEffect, useState } from "react";
import { InfoButton, StatusIcon } from "./Icons";
import { useImmer } from "use-immer";
import getRandomPass from "@/utilities/words";
import { BasicInput } from "@/utilities/form";
import { UseStateHook } from "@/utilities/api";

const dummy =
    "bg-red-50 bg-red-500 hover:bg-red-600 disabled:hover:bg-red-500 text-red-900 border-red-400"
    || "bg-yellow-50 bg-yellow-500 hover:bg-yellow-600 disabled:hover:bg-yellow-500 text-yellow-900 border-yellow-400"
    || "bg-green-50 bg-green-500 hover:bg-green-600 disabled:hover:bg-green-500 text-green-900 border-green-400"
    || "bg-sky-50 bg-sky-500 hover:bg-sky-600 disabled:hover:bg-gray-500 text-sky-900 border-sky-400"
    || "bg-gray-100 hover:bg-gray-200 disabled:hover:bg-gray-500 text-gray-800 border-gray-400";


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
    width?: string
    hook: UseStateHook<boolean>
    fullChild?: boolean
}

export function getColor(type: MessageProps["type"]): "red" | "sky" | "green" | "yellow" {
    return { danger: "red", info: "sky", success: "green", warning: "yellow" }[type] as any;
}

export default function Message({ title, children, type, buttons, width, hook, fullChild }: MessageProps) {
    const color = getColor(type);
    if (!hook || !hook[0]) {
        return <></>;
    }
    return (
        <div className="justify-center items-center flex fixed inset-0 z-50 outline-none focus:outline-none">
            <div className={"w-full mx-auto relative " + (width || "md:w-1/3")}>
                <div className="relative flex flex-col p-5 rounded-lg bg-white shadow shadow-gray-200 drop-shadow-xl outline outline-1 outline-gray-300">
                    <div className="flex flex-col items-center text-center">
                        <div className={`inline-block p-4 bg-${color}-50 rounded-full`}>
                            <StatusIcon status={type} iconClassName={`w-12 h-12 fill-current text-${color}-500`} />
                        </div>
                        <h2 className="mt-2 font-semibold text-gray-800">{title}</h2>
                        <div className={"mt-2 text-sm text-gray-600 leading-relaxed" + fullChild && "w-full"}>{children}</div>
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
    }]} fullChild={props.fullChild} />
}

export function StandardInfo(props: Omit<MessageProps, "title" | "button" | "type"> & {
    info?: string,
    dismiss?: string,
    onDismiss?: () => any
    continue?: string
    onContinue?: () => any
}) {
    return <StandardMessage title={props.info || "Info"} type="info" actions={[
        {
            content: props.dismiss || "Dismiss",
            action: props.onDismiss || (() => props.hook[1](false))
        },
        {
            content: props.continue || "Continue",
            action: props.onContinue || (() => props.hook[1](false))
        }
    ]}  {...props} />
}

export function StandardConfirm(props: Omit<MessageProps, "title" | "button" | "type"> & {
    title?: string
    cancel?: string,
    confirm?: string,
    onCancel?: () => any,
    onConfirm: () => any
}) {
    const title = props.title || "Do you want to continue";
    return (<StandardMessage type="danger" title={title} actions={[
        {
            content: props.cancel || "Cancel",
            action: props.onCancel || (() => props.hook[1](false))
        },
        {
            content: props.confirm || "Confirm",
            action: props.onConfirm
        }
    ]} {...props} />);
}

export function StandardDelete(props: Omit<MessageProps, "title" | "button" | "type"> & {
    title?: string
    cancel?: string,
    onCancel?: () => any,
    onDelete: () => any,
    type?: MessageProps["type"]
}) {
    return (
    <StandardConfirm title="Are you sure you want to delete?" fullChild onConfirm={props.onDelete} {...props} confirm="Delete" width="md:w-1/2">
        <div className="text-left">{props.children}</div>
    </StandardConfirm>)
}

export function StandardImportantConfirm(props: Omit<MessageProps, "title" | "button" | "type"> & {
    title?: string
    cancel?: string,
    confirm?: string,
    onCancel?: () => any,
    onConfirm: () => any
}) {
    const inputHook = useImmer({
        input: "",
        required: "*****************************************************************************"
    });
    useEffect(() => {
        inputHook[1](x => { x.required = getRandomPass() });
    }, []);

    const buttons = (
        <>
            <MessageButton color="base" onClick={props.onCancel || (() => props.hook[1](false))}>
                {props.cancel || "Cancel"}
            </MessageButton>
            <MessageButton color="red" onClick={props.onConfirm} disabled={inputHook[0].input !== inputHook[0].required}>
                {props.confirm || "Confirm"}
            </MessageButton>
        </>
    )
    return (
        <Message title={props.title || "Are you sure?"} type="danger" buttons={buttons} width={props.width} hook={props.hook} fullChild={props.fullChild}>
            {props.children}
            <br /><br />Type the following key to confirm:<br />
            <b className="select-none">{inputHook[0].required}</b>
            <BasicInput label="" prop="input" hook={inputHook} placeholder="type..." />
        </Message>
    )
}


export function AdditionalInfo({ info, children, width }: any) {
    const hook = useState(false);
    return (<>
        <StandardInfo continue="Okay" width={width || "md:w-8/12"} info={info || "Additional Info"} hook={hook}>
            {children}
        </StandardInfo>

        <InfoButton addClass="text-xs mx-auto self-center" width="15" height="15" onClick={() => hook[1](true)}>What's this?</InfoButton>
    </>);
}