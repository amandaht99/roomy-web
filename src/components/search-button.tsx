"use client";
import { useForm, Controller } from "react-hook-form";
import { SearchIcon } from "@chakra-ui/icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Spacer,
  Flex,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useProperties } from "@/context/properties-context";

// SearchFormData type defines the structure of the search form data
interface SearchFormData {
  city: string;
  hometown: string;
  dateFrom: Date;
  dateTo: Date;
}

// Displays a search button and a modal form for searching properties
export default function SearchButton() {
  const { setProperties, setFiltersApplied } = useProperties();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SearchFormData>();
  const toast = useToast();

  // FetchFlats function sends a POST request to the backend with the search filters, 
  // then updates the properties in the context and shows a toast notification
  async function fetchFlats(data: SearchFormData) {
    try {
      const parsedData = {
        city: data.city,
        dateFrom: data.dateFrom,
        dateTo: data.dateTo,
        hometown: data.hometown,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/v1/flats/search`,
        { filters: parsedData }
      );

      setProperties(response.data);

      setFiltersApplied(true);

      onClose();

      // A success toast
      toast({
        title: "Filter applied.",
        description: "The filter request was successful.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (e) {
      console.error(e);
      // An error toast for error handling
      toast({
        title: "Failed to apply filters.",
        description:
          "There was an error processing the filter request. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  }

  //The form is used to submit the search filters.
  return (
    <>
      <Button
        data-cy="search-button"
        rightIcon={<SearchIcon />}
        onClick={onOpen}
        textColor={"white"}
        backgroundColor="#F13B07"
      >
        Search
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Find a Swap</ModalHeader>
          <ModalCloseButton />

          <form onSubmit={handleSubmit(fetchFlats)}>
            <ModalBody>
              <Stack>
                <FormControl isInvalid={!!errors?.city}>
                  <FormLabel htmlFor="city">I want to stay in ...</FormLabel>
                  <Input
                    id="city"
                    data-cy="city-input"
                    placeholder="Search city"
                    {...register("city", { required: "City is required" })}
                  />
                  {errors.city && <p>{errors.city.message}</p>}
                </FormControl>

                <Spacer height={"20px"} />

                <FormControl isInvalid={!!errors?.hometown}>
                  <FormLabel htmlFor="hometown">
                    and could offer a place in ...
                  </FormLabel>

                  <Input
                    id="hometown"
                    data-cy="hometown-input"
                    placeholder="Search city"
                    {...register("hometown", {
                      required: "Hometown is required",
                    })}
                  />
                  {errors.hometown && <p>{errors.hometown.message}</p>}
                </FormControl>

                <Spacer height={"20px"} />

                <FormControl isInvalid={!!errors?.dateFrom}>
                  <FormLabel htmlFor="dateFrom">from ...</FormLabel>
                  <Flex>
                    <Controller
                      name="dateFrom"
                      control={control}
                      rules={{ required: "Date selection is required" }}
                      render={({ field }) => (
                        <DatePicker
                          onChange={field.onChange}
                          selected={field.value}
                          dateFormat="dd/MM/yyyy"
                          minDate={new Date()}
                          showTimeSelect={false}
                          todayButton="Today"
                          customInput={
                            <Input w={"100%"} data-cy="dateFrom-input" />
                          }
                          dropdownMode="select"
                          placeholderText="Choose start date"
                          shouldCloseOnSelect
                        />
                      )}
                    />
                    {errors.dateFrom && <p>{errors.dateFrom.message}</p>}
                  </Flex>
                </FormControl>

                <Spacer height={"20px"} />

                <FormControl isInvalid={!!errors?.dateTo}>
                  <FormLabel htmlFor="dateTo">until ...</FormLabel>

                  <Controller
                    name="dateTo"
                    control={control}
                    rules={{ required: "Date selection is required" }}
                    render={({ field }) => (
                      <DatePicker
                        onChange={field.onChange}
                        selected={field.value}
                        dateFormat="dd/MM/yyyy"
                        minDate={new Date()}
                        showTimeSelect={false}
                        todayButton="Today"
                        customInput={
                          <Input w={"100%"} data-cy="dateTo-input" />
                        }
                        dropdownMode="select"
                        placeholderText="Choose end date"
                        shouldCloseOnSelect
                      />
                    )}
                  />
                  {errors.dateTo && <p>{errors.dateTo.message}</p>}
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button
                data-cy="submit-button"
                mt={4}
                backgroundColor={"brand.900"}
                textColor={"white"}
                isLoading={isSubmitting}
                type="submit"
              >
                Submit
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
