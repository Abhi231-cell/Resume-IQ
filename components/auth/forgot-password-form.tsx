"use client"

import { useState } from "react"
import { CheckCircle2Icon, LoaderIcon, MailIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    setLoading(false)

    if (error) {
      toast.error("Unable to send reset link", { description: error.message })
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/30 p-6 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2Icon className="size-5.5" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="font-medium">Check your inbox</p>
          <p className="text-sm text-muted-foreground text-pretty">
            If an account exists for{" "}
            <span className="font-medium text-foreground">{email || "that email"}</span>, we&apos;ve
            sent a link to reset your password.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setSent(false)}>
          Use a different email
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
            <InputGroupInput
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
        </Field>

        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading ? (
            <>
              <LoaderIcon data-icon="inline-start" className="animate-spin" />
              Sending link
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </FieldGroup>
    </form>
  )
}
