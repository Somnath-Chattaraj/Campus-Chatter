import {
    Flex,
    FormControl,
    Button,
    useToast,
    FormLabel,
    Input,
    Box,
    Text,
    useBreakpointValue,
    SlideFade,
    Spinner,
  } from "@chakra-ui/react";
  import axios from "axios";
  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  
  const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const toast = useToast();
    const [verifyPasswordPage, setVerifyPasswordPage] = useState(false);
    const [changePasswordPage, setChangePasswordPage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
  
    // Responsive padding
    const formPadding = useBreakpointValue({ base: "4", md: "8" });
  
    // Transition delay
    const transitionDuration = "0.5s";
  
    async function handleChange() {
      setLoading(true);
      try {
        const res = await axios.post("/api/otp", { email: email });
        if (res.status === 200) {
          toast({
            title: "OTP sent successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setVerifyPasswordPage(true);
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        toast({
          title: "Error sending OTP",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }
  
    async function handleVerify() {
      setLoading(true);
      try {
        const res = await axios.post("/api/otp/verify", { otp: otp, email: email });
        if (res.status === 200) {
          toast({
            title: "OTP verified successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setVerifyPasswordPage(false);
          setChangePasswordPage(true);
        } else if (res.status === 400) {
          toast({
            title: "Invalid OTP",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Error verifying OTP",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Error verifying OTP:", error);
        toast({
          title: "Error verifying OTP",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }
  
    async function changePassword() {
      setLoading(true);
      try {
        const res = await axios.post("/api/otp/change", {
          email: email,
          password: password,
        });
        if (res.status === 200) {
          toast({
            title: "Password changed successfully",
            description: "You are being redirected to the login page.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          navigate("/login");
        } else {
          toast({
            title: "Error changing password",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Error changing password:", error);
        toast({
          title: "Error changing password",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }
  
    return (
      <Box
        minH="100vh"
        bgGradient="linear(to-r, teal.500, blue.600)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Flex
          direction="column"
          p={formPadding}
          bg="white"
          borderRadius="md"
          boxShadow="xl"
          maxW="400px"
          w="100%"
          mx="auto"
          align="center"
          justify="center"
          transition={`all ${transitionDuration} ease-in-out`}
        >
          <Text fontSize="xl" fontWeight="bold" mb={6} color="teal.700">
            Forgot Password
          </Text>
  
          <SlideFade
            in={!verifyPasswordPage && !changePasswordPage}
            offsetY="20px"
          >
            <FormControl id="email" mb={4}>
              <FormLabel className="text-black">Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="text-black"
                bg="gray.100"
                focusBorderColor="teal.500"
              />
              <Button
                mt={4}
                colorScheme="teal"
                isLoading={loading}
                onClick={handleChange}
                _hover={{ bg: "teal.400" }}
                transition={`background ${transitionDuration}`}
                w="100%"
              >
                {loading ? <Spinner /> : "Send OTP"}
              </Button>
            </FormControl>
          </SlideFade>
  
          <SlideFade in={verifyPasswordPage} offsetY="20px">
            <FormControl id="otp" mb={4}>
              <FormLabel className="text-black">Enter OTP</FormLabel>
              <Input
                type="text"
                className="text-black"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                bg="gray.100"
                focusBorderColor="teal.500"
              />
              <Button
                mt={4}
                colorScheme="teal"
                isLoading={loading}
                onClick={handleVerify}
                _hover={{ bg: "teal.400" }}
                transition={`background ${transitionDuration}`}
                w="100%"
              >
                {loading ? <Spinner /> : "Verify OTP"}
              </Button>
            </FormControl>
          </SlideFade>
  
          <SlideFade in={changePasswordPage} offsetY="20px">
            <FormControl id="password" mb={4}>
              <FormLabel className="text-black">New Password</FormLabel>
              <Input
                type="password"
                className="text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                bg="gray.100"
                focusBorderColor="teal.500"
              />
              <Button
                mt={4}
                colorScheme="teal"
                isLoading={loading}
                onClick={changePassword}
                _hover={{ bg: "teal.400" }}
                transition={`background ${transitionDuration}`}
                w="100%"
              >
                {loading ? <Spinner /> : "Change Password"}
              </Button>
            </FormControl>
          </SlideFade>
        </Flex>
      </Box>
    );
  };
  
  export default ForgetPassword;
  