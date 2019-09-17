import {createStandardAction} from "typesafe-actions";
import {RootState} from "./root-state";

export const uploadState = createStandardAction('UPLOAD_STATE')<RootState>();