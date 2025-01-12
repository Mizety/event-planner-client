"use client";

import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Filters } from "./EventFilters";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  attendees: unknown[];
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface EventListProps {
  filters: Filters;
  handlePagination: (page: number) => void;
}

export default function EventList({
  filters,
  handlePagination,
}: EventListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);

        const params = new URLSearchParams({
          page: filters.page.toString(),
          limit: filters.limit.toString(),
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          ...(filters.dateRange?.from && {
            startDate: filters.dateRange.from.toISOString(),
          }),
          ...(filters.dateRange?.to && {
            endDate: filters.dateRange.to.toISOString(),
          }),
          ...(filters.category && { category: filters.category }),
          ...(filters.search && { search: filters.search }),
        });

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events?${params.toString()}`
        );
        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();
        setEvents(data.events);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        toast({
          title: "Error",
          description: "Failed to load events",
          variant: "destructive",
        });
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [filters, toast]);

  if (isLoading) {
    return (
      <div>
        <div className="space-y-2 sm:h-[70vh] overflow-y-auto">
          {[...Array(filters.limit)].map((_, i) => (
            <EventSkeleton key={i} />
          ))}
        </div>
        <div className="flex justify-between items-center mt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="gap-2 flex flex-col sm:h-[70vh] overflow-y-auto">
        {events.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No events found
            </CardContent>
          </Card>
        ) : (
          events.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <Card className="hover:bg-accent transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{event.title}</CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(event.date), "PPP")}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{event.description}</p>
                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-sm">{event.location}</span>
                    <span className="text-sm">•</span>
                    <span className="text-sm">
                      {event.attendees?.length || 0} attendees
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      {pagination && (
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            disabled={!pagination.hasPrevPage}
            onClick={() => handlePagination(filters.page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={!pagination.hasNextPage}
            onClick={() => handlePagination(filters.page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

function EventSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-2 mt-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}
