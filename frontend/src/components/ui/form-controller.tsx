'use client';

import * as React from 'react';
import { useField } from 'formik';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Textarea } from '@/components/ui/textarea';
import { CustomSelect, CustomAsyncSelect } from '@/components/ui/custom-select';
import { cn } from '@/lib/utils';
import { type FormControllerProps } from './form-controller.types';

// Re-export semua types agar consumers tidak mengalami breaking changes
export type * from './form-controller.types';

export const FormController: React.FC<FormControllerProps> = (props) => {
  const {
    name,
    label,
    required = false,
    helperText,
    containerClassName,
    'data-testid': dataTestId,
  } = props;

  const [field, meta, helpers] = useField(name);
  const hasError = Boolean(meta.touched && meta.error);

  const containerTestId = dataTestId ?? `form-controller-${name}`;
  const labelTestId = `${containerTestId}-label`;
  const errorTestId = `${containerTestId}-error`;
  const helperTestId = `${containerTestId}-helper`;

  const renderField = () => {
    if (props.type === 'select') {
      return (
        <CustomSelect
          id={name}
          instanceId={name}
          inputId={name}
          options={props.options}
          value={field.value}
          onChange={(selected) => {
            helpers.setValue(selected);
          }}
          onBlur={() => {
            helpers.setTouched(true);
          }}
          isMulti={props.isMulti}
          isClearable={props.isClearable}
          isDisabled={props.disabled}
          placeholder={props.selectPlaceholder ?? 'Pilih opsi...'}
          hasError={hasError}
          aria-required={required ? 'true' : undefined}
          aria-invalid={hasError ? 'true' : undefined}
          aria-describedby={
            hasError ? `${name}-error` : helperText ? `${name}-helper` : undefined
          }
          data-testid={`${containerTestId}-select`}
        />
      );
    }

    if (props.type === 'async-select') {
      return (
        <CustomAsyncSelect
          id={name}
          instanceId={name}
          inputId={name}
          loadOptions={props.loadOptions}
          defaultOptions={props.defaultOptions}
          value={field.value}
          onChange={(selected) => {
            helpers.setValue(selected);
          }}
          onBlur={() => {
            helpers.setTouched(true);
          }}
          isMulti={props.isMulti}
          isClearable={props.isClearable}
          isDisabled={props.disabled}
          placeholder={props.selectPlaceholder ?? 'Ketik untuk mencari...'}
          hasError={hasError}
          aria-required={required ? 'true' : undefined}
          aria-invalid={hasError ? 'true' : undefined}
          aria-describedby={
            hasError ? `${name}-error` : helperText ? `${name}-helper` : undefined
          }
          data-testid={`${containerTestId}-async-select`}
        />
      );
    }

    if (props.type === 'textarea') {
      const {
        type: _type,
        name: _name,
        label: _label,
        required: _required,
        helperText: _helper,
        containerClassName: _containerClass,
        'data-testid': _testId,
        rows = 3,
        ...restTextareaProps
      } = props;

      return (
        <Textarea
          {...field}
          {...restTextareaProps}
          id={name}
          rows={rows}
          hasError={hasError}
          aria-required={required ? 'true' : undefined}
          aria-invalid={hasError ? 'true' : undefined}
          aria-describedby={
            hasError ? `${name}-error` : helperText ? `${name}-helper` : undefined
          }
          data-testid={`${containerTestId}-textarea`}
        />
      );
    }

    if (props.type === 'password') {
      const {
        type: _type,
        name: _name,
        label: _label,
        required: _required,
        helperText: _helper,
        containerClassName: _containerClass,
        'data-testid': _testId,
        toggleAriaLabel,
        ...restPasswordProps
      } = props;

      return (
        <PasswordInput
          {...field}
          {...restPasswordProps}
          id={name}
          toggleAriaLabel={toggleAriaLabel}
          hasError={hasError}
          aria-required={required ? 'true' : undefined}
          aria-invalid={hasError ? 'true' : undefined}
          aria-describedby={
            hasError ? `${name}-error` : helperText ? `${name}-helper` : undefined
          }
          data-testid={`${containerTestId}-password-input`}
        />
      );
    }

    // Default / Standard HTML input (text, email, number, etc.)
    const {
      type = 'text',
      name: _name,
      label: _label,
      required: _required,
      helperText: _helper,
      containerClassName: _containerClass,
      'data-testid': _testId,
      ...restInputProps
    } = props;

    return (
      <Input
        {...field}
        {...restInputProps}
        id={name}
        type={type}
        hasError={hasError}
        aria-required={required ? 'true' : undefined}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={
          hasError ? `${name}-error` : helperText ? `${name}-helper` : undefined
        }
        data-testid={`${containerTestId}-input`}
      />
    );
  };

  return (
    <div
      className={cn('space-y-1.5', containerClassName)}
      data-testid={containerTestId}
    >
      <Label
        htmlFor={name}
        required={required}
        data-testid={labelTestId}
      >
        {label}
      </Label>

      {renderField()}

      {helperText && !hasError && (
        <p
          id={`${name}-helper`}
          className="text-xs text-muted-foreground"
          data-testid={helperTestId}
        >
          {helperText}
        </p>
      )}

      {hasError && (
        <p
          id={`${name}-error`}
          role="alert"
          className="text-xs font-medium text-destructive animate-in fade-in-50"
          data-testid={errorTestId}
        >
          {meta.error}
        </p>
      )}
    </div>
  );
};

FormController.displayName = 'FormController';
