import { StandardSelectProps } from "@/components/Inputs"
import { BasicSelect, ElementFunc } from "@/utilities/form"
import { useEffect, useState } from "react"
import { UserSelectOptions } from "../data/models/user";
import { getter } from "../data/route";
import Notification from "@/components/notification";

var cache = null;

const UserSelect: ElementFunc<Omit<StandardSelectProps, "onChange" | "value" | "options" | "label"> & {label?: string}> = (props) => {
    const [options, setOptions] = useState([] as UserSelectOptions);
    const notificationHook = useState(false);
    const setOpt = (x: any) => {
        setOptions(x);
        cache = x;
    }

    useEffect(() => {
        getter("/api/users/select").then(setOpt).catch(err => {
            notificationHook[1](true);
        })
    }, [])
    return (<>
        <BasicSelect label="Users" {...props} options={options} />
        <Notification hook={notificationHook} type="danger">
            Error: Could not fetch list of users...
        </Notification>
    </>);
}

export default UserSelect;