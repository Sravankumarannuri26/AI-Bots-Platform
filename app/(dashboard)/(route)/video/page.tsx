"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Video, Send } from "lucide-react";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Loader } from "@/components/loader";
import { Empty } from "@/components/ui/empty";

import { formSchema } from "./constants";



const MusicPage = () => {

    const router = useRouter();
    const [music, setMusic] = useState<string>();
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        prompt: "",
      }
    });
  
    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
          setMusic(undefined);
    
          const response = await axios.post('/api/music', values);
          console.log(response)
    
          setMusic(response.data.audio);
          form.reset();
        } catch (error: any) {
          console.log(error);
        } finally {
          router.refresh();
        }
      }

    return ( 
        <div>
          <Heading
            title="Video Generation"
            description="Turn your prompt into wonderful videos."
            icon={Video}
            iconColor="text-orange-500"
            bgColor="bg-orange-500/10"
          />
          <div className="px-4 lg:px-8">
            <Form {...form}>
              <form 
               onSubmit={form.handleSubmit(onSubmit)} 
                className="
                  rounded-lg 
                  border 
                  w-full 
                  p-4 
                  px-3 
                  md:px-6 
                  focus-within:shadow-sm
                  grid
                  grid-cols-12
                  gap-2
                "
              >
                <FormField
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-10">
                      <FormControl className="m-0 p-0">
                        <Input
                          className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                          disabled={isLoading} 
                          placeholder="Golden Blue fish in coral reefs" 
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
                  Generate
                </Button>
              </form>
            </Form>
            {isLoading && (
              <div className="p-20">
                <Loader />
              </div>
            )}
            {!music && !isLoading && (
              <Empty label="No video generated." />
            )}
            {music && (
              <audio controls className="w-full mt-8">
                <source src={music} />
              </audio>
            )}
          </div>
        </div>
       );
    }
     
    export default MusicPage;