import { Center } from "@chakra-ui/react";
import { SignUp } from "@clerk/nextjs";

// Page displays the SignUp form from Clerk
export default function Page() {
  return (
    <Center h={"90vh"}>
      <SignUp signInUrl="/sign-in" redirectUrl="/home" />;
    </Center>
  );
}
