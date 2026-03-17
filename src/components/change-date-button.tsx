import {
  Steps,
  Button,
  IconButton,
  Input,
  useDisclosure,
  Field,
  Dialog,
  Portal,
} from "@chakra-ui/react";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { Property } from "./property-info";
import { Dispatch, SetStateAction } from "react";
import { LuPencil } from "react-icons/lu";
import { toaster } from "@/components/ui/toaster";

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
  const { open, onOpen, onClose } = useDisclosure();

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
        process.env.NEXT_PUBLIC_API_URL + "/api/flats/" + property.id + "/date",
        formData,
      );

      setProperty(response.data);
      onClose();

      // A success toast
      toaster.success({
        title: "Changes applied.",
        description: "The date has been succesfully updated.",
      });
    } catch (e) {
      console.error(e);
      // An erorr toast for error handling
      toaster.error({
        title: "Failed to apply changes.",
        description:
          "There was an error applying your change. Please try again.",
      });
    }
  };

  return (
    <>
      <IconButton
        aria-label="Edit date"
        onClick={onOpen}
        size="sm"
        variant="outline"
        data-cy={`date${type}-edit-button`}
      >
        <LuPencil />
      </IconButton>
      <Dialog.Root
        open={open}
        onOpenChange={(e) => {
          if (!e.open) {
            onClose();
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>Edit Date</Dialog.Header>
              <Dialog.CloseTrigger />
              <Dialog.Body>
                <Field.Root>
                  <Field.Label>Change Date</Field.Label>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="date"
                        {...field}
                        data-cy={`date${type}-input`}
                      />
                    )}
                  />
                </Field.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  onClick={changeDate}
                  data-cy={`date${type}-submit-button`}
                >
                  Change Date
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
