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
  useToast,
} from "@chakra-ui/react";
import { FaMapMarkerAlt, FaStar, FaPen, FaTrash } from "react-icons/fa";
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

  const toast = useToast();

  const deleteFlat = async (property: Property) => {
    try {
      await axios.delete(`http://localhost:8080/v1/flats/${property.id}`);
      // If delete operation is successful, remove the property from the state
      setProperty(null);

      toast({
        title: "Flat deleted.",
        description: "Your flat has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.error("Failed to delete the flat:", error);
      // Optionally, you can also display an error toast here
      toast({
        title: "Failed to delete flat.",
        description: "There was an error deleting your flat. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

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
          <Image
            src={
              "https://cdn.apartmenttherapy.info/image/upload/v1619013756/at/house%20tours/2021-04/Erin%20K/KERR-130-CLARKSON-2R-01-020577-EDIT-WEB.jpg"
            }
            alt={`Property1`}
          />
          <Image
            src={
              "https://www.mastrid.com/wp-content/uploads/2021/02/DepaSantaCatalina.jpg"
            }
            alt={`Property2`}
          />
          <Image
            src={
              "https://dom.com.cy/upload/resize_cache/iblock/7cb/870_654_2/7cb9955a62fb012942910a0882e3cadd.jpg"
            }
            alt={`Property3`}
          />
        </Carousel>
        <Heading size="md" mb={2} fontWeight="bold">
          Availability:
        </Heading>
        <Box bg="gray.100" p={3} rounded="md" width="full" mb={2}>
          <Text fontWeight="medium">
            From: {format(parseISO(property.dateFrom), "dd MMMM yy")}
          </Text>
        </Box>
        <Box bg="gray.100" p={3} rounded="md" width="full">
          <Text fontWeight="medium">
            To: {format(parseISO(property.dateTo), "dd MMMM yy")}
          </Text>
        </Box>
        <Text>
          <Icon as={FaMapMarkerAlt} color="#F13B07" /> {property.address.street}
          , {property.address.city}
        </Text>
        <Text fontStyle={"italic"}>{property.description}</Text>
        <Button
          leftIcon={<Icon as={FaTrash} />}
          backgroundColor={"brand.900"}
          textColor={"white"}
          variant="outline"
          onClick={() => deleteFlat(property)}
        >
          Delete Flat
        </Button>
      </VStack>
    </MotionBox>
  );
};

export default PropertyInfo;
