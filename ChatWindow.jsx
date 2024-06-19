import { Box, Flex, Text } from "@chakra-ui/react";

const ChatWindow = ({ messages, currentUser }) => (
  <Flex direction="column" spacing={4}>
    {messages.map((msg, index) => (
      <Flex
        key={index}
        justify={msg.sender === currentUser.name ? 'flex-end' : 'flex-start'}
      >
        <Box
          p={2}
          rounded="lg"
          bg={msg.sender === currentUser.name ? 'blue.500' : 'gray.700'}
          color="white"
          maxW="70%"
        >
          <Text>{msg.text}</Text>
        </Box>
      </Flex>
    ))}
  </Flex>
);

export default ChatWindow;
