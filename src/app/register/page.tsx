"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

interface ErrorType {
  field: string;
  message: string;
}

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<ErrorType[] | null>(null);
  const { register, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user !== null && !user?.guest) {
      router.push("/");
    }
  }, [router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validationErrors = await register(name, email, password);

      if (validationErrors !== null) {
        console.log("Validation errors:", validationErrors);
        setError(validationErrors?.errors);
        toast({
          title: validationErrors?.message,
          variant: "destructive",
        });
        return;
      }

      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
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
            <div>
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Register
            </Button>
            <p className="text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
