"use client";
import {
  Box,
  Heading,
  Text,
  VStack,
  Image,
  Icon,
  Button,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { FaMapMarkerAlt, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import FlatForm from "./upload-property-button";
import { format, parseISO } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { EditIcon } from "@chakra-ui/icons";
import DatePicker from "react-datepicker";

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

  // Function to fetch the property details of the user
  async function getFlat(userId: string | null | undefined) {
    if (!userId) return;

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_DATABASE_URL}/v1/flats/user/${userId}`
    );
    console.log(response.data);
    setProperty(response.data);
  }

  const toast = useToast();

  // Function to delete the user's property
  const deleteFlat = async (property: Property) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/v1/flats/${property.id}`
      );
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

  const {
    isOpen: dateFromIsOpen,
    onOpen: dateFromOnOpen,
    onClose: dateFromOnClose,
  } = useDisclosure();
  const {
    isOpen: dateToIsOpen,
    onOpen: dateToOnOpen,
    onClose: dateToOnClose,
  } = useDisclosure();
  const { control: dateFromControl, getValues: dateFromGetValues } = useForm({
    defaultValues: {
      dateFrom: property ? property.dateFrom : "",
    },
  });
  const { control: dateToControl, getValues: dateToGetValues } = useForm({
    defaultValues: {
      dateTo: property ? property.dateFrom : "",
    },
  });

  const changeDate = async (type, date, onClose) => {
    if (!property) return;

    try {
      const formData = {
        type,
        date,
      };

      const response = await axios.put(
        process.env.NEXT_PUBLIC_DATABASE_URL +
          "/v1/flats/" +
          property.id +
          "/date",
        formData
      );

      setProperty(response.data);
      onClose();

      // A success toast
      toast({
        title: "Changes applied.",
        description: "The dates have been succesfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (e) {
      console.error(e);
      // An erorr toast for error handling
      toast({
        title: "Failed to apply changes.",
        description:
          "There was an error applying your change. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
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

        <IconButton
          aria-label="Edit fromDate"
          icon={<EditIcon />}
          onClick={dateFromOnOpen}
          size="sm"
          variant="outline"
          data-cy="dateFrom-edit-button"
        />

        <Modal isOpen={dateFromIsOpen} onClose={dateFromOnClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Begin Date</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Date From</FormLabel>
                <Controller
                  name="dateFrom"
                  control={dateFromControl}
                  render={({ field }) => <Input type="date" {...field} data-cy={"dateFrom-input"}/>}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={() =>
                  changeDate(
                    "from",
                    dateFromGetValues("dateFrom"),
                    dateFromOnClose
                  )
                }
                data-cy={"dateFrom-submit-button"}
              >
                Change Date
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Box bg="gray.100" p={3} rounded="md" width="full" mb={2}>
          <Text fontWeight="medium">
            From: {format(parseISO(property.dateFrom), "dd MMMM yy")}
          </Text>
        </Box>

        <IconButton
          aria-label="Edit toDate"
          icon={<EditIcon />}
          onClick={dateToOnOpen}
          size="sm"
          variant="outline"
          data-cy="dateTo-edit-button"
        />

        <Modal isOpen={dateToIsOpen} onClose={dateToOnClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit End Date</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Date To</FormLabel>
                <Controller
                  name="dateTo"
                  control={dateToControl}
                  render={({ field }) => <Input type="date" {...field} data-cy={"dateTo-input"}/>}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={() =>
                  changeDate("to", dateToGetValues("dateTo"), dateToOnClose)
                }
                data-cy={"dateTo-submit-button"}
              >
                Change Date
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

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
