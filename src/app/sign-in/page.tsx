import { Steps, Center } from "@chakra-ui/react";
import { SignIn } from "@clerk/nextjs";

// Page displays the SignIn form from Clerk
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ redirectUrl?: string | string[] }>;
}) {
  const params = await searchParams;
  const redirectUrlParam =
    typeof params.redirectUrl === "string"
      ? params.redirectUrl
      : Array.isArray(params.redirectUrl)
        ? params.redirectUrl[0]
        : undefined;

  const fallbackRedirectUrl =
    redirectUrlParam && redirectUrlParam.startsWith("/")
      ? redirectUrlParam
      : "/home";

  return (
    <Center h={"90vh"}>
      <SignIn signUpUrl="/sign-up" fallbackRedirectUrl={fallbackRedirectUrl} />
    </Center>
  );
}
