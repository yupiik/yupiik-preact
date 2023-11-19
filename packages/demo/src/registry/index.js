import { simpleComponent, simpleRegistry } from "@yupiik/dynamic";
import { CustomForm } from "./Form";
import { JsonRpcDataLoader } from "./JsonRpcDataLoader";

export const customRegistry = simpleRegistry({
    Form: CustomForm,
    JsonRpcDataLoader: simpleComponent(JsonRpcDataLoader),
});
