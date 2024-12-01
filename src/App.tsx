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
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="pocketMoney">Pocket Money</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="signIn">Sign In</TabsTrigger>
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
