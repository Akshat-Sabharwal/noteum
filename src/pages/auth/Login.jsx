import {
  Card,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  VStack,
  Button,
  useColorModeValue,
  HStack,
  Heading,
  Divider,
  useToast,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { useState, useContext } from "react";
import { fetchResponse } from "../../utils/fetchResponse";
import { User } from "../../context/user";

export const Login = () => {
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const toast = useToast({ duration: 2000, isClosable: true });
  const navigate = useNavigate();
  const [buffer, setBuffer] = useState(false);
  const { setUser } = useContext(User);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isInvalid, setIsInvalid] = useState({
    email: false,
    password: false,
  });

  const validate = {
    email: (email) => {
      validator.isEmail(email)
        ? setIsInvalid({ ...isInvalid, email: false })
        : setIsInvalid({ ...isInvalid, email: true });
    },
    password: (pass) => {
      pass.trim() === ""
        ? setIsInvalid({ ...isInvalid, password: true })
        : setIsInvalid({ ...isInvalid, password: false });
    },
  };

  const login = () => {
    setBuffer(true);

    fetchResponse("auth/login", "POST", {
      ...formData,
    }).then(async (res) => {
      res.error
        ? (toast({
            title: res.error.name,
            description: res.error.message,
            status: "error",
          }),
          setBuffer(false))
        : await fetchResponse("me", "GET").then(async (res) => {
            setUser(res.result);
            toast({
              title: res.message,
              status: "success",
            });
            setBuffer(false);
            localStorage.setItem("auth", true);
            navigate("/dashboard");
          });
    });
  };

  return (
    <>
      <Flex
        justify="center"
        align={{ base: "flex-start", lg: "center" }}
        w="full"
        h="100vh"
        bgColor={useColorModeValue("white", "blackAlpha.700")}
      >
        <Flex
          flexDirection={{ base: "column", lg: "row" }}
          justify={{ base: "flex-start", lg: "center" }}
          align="center"
          w={{ base: "35ch", lg: "70%" }}
          gap={{ base: "3rem", lg: "7rem" }}
          mt={{ base: "5rem", lg: null }}
        >
          <Heading
            textAlign="center"
            color={useColorModeValue("blackAlpha.800", "whiteAlpha.900")}
            fontSize={{ base: "2rem", lg: "3rem" }}
            maxW={{ base: "20ch", lg: "30rem" }}
          >
            Login with your Noteum account
          </Heading>
          {!isMobile && (
            <Divider
              orientation="vertical"
              h="40vh"
              borderColor={useColorModeValue(
                "blackAlpha.300",
                "whiteAlpha.400"
              )}
            />
          )}
          <VStack w={{ base: "90%", lg: "33%" }} gap={5}>
            <Card
              p={{ base: 5, lg: 8 }}
              w="full"
              borderRadius="md"
              boxShadow="md"
              bgColor={useColorModeValue("white", "whiteAlpha.100")}
            >
              <VStack gap="2.25rem">
                <VStack gap={{ base: "1.3rem", lg: "1.5rem" }} w="full">
                  <FormControl isInvalid={isInvalid.email}>
                    <Input
                      type="text"
                      placeholder="E-mail"
                      fontSize={{ base: "1rem", lg: "1.1rem" }}
                      py={{ base: 3, lg: 5 }}
                      px={{ base: 3, lg: 4 }}
                      maxLength={40}
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        validate.email(e.target.value);
                      }}
                      onFocus={() =>
                        formData.email.length === 0
                          ? setIsInvalid({ ...isInvalid, email: true })
                          : null
                      }
                      _focus={{
                        border: "2px solid",
                        borderColor: isInvalid.email
                          ? "red.300"
                          : useColorModeValue(
                              "blackAlpha.600",
                              "whiteAlpha.600"
                            ),
                        boxShadow: "none",
                      }}
                    />
                    <FormErrorMessage>Invalid e-mail!</FormErrorMessage>
                  </FormControl>
                  <VStack w="full" align="center" gap={3}>
                    <FormControl isInvalid={isInvalid.password}>
                      <Input
                        type="password"
                        placeholder="Password"
                        fontSize={{ base: "1rem", lg: "1.1rem" }}
                        py={{ base: 3, lg: 5 }}
                        px={{ base: 3, lg: 4 }}
                        value={formData.password}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            password: e.target.value,
                          });
                          validate.password(e.target.value);
                        }}
                        onFocus={() =>
                          formData.password.length === 0
                            ? setIsInvalid({ ...isInvalid, password: true })
                            : null
                        }
                        _focus={{
                          border: "2px solid",
                          borderColor: isInvalid.password
                            ? "red.300"
                            : useColorModeValue(
                                "blackAlpha.600",
                                "whiteAlpha.600"
                              ),
                          boxShadow: "none",
                        }}
                      />
                      <FormErrorMessage>
                        Password must not be an empty string!
                      </FormErrorMessage>
                    </FormControl>
                    <Button
                      variant="link"
                      fontSize="0.9rem"
                      alignSelf="flex-end"
                      color={useColorModeValue(
                        "blackAlpha.500",
                        "whiteAlpha.500"
                      )}
                    >
                      Forgot password?
                    </Button>
                  </VStack>
                </VStack>
                <Button
                  rightIcon={<ArrowForwardIcon />}
                  bgColor={useColorModeValue("blackAlpha.800")}
                  color={useColorModeValue("white")}
                  variant="outline"
                  w="full"
                  fontSize="1.1rem"
                  isDisabled={isInvalid.email || isInvalid.password}
                  isLoading={buffer}
                  px={4}
                  py={5}
                  _hover={{
                    backgroundColor: useColorModeValue(
                      "blackAlpha.900",
                      "whiteAlpha.900"
                    ),
                    color: useColorModeValue("white", "blackAlpha.800"),
                  }}
                  onClick={login}
                >
                  Continue
                </Button>
              </VStack>
            </Card>
            <Button
              rightIcon={<ArrowForwardIcon />}
              variant="link"
              fontSize={{ base: "1rem", lg: "1.1rem" }}
              onClick={() => navigate("/auth/signup")}
            >
              New to Noteum? Sign up here
            </Button>
          </VStack>
        </Flex>
      </Flex>
    </>
  );
};
