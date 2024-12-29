// import { useState } from "react";
import "./App.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Day from "./components/day";
import PocketMoney from "@/components/pocketMoney";
import Savings from "@/components/savings";
import SignIn from "@/components/signIn";
import { UserAuth } from "./context/AuthContext";
import { User } from "firebase/auth";

function App() {
  const { user }: { user: User | null } = UserAuth() as { user: User | null };
  return (
    <>   
        <SignIn  />
       { user &&
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
        } 
    </>
  );
}

export default App;
