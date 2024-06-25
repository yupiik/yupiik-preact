import {
    rankWith,
    isStringControl,
    isNumberControl,
    isIntegerControl,
    isBooleanControl,
    isDateControl,
    isEnumControl,
    isObjectControl,
    isGroup,
    uiTypeIs,
} from '@jsonforms/core';
import {
    JsonFormsDispatch,
    withJsonFormsCellProps,
    withJsonFormsControlProps,
    withJsonFormsLabelProps,
    withJsonFormsLayoutProps,
} from '@jsonforms/react';

// NOTE: this is a bare minimum bootstrap impl, a lot of properties are missing, see material renderers

const BootstrapLabel = ({ uischema }) => {
    const { text } = uischema;
    return (
        <div className="form-group">
            <label>{text}</label>
        </div>
    );
};

const BootstrapInput = ({ data, handleChange, path, label }) => (
    <div className="form-group">
        <label htmlFor={path}>{label}</label>
        <input
            type="text"
            className="form-control"
            id={path}
            value={data || ''}
            onChange={ev => handleChange(path, ev.target.value)}
        />
    </div>
);
const BootstrapStringCell = ({ data, handleChange, path }) => (
    <input
        type="text"
        className="form-control"
        value={data || ''}
        onChange={ev => handleChange(path, ev.target.value)}
    />
);

const BootstrapNumber = ({ data, handleChange, path, label }) => (
    <div className="form-group">
        <label htmlFor={path}>{label}</label>
        <input
            type="number"
            className="form-control"
            id={path}
            value={data || ''}
            onChange={ev => handleChange(path, parseInt(ev.target.value, 10))}
        />
    </div>
);
const BootstrapNumberCell = ({ data, handleChange, path }) => (
    <input
        type="number"
        className="form-control"
        value={data || ''}
        onChange={ev => handleChange(path, parseInt(ev.target.value, 10))}
    />
);

const BootstrapBoolean = ({ data, handleChange, path, label }) => (
    <div className="form-check">
        <input
            type="checkbox"
            className="form-check-input"
            id={path}
            checked={data || false}
            onChange={ev => handleChange(path, ev.target.checked)}
        />
        <label className="form-check-label" htmlFor={path}>
            {label}
        </label>
    </div>
);
const BootstrapBooleanCell = ({ data, handleChange, path }) => (
    <input
        type="checkbox"
        className="form-check-input"
        checked={data || false}
        onChange={ev => handleChange(path, ev.target.checked)}
    />
);

const BootstrapDate = ({ data, handleChange, path, label }) => (
    <div className="form-group">
        <label htmlFor={path}>{label}</label>
        <input
            type="date"
            className="form-control"
            id={path}
            value={data || ''}
            onChange={ev => handleChange(path, ev.target.value)}
        />
    </div>
);
const BootstrapDateCell = ({ data, handleChange, path }) => (
    <input
        type="date"
        className="form-control"
        value={data || ''}
        onChange={ev => handleChange(path, ev.target.value)}
    />
);

const BootstrapEnum = ({ data, handleChange, path, label, schema }) => (
    <div className="form-group">
        <label htmlFor={path}>{label}</label>
        <select
            className="form-control"
            id={path}
            value={data || ''}
            onChange={ev => handleChange(path, ev.target.value)}
        >
            {schema.enum.map(option => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
);
const BootstrapEnumCell = ({ data, handleChange, path, schema }) => (
    <select
        className="form-control"
        value={data || ''}
        onChange={ev => handleChange(path, ev.target.value)}
    >
        {schema.enum.map(option => (
            <option key={option} value={option}>
                {option}
            </option>
        ))}
    </select>
);

const BootstrapHorizontalLayout = ({ uischema, schema, path, renderers }) => (
    <div className="form-row">
        {uischema.elements.map(element => (
            <div className="col" key={element.scope || element.label}>
                <JsonFormsDispatch
                    uischema={element}
                    schema={schema}
                    path={path}
                    renderers={renderers}
                />
            </div>
        ))}
    </div>
);

const BootstrapVerticalLayout = ({ uischema, schema, path, renderers }) => (
    <div className="form-group">
        {uischema.elements.map(element => (
            <div key={element.scope || element.label}>
                <JsonFormsDispatch
                    uischema={element}
                    schema={schema}
                    path={path}
                    renderers={renderers}
                />
            </div>
        ))}
    </div>
);

const BootstrapGroup = ({ uischema, schema, path, renderers }) => (
    <fieldset className="form-group">
        <legend>{uischema.label}</legend>
        {uischema.elements.map(element => (
            <div key={element.scope || element.label}>
                <JsonFormsDispatch
                    uischema={element}
                    schema={schema}
                    path={path}
                    renderers={renderers}
                />
            </div>
        ))}
    </fieldset>
);

const BootstrapObject = ({ uischema, schema, path, renderers }) => (
    <fieldset className="form-group">
      <legend>{uischema.label}</legend>
      {Object.keys(schema.properties).map((propKey) => {
        const propSchema = schema.properties[propKey];
        const propUiSchema = uischema.elements.find(el => el.scope && el.scope.endsWith(propKey));
        return (
          <div key={propKey} className="form-group">
            <JsonFormsDispatch
              uischema={propUiSchema}
              schema={propSchema}
              path={`${path}.${propKey}`}
              renderers={renderers}
            />
          </div>
        );
      })}
    </fieldset>
  );

export const bootstrapRenderers = [
    { tester: rankWith(3, uiTypeIs('Label')), renderer: withJsonFormsLabelProps(BootstrapLabel) },
    { tester: rankWith(3, isStringControl), renderer: withJsonFormsControlProps(BootstrapInput) },
    { tester: rankWith(3, isNumberControl), renderer: withJsonFormsControlProps(BootstrapNumber) },
    { tester: rankWith(3, isIntegerControl), renderer: withJsonFormsControlProps(BootstrapNumber) },
    { tester: rankWith(3, isBooleanControl), renderer: withJsonFormsControlProps(BootstrapBoolean) },
    { tester: rankWith(3, isDateControl), renderer: withJsonFormsControlProps(BootstrapDate) },
    { tester: rankWith(3, isEnumControl), renderer: withJsonFormsControlProps(BootstrapEnum) },
    { tester: rankWith(3, isObjectControl), renderer: withJsonFormsLayoutProps(BootstrapObject) },
    { tester: rankWith(3, uiTypeIs('HorizontalLayout')), renderer: withJsonFormsLayoutProps(BootstrapHorizontalLayout) },
    { tester: rankWith(3, uiTypeIs('VerticalLayout')), renderer: withJsonFormsLayoutProps(BootstrapVerticalLayout) },
    { tester: rankWith(3, isGroup), renderer: withJsonFormsLayoutProps(BootstrapGroup) },
];
// same than renderers but in tables ("cell")
export const bootstrapCells = [
    { tester: rankWith(3, isStringControl), cell: withJsonFormsCellProps(BootstrapStringCell) },
    { tester: rankWith(3, isNumberControl), cell: withJsonFormsCellProps(BootstrapNumberCell) },
    { tester: rankWith(3, isBooleanControl), cell: withJsonFormsCellProps(BootstrapBooleanCell) },
    { tester: rankWith(3, isDateControl), cell: withJsonFormsCellProps(BootstrapDateCell) },
    { tester: rankWith(3, isEnumControl), cell: withJsonFormsCellProps(BootstrapEnumCell) },
];
