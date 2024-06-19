import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

const ChatHistory = ({ users, onSelectUser }) => (
  <Box flex="1" overflowY="auto">
    {users.map((user) => (
      <Flex
        key={user.id}
        align="center"
        p="4"
        cursor="pointer"
        _hover={{ bg: "gray.800" }}
        onClick={() => onSelectUser(user)}
      >
        <Avatar size="md" />
        <Text ml="4">{user.name}</Text>
      </Flex>
    ))}
  </Box>
);

export default ChatHistory;
