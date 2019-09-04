import {createStandardAction} from "typesafe-actions";
import {RootState} from "./store";

export const uploadState = createStandardAction('UPLOAD_STATE')<RootState>();