import React from "react";
import Link from "next/link";
import { Calendar, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found - EventHub",
  description: "The page you are looking for could not be found",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Page Not Found - EventHub",
    description: "The page you are looking for could not be found",
    type: "website",
  },
};

export default function NotFound() {
  const suggestions = [
    {
      title: "Browse Events",
      description: "Discover exciting events happening near you",
      icon: Calendar,
      href: "/",
    },
    {
      title: "Login",
      description: "Look for login?",
      icon: Search,
      href: "/login",
    },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground">
            {`Oops! It seems the event you're looking for has already ended or
            moved to a different venue.`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            asChild
            variant="default"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href="/">
              <Calendar className="mr-2 h-4 w-4" />
              Browse Events
            </Link>
          </Button>
        </div>

        {/* Suggestions Section */}
        <div className="pt-12">
          <h3 className="text-lg font-medium mb-6">You might want to try:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestions.map((suggestion) => (
              <Card
                key={suggestion.title}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <Link href={suggestion.href} className="space-y-3 block">
                    <div className="flex items-center gap-3">
                      <suggestion.icon className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">{suggestion.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {suggestion.description}
                    </p>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
