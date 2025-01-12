"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import ImageUploader from "@/components/ImageUploader";
import { Label } from "@/components/ui/label";

const CATEGORIES = ["Conference", "Meetup", "Workshop", "Social", "Other"];

interface ErrorType {
  field: string;
  message: string;
}

export default function CreateEvent() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    category: "conference",
    date: new Date(),
    imagesUrl: [] as string[],
    coverUrl: undefined as string | undefined,
  });
  const [error, setError] = useState<ErrorType[] | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!user || user?.guest === true) {
      toast({
        title: "Warning",
        description: user?.guest
          ? "Guest User cannot create events."
          : "You must be logged in to create an event",
        variant: "default",
      });
      setIsLoading(false);
      return;
    }
    try {
      const token = user?.token;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok && response.status === 400) {
        const data = await response.json();
        setError(data.errors);
        toast({
          title: data.message,
          variant: "destructive",
        });
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      toast({
        title: "Success",
        description: "Event created successfully",
      });
      router.push("/");
    } catch {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return <CreateEventSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card>
          <CardHeader>
            <CardTitle>Create Event</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              You must be logged in to create an event.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-2">
            <Button onClick={() => router.push("/login")} className="w-fit">
              Log In
            </Button>
            <Button onClick={() => router.push("/signup")} className="w-fit">
              Sign Up
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className=" mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
          {error && error.length > 0 && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p className="font-bold">Validation errors:</p>
              <ul className="list-disc list-inside">
                {error.map((e, i) => (
                  <li key={i}>{e.field + " - " + e.message}</li>
                ))}
              </ul>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Event Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Event Image</Label>
              <ImageUploader
                onImageUrl={(url) =>
                  setFormData((prev) => {
                    return { ...prev, coverUrl: url };
                  })
                }
                mode="single"
                imageUrl={formData.coverUrl}
                onRemoveImage={() =>
                  setFormData({ ...formData, coverUrl: undefined })
                }
              />
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Input
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Event Gallary</Label>
              <ImageUploader
                mode="multiple"
                onImageUrl={(url) =>
                  setFormData((prev) => ({
                    ...prev,
                    imagesUrl: [...(prev.imagesUrl || []), url],
                  }))
                }
                images={formData.imagesUrl || []}
                onRemoveImage={(urlToRemove) =>
                  setFormData((prev) => ({
                    ...prev,
                    imagesUrl: prev.imagesUrl.filter(
                      (url) => url !== urlToRemove
                    ),
                  }))
                }
                maxImages={5}
              />
            </div>

            <div className="space-y-2">
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? (
                      format(formData.date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) =>
                      date && setFormData({ ...formData, date })
                    }
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || authLoading}
            >
              {isLoading ? "Creating..." : "Create Event"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
export function CreateEventSkeleton() {
  return (
    <div className=" mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <div className="border rounded-lg p-4">
                <Skeleton className="h-32 w-full" />
              </div>
            </div>

            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </div>

            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
