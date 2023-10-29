"use client";
import {
  Box,
  Heading,
  Text,
  VStack,
  Icon,
  Skeleton,
  Button,
  Avatar,
} from "@chakra-ui/react";
import { FaEnvelope, FaPhone, FaPen } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

// Framer motion variants for the animation
const variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const UserInfo = ({ user }) => {
  return (
    <MotionBox
      p={5}
      bg="white"
      boxShadow="md"
      rounded="md"
      initial="hidden"
      animate="show"
      variants={variants}
      whileHover={{ y: -10 }}
    >
      <VStack align="start" spacing={5}>
      <Skeleton isLoaded={user.name}>
            <Avatar size="2xl" name={user.name} src={user.profilePicture} />
          </Skeleton>
        <Text>{user.description}</Text>
        <Text>
          <Icon as={FaEnvelope} color="#F13B07" /> {user.email}
        </Text>
        <Text>
          <Icon as={FaPhone} color="#F13B07" /> {user.phone}
        </Text>
{/*         <Button
          leftIcon={<Icon as={FaEnvelope} />}
          colorScheme="red"
          variant="outline"
        >
          Contact {user.name}
        </Button> */}
        <Button leftIcon={<Icon as={FaPen} />} colorScheme="red" variant="outline">
            Edit User Info
          </Button>
      </VStack>
    </MotionBox>
  );
};

export default UserInfo;
