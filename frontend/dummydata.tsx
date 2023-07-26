import { CatalogedItem } from "./models/CatalogedItem";
import { CatalogedTask } from "./models/Tasks";

export const catalogedTasks: CatalogedTask[] = [
  {
    id: "1",
    label: "Purchase",
    description: "Purchase stone from mason on 42nd Street.",
    isDeleted: false,
  },
  {
    id: "2",
    label: "Cut",
    description: "Use the stonecutter to shape stone to meet specification.",
    isDeleted: false,
  },
  {
    id: "3",
    label: "Etch",
    description: "Ensure the requested text is correct and etch into stone",
    isDeleted: false,
  },
  {
    id: "4",
    label: "Finishing Touches",
    description: "Polish the stone and make any last finishing touches.",
    isDeleted: false,
  },
  {
    id: "5",
    label: "Delivery",
    description: "Transport the finished item to desired destination.",
    isDeleted: false,
  },
];

export const catalogedItems: CatalogedItem[] = [
  {
    id: 5,
    type: "Type",
    subType: "Subtype",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pulvinar nibh ac tristique porta. Proin ante nunc, mattis vel diam quis, aliquet dignissim tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam cursus erat.",
    commissionable: true,
    sizeable: true,
    options: [],
    tasks: catalogedTasks,
    isDeleted: false,
  },
  {
    id: 2,
    type: "Type2",
    subType: "Subtype2",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pulvinar nibh ac tristique porta. Proin ante nunc, mattis vel diam quis, aliquet dignissim tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam cursus erat.",
    commissionable: true,
    sizeable: true,
    options: [],
    tasks: catalogedTasks,
    isDeleted: false,
  },
];
