import { CatalogedTask } from "./Tasks";

export interface ItemOptionValue {
  id: string | number;
  label: string;
  subtext: string;
  isDeleted: boolean;
}

export interface ItemOption {
  id: string | number;
  key: string;
  allowNull: boolean;
  allowMulti: boolean;
  isDeleted: boolean;
  values: ItemOptionValue[];
}

export interface CatalogedItem {
  id: number | string;
  type: string;
  subType: string;
  description: string;
  commissionable: boolean;
  sizeable: boolean;
  options: ItemOption[];
  tasks: CatalogedTask[];
  isDeleted: boolean;
  payments?: Payment[];
}

export interface Payment {
  id: number;
  amount: number;
  paymentDate: Date;
  paymentType: "cash" | "card" | "check";
  notes: string;
}
