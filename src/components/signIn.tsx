import GoogleButton from "react-google-button";
// import { Button } from "@/components/ui/button";
import { UserAuth } from "../context/AuthContext";
import { User } from "firebase/auth";
import logout from "../assets/logout.png";

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
    <div className="w-auto px-1 flex justify-between items-center ">
      <h2 className="text-md font-just text-gray-700">
        {timeOfDay}, {name} !
      </h2>
      <div className="">
        <img
          title="Abmelden"
          src={logout}
          alt="logout"
          className="w-4 h-4 cursor-pointer hover:animate-shake"
          onClick={() => handleSignOut()}
        />
        {/* <Button
          className="w-6 h-6 bg-white border-none rounded-full p-1"
          onClick={() => handleSignOut()}
        >
          <img
          src={logout}
          alt="logout"
          className="w-4 h-4"
         
        /> 
        </Button>
        */}
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
    <div className="w-auto  flex flex-col justify-center items-center h-view mt-8">
      <GoogleButton label='Mit Google anmelden' type="light"  onClick={() => handleGoogleSignIn()} />
      <p className="px-8 py-4 text-sm">
        Kein Google-Konto? Registriere dich{" "}
        <a
          className="text-gray-700 text-4xl hover:text-red-500"
          href="https://support.google.com/mail/answer/56256?hl=en"
          target="_blank"
          rel="noreferrer"
        >
          ⇝
        </a>
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
