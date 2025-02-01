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
import logo from "./assets/logo.png";

function App() {
  const { user }: { user: User | null } = UserAuth() as { user: User | null };
  return (
    <>
      <div className="flex flex-col items-strech justify-around min-h-screen w-full">
        <div>
          <div className="text-center border-b border-dashed border-gray-800 border-opacity-50">
            <img
              src={logo}
              alt="logo"
              className="inline-block w-32 h-32 mb-4 mx-auto "
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
        </footer>
      </div>
    </>
  );
}

export default App;
