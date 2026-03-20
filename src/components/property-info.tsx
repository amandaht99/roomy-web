"use client";
import {
  Steps,
  Box,
  Heading,
  Text,
  VStack,
  Image,
  Icon,
  Button,
} from "@chakra-ui/react";
import { FaMapMarkerAlt, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { useEffect, useState } from "react";
import axios from "axios";
import FlatForm from "./upload-property-button";
import NoImagePlaceholder from "./no-image-placeholder";
import { format, parseISO } from "date-fns";
import { ChangeDateButton } from "./change-date-button";
import { useAuth } from "@clerk/nextjs";
import { toaster } from "@/components/ui/toaster";

const MotionBox = motion.create(Box);

// Framer motion variants for the animation
const variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

function getImageFileName(imageUrl: string) {
  const pathWithoutQuery = imageUrl.split("?")[0].split("#")[0];
  const fileName = pathWithoutQuery.split("/").pop() || "image";
  return decodeURIComponent(fileName);
}

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

  // Function to fetch the property details of the user
  async function getFlat(userId: string | null | undefined) {
    if (!userId) return;

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/flats/user/${userId}`,
    );
    setProperty(response.data);
  }

  // Function to delete the user's property
  const deleteFlat = async (property: Property) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/flats/${property.id}`,
      );
      // If delete operation is successful, remove the property from the state
      setProperty(null);

      toaster.success({
        title: "Flat deleted.",
        description: "Your flat has been successfully deleted.",
      });
    } catch (error) {
      console.error("Failed to delete the flat:", error);
      toaster.error({
        title: "Failed to delete flat.",
        description: "There was an error deleting your flat. Please try again.",
      });
    }
  };

  // Fetch the property when the component mounts
  useEffect(() => {
    getFlat(userId);
  }, [userId]);

  // If user does not have a property, display a message and a form to add a property
  if (!property) {
    return (
      <VStack>
        <Text>You dont have a flat yet!!!</Text>
        <FlatForm setProperty={setProperty} userId={userId} />
      </VStack>
    );
  }

  // Display the property details
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
      <VStack align="start" gap={5}>
        <Carousel showThumbs={false}>
          {property.images.length > 0
            ? property.images.map((image, index) => (
                <Box
                  key={`${image}-${index}`}
                  w="100%"
                  borderRadius="md"
                  overflow="hidden"
                  aspectRatio={4 / 3}
                >
                  <Image
                    src={image}
                    alt={`Property ${index + 1}`}
                    title={getImageFileName(image)}
                    loading="lazy"
                    h="100%"
                    w="100%"
                    objectFit="cover"
                  />
                </Box>
              ))
            : [
                <Box
                  key="empty-image-placeholder"
                  w="100%"
                  aspectRatio={4 / 3}
                  borderRadius="md"
                  overflow="hidden"
                >
                  <NoImagePlaceholder />
                </Box>,
              ]}
        </Carousel>
        <Heading size="md" mb={2} fontWeight="bold">
          Availability:
        </Heading>

        <ChangeDateButton
          property={property}
          setProperty={setProperty}
          type="From"
        />

        <Box bg="gray.100" p={3} rounded="md" width="full" mb={2}>
          <Text fontWeight="medium">
            From: {format(parseISO(property.dateFrom), "dd MMMM yy")}
          </Text>
        </Box>

        <ChangeDateButton
          property={property}
          setProperty={setProperty}
          type="To"
        />

        <Box bg="gray.100" p={3} rounded="md" width="full">
          <Text fontWeight="medium">
            To: {format(parseISO(property.dateTo), "dd MMMM yy")}
          </Text>
        </Box>
        <Text>
          <Icon color="#F13B07" asChild>
            <FaMapMarkerAlt />
          </Icon>{" "}
          {property.address.street}, {property.address.city}
        </Text>
        <Text fontStyle={"italic"}>{property.description}</Text>
        <Button
          backgroundColor={"brand.900"}
          color={"white"}
          variant="outline"
          onClick={() => deleteFlat(property)}
        >
          <Icon asChild>
            <FaTrash />
          </Icon>
          Delete Flat
        </Button>
      </VStack>
    </MotionBox>
  );
};

export default PropertyInfo;
