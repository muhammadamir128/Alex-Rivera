"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  UserRound,
  Save,
  Loader2,
  ImagePlus,
  Plus,
  Trash2,
  Sparkles,
  Hash,
  Link2,
  CheckCircle2,
  SlidersHorizontal,
  RotateCcw,
  Crop,
  ZoomIn,
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

const KNOWN_STATS = [
  "yearsExperience",
  "projectsDelivered",
  "technologies",
  "clients",
  "coffeeCups",
];

const SOCIAL_FIELDS = [
  { key: "github", label: "GitHub", placeholder: "https://github.com/you" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/you" },
  { key: "twitter", label: "Twitter / X", placeholder: "https://twitter.com/you" },
  { key: "dribbble", label: "Dribbble", placeholder: "https://dribbble.com/you" },
  { key: "email", label: "Email", placeholder: "you@example.com" },
  { key: "website", label: "Website", placeholder: "https://yoursite.dev" },
];

export default function AdminProfilePage() {
  const { data, loading, setData } = useAsync<Profile>(
    () => api<Profile>("/api/profile"),
    []
  );

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPosY, setAvatarPosY] = useState(15);
  const [avatarPosX, setAvatarPosX] = useState(50);
  const [avatarZoom, setAvatarZoom] = useState(100);
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [stats, setStats] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cropping, setCropping] = useState(false);

  // new stat key being added
  const [newStatKey, setNewStatKey] = useState("");
  const [newStatValue, setNewStatValue] = useState("");

  // hydrate from server
  useEffect(() => {
    if (!data) return;
    setName(data.name || "");
    setTitle(data.title || "");
    setTagline(data.tagline || "");
    setBio(data.bio || "");
    setAvatarUrl(data.avatarUrl || "");
    setAvatarPosY(data.stats?.avatarPosY !== undefined ? Number(data.stats.avatarPosY) : 15);
    setAvatarPosX(data.stats?.avatarPosX !== undefined ? Number(data.stats.avatarPosX) : 50);
    setAvatarZoom(data.stats?.avatarZoom !== undefined ? Number(data.stats.avatarZoom) : 100);
    setSocialLinks(data.socialLinks || {});
    const statsStr: Record<string, string> = {};
    for (const [k, v] of Object.entries(data.stats || {})) {
      if (!["avatarPosY", "avatarPosX", "avatarZoom"].includes(k)) {
        statsStr[k] = String(v ?? "");
      }
    }
    setStats(statsStr);
  }, [data]);

  const isDirty = useMemo(() => {
    if (!data) return false;
    if (name !== (data.name || "")) return true;
    if (title !== (data.title || "")) return true;
    if (tagline !== (data.tagline || "")) return true;
    if (bio !== (data.bio || "")) return true;
    if (avatarUrl !== (data.avatarUrl || "")) return true;
    const serverPosY = data.stats?.avatarPosY !== undefined ? Number(data.stats.avatarPosY) : 15;
    const serverPosX = data.stats?.avatarPosX !== undefined ? Number(data.stats.avatarPosX) : 50;
    const serverZoom = data.stats?.avatarZoom !== undefined ? Number(data.stats.avatarZoom) : 100;
    if (avatarPosY !== serverPosY || avatarPosX !== serverPosX || avatarZoom !== serverZoom) return true;
    const a = JSON.stringify(socialLinks);
    const b = JSON.stringify(data.socialLinks || {});
    if (a !== b) return true;
    const c = JSON.stringify(stats);
    const filteredServerStats = Object.fromEntries(
      Object.entries(data.stats || {})
        .filter(([k]) => !["avatarPosY", "avatarPosX", "avatarZoom"].includes(k))
        .map(([k, v]) => [k, String(v ?? "")])
    );
    const d = JSON.stringify(filteredServerStats);
    if (c !== d) return true;
    return false;
  }, [data, name, title, tagline, bio, avatarUrl, avatarPosY, avatarPosX, avatarZoom, socialLinks, stats]);

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setAvatarUrl(url);
      setAvatarPosY(15);
      setAvatarPosX(50);
      setAvatarZoom(100);
      toast.success("Avatar uploaded! You can fine-tune alignment below.");
    } catch (e) {
      toast.error("Upload failed", { description: (e as Error).message });
    } finally {
      setUploading(false);
    }
  };

  const handleCropAndSave = async () => {
    if (!avatarUrl) return;
    setCropping(true);
    try {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image for cropping"));
        img.src = avatarUrl;
      });

      const canvas = document.createElement("canvas");
      const targetSize = 800;
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context unavailable");

      const scale = avatarZoom / 100;
      const baseCropSize = Math.min(img.naturalWidth, img.naturalHeight);
      const cropSize = baseCropSize / scale;

      const maxOffsetX = Math.max(0, img.naturalWidth - cropSize);
      const maxOffsetY = Math.max(0, img.naturalHeight - cropSize);

      const srcX = maxOffsetX * (avatarPosX / 100);
      const srcY = maxOffsetY * (avatarPosY / 100);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, srcX, srcY, cropSize, cropSize, 0, 0, targetSize, targetSize);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.92)
      );
      if (!blob) throw new Error("Failed to generate cropped image");

      const file = new File([blob], `avatar-cropped-${Date.now()}.jpg`, { type: "image/jpeg" });
      const newUrl = await uploadFile(file);
      setAvatarUrl(newUrl);
      setAvatarPosX(50);
      setAvatarPosY(50);
      setAvatarZoom(100);
      toast.success("Picture cropped & saved successfully!");
    } catch (err) {
      toast.error("Crop failed", { description: (err as Error).message });
    } finally {
      setCropping(false);
    }
  };

  const setStat = (key: string, value: string) => {
    setStats((prev) => ({ ...prev, [key]: value }));
  };
  const removeStat = (key: string) => {
    setStats((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };
  const addStat = () => {
    const key = newStatKey.trim().replace(/\s+/g, "");
    if (!key) {
      toast.error("Stat key is required");
      return;
    }
    if (stats[key] !== undefined) {
      toast.error("That stat already exists");
      return;
    }
    setStats((prev) => ({ ...prev, [key]: newStatValue }));
    setNewStatKey("");
    setNewStatValue("");
  };

  const setSocial = (key: string, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    setSaving(true);
    const payload = {
      name,
      title,
      tagline,
      bio,
      avatarUrl: avatarUrl || null,
      socialLinks,
      stats: {
        ...Object.fromEntries(
          Object.entries(stats).map(([k, v]) => [
            k,
            v === "" ? "" : Number.isNaN(Number(v)) ? v : Number(v),
          ])
        ),
        avatarPosY,
        avatarPosX,
        avatarZoom,
      },
    };
    try {
      const updated = await api<Profile>("/api/profile", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setData(updated);
      // resync local state with normalized response
      const statsStr: Record<string, string> = {};
      for (const [k, v] of Object.entries(updated.stats || {})) {
        if (!["avatarPosY", "avatarPosX", "avatarZoom"].includes(k)) {
          statsStr[k] = String(v ?? "");
        }
      }
      setStats(statsStr);
      toast.success("Profile saved");
    } catch (e) {
      toast.error("Failed to save profile", { description: (e as Error).message });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-80 w-full rounded-2xl lg:col-span-2" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Profile"
        title="Edit your profile"
        description="The hero & about sections on the public site render directly from these fields."
        icon={UserRound}
        action={
          <Button
            onClick={submit}
            disabled={!isDirty || saving || uploading || cropping}
            className="gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:opacity-90"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save changes
              </>
            )}
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          {/* Identity */}
          <Section
            title="Identity"
            icon={UserRound}
            description="The core info displayed in the hero section."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="p-name">Name</Label>
                <Input
                  id="p-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-title">Title</Label>
                <Input
                  id="p-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Full-Stack Developer"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-tagline">Tagline</Label>
              <Textarea
                id="p-tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="One short sentence that captures what you do."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-bio">Bio</Label>
              <Textarea
                id="p-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A few sentences about your background, what excites you, etc."
                rows={5}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Avatar</Label>
                {avatarUrl && (
                  <span className="text-[11px] font-medium text-blue-400">
                    Adjust position, zoom, or crop below
                  </span>
                )}
              </div>
              <div className="flex items-start gap-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-white/5 ring-2 ring-white/10 shadow-lg">
                  {uploading ? (
                    <div className="grid h-full w-full place-items-center bg-black/40">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                    </div>
                  ) : avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="avatar preview"
                      className="h-full w-full object-cover transition-all duration-150"
                      style={{
                        objectPosition: `${avatarPosX}% ${avatarPosY}%`,
                        transform: avatarZoom !== 100 ? `scale(${avatarZoom / 100})` : undefined,
                      }}
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-muted-foreground">
                      <ImagePlus className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleUpload(e.target.files?.[0]);
                        e.target.value = "";
                      }}
                      disabled={uploading}
                      className="cursor-pointer file:bg-white/5 file:text-xs"
                    />
                    {avatarUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setAvatarUrl("");
                          toast.info("Avatar cleared");
                        }}
                        className="text-xs text-muted-foreground hover:text-red-400 shrink-0"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  {uploading && <p className="text-[11px] text-blue-400">Uploading image…</p>}
                  <Input
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="or paste image URL (/uploads/...)"
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              {/* Picture Adjustment & Framing Controls */}
              {avatarUrl && (
                <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4 text-blue-400" />
                      <span className="text-xs font-semibold text-foreground">
                        Picture Alignment & Face Focus
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setAvatarPosX(50);
                          setAvatarPosY(15);
                          setAvatarZoom(100);
                          toast.info("Reset to Face Focus (15%)");
                        }}
                        className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground"
                      >
                        <RotateCcw className="mr-1 h-3 w-3" />
                        Reset
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={cropping}
                        onClick={handleCropAndSave}
                        className="h-7 border-blue-500/30 bg-blue-500/10 px-2.5 text-[11px] text-blue-300 hover:bg-blue-500/20 hover:text-blue-200"
                      >
                        {cropping ? (
                          <>
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            Cropping…
                          </>
                        ) : (
                          <>
                            <Crop className="mr-1 h-3 w-3" />
                            Crop & Save Permanently
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Quick Alignment Presets:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarPosY(12);
                          setAvatarPosX(50);
                        }}
                        className={cn(
                          "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors border",
                          avatarPosY <= 15
                            ? "border-blue-500 bg-blue-500/20 text-blue-300"
                            : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                        )}
                      >
                        👤 Face / Head (12%)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarPosY(25);
                          setAvatarPosX(50);
                        }}
                        className={cn(
                          "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors border",
                          avatarPosY > 15 && avatarPosY <= 35
                            ? "border-blue-500 bg-blue-500/20 text-blue-300"
                            : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                        )}
                      >
                        👔 Upper Body (25%)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarPosY(50);
                          setAvatarPosX(50);
                        }}
                        className={cn(
                          "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors border",
                          avatarPosY > 35 && avatarPosY <= 65
                            ? "border-blue-500 bg-blue-500/20 text-blue-300"
                            : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                        )}
                      >
                        🎯 Center (50%)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarPosY(80);
                          setAvatarPosX(50);
                        }}
                        className={cn(
                          "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors border",
                          avatarPosY > 65
                            ? "border-blue-500 bg-blue-500/20 text-blue-300"
                            : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                        )}
                      >
                        🧍 Lower / Waist (80%)
                      </button>
                    </div>
                  </div>

                  {/* Range sliders */}
                  <div className="grid gap-3 sm:grid-cols-3 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">Vertical (Y)</span>
                        <span className="font-mono text-blue-400 font-medium">{avatarPosY}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={avatarPosY}
                        onChange={(e) => setAvatarPosY(Number(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <div className="flex justify-between text-[9px] text-muted-foreground/60">
                        <span>Top (Head)</span>
                        <span>Bottom</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">Horizontal (X)</span>
                        <span className="font-mono text-blue-400 font-medium">{avatarPosX}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={avatarPosX}
                        onChange={(e) => setAvatarPosX(Number(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <div className="flex justify-between text-[9px] text-muted-foreground/60">
                        <span>Left</span>
                        <span>Right</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">Zoom / Scale</span>
                        <span className="font-mono text-blue-400 font-medium">
                          {(avatarZoom / 100).toFixed(1)}x
                        </span>
                      </div>
                      <input
                        type="range"
                        min={100}
                        max={200}
                        step={5}
                        value={avatarZoom}
                        onChange={(e) => setAvatarZoom(Number(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <div className="flex justify-between text-[9px] text-muted-foreground/60">
                        <span>1.0x (Normal)</span>
                        <span>2.0x (Close-up)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Section>

          {/* Stats */}
          <Section
            title="Stats"
            icon={Hash}
            description="Numbers displayed in the hero/about section. Add or remove any key-value pair."
          >
            <div className="space-y-2.5">
              {KNOWN_STATS.map((k) => (
                <div key={k} className="flex items-center gap-2">
                  <div className="w-40 shrink-0 font-mono text-xs text-muted-foreground">
                    {k}
                  </div>
                  <Input
                    value={stats[k] ?? ""}
                    onChange={(e) => setStat(k, e.target.value)}
                    placeholder="0"
                    className="flex-1"
                  />
                  <button
                    onClick={() => removeStat(k)}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                    aria-label={`Remove ${k}`}
                    type="button"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {Object.keys(stats)
                .filter((k) => !KNOWN_STATS.includes(k))
                .map((k) => (
                  <div key={k} className="flex items-center gap-2">
                    <div className="w-40 shrink-0 truncate font-mono text-xs text-foreground">
                      {k}
                      <span className="ml-1.5 rounded bg-blue-500/15 px-1 py-0.5 text-[9px] text-blue-300">
                        custom
                      </span>
                    </div>
                    <Input
                      value={stats[k] ?? ""}
                      onChange={(e) => setStat(k, e.target.value)}
                      placeholder="0"
                      className="flex-1"
                    />
                    <button
                      onClick={() => removeStat(k)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                      aria-label={`Remove ${k}`}
                      type="button"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
            </div>

            <div className="mt-3 flex flex-col gap-2 rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-3 sm:flex-row sm:items-center">
              <Input
                value={newStatKey}
                onChange={(e) => setNewStatKey(e.target.value)}
                placeholder="new stat key (e.g. happyClients)"
                className="flex-1 font-mono text-xs"
              />
              <Input
                value={newStatValue}
                onChange={(e) => setNewStatValue(e.target.value)}
                placeholder="value"
                className="flex-1 sm:max-w-[140px]"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addStat}
                className="gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </Button>
            </div>
          </Section>

          {/* Social links */}
          <Section
            title="Social links"
            icon={Link2}
            description="Used in the header, footer, and contact section. Leave blank to hide."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {SOCIAL_FIELDS.map((s) => (
                <div key={s.key} className="space-y-2">
                  <Label htmlFor={`social-${s.key}`}>{s.label}</Label>
                  <Input
                    id={`social-${s.key}`}
                    value={socialLinks[s.key] ?? ""}
                    onChange={(e) => setSocial(s.key, e.target.value)}
                    placeholder={s.placeholder}
                    className="font-mono text-xs"
                  />
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <Section
            title="Live preview"
            icon={Sparkles}
            description="Approximate rendering of your hero card."
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#0a0e1a] p-5">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-12 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-500/30 to-violet-600/30 blur-3xl"
              />
              <div className="relative flex flex-col items-center text-center">
                <div className="relative h-24 w-24 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 ring-4 ring-white/5 shadow-2xl">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={name || "avatar"}
                      className="h-full w-full object-cover transition-all duration-150"
                      style={{
                        objectPosition: `${avatarPosX}% ${avatarPosY}%`,
                        transform: avatarZoom !== 100 ? `scale(${avatarZoom / 100})` : undefined,
                      }}
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-2xl font-bold text-white">
                      {(name || "A").slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="mt-4 font-display text-xl font-bold tracking-tight">
                  {name || "Your name"}
                </h3>
                <p className="text-sm text-blue-300">{title || "Your title"}</p>
                <p className="mt-2 max-w-xs text-xs text-muted-foreground">
                  {tagline || "Your tagline will appear here."}
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  {Object.entries(stats)
                    .slice(0, 4)
                    .map(([k, v]) => (
                      <div
                        key={k}
                        className="rounded-lg bg-white/[0.03] px-2.5 py-1.5 text-center"
                      >
                        <div className="font-display text-base font-bold text-foreground">
                          {v || "0"}
                        </div>
                        <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                          {k.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                      </div>
                    ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
                  {SOCIAL_FIELDS.filter((s) => socialLinks[s.key]?.trim()).map((s) => (
                    <span
                      key={s.key}
                      className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground"
                    >
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {isDirty ? (
              <p className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Unsaved changes
              </p>
            ) : (
              <p className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                All changes saved
              </p>
            )}
          </Section>
        </div>
      </div>
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
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
