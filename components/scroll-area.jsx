import { Box } from "@chakra-ui/react";

export const ScrollArea = ({ children, ...props }) => (
  <Box overflowY="auto" {...props}>
    {children}
  </Box>
);
