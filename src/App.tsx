// import { useState } from "react";
import "./App.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Day from "./components/day";
import PocketMoney from "@/components/pocketMoney";
import Savings from "@/components/savings";
import SignIn from "@/components/signIn";

function App() {
  return (
    <>
      <div>
        <Day />
        <Tabs
          defaultValue="pocketMoney"
          className="max-w-md bg-transparent border-none"
        >
          <TabsList className="flex justify-around gap-2">
            <TabsTrigger value="pocketMoney" className="w-1/3">
              Taschengeld
            </TabsTrigger>
            <TabsTrigger value="savings" className="w-1/3">
              Spardose
            </TabsTrigger>
            <TabsTrigger value="signIn" className="w-1/3">
              Anmelden
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pocketMoney">
            <PocketMoney />
          </TabsContent>
          <TabsContent value="savings">
            <Savings />
          </TabsContent>
          <TabsContent value="signIn">
            <SignIn />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default App;
