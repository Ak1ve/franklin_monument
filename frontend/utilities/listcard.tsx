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
}

export function listCard<D>(schema: ModelSchema<D>, component: (props: ListCardProps<D>) => JSX.Element, loadingComponent?: JSX.Element, base?: JSX.Element): () => JSX.Element {
    return () => {
        const sessionStatus = useSession({ required: true }).status;
        const [data, setData] = useState(null as D);
        const [endpointError, setEndpointError] = useState(null as EndpointError | null);
        const router = useRouter();
        useEffect(() => {
            schema.route.get!(getRouteParams({
                router, schema,
                onSuccess(success) {
                    setData(success.data || null!);
                },
                onError(err) {
                    if (err.error.type === "Network") {
                        err.error.error.info.then((x: EndpointError) => {
                            setEndpointError(x);
                        });
                    }
                }
            }))
        }, []);

        const isLoading = sessionStatus === "loading" || data === null

        if (endpointError !== null) {
            const isPermError = endpointError.type === "Permission";
            return (<>
                {base || <Navbar active="******" />}
                <StandardError ok="Back to Dashboard" onOk={() => { router.push("/dashboard") }}
                    error={isPermError ? "Not Allowed" : endpointError.type}>
                    {
                        isPermError ? (<>
                            You are not allowed to view this page. If this is a mistake, contact
                            an administrator.  If you were recently granted permission to view this page,
                            please wait 5-10 minutes before attempting to load this page.<br /><br />Additional information: {endpointError.error}
                        </>) :
                            (<>
                                An unknown error has occured while loading this page.  Please ensure that your account
                                has been set up correctly.<br /><br />Additional informaiton: ${endpointError.error}
                            </>)
                    }
                </StandardError>
            </>);
        }

        if (isLoading) {
            if (loadingComponent) {
                return loadingComponent;
            }
            return (<>
                {base || <Navbar active="****" />}
                <StandardInfo info="Loading page..." continue="Back To Dashboard" onContinue={() => router.push("/dashboard")}>
                    Currently loading the page.  If this page loads for too long, ensure the system is working properly.  
                    <br/>If you can't currently access this page, you can navigate back to the dashboard.
                </StandardInfo>
            </>);
        }

        return component(
            {
                data,
                isLoading,
                endpointError: endpointError
            }
        );
    };
}