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
} from "@chakra-ui/react";
import { Property } from "./property-info";
import { Dispatch, SetStateAction } from "react";
import axios from "axios";
import { parseISO } from "date-fns";

interface UploadFormData {
  description?: string;
  rooms?: string;
  images?: string[];
  address: { street: string; city: string; country: string };
  dateFrom: string;
  dateTo: string;
  swapWithCity: string;
}

const FlatForm = (props: {
  setProperty: Dispatch<SetStateAction<Property | null>>;
  userId?: string | null;
}) => {
  const { setProperty, userId } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleSubmit, control } = useForm<UploadFormData>();

  const onSubmit = async (data: UploadFormData) => {
    if (!userId) return;

    try {
      const parsedData = {
        ...data,
        dateFrom: parseISO(data.dateFrom),
        dateTo: parseISO(data.dateTo),
      };

      const response = await axios.post(
        `http://localhost:8080/v1/flats/user/${userId}`,
        parsedData
      );

      setProperty(response.data);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

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
