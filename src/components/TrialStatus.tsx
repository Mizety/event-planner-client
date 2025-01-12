"use client";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

export default function TrialStatus() {
  const { user, isLoading } = useAuth();
  return (
    <>
      {user?.guest && !isLoading && (
        <Alert className="space-y-4 bg-gray-100 text-gray-800">
          <AlertTitle>Guest User</AlertTitle>
          <AlertDescription>
            You are currently logged in as a guest user. Please login to access
            all features.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
