import { Box, VStack, Input, Button, Text, Link, Image } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignupForm = () => {
  const [inputs, setInputs] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!inputs.fullName || !inputs.username || !inputs.email || !inputs.password) {
      alert("Please fill in all required fields.");
      return;
    }

    console.log("Signup inputs", inputs);
    try {
      const response = await axios.post('http://localhost:3000/signup', inputs);
      if (response.status === 200) {
        console.log("Signup successful:", response.data);
        navigate("/");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Signup failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  return (
    <Box border="1px solid gray" borderRadius={4} padding={5} width="full" maxW="md">
      <VStack spacing={4}>
        <Image src="/logo.png" h={24} cursor="pointer" alt="Instagram" />

        <Input 
          name="fullName"
          placeholder="Full Name" 
          fontSize={14} 
          value={inputs.fullName}
          onChange={handleChange}
        />
        <Input 
          name="username"
          placeholder="Username" 
          fontSize={14} 
          value={inputs.username}
          onChange={handleChange}
        />
        <Input 
          name="email"
          placeholder="Email" 
          fontSize={14} 
          type="email" 
          value={inputs.email}
          onChange={handleChange}
        />
        <Input 
          name="password"
          placeholder="Password" 
          fontSize={14} 
          type="password"
          value={inputs.password}
          onChange={handleChange}
        />
        <Button 
          w="full" 
          colorScheme="blue" 
          size="sm" 
          fontSize={14} 
          onClick={handleSignup}
        >
          Sign Up
        </Button>
        <Box textAlign="center">
          <Text fontSize={14}>
            Already have an account?{" "}
            <Link color="blue.500" onClick={() => navigate("/")}>
              Log in
            </Link>
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default SignupForm;
