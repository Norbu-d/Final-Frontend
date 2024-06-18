import { Container, Flex, VStack,  Box, Image } from "@chakra-ui/react"
import AuthForm from "../../../components/AuthForm/AuthForm"

const Authpage = () => {
  return (
    <Flex minH={"100vh"} justifyContent={"center"} alignItems={"center"} px={4}>
        <Container maxW={"container.md"} padding={0}>
            <Flex justifyContent={"center"} allignItems={"center"} gap={10}>
         {/* left hand site*/}
            <Box display={{base:"none", md:"block"}}>
            <Image src="./auth.png" h={650} alt='phone img'/>
            </Box>

             {/* Right hand side*/}
            <VStack spacing={4} align={"stretch"}>
                <AuthForm />
                <Box textAlign={"center"}></Box>
                <Flex gap={5} justifyContent={"center"}>
                


                </Flex>

            </VStack>

            </Flex>          
           

        </Container>
    </Flex>
  )
}

export default Authpage