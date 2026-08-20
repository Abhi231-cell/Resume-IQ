"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  BellIcon,
  DownloadIcon,
  LoaderIcon,
  MonitorIcon,
  MoonIcon,
  ShieldIcon,
  SunIcon,
  Trash2Icon,
  TriangleAlertIcon,
} from "lucide-react"
import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Field, FieldDescription, FieldGroup, FieldTitle } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

const THEMES = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
]

const PRIVACY_OPTIONS = [
  {
    id: "improve-model",
    title: "Help improve analysis quality",
    description: "Allow anonymized resume data to refine scoring models.",
    defaultChecked: true,
  },
  {
    id: "usage-analytics",
    title: "Usage analytics",
    description: "Share anonymous product usage to help us prioritize features.",
    defaultChecked: true,
  },
  {
    id: "personalized-jobs",
    title: "Personalized job matches",
    description: "Use your resume profile to surface more relevant roles.",
    defaultChecked: false,
  },
]

const NOTIFICATION_OPTIONS = [
  {
    id: "email-analysis",
    title: "Analysis complete",
    description: "Email me when a resume analysis finishes.",
    defaultChecked: true,
  },
  {
    id: "email-jobs",
    title: "New job matches",
    description: "Notify me when new roles match my profile.",
    defaultChecked: true,
  },
  {
    id: "email-product",
    title: "Product updates",
    description: "Occasional emails about new features and tips.",
    defaultChecked: false,
  },
]

export function SettingsView() {
  const { theme, setTheme } = useTheme()
  const [profile, setProfile] = React.useState({
    name: "",
    email: "",
    headline: "Professional",
    location: "Remote",
    initials: "U",
  })
  const [savingProfile, setSavingProfile] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  const [confirmText, setConfirmText] = React.useState("")

  React.useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const name =
          (user.user_metadata?.full_name as string) ||
          (user.user_metadata?.name as string) ||
          user.email?.split("@")[0] ||
          "User"
        const email = user.email || ""
        const initials =
          name
            .split(" ")
            .map((part: string) => part[0])
            .filter(Boolean)
            .slice(0, 2)
            .join("")
            .toUpperCase() || "U"

        setProfile({
          name,
          email,
          headline: "Professional",
          location: "Remote",
          initials,
        })
      }
    }

    loadUser()
  }, [])

  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSavingProfile(true)
    const formData = new FormData(e.currentTarget)
    const name = String(formData.get("name") ?? "").trim()
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name },
    })

    setSavingProfile(false)

    if (error) {
      toast.error("Unable to update profile", { description: error.message })
      return
    }

    setProfile((prev) => ({
      ...prev,
      name,
      initials:
        name
          .split(" ")
          .map((part: string) => part[0])
          .filter(Boolean)
          .slice(0, 2)
          .join("")
          .toUpperCase() || "U",
    }))

    toast.success("Profile saved", { description: "Your changes have been updated." })
  }

  function confirmDelete() {
    setDeleting(true)
    setTimeout(() => {
      setDeleting(false)
      setDeleteOpen(false)
      setConfirmText("")
      toast.success("Account scheduled for deletion", {
        description: "This is a demo — no data was removed.",
      })
    }, 900)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your profile, appearance, privacy and account.
        </p>
      </div>

      <Tabs defaultValue="profile" className="gap-6">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile">
          <Card>
            <CardHeader className="border-b [.border-b]:pb-4">
              <CardTitle>Profile</CardTitle>
              <CardDescription>This information personalizes your workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveProfile} className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <Avatar className="size-16 rounded-xl">
                    <AvatarFallback className="rounded-xl bg-primary/10 text-lg text-primary">
                      {profile.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <Button type="button" variant="outline" size="sm">
                      Change photo
                    </Button>
                    <p className="text-xs text-muted-foreground">JPG or PNG, up to 2MB.</p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field>
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Your name"
                    />
                  </Field>
                  <Field>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      placeholder="you@company.com"
                    />
                  </Field>
                  <Field>
                    <Label htmlFor="headline">Professional headline</Label>
                    <Input
                      id="headline"
                      name="headline"
                      value={profile.headline}
                      onChange={(e) => setProfile((p) => ({ ...p, headline: e.target.value }))}
                      placeholder="e.g. Senior Frontend Engineer"
                    />
                  </Field>
                  <Field>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={profile.location}
                      onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                      placeholder="e.g. Remote"
                    />
                  </Field>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={savingProfile}>
                    {savingProfile ? (
                      <>
                        <LoaderIcon data-icon="inline-start" className="animate-spin" />
                        Saving
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader className="border-b [.border-b]:pb-4">
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Choose how ResumeIQ looks on this device.</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="grid gap-3 sm:grid-cols-3"
                role="radiogroup"
                aria-label="Color theme"
              >
                {THEMES.map((option) => {
                  const active = mounted && theme === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setTheme(option.value)}
                      className={cn(
                        "flex flex-col items-center gap-3 rounded-xl border p-5 text-sm font-medium transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                        active
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border text-muted-foreground hover:bg-muted/50",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-10 items-center justify-center rounded-lg",
                          active ? "bg-primary/10 text-primary" : "bg-muted text-foreground",
                        )}
                      >
                        <option.icon className="size-5" />
                      </span>
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy" className="flex flex-col gap-6">
          <Card>
            <CardHeader className="border-b [.border-b]:pb-4">
              <CardTitle className="flex items-center gap-2">
                <ShieldIcon className="size-4.5 text-primary" />
                Privacy & data
              </CardTitle>
              <CardDescription>Control how your data is used.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                {PRIVACY_OPTIONS.map((option, i) => (
                  <React.Fragment key={option.id}>
                    {i > 0 && <Separator />}
                    <Field orientation="horizontal">
                      <div className="flex flex-1 flex-col gap-0.5">
                        <FieldTitle>{option.title}</FieldTitle>
                        <FieldDescription>{option.description}</FieldDescription>
                      </div>
                      <Switch defaultChecked={option.defaultChecked} aria-label={option.title} />
                    </Field>
                  </React.Fragment>
                ))}
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b [.border-b]:pb-4">
              <CardTitle className="flex items-center gap-2">
                <BellIcon className="size-4.5 text-primary" />
                Email notifications
              </CardTitle>
              <CardDescription>Decide what we email you about.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                {NOTIFICATION_OPTIONS.map((option, i) => (
                  <React.Fragment key={option.id}>
                    {i > 0 && <Separator />}
                    <Field orientation="horizontal">
                      <div className="flex flex-1 flex-col gap-0.5">
                        <FieldTitle>{option.title}</FieldTitle>
                        <FieldDescription>{option.description}</FieldDescription>
                      </div>
                      <Switch defaultChecked={option.defaultChecked} aria-label={option.title} />
                    </Field>
                  </React.Fragment>
                ))}
              </FieldGroup>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account */}
        <TabsContent value="account" className="flex flex-col gap-6">
          <Card>
            <CardHeader className="border-b [.border-b]:pb-4">
              <CardTitle>Your data</CardTitle>
              <CardDescription>Export a copy of everything associated with your account.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Download your resumes, analyses and history as a single archive.
              </p>
              <Button
                variant="outline"
                onClick={() =>
                  toast.success("Export started", {
                    description: "We'll email you a download link when it's ready.",
                  })
                }
              >
                <DownloadIcon data-icon="inline-start" />
                Export data
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/40">
            <CardHeader className="border-b [.border-b]:pb-4 [.border-b]:border-destructive/20">
              <CardTitle className="flex items-center gap-2 text-destructive">
                <TriangleAlertIcon className="size-4.5" />
                Danger zone
              </CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data. This cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Deleting your account removes every resume, analysis and job match.
              </p>
              <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogTrigger render={<Button variant="destructive" />}>
                  <Trash2Icon data-icon="inline-start" />
                  Delete account
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive">
                      <TriangleAlertIcon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This permanently removes all your data. Type{" "}
                      <span className="font-medium text-foreground">DELETE</span> to confirm.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="px-0.5">
                    <Input
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="Type DELETE"
                      aria-label="Type DELETE to confirm"
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      disabled={confirmText !== "DELETE" || deleting}
                      onClick={confirmDelete}
                    >
                      {deleting ? (
                        <>
                          <LoaderIcon data-icon="inline-start" className="animate-spin" />
                          Deleting
                        </>
                      ) : (
                        "Delete account"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
