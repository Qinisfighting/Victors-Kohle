// import { useState } from "react";
import "./App.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Day from "./components/day";
import PocketMoney from "@/components/pocketMoney";
import { Toaster } from "@/components/ui/toaster";
import Savings from "@/components/savings";
import SignIn from "@/components/signIn";
import { UserAuth } from "./context/AuthContext";
import { User } from "firebase/auth";
import logo from "./assets/logo.webp";
import Loader from "@/components/loader";

function App() {
  const { user, authLoading }: { user: User | null; authLoading: boolean } =
    UserAuth() as { user: User | null; authLoading: boolean };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-strech justify-around min-h-screen w-full">
        <div>
          <div className="text-center border-b border-dashed border-gray-800 border-opacity-50">
            <img
              src={logo}
              alt="Victors Kohle"
              width="512"
              height="429"
              loading="eager"
              fetchPriority="high"
              className="block h-auto w-[11rem] max-w-full mx-auto mb-4"
            />
          </div>
          <SignIn />
          {user && (
            <div>
              <Day />
              <Tabs
                defaultValue="pocketMoney"
                className="max-w-md bg-transparent border-none"
              >
                <TabsList className="flex justify-around gap-2">
                  <TabsTrigger value="pocketMoney" className="w-1/2">
                    Taschengeld
                  </TabsTrigger>
                  <TabsTrigger value="savings" className="w-1/2">
                    Spardose
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="pocketMoney">
                  <PocketMoney />
                </TabsContent>
                <TabsContent value="savings">
                  <Savings />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
        <Toaster />
        <footer className="text-center text-gray-500 text-xs mt-16">
          © {new Date().getFullYear()} by{" "}
          <a
            href="https://www.yanqin.de"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-600 text-gray-700"
          >
            QIN's code
          </a>
          {" · "}
          <a
            href="/privacy.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-600 text-gray-700"
          >
            Datenschutz
          </a>
        </footer>
      </div>
    </>
  );
}

export default App;
