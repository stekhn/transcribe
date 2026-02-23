import React from "react";
import { Alert } from "@mantine/core";

interface ErrorMessageProps {
  error: { name: string; message: string };
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  return (
    <Alert>
      {error.name}: {error.message}
    </Alert>
  );
};
