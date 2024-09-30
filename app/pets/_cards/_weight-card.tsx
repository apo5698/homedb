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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, DATE_FORMAT, DATETIME_FORMAT, fetcher } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pet, Weight } from "@prisma/client";
import axios from "axios";
import { differenceInDays, format } from "date-fns";
import { LoaderCircleIcon, PlusIcon, WeightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import useSWR from "swr";
import { z } from "zod";

const chartConfig = {
  weight: {
    label: "Weight",
    icon: WeightIcon,
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const formSchema = z.object({
  weight: z.coerce.number().min(0.1, "Weight must be greater than 0"),
  time: z.string({ required_error: "Time is required" }),
});

const WeightCard = ({ pet }: { pet: Pet }) => {
  const { data, error, isLoading, mutate } = useSWR<Weight[]>(
    `/api/pets/${pet.id}/weights`,
    fetcher,
  );

  if (error) {
    console.error("Error:", error);
    toast.error("Error", { description: error.message });
  }

  const [visibleData, setVisibleData] = useState<Weight[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    if (Array.isArray(data)) {
      setVisibleData(data.slice(0, pageSize));
    }
  }, [data]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // @ts-ignore TS2322
      weight: "",
      time: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    },
  });

  const showMore = () => {
    if (!data || data.length === visibleData.length) return;
    setVisibleData(data.slice(0, visibleData.length + pageSize));
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    values.time = new Date(values.time).toISOString();

    axios
      .post(`/api/pets/${pet.id}/weights`, values)
      .then(() => {
        setDialogOpen(false);
        toast.success(`Weight added for ${pet.name}`, {
          description: format(values.time, DATETIME_FORMAT),
        });
      })
      .catch((error) => {
        let message;

        if (error.response) {
          message = error.response.data.error;
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
        <DefaultCardTitle>⚖️ Weight</DefaultCardTitle>
        <DefaultCardDescription className="flex gap-1 items-center">
          <span className="shrink-0">Last updated:</span>
          {isLoading ? (
            <Skeleton className="w-32 h-3" />
          ) : (
            <span>
              {visibleData[0] &&
                format(new Date(visibleData[0].time), DATETIME_FORMAT)}
            </span>
          )}
        </DefaultCardDescription>
      </DefaultCardHeader>
      <DefaultCardContent className="flex flex-col gap-4">
        {data?.length && (
          <ChartContainer config={chartConfig} className="min-h-32 w-full">
            <LineChart
              accessibilityLayer
              data={data.toReversed()}
              margin={{
                left: -20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={14}
                tickFormatter={(value) => format(new Date(value), DATE_FORMAT)}
              />
              <YAxis
                dataKey="weight"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      format(new Date(value), DATETIME_FORMAT)
                    }
                  />
                }
              />
              <Line
                dataKey="weight"
                type="natural"
                stroke="var(--color-weight)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Weight (lbs)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleData.map((record, index) => {
              const weightDiff =
                index < visibleData.length - 1
                  ? record.weight - visibleData[index + 1].weight
                  : null;

              return (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <p>{format(new Date(record.time), DATE_FORMAT)}</p>
                      <p className="text-xs text-muted-foreground">
                        {differenceInDays(record.time, new Date(pet.birthDate))}{" "}
                        days
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span>{record.weight}</span> (
                    <span
                      className={cn(
                        "text-right",
                        weightDiff !== null && weightDiff !== 0
                          ? weightDiff > 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                          : "",
                      )}
                    >
                      {weightDiff !== null && weightDiff !== 0
                        ? (weightDiff > 0 ? "+" : "") + weightDiff.toFixed(1)
                        : "-"}
                    </span>
                    )
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {visibleData.length < (data?.length || 0) && (
          <Button
            variant="link"
            className="px-2 text-blue-600 dark:text-blue-400"
            onClick={showMore}
          >
            Show More
          </Button>
        )}
      </DefaultCardContent>
      <DefaultCardFooter>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="ml-auto"
              size="sm"
              disabled={submitting}
              onClick={() => onSubmit}
            >
              {submitting && (
                <LoaderCircleIcon className="mr-1 h-4 w-4 animate-spin" />
              )}
              <PlusIcon className="mr-1 h-3 w-3" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Weight</DialogTitle>
              <DialogDescription>{pet.name}</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Weight</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" className="w-32" />
                      </FormControl>
                      <FormDescription>In pounds (lbs)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="datetime-local"
                          className="w-auto"
                        />
                      </FormControl>
                      <FormDescription>In pounds (lbs)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Submit</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </DefaultCardFooter>
    </DefaultCard>
  );
};

export default WeightCard;
