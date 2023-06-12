import React from "react";
import { ButtonTypes, StandardButton } from "./Inputs";


export interface ModalProps {
    showModal: boolean,
    title: string,
    footer: any,
    children?: any,
    onExit?: () => any;
}

export default function Modal(props: ModalProps) {
    return (
        <>
            {props.showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-scroll fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative my-6 mx-auto w-7/12">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t-3xl">
                                    <h3 className="text-2xl font-semibold">
                                        {props.title}
                                    </h3>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={props.onExit}
                                    >
                                        <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                                            x
                                        </span>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="p-10 w-full overflow-y-scroll h-96">
                                    {props.children}
                                </div>
                                <hr />
                                {/*footer*/}
                                <div className="p-5 w-full">
                                    {props.footer}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    );
}


export interface DefaultModalProps extends Omit<ModalProps, "footer" | "onExit"> {
    onSubmit?: () => any,
    onCancel?: () => any
}

export function StandardModal(props: DefaultModalProps) {
    const footer = (
        <div className="flex justify-end">
            <StandardButton className="mr-2" type={ButtonTypes.DANGER} onClick={props.onCancel}>Cancel</StandardButton>
            <StandardButton type={ButtonTypes.ACTIVE} onClick={props.onSubmit}>Submit</StandardButton>
        </div>
    );
    return (
        <Modal showModal={props.showModal} footer={footer} title={props.title} onExit={props.onCancel}>
            {props.children}
        </Modal>
    )
}

export interface ModalSectionProps {
    header: string | any
    children?: any
}

export function ModalSection(props: ModalSectionProps) {
    return (
        <>
            <h3 className="text-xl">{props.header}</h3>
            <hr className="mb-3" />
            <div className="mb-8">
                {props.children}
            </div>
        </>
    );
}