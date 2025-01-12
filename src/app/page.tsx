"use client";
import { Button } from "@/components/ui/button";
import FilterComponent from "@/components/EventFilters";
import EventsList from "@/components/EventList";
import Link from "next/link";
import { useState } from "react";
import type { Filters } from "@/components/EventFilters";

export default function EventsPage() {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: undefined,
    dateRange: undefined,
    sortBy: "date",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Planned Events</h1>
        <Link href="/events/create">
          <Button>Create Event</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        <FilterComponent onFilterChange={setFilters} />
        <EventsList
          filters={filters}
          handlePagination={(page: number) => {
            if (page < 1) return;
            setFilters({ ...filters, page });
          }}
        />
      </div>
    </div>
  );
}
