import React, { useEffect, ReactNode } from "react";
import {
  Select as MantineSelect,
  Group,
  ActionIcon,
  Tooltip as MantineTooltip,
} from "@mantine/core";
import { IconHelp } from "@tabler/icons-react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface SelectProps<T = string> {
  id: string;
  defaultValue: T;
  setValue: React.Dispatch<React.SetStateAction<T>> | ((value: T) => void);
  label?: string;
  info?: string;
  children: React.ReactNode;
}

export const Select = <T extends string = string>({
  id,
  defaultValue,
  setValue,
  label,
  info,
  children,
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
      label={
        label && info ? (
          <Group gap='0.25rem'>
            {label}
            <MantineTooltip label={info}>
              <ActionIcon variant='transparent' size='xs' color='gray'>
                <IconHelp />
              </ActionIcon>
            </MantineTooltip>
          </Group>
        ) : (
          label
        )
      }
      value={storedValue}
      onChange={handleChange}
      data={selectData}
      variant='filled'
      size='sm'
      radius='md'
      {...props}
    />
  );
};

interface OptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {}

export const Option: React.FC<OptionProps> = (props) => {
  return <option {...props}></option>;
};
