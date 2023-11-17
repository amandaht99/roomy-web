import { Center } from "@chakra-ui/react";
import { SignIn } from "@clerk/nextjs";

// Page displays the SignIn form from Clerk
export default function Page() {
  return (
    <Center h={"90vh"}>
      <SignIn signUpUrl="/sign-up" redirectUrl="/home" />
    </Center>
  );
}
