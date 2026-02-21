import { useEffect } from "react";
import {
  Switch as MantineSwitch,
  Group,
  Divider,
  Box,
  Text,
} from "@mantine/core";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface SwitchProps {
  id: string;
  onChange: (isChecked: boolean) => void;
  defaultChecked?: boolean;
  overrideStoredValue?: boolean;
  label?: string;
  showLine?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Switch: React.FC<SwitchProps> = ({
  id,
  onChange,
  defaultChecked = false,
  overrideStoredValue = false,
  label,
  showLine = false,
  className,
  style,
}) => {
  const [storedValue, setStoredValue] = useLocalStorage(id, defaultChecked);
  const isChecked = overrideStoredValue ? defaultChecked : storedValue;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setStoredValue(checked);
    onChange(checked);
  };

  useEffect(() => {
    onChange(storedValue);
  }, []);

  return (
    <Group
      justify='space-between'
      gap='md'
      wrap='nowrap'
      className={className}
      style={style}
    >
      <Text size='sm' c='dimmed'>
        {label}
      </Text>
      {showLine && (
        <Box flex={1}>
          <Divider />
        </Box>
      )}
      <MantineSwitch
        id={id}
        checked={isChecked}
        onChange={handleChange}
        withThumbIndicator={false}
        size='sm'
      />
    </Group>
  );
};
