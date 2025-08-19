import { ValidationErrors } from "@angular/forms";

export type ErrorMessageConfig = Record<
    string,
    (error: ValidationErrors) => string
>;
