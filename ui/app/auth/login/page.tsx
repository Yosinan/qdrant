import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Activity } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="doctor@hospital.com" type="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
          <Button className="w-full" asChild>
            <Link href="/">Sign In</Link>
          </Button>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="link" size="sm" asChild>
            <Link href="/auth/register">Create account</Link>
          </Button>
          <Button variant="link" size="sm" asChild>
            <Link href="/auth/forgot-password">Forgot password?</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

