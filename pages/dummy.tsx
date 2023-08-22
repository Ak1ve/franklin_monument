"use client";
import { listCard } from "@/utilities/listcard";
import { useEffect, useState } from "react";
import { FinancialSummary } from "./reports";
import { FinancialReport } from "@/data/models/reports";
import { useRouter } from "next/router";
import { useImmer } from "use-immer";
import { BasicInput } from "@/utilities/form";



const ReportData = listCard(FinancialReport, ({
    data, isLoading
}) => {
    if (isLoading) {
        return <>Loading</>
    }
    return <>{JSON.stringify(data)}</>;
});


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
}, false);

export function Report() {
    const [showReport, setShowReport] = useState(false);
    const immerHook = useImmer({
        startDate: "",
        endDate: ""
    });
    const [refresh, setRefresh] = useState(false);
    const { push, query } = useRouter();
    const onLoad = () => {
        push({ query: { ...query, ...immerHook[0] } }).then(x => {
            setShowReport(true);
            setRefresh(!refresh);
        })
    };
    return (<>
        <BasicInput prop="startDate" label="" hook={immerHook} />
        <BasicInput prop="endDate" label="" hook={immerHook} />
        <button onClick={onLoad}>LOAD</button>
        {
            showReport && <ReportData key={refresh ? 1 : 0} />
        }
    </>)
}