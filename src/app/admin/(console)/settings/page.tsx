"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Lock,
  KeyRound,
  Globe,
  Save,
  Loader2,
  ImagePlus,
  CheckCircle2,
  Mail,
  Eye,
  EyeOff,
  Download,
  Database,
} from "lucide-react";
import { toast } from "sonner";
import { api, uploadFile, useAsync } from "@/components/admin/use-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Profile = {
  id: string;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  avatarUrl: string | null;
  socialLinks: Record<string, string>;
  seo: Record<string, string>;
  stats: Record<string, number | string>;
  updatedAt: string;
};

type AdminInfo = {
  admin: { id: string; email: string; name: string | null; lastLoginAt: string | null };
};

export default function AdminSettingsPage() {
  const { data: profileData, loading: profileLoading, setData: setProfileData } = useAsync<Profile>(
    () => api<Profile>("/api/profile"),
    []
  );

  const [admin, setAdmin] = useState<AdminInfo["admin"] | null>(null);
  useEffect(() => {
    api<AdminInfo>("/api/auth/me")
      .then((d) => setAdmin(d.admin))
      .catch(() => {});
  }, []);

  // ---- password form ----
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  const passwordError = useMemo(() => {
    if (!newPassword && !confirmPassword) return null;
    if (newPassword.length < 8) return "New password must be at least 8 characters.";
    if (newPassword !== confirmPassword) return "Passwords don't match.";
    return null;
  }, [newPassword, confirmPassword]);

  const canSubmitPwd =
    !!currentPassword && !!newPassword && !!confirmPassword && !passwordError;

  // ---- seo form ----
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoOgImage, setSeoOgImage] = useState("");
  const [ogImgError, setOgImgError] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setOgImgError(false);
  }, [seoOgImage]);
  const [savingSeo, setSavingSeo] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      // Use a hidden anchor to trigger the file download.
      const res = await fetch("/api/export", { cache: "no-store" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Export failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = res.headers.get("Content-Disposition") || "";
      const match = disposition.match(/filename="?([^";]+)"?/i);
      a.download = match ? match[1] : `portfolio-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Export downloaded", {
        description: a.download,
      });
    } catch (e) {
      toast.error("Failed to export", { description: (e as Error).message });
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    if (!profileData) return;
    setSeoTitle(profileData.seo?.title || "");
    setSeoDescription(profileData.seo?.description || "");
    setSeoOgImage(profileData.seo?.ogImage || "");
  }, [profileData]);

  const seoDirty = useMemo(() => {
    if (!profileData) return false;
    return (
      seoTitle !== (profileData.seo?.title || "") ||
      seoDescription !== (profileData.seo?.description || "") ||
      seoOgImage !== (profileData.seo?.ogImage || "")
    );
  }, [profileData, seoTitle, seoDescription, seoOgImage]);

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setSeoOgImage(url);
      toast.success("OG image uploaded");
    } catch (e) {
      toast.error("Upload failed", { description: (e as Error).message });
    } finally {
      setUploading(false);
    }
  };

  const submitPwd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitPwd) return;
    setSavingPwd(true);
    try {
      await api("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      toast.success("Password changed");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      toast.error("Failed to change password", { description: (e as Error).message });
    } finally {
      setSavingPwd(false);
    }
  };

  const submitSeo = async () => {
    setSavingSeo(true);
    try {
      const updated = await api<Profile>("/api/profile", {
        method: "PATCH",
        body: JSON.stringify({
          seo: {
            title: seoTitle,
            description: seoDescription,
            ogImage: seoOgImage,
          },
        }),
      });
      setProfileData(updated);
      toast.success("SEO meta saved");
    } catch (e) {
      toast.error("Failed to save SEO", { description: (e as Error).message });
    } finally {
      setSavingSeo(false);
    }
  };

  if (profileLoading || !profileData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Account settings"
        description="Manage your account credentials and the public SEO metadata for your portfolio."
        icon={Settings}
        action={
          <Button
            onClick={handleExport}
            disabled={exporting}
            variant="outline"
            className="gap-2 border-white/10 bg-white/5 hover:bg-white/10"
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Export data</span>
            <span className="sm:hidden">Export</span>
          </Button>
        }
      />

      {/* Account / read-only email */}
      <Section
        title="Account"
        icon={Mail}
        description="The email address associated with this admin account."
      >
        <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5">
            <Mail className="h-4 w-4 text-blue-300" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Admin email
            </div>
            <div className="truncate text-sm font-medium text-foreground">
              {admin?.email || "—"}
            </div>
          </div>
        </div>
      </Section>

      {/* Export data */}
      <Section
        title="Export data"
        icon={Database}
        description="Download a full JSON snapshot of all your portfolio content — projects, skills, experience, testimonials, messages, and profile."
      >
        <div className="flex flex-col gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-sm font-medium text-foreground">portfolio-export.json</div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Includes all entities with their relationships. Safe to keep as a backup.
            </p>
          </div>
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:opacity-90"
          >
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Preparing…
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download JSON
              </>
            )}
          </Button>
        </div>
      </Section>

      {/* Change password */}
      <Section
        title="Change password"
        icon={Lock}
        description="Pick a strong, unique password. Minimum 8 characters."
      >
        <form onSubmit={submitPwd} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cur-pwd">Current password</Label>
            <div className="relative">
              <Input
                id="cur-pwd"
                type={showPwd ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center text-muted-foreground hover:text-foreground"
                aria-label={showPwd ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-pwd">New password</Label>
              <Input
                id="new-pwd"
                type={showPwd ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={8}
              />
              {newPassword && newPassword.length < 8 && (
                <p className="text-[11px] text-amber-400">
                  Must be at least 8 characters.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-pwd">Confirm new password</Label>
              <Input
                id="confirm-pwd"
                type={showPwd ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                className={cn(
                  passwordError && confirmPassword ? "border-red-400/60" : ""
                )}
              />
              {passwordError && confirmPassword && (
                <p className="text-[11px] text-red-400">{passwordError}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <KeyRound className="h-3 w-3" />
              Min 8 characters · mix letters & numbers for strength.
            </div>
            <Button
              type="submit"
              disabled={!canSubmitPwd || savingPwd}
              className="gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:opacity-90"
            >
              {savingPwd ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating…
                </>
              ) : (
                "Update password"
              )}
            </Button>
          </div>
        </form>
      </Section>

      {/* SEO meta */}
      <Section
        title="SEO meta"
        icon={Globe}
        description="Controls the default <title>, meta description, and social preview image."
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seo-title">Default title</Label>
            <Input
              id="seo-title"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Muhammad Amir — Full-Stack Developer"
            />
            <p className="text-[11px] text-muted-foreground">
              Falls back to "{profileData.name} — {profileData.title}" when blank.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo-desc">Meta description</Label>
            <Textarea
              id="seo-desc"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="A short description that appears in search results and link previews."
              rows={3}
            />
            <p className="text-[11px] text-muted-foreground">
              Recommended length: 120–160 characters.{" "}
              <span className="font-mono">{seoDescription.length}</span>
            </p>
          </div>

          <div className="space-y-2">
            <Label>OG image</Label>

            {/* Preview + controls stacked vertically for cleaner layout */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-3">
              {/* Thumbnail preview */}
              <div className="relative h-28 w-full overflow-hidden rounded-lg border border-white/10 bg-white/5">
                {seoOgImage && !ogImgError ? (
                  <img
                    src={seoOgImage}
                    alt="OG preview"
                    onError={() => setOgImgError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center gap-1 text-muted-foreground">
                    <ImagePlus className="h-6 w-6" />
                    <span className="text-[11px]">
                      {ogImgError ? "Image failed to load" : "No OG image set"}
                    </span>
                  </div>
                )}
                {seoOgImage && (
                  <button
                    type="button"
                    onClick={() => setSeoOgImage("")}
                    className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] text-red-400 hover:bg-black/80 hover:text-red-300 transition-colors"
                  >
                    Remove
                  </button>
                )}
                <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] text-white/70">
                  1200 × 630 recommended
                </div>
              </div>

              {/* File picker */}
              <div className="flex items-center gap-2">
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-muted-foreground hover:bg-white/[0.08] transition-colors">
                    <ImagePlus className="h-3.5 w-3.5 shrink-0" />
                    {uploading ? (
                      <span className="text-blue-400">Uploading…</span>
                    ) : (
                      <span>Choose file to upload…</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUpload(e.target.files?.[0])}
                    disabled={uploading}
                  />
                </label>
              </div>

              {/* URL input */}
              <Input
                value={seoOgImage}
                onChange={(e) => setSeoOgImage(e.target.value)}
                placeholder="or paste image URL (e.g. /uploads/og-cover.jpg)"
                className="font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            {seoDirty ? (
              <p className="flex items-center gap-1.5 text-[11px] text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Unsaved changes
              </p>
            ) : (
              <p className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Saved
              </p>
            )}
            <Button
              onClick={submitSeo}
              disabled={!seoDirty || savingSeo || uploading}
              className="gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:opacity-90"
            >
              {savingSeo ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save SEO
                </>
              )}
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}

function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-600/20 ring-1 ring-white/10">
          <Icon className="h-5 w-5 text-blue-300" />
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-blue-400">
            {eyebrow}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {action}
    </motion.div>
  );
}

function Section({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl glass p-5 sm:p-6">
      <div className="mb-4 flex items-start gap-2.5">
        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/5 text-blue-300">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="font-display text-sm font-semibold tracking-tight">{title}</h2>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}
