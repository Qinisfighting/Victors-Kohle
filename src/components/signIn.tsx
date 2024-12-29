import GoogleButton from "react-google-button";
import { Button } from "@/components/ui/button";
import { UserAuth } from "../context/AuthContext";
import { User } from "firebase/auth";

export function Greeting({
  name,
  handleSignOut,
}: {
  name: string;
  handleSignOut: () => void;
}) {
  // const { user }: { user: User | null } = UserAuth() as { user: User | null };
  const date = new Date();
  const hours = date.getHours();
  // console.log(hours);
  let timeOfDay;
  if (hours >= 4 && hours < 12) {
    timeOfDay = "Guten Morgen";
  } else if (hours >= 12 && hours < 18) {
    timeOfDay = "Guten Nachmittag";
  } else if (hours >= 18 && hours < 22) {
    timeOfDay = "Guten Abend";
  } else {
    timeOfDay = "Gute Nacht";
  }
  return (
    <div className="w-auto text-center flex justify-center items-center">
      <h2 className="px-6">
        {timeOfDay}, {name}!
      </h2>
      <div className="flex gap-4">
        <Button
          className="w-20 h-8 p-2 m-4"
          onClick={() => handleSignOut()}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

const SignIn = () => {
  const {
    googleSignIn,
    logOut,
    user,
  }: {
    googleSignIn: () => Promise<void>;
    logOut: () => Promise<void>;
    user: User | null;
  } = UserAuth() as {
    googleSignIn: () => Promise<void>;
    logOut: () => Promise<void>;
    user: User | null;
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };
 const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  return user === null ? (
    <div className="w-auto  flex flex-col justify-center items-center h-view">
      <GoogleButton  label='Mit Google anmelden' onClick={() => handleGoogleSignIn()} />
      <p className="px-8 py-4">
        Kein Google-Konto? Registriere dich{" "}
        <a
          className="underline"
          href="https://support.google.com/mail/answer/56256?hl=en"
          target="_blank"
          rel="noreferrer"
        >
          hier
        </a>
        .
      </p>
    </div>
  ) : (
    <Greeting
      name={user?.displayName || "Benutzer"}
      handleSignOut={handleSignOut}
    />
  );
};

export default SignIn;
