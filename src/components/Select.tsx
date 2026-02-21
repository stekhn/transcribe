import React, { useEffect, ReactNode } from "react";
import { Select as MantineSelect } from "@mantine/core";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface SelectProps<T = string> {
  id: string;
  defaultValue: T;
  setValue: React.Dispatch<React.SetStateAction<T>> | ((value: T) => void);
  label?: string;
  children: React.ReactNode;
  renderOption?: (item: {
    option: { value: string; label: string };
    checked?: boolean;
  }) => React.ReactNode;
}

export const Select = <T extends string = string>({
  id,
  defaultValue,
  setValue,
  label,
  children,
  renderOption,
  ...props
}: SelectProps<T>) => {
  const [storedValue, setStoredValue] = useLocalStorage<T>(id, defaultValue);

  const handleChange = (value: string | null) => {
    if (value !== null) {
      const typedValue = value as T;
      setStoredValue(typedValue);
      // Handle both React setState and plain functions
      if (typeof setValue === "function") {
        setValue(typedValue);
      }
    }
  };

  useEffect(() => {
    setValue(storedValue);
  }, []);

  // Convert React children to Select data format
  const selectData =
    React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.props.value) {
        const children = child.props.children;
        const label = Array.isArray(children)
          ? children.join("")
          : String(children);
        return {
          value: child.props.value,
          label,
        };
      }
      return null;
    })?.filter(Boolean) || [];

  return (
    <MantineSelect
      id={id}
      label={label}
      value={storedValue}
      onChange={handleChange}
      data={selectData}
      variant='filled'
      size='sm'
      radius='md'
      renderOption={renderOption}
      {...props}
    />
  );
};

interface OptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {}

export const Option: React.FC<OptionProps> = (props) => {
  return <option {...props}></option>;
};
