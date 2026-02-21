import React from "react";
import { Alert, Text } from "@mantine/core";

interface ErrorMessageProps {
  error: { name: string; message: string };
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  return (
    <Alert color='red' radius='md' mt='md'>
      <Text size='sm'>
        {error.name}: {error.message}
      </Text>
    </Alert>
  );
};
