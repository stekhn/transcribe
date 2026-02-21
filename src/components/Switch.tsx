import { useEffect } from "react";
import {
  Switch as MantineSwitch,
  Group,
  ActionIcon,
  Tooltip as MantineTooltip,
  Divider,
  Box,
  Text,
} from "@mantine/core";
import { IconHelp } from "@tabler/icons-react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface SwitchProps {
  id: string;
  onChange: (isChecked: boolean) => void;
  defaultChecked?: boolean;
  overrideStoredValue?: boolean;
  label?: string;
  info?: string;
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
  info,
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
      <Group gap='0.25rem' wrap='nowrap'>
        <Text size='sm' c='dimmed'>
          {label}
        </Text>
        {info && (
          <MantineTooltip label={info}>
            <ActionIcon variant='transparent' size='xs' color='gray'>
              <IconHelp />
            </ActionIcon>
          </MantineTooltip>
        )}
      </Group>
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
