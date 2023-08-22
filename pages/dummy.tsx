"use client";
import { listCard } from "@/utilities/listcard";
import { FinancialReport } from "@/data/models/reports";
import { useImmer } from "use-immer";
import { BasicInput } from "@/utilities/form";
import { useState } from "react";


export default listCard(FinancialReport, ({data, isLoading, refresh, query, loadingMessage}) => {
    const [showReport, setShowReport] = useState(false);
    const immerHook = useImmer({
        startDate: "",
        endDate: ""
    });
    const onLoad = () => {
        query((query) => ({...query, ...immerHook[0]})).then(x => {
            setShowReport(true);
            refresh();
        })
    };
    return (<>
        <BasicInput prop="startDate" label="" hook={immerHook} />
        <BasicInput prop="endDate" label="" hook={immerHook} />
        <button onClick={onLoad}>LOAD</button>
        { isLoading && showReport && loadingMessage}
        {!isLoading && showReport && <>{JSON.stringify(data)}</>}
    </>)
}, false, false);