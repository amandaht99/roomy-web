import { useForm, Controller } from "react-hook-form";
import {
  Steps,
  Box,
  Button,
  Input,
  Image,
  Text,
  Textarea,
  VStack,
  HStack,
  useDisclosure,
  Field,
  Dialog,
  Portal,
} from "@chakra-ui/react";
import { Property } from "./property-info";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { parseISO } from "date-fns";
import { toaster } from "@/components/ui/toaster";

interface UploadFormData {
  description?: string;
  rooms?: string;
  address: { street: string; city: string; country: string };
  dateFrom: string;
  dateTo: string;
  swapWithCity: string;
}

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGES = 3;

//Flatform is a component for uploading property information
const FlatForm = (props: {
  setProperty: Dispatch<SetStateAction<Property | null>>;
  userId?: string | null;
}) => {
  const { setProperty, userId } = props;
  const { open, onOpen, onClose } = useDisclosure();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const { handleSubmit, control } = useForm<UploadFormData>({
    defaultValues: { address: {} },
  });

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  function convertToUppercase(string: string) {
    return string[0].toUpperCase() + string.substring(1);
  }

  const resetImageSelection = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setSelectedImages([]);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const combinedFiles = [...selectedImages, ...files];

    if (combinedFiles.length > MAX_IMAGES) {
      toaster.error({
        title: "Too many images.",
        description: `You can select up to ${MAX_IMAGES} images.`,
      });
      event.target.value = "";
      return;
    }

    const hasInvalidType = files.some(
      (file) => !ALLOWED_IMAGE_TYPES.has(file.type),
    );
    if (hasInvalidType) {
      toaster.error({
        title: "Unsupported image type.",
        description: "Only jpeg, png, and webp files are allowed.",
      });
      event.target.value = "";
      return;
    }

    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    const nextPreviewUrls = combinedFiles.map((file) =>
      URL.createObjectURL(file),
    );

    setSelectedImages(combinedFiles);
    setPreviewUrls(nextPreviewUrls);
    event.target.value = "";
  };

  const onSubmit = async (data: UploadFormData) => {
    if (!userId) return;
    setIsSubmitting(true);
    setUploadProgress(null);

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
        parsedData,
      );

      const createdFlat = response.data;

      if (selectedImages.length > 0 && createdFlat?.id) {
        try {
          const uploadFormData = new FormData();
          uploadFormData.append("flatId", String(createdFlat.id));
          selectedImages.forEach((file) => {
            uploadFormData.append("images", file);
          });

          const uploadResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
            uploadFormData,
            {
              onUploadProgress: (progressEvent) => {
                if (!progressEvent.total) return;
                const progress = Math.round(
                  (progressEvent.loaded / progressEvent.total) * 100,
                );
                setUploadProgress(progress);
              },
            },
          );

          setProperty({
            ...createdFlat,
            imagesPaths:
              uploadResponse.data.imagesPaths ?? createdFlat.imagesPaths,
            images: uploadResponse.data.images ?? createdFlat.images,
          });

          onClose();
          resetImageSelection();

          // A success toast
          toaster.success({
            title: "Flat uploaded.",
            description: "Your flat has been successfully uploaded.",
          });
        } catch (uploadError) {
          console.error(uploadError);
          setProperty(createdFlat);
          onClose();
          resetImageSelection();

          toaster.error({
            title: "Image upload failed.",
            description:
              "Your flat was created, but image upload failed. You can retry later.",
          });
        }
      } else {
        setProperty(createdFlat);
        onClose();
        resetImageSelection();

        // A success toast
        toaster.success({
          title: "Flat uploaded.",
          description: "Your flat has been successfully uploaded.",
        });
      }
    } catch (e) {
      console.error(e);
      // An erorr toast for error handling
      toaster.error({
        title: "Failed to upload flat.",
        description:
          "There was an error uploading your flat. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  // Rendering the component
  return (
    <>
      <Button onClick={onOpen} backgroundColor="#F13B07">
        Upload Property
      </Button>
      <Dialog.Root
        open={open}
        size="xl"
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
              <Dialog.Header>Fill in Property Info</Dialog.Header>
              <Dialog.CloseTrigger />
              <Dialog.Body>
                <Box p="5" shadow="md" borderWidth="1px" asChild>
                  <form onSubmit={handleSubmit(onSubmit)}>
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
                          render={({ field }) => (
                            <Input type="date" {...field} />
                          )}
                        />
                      </Field.Root>
                      <Field.Root required={true} id="dateTo">
                        <Field.Label>until ...</Field.Label>
                        <Controller
                          name="dateTo"
                          control={control}
                          render={({ field }) => (
                            <Input type="date" {...field} />
                          )}
                        />
                      </Field.Root>
                      <Field.Root id="rooms">
                        <Field.Label>Rooms (optional)</Field.Label>
                        <Controller
                          name="rooms"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="Enter number of rooms"
                            />
                          )}
                        />
                      </Field.Root>
                      <Field.Root id="images">
                        <Field.Label>Images (optional, up to 3)</Field.Label>
                        <Input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          onChange={handleImageChange}
                        />
                        {previewUrls.length > 0 ? (
                          <HStack gap={3} wrap="wrap" align="start" w="full">
                            {previewUrls.map((url, index) => (
                              <Image
                                key={`${url}-${index}`}
                                src={url}
                                alt={`Selected image ${index + 1}`}
                                boxSize="90px"
                                objectFit="cover"
                                borderRadius="md"
                                borderWidth="1px"
                                borderColor="gray.200"
                              />
                            ))}
                          </HStack>
                        ) : null}
                      </Field.Root>
                    </VStack>
                  </form>
                </Box>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  backgroundColor="brand.900"
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                >
                  {isSubmitting
                    ? uploadProgress !== null
                      ? `Uploading ${uploadProgress}%`
                      : "Submitting..."
                    : "Submit"}
                </Button>
                {isSubmitting && uploadProgress !== null ? (
                  <Text fontSize="sm" color="gray.600" ml={3}>
                    Uploading images: {uploadProgress}%
                  </Text>
                ) : null}
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default FlatForm;
