"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Edit } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteEventDialog } from "@/components/DeleteEventModal";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  imagesUrl: string[];
  coverUrl: string;
  creator: {
    email: string;
    name: string;
  };
  creatorId: string;
  attendees: Array<{
    id: string;
    name: string;
  }>;
}

export default function EventDetails() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { socket } = useSocket();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  console.log("event", event);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events/${params.id}`
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setEvent(data);
      } catch {
        toast({
          title: "Error",
          description: "Failed to fetch event details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [params.id, toast]);

  useEffect(() => {
    if (socket && params.id) {
      socket.emit("joinEvent", params.id);

      socket.on("eventUpdated", (updatedEvent) => {
        if (updatedEvent.id === params.id) {
          setEvent(updatedEvent);
          toast({
            title: "Event Updated",
            description: "Event details have been updated",
          });
        }
      });

      socket.on("eventDeleted", (deletedEventId) => {
        if (deletedEventId === params.id) {
          toast({
            title: "Event Deleted",
            description: "This event has been deleted",
            variant: "destructive",
          });
          router.push("/");
        }
      });

      return () => {
        socket.off("eventUpdated");
        socket.off("eventDeleted");
        socket.emit("leaveEvent", params.id);
      };
    }
  }, [params.id, router, socket, toast]);

  const handleJoinLeave = async () => {
    if (!user || user?.guest === true) {
      toast({
        title: "Warning",
        description: user?.guest
          ? "Guest User cannot join/leave events."
          : "You must be logged in to join/leave an event",
        variant: "default",
      });
      return;
    }

    setActionLoading(true);
    const isAttending = event?.attendees.some((a) => a.id === user.id);
    const endpoint = isAttending ? "leave" : "join";

    try {
      const token = user.token;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/${params.id}/${endpoint}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to update attendance");

      const updatedEvent = await response.json();
      setEvent(updatedEvent);
      toast({
        title: isAttending ? "Left Event" : "Joined Event",
        description: isAttending
          ? "You have left this event"
          : "You have joined this event",
      });
    } catch {
      toast({
        title: "Error",
        description: `Failed to ${endpoint} event`,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = user?.token;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/${params.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete event");

      toast({
        title: "Success",
        description: "Event has been deleted",
      });
      router.push("/");
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    router.push(`/events/${params.id}/edit`);
  };

  if (authLoading || isLoading) {
    return <EventDetailsSkeleton />;
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Event Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Event with ID {params.id} does not exist</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/")}>Go Back</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const isCreator = user?.id === event.creatorId;
  const isAttending = event?.attendees?.some((a) => a.id === user?.id);

  return (
    <div className="mx-auto space-y-6">
      <Card>
        {event.coverUrl && (
          <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
            <img
              src={event.coverUrl}
              alt={`${event.title} cover`}
              className="w-full h-full object-cover rounded-t-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
          </div>
        )}
        <CardHeader>
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <CardTitle className="text-3xl">{event.title}</CardTitle>
              <p className="text-muted-foreground mt-2">
                Organized by {event.creator.name}
              </p>
              <span className="inline-block px-3 py-1 mt-2 text-sm rounded-full bg-primary/10 text-primary">
                {event.category}
              </span>
            </div>
            <div className="flex gap-2">
              {user === null ? (
                <>
                  <Button onClick={() => router.push("/login")}>
                    Login to Join
                  </Button>
                </>
              ) : isCreator ? (
                <>
                  <Button variant="outline" onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <DeleteEventDialog onDelete={handleDelete} />
                </>
              ) : (
                <Button
                  onClick={handleJoinLeave}
                  disabled={actionLoading}
                  variant={isAttending ? "outline" : "default"}
                >
                  {isAttending ? "Leave Event" : "Join Event"}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-5 w-5" />
              <span>{format(new Date(event.date), "PPP")}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-5 w-5" />
              <span>{event.attendees?.length} attending</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          </div>

          {event.imagesUrl && event.imagesUrl.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {event.imagesUrl.map((url, index) => (
                  <div key={index} className="relative aspect-video">
                    <img
                      src={url}
                      alt={`Event image ${index + 1}`}
                      className="rounded-md object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-2">Attendees</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {event.attendees?.map((attendee) => (
                <div
                  key={attendee.id}
                  className="p-2 rounded-md bg-secondary text-secondary-foreground flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {attendee.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate">{attendee.name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function EventDetailsSkeleton() {
  return (
    <div className="mx-auto space-y-6">
      <Card>
        <Skeleton className="w-full h-[300px] md:h-[400px] rounded-t-lg" />
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-[300px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-6 w-[100px]" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-24 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="aspect-video w-full rounded-md" />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
