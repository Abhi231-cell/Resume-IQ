import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Choose a new password",
  description: "Set a new ResumeIQ account password.",
}

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Choose a new password</h1>
          <p className="text-sm text-muted-foreground">Enter a new password for your account.</p>
        </div>
        <ResetPasswordForm />
      </div>
    </AuthShell>
  )
}
