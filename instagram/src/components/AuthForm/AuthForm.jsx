/* eslint-disable react/no-unescaped-entities */
import { Box, VStack, Image, Input, Button, Text, Link } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import axios from 'axios';

const AuthForm = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });

  const handleAuth = async () => {
    if (!inputs.email || !inputs.password) {
      alert("Please fill in all required fields.");
      return;
    }

    console.log("Login inputs", inputs);
    try {
      const response = await axios.post('http://localhost:3000/auth/login', inputs);
      if (response.status === 200) {
        const { token, username } = response.data;
        console.log("Login successful:", response.data);
        // Store the token in localStorage
        localStorage.setItem('jwtToken', token);
        // Redirect to /home/username
        navigate(`/home/${username}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please try again.");
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
    <Box border="1px solid gray" borderRadius={4} padding={5} width="full" maxW="md" marginTop={8}>
      <VStack spacing={4}>
        <Image src="/logo.png" h={24} cursor="pointer" alt="Instagram" />
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
          onClick={handleAuth}
        >
          Log in
        </Button>
        <Box textAlign="center">
          <Text fontSize={14}>Don't have an account? 
            <Link color="blue.500" onClick={() => navigate('/signup')}>
              Sign up
            </Link>
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default AuthForm;
