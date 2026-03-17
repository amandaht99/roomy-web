"use client";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import {
  Steps,
  useDisclosure,
  Button,
  Stack,
  Input,
  Spacer,
  Flex,
  Field,
  Dialog,
  Portal,
} from "@chakra-ui/react";
import axios from "axios";
import { useProperties } from "@/context/properties-context";
import { LuSearch } from "react-icons/lu";
import { toaster } from "@/components/ui/toaster";

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
  const { open, onOpen, onClose } = useDisclosure();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SearchFormData>();

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
        `${process.env.NEXT_PUBLIC_API_URL}/api/flats/search`,
        { filters: parsedData },
      );

      setProperties(response.data);

      setFiltersApplied(true);

      onClose();

      // A success toast
      toaster.success({
        title: "Filter applied.",
        description: "The filter request was successful.",
      });
    } catch (e) {
      console.error(e);
      // An error toast for error handling
      toaster.error({
        title: "Failed to apply filters.",
        description:
          "There was an error processing the filter request. Please try again.",
      });
    }
  }

  //The form is used to submit the search filters.
  return (
    <>
      <Button
        data-cy="search-button"
        onClick={onOpen}
        backgroundColor="#F13B07"
      >
        Search
        <LuSearch />
      </Button>
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
              <Dialog.Header>Find a Swap</Dialog.Header>
              <Dialog.CloseTrigger />
              <form onSubmit={handleSubmit(fetchFlats)}>
                <Dialog.Body>
                  <Stack>
                    <Field.Root invalid={!!errors?.city}>
                      <Field.Label htmlFor="city">
                        I want to stay in ...
                      </Field.Label>
                      <Input
                        id="city"
                        data-cy="city-input"
                        placeholder="Search city"
                        {...register("city", { required: "City is required" })}
                      />
                      {errors.city && <p>{errors.city.message}</p>}
                    </Field.Root>

                    <Spacer height={"20px"} />

                    <Field.Root invalid={!!errors?.hometown}>
                      <Field.Label htmlFor="hometown">
                        and could offer a place in ...
                      </Field.Label>

                      <Input
                        id="hometown"
                        data-cy="hometown-input"
                        placeholder="Search city"
                        {...register("hometown", {
                          required: "Hometown is required",
                        })}
                      />
                      {errors.hometown && <p>{errors.hometown.message}</p>}
                    </Field.Root>

                    <Spacer height={"20px"} />

                    <Field.Root invalid={!!errors?.dateFrom}>
                      <Field.Label htmlFor="dateFrom">from ...</Field.Label>
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
                    </Field.Root>

                    <Spacer height={"20px"} />

                    <Field.Root invalid={!!errors?.dateTo}>
                      <Field.Label htmlFor="dateTo">until ...</Field.Label>

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
                    </Field.Root>
                  </Stack>
                </Dialog.Body>

                <Dialog.Footer>
                  <Button
                    data-cy="submit-button"
                    mt={4}
                    backgroundColor={"brand.900"}
                    loading={isSubmitting}
                    type="submit"
                  >
                    Submit
                  </Button>
                </Dialog.Footer>
              </form>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
