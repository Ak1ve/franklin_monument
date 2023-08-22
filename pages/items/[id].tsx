import Navbar from "@/components/Navbar";
import ItemForm from "@/forms/items/Item";
import { CatalogedItem } from "@/models/CatalogedItem";


/*
const item: CatalogedItem = {

};
*/

export default function CatalogedItemView({ }) {
    return (
        <div className="">
            <Navbar active="*****" />
            <ItemForm />
        </div>
    );
}