'use client';

import * as React from 'react';
import Select, {
  type Props as SelectProps,
  type ClassNamesConfig,
  type GroupBase,
} from 'react-select';
import AsyncSelect, { type AsyncProps } from 'react-select/async';
import { cn } from '@/lib/utils';

export interface FormSelectOption {
  label: string;
  value: string | number;
  [key: string]: unknown;
}

export const getSelectClassNames = (
  hasError?: boolean
): ClassNamesConfig<FormSelectOption, boolean, GroupBase<FormSelectOption>> => ({
  control: (state) =>
    cn(
      'flex min-h-9 w-full rounded-md border bg-transparent px-2.5 py-0.5 text-sm shadow-sm transition-colors cursor-pointer',
      hasError
        ? 'border-destructive ring-1 ring-destructive/30 focus-within:ring-destructive focus-within:border-destructive'
        : cn(
            'border-border',
            state.isFocused && 'ring-1 ring-primary border-primary outline-none'
          ),
      state.isDisabled && 'cursor-not-allowed opacity-50 bg-secondary/30'
    ),
  placeholder: () => 'text-muted-foreground text-sm font-normal select-none',
  input: () => 'text-foreground text-sm font-sans',
  singleValue: () => 'text-foreground text-sm font-sans',
  multiValue: () =>
    'bg-secondary text-secondary-foreground rounded px-1.5 py-0.5 text-xs mr-1 font-medium inline-flex items-center',
  multiValueLabel: () => 'text-secondary-foreground text-xs',
  multiValueRemove: () =>
    'text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded ml-1 cursor-pointer transition-colors p-0.5',
  menu: () =>
    'mt-1.5 rounded-md border border-border bg-card shadow-md py-1 z-50 overflow-hidden',
  menuList: () => 'py-1 max-h-60 overflow-y-auto text-sm',
  option: (state) =>
    cn(
      'px-3 py-2 text-sm cursor-pointer select-none transition-colors font-sans',
      state.isSelected
        ? 'bg-primary text-primary-foreground font-medium'
        : state.isFocused
        ? 'bg-secondary text-foreground'
        : 'text-foreground',
      state.isDisabled && 'cursor-not-allowed opacity-40'
    ),
  noOptionsMessage: () => 'text-xs text-muted-foreground py-3 text-center',
  loadingMessage: () => 'text-xs text-muted-foreground py-3 text-center',
  indicatorSeparator: () => 'bg-border my-1 mx-1.5 w-[1px]',
  dropdownIndicator: () =>
    'text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-1',
  clearIndicator: () =>
    'text-muted-foreground hover:text-destructive cursor-pointer transition-colors p-1',
  loadingIndicator: () => 'text-primary p-1',
});

function isGroup(
  item: FormSelectOption | GroupBase<FormSelectOption>
): item is GroupBase<FormSelectOption> {
  return typeof item === 'object' && item !== null && 'options' in item;
}

// Helper to resolve Formik value (primitive or option object) to react-select option
export function resolveSelectValue(
  value: unknown,
  options?: readonly (FormSelectOption | GroupBase<FormSelectOption>)[],
  isMulti?: boolean
): FormSelectOption | FormSelectOption[] | null {
  if (value === null || value === undefined || value === '') return null;

  const flatOptions: FormSelectOption[] = [];
  if (options) {
    for (const item of options) {
      if (isGroup(item)) {
        flatOptions.push(...item.options);
      } else {
        flatOptions.push(item);
      }
    }
  }

  if (isMulti) {
    if (!Array.isArray(value)) return null;
    return value.map((v) => {
      if (typeof v === 'object' && v !== null && 'value' in v) {
        return v as FormSelectOption;
      }
      const found = flatOptions.find((opt) => opt.value === v);
      return found ?? { label: String(v), value: v as string | number };
    });
  }

  if (typeof value === 'object' && value !== null && 'value' in value) {
    return value as FormSelectOption;
  }

  const found = flatOptions.find((opt) => opt.value === value);
  return found ?? { label: String(value), value: value as string | number };
}

export interface CustomSelectProps
  extends Omit<
    SelectProps<FormSelectOption, boolean, GroupBase<FormSelectOption>>,
    'classNames' | 'unstyled'
  > {
  hasError?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  hasError,
  options = [],
  value,
  isMulti,
  placeholder = 'Pilih opsi...',
  ...props
}) => {
  const resolvedValue = resolveSelectValue(
    value,
    options as readonly (FormSelectOption | GroupBase<FormSelectOption>)[],
    isMulti
  );

  return (
    <Select
      unstyled
      classNames={getSelectClassNames(hasError)}
      options={options}
      value={resolvedValue}
      isMulti={isMulti}
      placeholder={placeholder}
      {...props}
    />
  );
};

export interface CustomAsyncSelectProps
  extends Omit<
    AsyncProps<FormSelectOption, boolean, GroupBase<FormSelectOption>>,
    'classNames' | 'unstyled'
  > {
  hasError?: boolean;
}

export const CustomAsyncSelect: React.FC<CustomAsyncSelectProps> = ({
  hasError,
  value,
  isMulti,
  placeholder = 'Ketik untuk mencari...',
  defaultOptions = true,
  ...props
}) => {
  const resolvedValue = resolveSelectValue(value, undefined, isMulti);

  return (
    <AsyncSelect
      unstyled
      classNames={getSelectClassNames(hasError)}
      value={resolvedValue}
      isMulti={isMulti}
      placeholder={placeholder}
      defaultOptions={defaultOptions}
      {...props}
    />
  );
};
