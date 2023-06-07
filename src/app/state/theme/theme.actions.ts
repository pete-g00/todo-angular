import { createAction, props } from "@ngrx/store";
import { AppTheme } from "./theme.reducer";

export const updateTheme = createAction(
    "[theme] update theme",
    props<{theme: AppTheme}>()
)