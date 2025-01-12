"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import ImageUploader from "@/components/ImageUploader";
import { Label } from "@/components/ui/label";

const CATEGORIES = ["Conference", "Meetup", "Workshop", "Social", "Other"];

type FormData = {
  title: string;
  description: string;
  location: string;
  category: string;
  date: Date;
  creatorId: string;
  imagesUrl: string[];
  coverUrl: string;
} | null;

interface ErrorType {
  field: string;
  message: string;
}
export default function EditEvent() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState<FormData>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorType[] | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events/${params.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch event");

        const data = await response.json();
        setFormData({
          title: data.title,
          description: data.description,
          location: data.location,
          category: data.category,
          date: new Date(data.date),
          creatorId: data.creatorId,
          imagesUrl: data.imagesUrl || [],
          coverUrl: data.coverUrl,
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to fetch event",
          variant: "destructive",
        });
        setFormData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [params.id, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token || !formData) {
      toast({
        title: "Error",
        description: "You must be logged in to update an event",
        variant: "destructive",
      });
      return;
    }

    if (formData.creatorId !== user.id) {
      router.push(`/events/${params.id}`);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
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

      if (!response.ok) throw new Error(await response.text());

      toast({ title: "Success", description: "Event updated successfully" });
      router.push(`/events/${params.id}`);
    } catch {
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) return <EditEventSkeleton />;

  if (!formData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card>
          <CardHeader>
            <CardTitle>Something went wrong!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Failed to fetch event. Are you sure it exists?</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push(`/events/${params.id}`)}>
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (user?.id !== formData.creatorId) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card>
          <CardHeader>
            <CardTitle>Unauthorized</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You are not authorized to edit this event.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push(`/events/${params.id}`)}>
              Go Back
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
          <CardTitle>Edit Event</CardTitle>
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
                  setFormData({ ...formData, coverUrl: url })
                }
                mode="single"
                imageUrl={formData.coverUrl}
                onRemoveImage={() => setFormData({ ...formData, coverUrl: "" })}
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
              <Label>Event Gallery</Label>
              <ImageUploader
                mode="multiple"
                onImageUrl={(url) =>
                  setFormData({
                    ...formData,
                    imagesUrl: [...formData.imagesUrl, url],
                  })
                }
                images={formData.imagesUrl}
                onRemoveImage={(urlToRemove) =>
                  setFormData({
                    ...formData,
                    imagesUrl: formData.imagesUrl.filter(
                      (url) => url !== urlToRemove
                    ),
                  })
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
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Event"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function EditEventSkeleton() {
  return (
    <div className=" mx-auto">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[140px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <div className="border rounded-lg p-4">
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
          <Skeleton className="h-32 w-full" />
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
        </CardContent>
      </Card>
    </div>
  );
}
