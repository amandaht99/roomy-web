import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Property } from "./property-info";
import { Dispatch, SetStateAction } from "react";
import axios from "axios";
import { parseISO } from "date-fns";

interface UploadFormData {
  description?: string;
  rooms?: string;
  images: string[] | [];
  address: { street: string; city: string; country: string };
  dateFrom: string;
  dateTo: string;
  swapWithCity: string;
}

//Flatform is a component for uploading property information
const FlatForm = (props: {
  setProperty: Dispatch<SetStateAction<Property | null>>;
  userId?: string | null;
}) => {
  const { setProperty, userId } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleSubmit, control } = useForm<UploadFormData>({
    defaultValues: { images: [], address: {} },
  });

  const toast = useToast();

  function convertToUppercase(string: string) {
    return string[0].toUpperCase() + string.substring(1);
  }

  const onSubmit = async (data: UploadFormData) => {
    if (!userId) return;

    // Parsing the data and making a POST request to the server
    try {
      const parsedData = {
        ...data,
        dateFrom: parseISO(data.dateFrom),
        dateTo: parseISO(data.dateTo),
        swapWithCity: convertToUppercase(data.swapWithCity),
        address: {
          ...data.address,
          street: convertToUppercase(data.address.street),
          city: convertToUppercase(data.address.city),
          country: convertToUppercase(data.address.country),
        },
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/flats/user/${userId}`,
        parsedData
      );

      setProperty(response.data);
      onClose();

      // A success toast
      toast({
        title: "Flat uploaded.",
        description: "Your flat has been successfully uploaded.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (e) {
      console.error(e);
      // An erorr toast for error handling
      toast({
        title: "Failed to upload flat.",
        description:
          "There was an error uploading your flat. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  // Rendering the component
  return (
    <>
      <Button onClick={onOpen} textColor={"white"} backgroundColor="#F13B07">
        Upload Property
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Fill in Property Info</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              as="form"
              onSubmit={handleSubmit(onSubmit)}
              p="5"
              shadow="md"
              borderWidth="1px"
            >
              <VStack spacing="5">
                <FormControl isRequired={true} id="swapWithCity">
                  <FormLabel>I want to stay in ...</FormLabel>
                  <Controller
                    name="swapWithCity"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Enter city" />
                    )}
                  />
                </FormControl>
                <FormControl isRequired={true} id="street">
                  <FormLabel>My property is in ...</FormLabel>
                  <Controller
                    name="address.street"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Enter street" />
                    )}
                  />
                </FormControl>
                <FormControl isRequired={true} id="city">
                  <Controller
                    name="address.city"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Enter city" />
                    )}
                  />
                </FormControl>
                <FormControl isRequired={true} id="country">
                  <Controller
                    name="address.country"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Enter country" />
                    )}
                  />
                </FormControl>
                <FormControl id="description">
                  <FormLabel>Description (optional)</FormLabel>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => <Textarea {...field} />}
                  />
                </FormControl>
                <FormControl isRequired={true} id="dateFrom">
                  <FormLabel>I could swap from ...</FormLabel>
                  <Controller
                    name="dateFrom"
                    control={control}
                    render={({ field }) => <Input type="date" {...field} />}
                  />
                </FormControl>
                <FormControl isRequired={true} id="dateTo">
                  <FormLabel>until ...</FormLabel>
                  <Controller
                    name="dateTo"
                    control={control}
                    render={({ field }) => <Input type="date" {...field} />}
                  />
                </FormControl>
                <FormControl id="rooms">
                  <FormLabel>Rooms (optional)</FormLabel>
                  <Controller
                    name="rooms"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Enter number of rooms" />
                    )}
                  />
                </FormControl>
                {/* <FormControl isRequired={true} id="images">
                  <FormLabel>Images (optional)</FormLabel>
                  <Controller
                    name="images"
                    control={control}
                    defaultValue=""
                    render={({ field }) => <Input {...field} placeholder="Enter image URLs separated by commas" />}
                  />
                </FormControl> */}
              </VStack>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              backgroundColor="brand.900"
              textColor={"white"}
              type="submit"
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FlatForm;
