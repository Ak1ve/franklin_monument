import classNames from "classnames";
import { Children, useState } from "react";
import Select from "react-tailwindcss-select";
import { SelectProps } from "react-tailwindcss-select/dist/components/type";

export interface StandardSelectProps extends Omit<SelectProps, "primaryColor"> {
  label: string;
  id: string;
  helpText?: string;
  primaryColor?: string;
  errorText?: string;
  containerClass?: string;
  labelClass?: string;
  inputClass?: string;
  helpClass?: string;
  textErrorClass?: string;
}

export function StandardSelect(props: StandardSelectProps) {
  const labelClassName = classNames(props.labelClass, "input-label");
  const helpClassName = classNames(
    props.helpClass,
    "text-gray-600 text-xs italic"
  );
  const textErrorClassName = classNames(
    props.textErrorClass,
    "text-red-500 text-xs italic"
  );
  const containerClassName = classNames(
    props.containerClass,
    "w-full px-3 mb-3 md:mb-4 input-group"
  );
  return (
    <div className={containerClassName}>
      <label className={labelClassName} htmlFor={props.id}>
        {props.label}
      </label>
      <Select primaryColor="sky" {...props} />
      {props.helpText && <p className={helpClassName}>{props.helpText}</p>}
      {props.errorText && (
        <p className={textErrorClassName}>{props.errorText}</p>
      )}
    </div>
  );
}

export interface StandardInputProps extends React.HTMLProps<HTMLInputElement> {
  label: string;
  id: string;
  helpText?: string;
  errorText?: string;
  containerClass?: string;
  labelClass?: string;
  inputClass?: string;
  helpClass?: string;
  textErrorClass?: string;
}

export function StandardInput(props: StandardInputProps) {
  const labelClassName = classNames(props.labelClass, "input-label");
  const helpClassName = classNames(
    props.helpClass,
    "text-gray-600 text-xs italic"
  );
  const textErrorClassName = classNames(
    props.textErrorClass,
    "text-red-500 text-xs italic"
  );
  const containerClassName = classNames(
    props.containerClass,
    "w-full px-3 mb-3 md:mb-4 input-group"
  );
  const inputClassName = classNames("input-primary", {
    "input-invalid": props.errorText,
  }, props.inputClass);
  return (
    <div className={containerClassName}>
      <label className={labelClassName} htmlFor={props.id}>
        {props.label}
      </label>
      <input className={inputClassName} {...props} />
      {props.helpText && <p className={helpClassName}>{props.helpText}</p>}
      {props.errorText && (
        <p className={textErrorClassName}>{props.errorText}</p>
      )}
    </div>
  );
}

export interface StandardCheckboxProps
  extends Omit<React.HTMLProps<HTMLInputElement>, "value"> {
  id: string
  label: string
  errorText?: string
  helpText?: string
  labelClass?: string
  helpClass?: string
  textErrorClass?: string
  containerClass?: string
  inputClass?: string
}

export function StandardCheckbox(props: StandardCheckboxProps) {
  const labelClassName = classNames(
    props.labelClass,
    "uppercase tracking-wide text-gray-700 text-xs font-bold select-none"
  );
  const helpClassName = classNames(
    props.helpClass,
    "text-gray-600 text-xs italic"
  );
  const textErrorClassName = classNames(
    props.textErrorClass,
    "text-red-500 text-xs italic"
  );
  const containerClassName = classNames(
    props.containerClass,
    "w-full px-3 mb-3 md:mb-4 input-group justify-center text-center self-center"
  );
  const inputClassName = classNames("input-primary mr-2", {
    "input-invalid": props.errorText,
  }, props.inputClass);
  return (
    <div className={containerClassName}>
      <label className={labelClassName} htmlFor={props.id}>
        <input
          className={inputClassName}
          type="checkbox"
          {...props}
          value={undefined}
        />
        {props.label}
      </label>
      {props.helpText && <p className={helpClassName}>{props.helpText}</p>}
      {props.errorText && (
        <p className={textErrorClassName}>{props.errorText}</p>
      )}
    </div>
  );
}

export function InputGrid({ children, maxColumns = undefined }: { children: any; maxColumns?: number; }) {
  const count = Children.count(children);
  if (count === 1) {
    return (
      <div className="flex flex-wrap mb-2">
        {children}
      </div>
    )
  }
  const columns = maxColumns === undefined ? count : maxColumns; 
  const numRows = Math.ceil(count / columns);
  let rows = new Array(numRows);
  for (let i = 0; i < numRows; i++) {
    rows[i] = [];
  }
  Children.toArray(children).forEach((value, index) => {
    const x = Math.trunc(index / columns);
    rows[x].push(value);
  });
  return (
    <div className={`flex flex-wrap mb-2 input-grid-${columns}`}>
      {...children}
    </div>
  );
}

export interface StandardDatepickerProps
  extends Omit<StandardInputProps, "type"> { }

export function StandardDatepicker(props: StandardDatepickerProps) {
  const labelClassName = classNames(props.labelClass, "input-label");
  const helpClassName = classNames(
    props.helpClass,
    "text-gray-600 text-xs italic"
  );
  const textErrorClassName = classNames(
    props.textErrorClass,
    "text-red-500 text-xs italic"
  );
  const containerClassName = classNames(
    props.containerClass,
    "w-full px-3 mb-3 md:mb-4 input-group"
  );
  const inputClassName = classNames("input-primary", {
    "input-invalid": props.errorText,
  }, props.inputClass);
  return (
    <div className={containerClassName}>
      <label className={labelClassName} htmlFor={props.id}>
        {props.label}
      </label>
      <input type="date" className={inputClassName} {...props} />
      {props.helpText && <p className={helpClassName}>{props.helpText}</p>}
      {props.errorText && (
        <p className={textErrorClassName}>{props.errorText}</p>
      )}
    </div>
  );
}

export interface StandardTextAreaProps
  extends React.HTMLProps<HTMLTextAreaElement> {
  label: string;
  id: string;
  helpText?: string;
  primaryColor?: string;
  errorText?: string;
  containerClass?: string;
  labelClass?: string;
  inputClass?: string;
  helpClass?: string;
  textErrorClass?: string;
}

export function StandardTextArea(props: StandardTextAreaProps) {
  const labelClassName = classNames(props.labelClass, "input-label");
  const helpClassName = classNames(
    props.helpClass,
    "text-gray-600 text-xs italic"
  );
  const textErrorClassName = classNames(
    props.textErrorClass,
    "text-red-500 text-xs italic"
  );
  const containerClassName = classNames(
    props.containerClass,
    "w-full px-3 mb-3 md:mb-4 input-group"
  );
  const inputClassName = classNames("input-primary", {
    "input-invalid": props.errorText,
  }, props.inputClass);
  return (
    <div className={containerClassName}>
      <label className={labelClassName} htmlFor={props.id}>
        {props.label}
      </label>
      <textarea className={inputClassName} {...props}></textarea>
      {props.helpText && <p className={helpClassName}>{props.helpText}</p>}
      {props.errorText && (
        <p className={textErrorClassName}>{props.errorText}</p>
      )}
    </div>
  );
}

export enum ButtonTypes {
  ACTIVE = "text-green-800 bg-green-300 hover:bg-green-400",
  DANGER = "text-red-800 bg-red-300 hover:bg-red-400",
  CAUTION = "text-yellow-800 bg-yellow-200 hover:bg-yellow-300",
  STANDARD = "text-gray-50 bg-sky-500 hover:bg-sky-600",
}

export interface StandardButtonProps
  extends Omit<React.HTMLProps<HTMLButtonElement>, "type"> {
  type?: ButtonTypes;
}

export function StandardButton(props: StandardButtonProps) {
  let className = classNames(
    "px-4 py-2 hover:scale-105 rounded-xl flex items-center gap-2",
    props?.className,
    {
      "text-gray-50 bg-sky-500 hover:bg-sky-600": !props.type,
    },
    props.type
  );
  return (
    <button {...props} type="button" className={className}>
      {props.children}
    </button>
  );
}
