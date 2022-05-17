import delegate from "json-logic-js";

const operators = {
    fn: (impl /* function */, ...params) => {
        return impl.apply(undefined, params);
    },
    mergeObjects: (object1, object2) => ({ ...object1, ...object2 }),
};

Object
    .keys(operators)
    .forEach(name => delegate.add_operation(name, operators[name]));

export default {
    apply: delegate.apply,
};
