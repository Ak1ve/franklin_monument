import {useState} from "react";
import {signOut, useSession} from "next-auth/react";
import axios from "axios";

export default function Home() {

    const {data: session, status} = useSession({required: true});
    const [response, setResponse] = useState("{}");
  
    const getUserDetails = async (useToken: boolean) => {
      try {
        const response = await axios({
          method: "get",
          url: process.env.NEXT_PUBLIC_BACKEND_URL + "auth/user/",
          headers: useToken ? {Authorization: "Bearer " + (session as any)?.access_token} : {},
        });
        setResponse(JSON.stringify(response.data));
      } catch (error: any) {
        setResponse(error.message);
      }
    };
  
    if (status == "loading") {
      return "loading";
    }
    /*
    if (session) {
      return (
        <>
        /*
            <div>PK: {session.user.pk}</div>
            <div>Username: {session.user.username}</div>
            <div>Email: {session.user.email || "Not provided"}</div>
            <div>
              {response}
            </Code>
          </VStack>
          <HStack justifyContent="center" mt={4}>
            <Button colorScheme="blue" onClick={() => getUserDetails(true)}>
              User details (with token)
            </Button>
            <Button colorScheme="orange" onClick={() => getUserDetails(false)}>
              User details (without token)
            </Button>
            <Button colorScheme="red" onClick={() => signOut({callbackUrl: "/"})}>
              Sign out
            </Button>
            </>
      );
    }
    */
    if (session) {
        <>Logged in!</>
    }
    return <></>;
  }