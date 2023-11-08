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

const MotionBox = motion(Box);

// Framer motion variants for the animation
const variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

type PropertyType = {
    images: string[];
    name: string;
    description: string;
    location: string;
    reviews: string[];
};

const PropertyInfo = ({ property }: { property: PropertyType }) => {
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
        <Heading as="h2" size="lg" color="#F13B07">
          {property.name}
        </Heading>
        <Text>{property.description}</Text>
        <Text>
          <Icon as={FaMapMarkerAlt} color="#F13B07" /> {property.location}
        </Text>
        <Heading as="h3" size="md" color="#F13B07">
          Reviews
        </Heading>
        <List spacing={2}>
          {property.reviews.map((review, index) => (
            <ListItem key={index}>
              <ListIcon as={FaStar} color="yellow.400" />
              {review}
            </ListItem>
          ))}
        </List>
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
