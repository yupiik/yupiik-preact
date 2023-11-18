import { simpleRegistry } from "@yupiik/dynamic";
import { CustomForm } from "./Form";

export const customRegistry = simpleRegistry({
    Form: CustomForm,
});
