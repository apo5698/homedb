import Pets from "@/app/pets/_pets";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = () => {
  return (
    <Tabs defaultValue="pets" className="w-full">
      <TabsList className="mb-2">
        <TabsTrigger value="pets">Pets</TabsTrigger>
      </TabsList>
      <TabsContent value="pets">
        <Pets />
      </TabsContent>
    </Tabs>
  );
};

export default Page;
