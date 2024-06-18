import { Container, Flex, VStack, Box } from "@chakra-ui/react";
import SignupForm from "../components/signupform";

const SignupPage = () => {
  return (
    <Flex minH={"100vh"} justifyContent={"center"} alignItems={"center"} px={4}>
      <Container maxW={"container.md"} padding={0}>
        <Flex justifyContent={"center"} alignItems={"center"} gap={10}>
          <VStack spacing={4} align={"stretch"}>
            <SignupForm />
            <Box textAlign={"center"}></Box>
            <Flex gap={5} justifyContent={"center"}></Flex>
          </VStack>
        </Flex>
      </Container>
    </Flex>
  );
};

export default SignupPage;
