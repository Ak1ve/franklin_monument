import { StandardButton, StandardInput } from "@/components/Inputs";
import { formComponent } from "@/data/form"
import { HelloType } from "@/data/models/testing"
import { Data, ModelSchema } from "@/data/schema"
import { BasicInput } from "@/utilities/form";



export const Hello = formComponent(HelloType, ({ register, errors, stateHook, form }) => {
    return (
        <h2>
            <BasicInput label="Name" {...register("name")}/>
            <BasicInput label="Goose" type="number" {...register("goose")} />
            <StandardButton onClick={() => {form.post()}}>{stateHook[0]?.name}</StandardButton>
        </h2>
    );
});

module.exports = Hello;
