import { Timestamp } from "@firebase/firestore-types";

export interface TGFormData {
  day: string;
  expense: number | null;
  createdOn: Timestamp;
}

export interface Expense {
  day: string;
  expense: number | null;
  createdOn: Timestamp;
}
