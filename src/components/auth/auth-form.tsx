"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const userSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

const companySchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  industry: z.string().min(1, {
    message: "Please select an industry.",
  }),
  size: z.string().min(1, {
    message: "Please select company size.",
  }),
})

const signUpSchema = userSchema.extend({
  role: z.enum(["company", "trainer", "trainee"]),
  ...(process.env.NEXT_PUBLIC_ENABLE_COMPANY_SIGNUP === "true"
    ? { company: companySchema }
    : {}),
})

const signInSchema = userSchema

export type AuthFormValues = z.infer<typeof signUpSchema>

interface AuthFormProps {
  type: "signin" | "signup"
  onSubmit: (data: AuthFormValues) => Promise<void>
  submitText: string
  isPending?: boolean
  className?: string
}

const industries = [
  { label: "Technology", value: "technology" },
  { label: "Financial Services", value: "finance" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Retail", value: "retail" },
  { label: "Telecommunications", value: "telecom" },
  { label: "Other", value: "other" },
]

const companySizes = [
  { label: "1-50 employees", value: "small" },
  { label: "51-200 employees", value: "medium" },
  { label: "201-1000 employees", value: "large" },
  { label: "1000+ employees", value: "enterprise" },
]

export function AuthForm({
  type,
  onSubmit,
  submitText,
  isPending,
  className,
}: AuthFormProps) {
  const { toast } = useToast()
  const [role, setRole] = React.useState<"company" | "trainer" | "trainee">("trainee")
  
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(type === "signin" ? signInSchema : signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "trainee",
      ...(type === "signup" && process.env.NEXT_PUBLIC_ENABLE_COMPANY_SIGNUP === "true"
        ? {
            company: {
              companyName: "",
              industry: "",
              size: "",
            },
          }
        : {}),
    },
  })

  async function handleSubmit(data: AuthFormValues) {
    try {
      await onSubmit(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      })
    }
  }

  const showCompanyFields = type === "signup" && role === "company"

  return (
    <div className={cn("grid gap-6", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    autoCapitalize="none"
                    autoComplete={type === "signup" ? "new-password" : "current-password"}
                    autoCorrect="off"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {type === "signup" && (
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>I am a</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={(value: "company" | "trainer" | "trainee") => {
                      field.onChange(value)
                      setRole(value)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="company">Company Representative</SelectItem>
                      <SelectItem value="trainer">Call Center Trainer</SelectItem>
                      <SelectItem value="trainee">Call Center Trainee</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select your role in the call center training program
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {showCompanyFields && (
            <>
              <FormField
                control={form.control}
                name="company.companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your company name"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company.industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry.value} value={industry.value}>
                            {industry.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company.size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Size</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companySizes.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitText}
          </Button>
        </form>
      </Form>
    </div>
  )
}
