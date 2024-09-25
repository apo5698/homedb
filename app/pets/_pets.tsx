"use client";

import BathCard from "@/app/pets/_cards/_bath-card";
import WeightCard from "@/app/pets/_cards/_weight-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/lib/utils";
import { Pet } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

const Page = () => {
  const [currentPet, setCurrentPet] = useState<Pet>();
  const { data, error, isLoading } = useSWR<Pet[]>("/api/pets", fetcher);

  useEffect(() => {
    if (Array.isArray(data) && currentPet === undefined) {
      setCurrentPet(data[0]);
    }
  }, [data]);

  if (error) {
    toast.error("Failed to load pets", { description: error.message });
  }

  const skeleton = <Skeleton className="w-full h-48" />;

  return (
    <div className="flex flex-col gap-4">
      {isLoading ? (
        <Skeleton className="w-full h-9" />
      ) : (
        <Select
          value={currentPet?.id.toString()}
          onValueChange={(value) => {
            setCurrentPet(data!.find((pet) => pet.id === parseInt(value)));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={currentPet?.name} />
          </SelectTrigger>
          <SelectContent>
            {data?.map((pet) => (
              <SelectItem key={pet.id} value={pet.id.toString()}>
                {pet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <div className="flex flex-col gap-2">
        {currentPet ? <WeightCard pet={currentPet} /> : skeleton}
        {currentPet ? <BathCard pet={currentPet} /> : skeleton}
      </div>
    </div>
  );
};

export default Page;
