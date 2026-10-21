import * as React from 'react';
import { type FormSelectOption } from '@/components/ui/custom-select';

export type { FormSelectOption };

// Standard HTML input types supported (excluding password, which has its own controller)
export type StandardInputType =
  | 'text'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'search'
  | 'color'
  | 'file';

// 1. Base Props: Atribut wajib dan umum yang berlaku di seluruh tipe kontrol
export interface BaseFormControllerProps {
  name: string;
  label: string;
  required?: boolean;
  helperText?: string;
  containerClassName?: string;
  'data-testid'?: string;
}

// 2. Select Controller Props: Khusus type="select" (wajib memiliki options)
export interface SelectControllerProps {
  type: 'select';
  options: FormSelectOption[];
  isMulti?: boolean;
  isClearable?: boolean;
  selectPlaceholder?: string;
  disabled?: boolean;
}

// 3. Async Select Controller Props: Khusus type="async-select" (wajib memiliki loadOptions)
export interface AsyncSelectControllerProps {
  type: 'async-select';
  loadOptions: (inputValue: string) => Promise<FormSelectOption[]>;
  defaultOptions?: boolean | FormSelectOption[];
  isMulti?: boolean;
  isClearable?: boolean;
  selectPlaceholder?: string;
  disabled?: boolean;
}

// 4. Textarea Controller Props: Khusus type="textarea"
export interface TextareaControllerProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    'name' | 'required' | 'value' | 'defaultValue'
  > {
  type: 'textarea';
  rows?: number;
}

// 5. Password Controller Props: Khusus type="password" (memakai PasswordInput mandiri)
export interface PasswordControllerProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'name' | 'type' | 'required' | 'value' | 'defaultValue'
  > {
  type: 'password';
  toggleAriaLabel?: {
    show?: string;
    hide?: string;
  };
}

// 6. Standard Input Controller Props: Default atau input standar HTML
export interface StandardInputControllerProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'name' | 'type' | 'required' | 'value' | 'defaultValue'
  > {
  type?: StandardInputType;
}

// Discriminated Union Props
export type FormControllerProps = BaseFormControllerProps &
  (
    | SelectControllerProps
    | AsyncSelectControllerProps
    | TextareaControllerProps
    | PasswordControllerProps
    | StandardInputControllerProps
  );
