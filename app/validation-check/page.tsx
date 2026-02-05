"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import PageSkeleton from "../components/PageSkeleton";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

const Page = () => {
  const form = useForm<FieldValues>({
    defaultValues: {
      symbol: "",
      rule: "",
      roll: false,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    data.rule = data.rule.trim();
    if (data.rule === "" || data.symbol === "") {
      toast.error("Please enter a rule and symbol");
      return;
    }

    const closedParentheses = [...data.rule.matchAll(/\)/g)].map(
      (a) => a.index
    );
    const insertIndex = closedParentheses[1];

    if (insertIndex == null) {
      toast.error("Invalid rule");
      return;
    }

    const part1 = data.rule.slice(0, insertIndex);
    const part2 = data.rule.slice(insertIndex);

    const newRule = `${part1},"${data.symbol}"${
      data.roll ? `,"/${data.symbol}"` : ""
    }${part2}`;

    form.reset({ ...data, rule: newRule, symbol: "", roll: false });
  };

  return (
    <PageSkeleton
      title="Validation Rule Editor"
      subtitle="Add symbols to a validation rule"
      size="md"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="rule"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base sm:text-lg">Rule</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter the validation rule here"
                    className="border rounded border-gray-500 bg-gray-50 p-1 min-h-50"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Label htmlFor="symbol" className="text-base sm:text-lg mt-6">
            Symbols
          </Label>
          <div className="flex h-12 flex-row gap-5">
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="symbol"
                      {...field}
                      placeholder="Enter a symbol"
                      className="h-full"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roll"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row items-center gap-2">
                    <Label htmlFor="roll" className="text-sm text-slate-700">
                      Add future roll
                    </Label>
                    <FormControl>
                      <Input
                        type="checkbox"
                        id="roll"
                        checked={field.value}
                        onChange={field.onChange}
                        className=" h-4 w-4 accent-black"
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button className="bg-black h-full mt-6">Add symbol</Button>
        </form>
      </Form>
    </PageSkeleton>
  );
};

export default Page;
