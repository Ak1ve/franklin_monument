import { ModelSchema, getRouteParams } from "@/data/schema";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { EndpointError } from "./endpoint";
import { StandardError, StandardInfo } from "@/components/message";
import Navbar from "@/components/Navbar";

export interface ListCardProps<D> {
    data: D
    isLoading: boolean
    endpointError: EndpointError | null
    loadingMessage: any
    query: (callback: (query: Object) => Object) => Promise<boolean>
    refresh: () => void
}


export function listCard<D>(schema: ModelSchema<D>, component: (props: ListCardProps<D>) => JSX.Element, fetchOnDock: boolean = true, navBase: boolean = true): () => JSX.Element {

    return () => {
        const sessionStatus = useSession({ required: true }).status;
        const [data, setData] = useState(null as D);
        const [endpointError, setEndpointError] = useState(null as EndpointError | null);
        const router = useRouter();
        const showInfoHook = useState(false);
        const refreshHook = useState(false);
        const [fetched, setFetched] = useState(false);
        useEffect(() => {
            if (!fetchOnDock && !fetched) {
                setFetched(true);
                return;
            }
            setFetched(true);
            schema.route.get!(getRouteParams({
                router, schema,
                onSuccess(success) {
                    setData(success.data || null!);
                    // After 5 seconds, show the info screeen
                },
                onError(err) {
                    if (err.error.type === "Network") {
                        (err.error.error.info as any).then((x: EndpointError) => {
                            setEndpointError(x);
                        });
                    }
                }
            }))
        }, [refreshHook[0]]);
        setTimeout(() => showInfoHook[1](true), 5000);

        const isLoading = sessionStatus === "loading" || data === null

        if (endpointError !== null) {
            const isPermError = endpointError.type === "Permission";
            return (<>
                {navBase && <Navbar active="******" />}
                <StandardError ok="Back to Dashboard" onOk={() => { router.push("/dashboard") }}
                    error={isPermError ? "Not Allowed" : endpointError.type} hook={[true, () => { }]}>
                    {
                        isPermError ? (<>
                            You are not allowed to view this page. If this is a mistake, contact
                            an administrator.  If you were recently granted permission to view this page,
                            please wait 5-10 minutes before attempting to load again.<br /><br />Additional information: {endpointError.error}
                        </>) :
                            (<>
                                An unknown error has occured while loading this page.  Please ensure that your account
                                has been set up correctly.<br /><br />Additional informaiton: ${endpointError.error}
                            </>)
                    }
                </StandardError>
            </>);
        }

        const query = (callback: (query: Object) => Object) => {
            return router.push({query: callback(router.query as any) as any});
        }

        const refresh = () => {
            refreshHook[1]((x) => !x);
        }

        return component(
            {
                data,
                isLoading,
                loadingMessage: (<>
                    {navBase && <Navbar active="******" />}
                    <StandardInfo info="Loading page..." continue="Back To Dashboard" onContinue={() => router.push("/dashboard")} hook={showInfoHook}>
                        This page is currently loading.  If this page loads for too long, ensure the system is working properly.  It is
                        possible the data is taking a while to load, or there is an error with how the data is setup.
                        <br />If you can't currently access this page, you can navigate back to the dashboard.
                    </StandardInfo>
                </>),
                endpointError: endpointError,
                query,
                refresh
            }
        );
    };
}