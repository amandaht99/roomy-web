import { useForm, Controller } from "react-hook-form";
import {
  Steps,
  Box,
  Button,
  Input,
  Textarea,
  VStack,
  useDisclosure,
  useToast,
  Field,
  Dialog,
  Portal,
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
  const { open, onOpen, onClose } = useDisclosure();
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
      <Dialog.Root open={isOpen} size='xl' onOpenChange={e => {
        if (!e.open) {
          onClose();
        }
      }}>
        <Portal>

          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>Fill in Property Info</Dialog.Header>
              <Dialog.CloseTrigger />
              <Dialog.Body>
                <Box p="5" shadow="md" borderWidth="1px" asChild><form onSubmit={handleSubmit(onSubmit)}>
                    <VStack gap="5">
                      <Field.Root required={true} id="swapWithCity">
                        <Field.Label>I want to stay in ...</Field.Label>
                        <Controller
                          name="swapWithCity"
                          control={control}
                          render={({ field }) => (
                            <Input {...field} placeholder="Enter city" />
                          )}
                        />
                      </Field.Root>
                      <Field.Root required={true} id="street">
                        <Field.Label>My property is in ...</Field.Label>
                        <Controller
                          name="address.street"
                          control={control}
                          render={({ field }) => (
                            <Input {...field} placeholder="Enter street" />
                          )}
                        />
                      </Field.Root>
                      <Field.Root required={true} id="city">
                        <Controller
                          name="address.city"
                          control={control}
                          render={({ field }) => (
                            <Input {...field} placeholder="Enter city" />
                          )}
                        />
                      </Field.Root>
                      <Field.Root required={true} id="country">
                        <Controller
                          name="address.country"
                          control={control}
                          render={({ field }) => (
                            <Input {...field} placeholder="Enter country" />
                          )}
                        />
                      </Field.Root>
                      <Field.Root id="description">
                        <Field.Label>Description (optional)</Field.Label>
                        <Controller
                          name="description"
                          control={control}
                          render={({ field }) => <Textarea {...field} />}
                        />
                      </Field.Root>
                      <Field.Root required={true} id="dateFrom">
                        <Field.Label>I could swap from ...</Field.Label>
                        <Controller
                          name="dateFrom"
                          control={control}
                          render={({ field }) => <Input type="date" {...field} />}
                        />
                      </Field.Root>
                      <Field.Root required={true} id="dateTo">
                        <Field.Label>until ...</Field.Label>
                        <Controller
                          name="dateTo"
                          control={control}
                          render={({ field }) => <Input type="date" {...field} />}
                        />
                      </Field.Root>
                      <Field.Root id="rooms">
                        <Field.Label>Rooms (optional)</Field.Label>
                        <Controller
                          name="rooms"
                          control={control}
                          render={({ field }) => (
                            <Input {...field} placeholder="Enter number of rooms" />
                          )}
                        />
                      </Field.Root>
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
                  </form></Box>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  backgroundColor="brand.900"
                  textColor={"white"}
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                >
                  Submit
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>

        </Portal>
      </Dialog.Root>
    </>
  );
};

export default FlatForm;
