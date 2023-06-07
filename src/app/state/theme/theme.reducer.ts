import { createReducer, on } from "@ngrx/store";
import { updateTheme } from "./theme.actions";

export type AppTheme = "light" | "dark";

export const themeReducer = createReducer<AppTheme>(
    "dark",
    on(updateTheme, (_, { theme }) => theme)
)
