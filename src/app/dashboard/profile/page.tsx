"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2, User, Mail, AtSign, Shield, Clock } from "lucide-react"
import { useUserStore } from "@/lib/store/use-user-store"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { formatDate } from "@/lib/utils"

const profileFormSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be at least 2 characters.")
    .regex(/^[a-zA-Z\s-]+$/, "First name must contain only letters, spaces, and hyphens"),
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters.")
    .regex(/^[a-zA-Z\s-]+$/, "Last name must contain only letters, spaces, and hyphens"),
  department: z.string()
    .min(2, "Department must be at least 2 characters.")
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfilePage() {
  const { user, setUser } = useUserStore()
  const { toast } = useToast()
  const [isPending, startTransition] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      department: user?.department || "",
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    if (!user?._id) return

    startTransition(true)
    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.status === "success" && result.data) {
        setUser(result.data.user)
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error?.message || "Failed to update profile.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      startTransition(false)
    }
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          View and manage your personal information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your account details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{`${user.firstName} ${user.lastName}`}</h2>
                    <p className="text-sm text-muted-foreground">{user.role}</p>
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-4">
                <div className="grid gap-2">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                {user.department && (
                  <div className="grid gap-2">
                    <p className="text-sm font-medium">Department</p>
                    <p className="text-sm text-muted-foreground">{user.department}</p>
                  </div>
                )}
                <div className="grid gap-2">
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="Sales" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 