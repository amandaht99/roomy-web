import { EditIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { Property } from "./property-info";
import { Dispatch, SetStateAction } from "react";

type ChangeDateButtonProps = {
  property: Property;
  setProperty: Dispatch<SetStateAction<Property | null>>;
  type: "From" | "To";
};

export function ChangeDateButton({
  property,
  setProperty,
  type,
}: ChangeDateButtonProps) {
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { control, getValues } = useForm({
    defaultValues: {
      date: type === "From" ? property.dateFrom : property.dateTo,
    },
  });

  const changeDate = async () => {
    if (!property) return;

    try {
      const formData = {
        type,
        date: getValues("date"),
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
        description: "The date has been succesfully updated.",
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

  return (
    <>
      <IconButton
        aria-label="Edit date"
        icon={<EditIcon />}
        onClick={onOpen}
        size="sm"
        variant="outline"
        data-cy={`date${type}-edit-button`}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Date</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Change Date</FormLabel>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Input type="date" {...field} data-cy={`date${type}-input`} />
                )}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={changeDate} data-cy={`date${type}-submit-button`}>
              Change Date
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
