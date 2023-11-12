"use client";
import {
  Box,
  Heading,
  Text,
  VStack,
  Image,
  Icon,
  Skeleton,
  List,
  ListItem,
  ListIcon,
  Button,
} from "@chakra-ui/react";
import { FaMapMarkerAlt, FaStar, FaPen } from "react-icons/fa";
import { motion } from "framer-motion";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import FlatForm from "./upload-property-button";
import { format, parseISO } from "date-fns";

const MotionBox = motion(Box);

// Framer motion variants for the animation
const variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export type Property = {
  id: number;
  ownerId: string;
  dateFrom: string;
  dateTo: string;
  description: string | null;
  images: string[];
  rooms: number | null;
  squareMeters: number | null;
  address: {
    city: string;
    country: string;
    street: string;
  };
  swapWithCity: string;
  createdAt: string;
};

const PropertyInfo = () => {
  const [property, setProperty] = useState<Property | null>(null);
  const { userId } = useAuth();

  async function getFlat(userId: string | null | undefined) {
    if (!userId) return;

    const response = await axios.get(
      `http://localhost:8080/v1/flats/user/${userId}`
    );
    console.log(response.data);
    setProperty(response.data);
  }

  // call when component renders
  useEffect(() => {
    getFlat(userId);
  }, []);

  if (!property) {
    return (
      <VStack>
        <Text>You dont have a flat yet!!!</Text>
        <FlatForm setProperty={setProperty} userId={userId} />
      </VStack>
    );
  }

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
        <Carousel showThumbs={false}>
          {property &&
            property.images &&
            property.images.map((img, index) => (
              <div key={index}>
                <Image src={img} alt={`Property ${index + 1}`} />
              </div>
            ))}
        </Carousel>
        <Heading size="md" mb={2} fontWeight="bold">Availability:</Heading>
        <Box bg="gray.100" p={3} rounded="md" width="full" mb={2}>
          <Text fontWeight="medium">From: {format(parseISO(property.dateFrom), "dd MMMM yy")}</Text>
        </Box>
        <Box bg="gray.100" p={3} rounded="md" width="full">
          <Text fontWeight="medium">To: {format(parseISO(property.dateTo), "dd MMMM yy")}</Text>
        </Box>
        <Text>
          {property.address.street},{property.address.city}
        </Text>
        <Text>{property.description}</Text>
        <Text>
          {/* <Icon as={FaMapMarkerAlt} color="#F13B07" /> {property.location} */}
        </Text>
        {/* <Heading as="h3" size="md" color="#F13B07">
          Reviews
        </Heading>
        <List spacing={2}>
          {property.reviews.map((review, index) => (
            <ListItem key={index}>
              <ListIcon as={FaStar} color="yellow.400" />
              {review}
            </ListItem>
          ))}
        </List> */}
        <Button
          leftIcon={<Icon as={FaPen} />}
          colorScheme="red"
          variant="outline"
        >
          Edit Property Info
        </Button>
      </VStack>
    </MotionBox>
  );
};

export default PropertyInfo;
