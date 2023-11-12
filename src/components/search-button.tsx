"use client";
import { useState } from "react";
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
  Skeleton,
  Stack,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spacer,
  Flex,
} from "@chakra-ui/react";
import { Progress } from "@chakra-ui/react";

export default function SearchButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const [date, setDate] = useState(new Date());

  function fetchFlats(values) {
    console.log("fetching flats now with values:", values);

    // Simulates a request, replace this with your actual request
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Success");
      }, 2000);
    })
      .then(() => {
        onClose(); // Close the modal here after the request is done
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <>
      <Button
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
                <FormControl isInvalid={errors.name}>
                  <FormLabel htmlFor="city">I want to stay in ...</FormLabel>
                  <Input
                    id="city"
                    placeholder="Search city"
                    {...register("city", { required: "City is required" })}
                  />
                  {errors.city && <p>{errors.city.message}</p>}

                  <Spacer height={"20px"} />

                  <FormLabel htmlFor="city">
                    and could offer a place in ...
                  </FormLabel>

                  <Input
                    id="hometown"
                    placeholder="Search city"
                    {...register("hometown", {
                      required: "Hometown is required",
                    })}
                  />
                  {errors.hometown && <p>{errors.hometown.message}</p>}

                  <Spacer height={"20px"} />

                  <FormLabel htmlFor="city">from ...</FormLabel>
                  <Flex>
                    <Controller
                      name="fromDate"
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
                          // customInput={<StyledInput errors={errors} />}
                          dropdownMode="select"
                          placeholderText="Choose date"
                          shouldCloseOnSelect
                        />
                      )}
                    />
                    {errors.fromDate && <p>{errors.fromDate.message}</p>}
                  </Flex>
                  <Spacer height={"20px"} />

                  <FormLabel htmlFor="city">until ...</FormLabel>

                  <Controller
                    name="toDate"
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
                        // customInput={<StyledInput errors={errors} />}
                        dropdownMode="select"
                        placeholderText="Choose date"
                        shouldCloseOnSelect
                      />
                    )}
                  />
                  {errors.toDate && <p>{errors.toDate.message}</p>}
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button
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
