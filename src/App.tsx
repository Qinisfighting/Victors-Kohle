// import { useState } from "react";
import "./App.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Day from "./components/day";
import PocketMoney from "@/components/pocketMoney";
import Savings from "@/components/savings";


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
    </>
  );
}

export default App;
