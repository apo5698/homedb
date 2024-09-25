"use client";

import {
  DefaultCard,
  DefaultCardContent,
  DefaultCardDescription,
  DefaultCardFooter,
  DefaultCardHeader,
  DefaultCardTitle,
} from "@/components/default-card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DATE_FORMAT, DATETIME_FORMAT, fetcher } from "@/lib/utils";
import { Pet } from "@prisma/client";
import axios from "axios";
import { differenceInDays, format } from "date-fns";
import { LoaderCircleIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

const BathCard = ({ pet }: { pet: Pet }) => {
  const [submitting, setSubmitting] = useState(false);

  const { data, error, isLoading, mutate } = useSWR<Bath[]>(
    `/api/pets/${pet.id}/baths`,
    fetcher,
  );

  const lastDate = useMemo(
    () => (data?.length ? new Date(data[0].time) : null),
    [data],
  );

  const onCreate = () => {
    setSubmitting(true);
    const now = new Date();

    axios
      .post(`/api/pets/${pet.id}/bath`, { time: now })
      .then(() => {
        toast.success(`Bath taken for ${pet.name}`, {
          description: format(now, DATETIME_FORMAT),
        });
      })
      .catch((error) => {
        let message;

        if (error.response) {
          message = error.response.data.error;
        } else if (error.request) {
          message = "No response received";
          console.error(error.request);
        } else {
          message = error.message;
        }

        console.error("Error:", message);
        toast.error("Error", { description: message });
      })
      .finally(() => {
        setSubmitting(false);
        // Revalidate data
        // noinspection JSIgnoredPromiseFromCall
        mutate();
      });
  };

  return (
    <DefaultCard>
      <DefaultCardHeader>
        <DefaultCardTitle>🛁 Bath</DefaultCardTitle>
        <DefaultCardDescription className="flex gap-1 items-center">
          <span className="shrink-0">Last updated:</span>
          {isLoading ? (
            <Skeleton className="w-32 h-3" />
          ) : (
            <span>{lastDate && format(lastDate, DATETIME_FORMAT)}</span>
          )}
        </DefaultCardDescription>
      </DefaultCardHeader>
      <DefaultCardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Days Since Last</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-muted">
              <TableCell className="font-medium">Today</TableCell>
              <TableCell className="text-right">
                {lastDate ? differenceInDays(new Date(), lastDate) : null}
              </TableCell>
            </TableRow>
            {data?.map((bath, index) => {
              const daysSinceLast =
                index < data.length - 1
                  ? differenceInDays(
                      new Date(bath.time),
                      new Date(data[index + 1].time),
                    )
                  : null;

              return (
                <Popover key={index}>
                  <PopoverTrigger className="hover:cursor-pointer" asChild>
                    <TableRow key={bath.id}>
                      <TableCell className="font-medium">
                        {format(new Date(bath.time), DATE_FORMAT)}
                      </TableCell>
                      <TableCell className="text-right">
                        {daysSinceLast}
                      </TableCell>
                    </TableRow>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2">
                    <div className="flex flex-col gap-1">
                      <p className="text-xs">
                        {format(new Date(bath.time), DATETIME_FORMAT)}
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                      >
                        Delete
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              );
            })}
          </TableBody>
        </Table>
      </DefaultCardContent>
      <DefaultCardFooter>
        <Button
          className="ml-auto"
          size="sm"
          disabled={submitting}
          onClick={onCreate}
        >
          {submitting && (
            <LoaderCircleIcon className="mr-1 h-4 w-4 animate-spin" />
          )}
          Taken
        </Button>
      </DefaultCardFooter>
    </DefaultCard>
  );
};

export default BathCard;
