"use client";
import { listCard } from "@/utilities/listcard";
import { FinancialReport } from "@/data/models/reports";
import { useImmer } from "use-immer";
import { BasicInput } from "@/utilities/form";
import { useState } from "react";
import UserSelect from "@/components/UserSelect";

export default function Dummy() {
    const hook = useImmer({
        user: null
    });
    return <UserSelect hook={hook} prop="user" label="User"/>
}