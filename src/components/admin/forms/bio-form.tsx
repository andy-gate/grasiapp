"use client";

import { useActionState, useState, useEffect } from "react";
import { saveBioPage } from "@/actions/admin/bio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Link2,
  Palette,
  Settings,
  Globe,
  Sparkles,
  Eye,
  Check,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Define Types
interface BioLinkItem {
  id?: string;
  title: string;
  url: string;
  isActive: boolean;
  openInNewTab: boolean;
}

interface BioFormProps {
  initialData?: {
    id?: string;
    slug: string;
    displayName: string;
    bio?: string | null;
    avatarMedia?: { url: string } | null;
    backgroundMedia?: { url: string } | null;
    status: string;
    themePreset?: string | null;
    backgroundType: string;
    backgroundValue?: string | null;
    buttonStyle?: string | null;
    buttonColor?: string | null;
    textColor?: string | null;
    fontFamily?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    links: BioLinkItem[];
  };
}

// Built-in presets configuration
const PRESETS = {
  light: {
    backgroundType: "COLOR",
    backgroundValue: "#f8fafc",
    textColor: "#0f172a",
    buttonColor: "#0f172a",
    buttonStyle: "rounded",
    fontFamily: "sans",
  },
  dark: {
    backgroundType: "COLOR",
    backgroundValue: "#0f172a",
    textColor: "#f8fafc",
    buttonColor: "#1e293b",
    buttonStyle: "rounded",
    fontFamily: "sans",
  },
  sunset: {
    backgroundType: "GRADIENT",
    backgroundValue: "linear-gradient(to bottom right, #ff7e5f, #feb47b)",
    textColor: "#ffffff",
    buttonColor: "rgba(255, 255, 255, 0.2)",
    buttonStyle: "pill",
    fontFamily: "sans",
  },
  ocean: {
    backgroundType: "GRADIENT",
    backgroundValue: "linear-gradient(to bottom, #2b5876, #4e4376)",
    textColor: "#ffffff",
    buttonColor: "rgba(0, 0, 0, 0.3)",
    buttonStyle: "pill",
    fontFamily: "sans",
  },
  emerald: {
    backgroundType: "COLOR",
    backgroundValue: "#064e3b",
    textColor: "#ecfdf5",
    buttonColor: "#047857",
    buttonStyle: "square",
    fontFamily: "serif",
  },
};

export function BioForm({ initialData }: BioFormProps) {
  // State for form data (synced to preview)
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [displayName, setDisplayName] = useState(initialData?.displayName || "");
  const [bio, setBio] = useState(initialData?.bio || "");
  const [status, setStatus] = useState(initialData?.status || "DRAFT");
  const [themePreset, setThemePreset] = useState(initialData?.themePreset || "light");
  const [backgroundType, setBackgroundType] = useState(initialData?.backgroundType || "COLOR");
  const [backgroundValue, setBackgroundValue] = useState(initialData?.backgroundValue || "#f8fafc");
  const [buttonStyle, setButtonStyle] = useState(initialData?.buttonStyle || "rounded");
  const [buttonColor, setButtonColor] = useState(initialData?.buttonColor || "#0f172a");
  const [textColor, setTextColor] = useState(initialData?.textColor || "#0f172a");
  const [fontFamily, setFontFamily] = useState(initialData?.fontFamily || "sans");
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || "");

  // File states for previews
  const [avatarPreview, setAvatarPreview] = useState(initialData?.avatarMedia?.url || "");
  const [bgImagePreview, setBgImagePreview] = useState(initialData?.backgroundMedia?.url || "");
  const [deleteAvatar, setDeleteAvatar] = useState(false);
  const [deleteBackground, setDeleteBackground] = useState(false);

  // Links state
  const [links, setLinks] = useState<BioLinkItem[]>(initialData?.links || []);

  // Sync preset values on preset change
  useEffect(() => {
    if (themePreset && themePreset !== "custom") {
      const preset = PRESETS[themePreset as keyof typeof PRESETS];
      if (preset) {
        setBackgroundType(preset.backgroundType);
        setBackgroundValue(preset.backgroundValue);
        setButtonStyle(preset.buttonStyle);
        setButtonColor(preset.buttonColor);
        setTextColor(preset.textColor);
        setFontFamily(preset.fontFamily);
      }
    }
  }, [themePreset]);

  // Action status state
  const [state, formAction, pending] = useActionState(saveBioPage, { ok: true });

  // Handle file preview generators
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDeleteAvatar(false);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleBgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDeleteBackground(false);
      setBgImagePreview(URL.createObjectURL(file));
    }
  };

  // Links Handlers
  const addLink = () => {
    setLinks([
      ...links,
      {
        title: "Tautan Baru",
        url: "https://",
        isActive: true,
        openInNewTab: true,
      },
    ]);
  };

  const updateLink = (index: number, key: keyof BioLinkItem, value: any) => {
    const updated = [...links];
    updated[index] = { ...updated[index], [key]: value };
    setLinks(updated);
  };

  const moveLink = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === links.length - 1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...links];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setLinks(updated);
  };

  const deleteLink = (index: number) => {
    const updated = links.filter((_, idx) => idx !== index);
    setLinks(updated);
  };

  // Dynamic public path prefix generator
  const currentHost = typeof window !== "undefined" ? window.location.origin : "";

  // Dynamic Background Style for Preview
  const getPreviewBgStyle = () => {
    if (backgroundType === "COLOR" && backgroundValue) {
      return { backgroundColor: backgroundValue };
    }
    if (backgroundType === "GRADIENT" && backgroundValue) {
      return { background: backgroundValue };
    }
    if (backgroundType === "IMAGE" && bgImagePreview && !deleteBackground) {
      return {
        backgroundImage: `url(${bgImagePreview})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return { backgroundColor: "#f1f5f9" };
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* LEFT COLUMN: EDITOR FORM */}
      <div className="lg:col-span-8 space-y-6">
        <form action={formAction} className="space-y-6">
          {state.ok === false && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {state.error}
            </div>
          )}
          
          {state.ok === true && state !== undefined && (
            <div className="hidden" />
          )}

          {/* Top-level hidden inputs to ensure they are always submitted regardless of active tab */}
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="displayName" value={displayName} />
          <input type="hidden" name="bio" value={bio || ""} />
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="themePreset" value={themePreset} />
          <input type="hidden" name="backgroundType" value={backgroundType} />
          <input type="hidden" name="backgroundValue" value={backgroundValue || ""} />
          <input type="hidden" name="buttonStyle" value={buttonStyle || "rounded"} />
          <input type="hidden" name="buttonColor" value={buttonColor || "#0f172a"} />
          <input type="hidden" name="textColor" value={textColor || "#0f172a"} />
          <input type="hidden" name="fontFamily" value={fontFamily || "sans"} />
          <input type="hidden" name="seoTitle" value={seoTitle || ""} />
          <input type="hidden" name="seoDescription" value={seoDescription || ""} />
          <input type="hidden" name="linksJson" value={JSON.stringify(links)} />
          <input type="hidden" name="deleteAvatar" value={String(deleteAvatar)} />
          <input type="hidden" name="deleteBackground" value={String(deleteBackground)} />

          {/* Top-level hidden file inputs (they never unmount) */}
          <input
            type="file"
            id="avatarFile"
            name="avatarFile"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <input
            type="file"
            id="backgroundFile"
            name="backgroundFile"
            accept="image/*"
            className="hidden"
            onChange={handleBgImageChange}
          />

          <Tabs defaultValue="links" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted mb-4">
              <TabsTrigger value="links" className="flex items-center gap-1">
                <Link2 className="size-4" />
                <span>Links</span>
              </TabsTrigger>
              <TabsTrigger value="info" className="flex items-center gap-1">
                <Globe className="size-4" />
                <span>Info</span>
              </TabsTrigger>
              <TabsTrigger value="design" className="flex items-center gap-1">
                <Palette className="size-4" />
                <span>Desain</span>
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center gap-1">
                <Settings className="size-4" />
                <span>SEO</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB CONTENT: LINKS */}
            <TabsContent value="links" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span>Daftar Tautan</span>
                  <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {links.length} links
                  </span>
                </h2>
                <Button type="button" onClick={addLink} className="flex items-center gap-1 text-xs px-3 py-1">
                  <Plus className="size-4" />
                  Tambah Link Baru
                </Button>
              </div>

              {links.length === 0 ? (
                <Card className="border-dashed border-2 py-12 text-center">
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">Belum ada link yang ditambahkan.</p>
                    <Button type="button" variant="outline" onClick={addLink} className="mx-auto">
                      Tambah Link Pertama Anda
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {links.map((link, index) => (
                    <Card key={index} className="relative group overflow-hidden">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 space-y-3">
                            <div>
                              <Label className="text-xs">Judul Link</Label>
                              <Input
                                type="text"
                                value={link.title}
                                onChange={(e) => updateLink(index, "title", e.target.value)}
                                className="h-8 text-sm"
                                placeholder="Judul Tautan"
                                required
                              />
                            </div>
                            <div>
                              <Label className="text-xs">URL Tujuan</Label>
                              <Input
                                type="text"
                                value={link.url}
                                onChange={(e) => updateLink(index, "url", e.target.value)}
                                className="h-8 text-sm"
                                placeholder="https://..."
                                required
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 justify-between h-full py-1">
                            {/* Sort Actions */}
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => moveLink(index, "up")}
                                disabled={index === 0}
                                className="size-7"
                              >
                                <ArrowUp className="size-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => moveLink(index, "down")}
                                disabled={index === links.length - 1}
                                className="size-7"
                              >
                                <ArrowDown className="size-3.5" />
                              </Button>
                            </div>
                            
                            {/* Toggles */}
                            <div className="flex items-center justify-between gap-3 bg-muted p-1 rounded-md">
                              <span className="text-[10px] font-medium px-1">Aktif</span>
                              <Switch
                                checked={link.isActive}
                                onCheckedChange={(checked) =>
                                  updateLink(index, "isActive", checked)
                                }
                                className="scale-75"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t pt-2 text-xs text-muted-foreground">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={link.openInNewTab}
                              onChange={(e) =>
                                updateLink(index, "openInNewTab", e.target.checked)
                              }
                              className="rounded border-gray-300"
                            />
                            <span>Buka di tab baru</span>
                          </label>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteLink(index)}
                            className="h-7 text-destructive hover:text-destructive/90 hover:bg-destructive/10 text-xs px-2 py-1 flex items-center gap-1"
                          >
                            <Trash2 className="size-3.5" />
                            <span>Hapus</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* TAB CONTENT: INFO */}
            <TabsContent value="info" className="space-y-4">
              <h2 className="text-lg font-semibold">Profil & Informasi</h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="slug">Custom URL Slug *</Label>
                  <div className="flex items-center">
                    <span className="bg-muted border border-r-0 rounded-l-md px-3 py-2 text-sm text-muted-foreground select-none">
                      /u/
                    </span>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="username"
                      required
                      className="rounded-l-none"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ini akan menjadi alamat publik Anda: {currentHost}/u/{slug || "..."}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName">Nama Tampilan *</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Nama Anda atau Brand"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Deskripsi Singkat (Bio)</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Ceritakan sedikit tentang diri Anda..."
                  rows={4}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2 border-t pt-4">
                <div className="space-y-2">
                  <Label>Foto Profil (Avatar)</Label>
                  <div className="flex items-center gap-4">
                    {avatarPreview && !deleteAvatar ? (
                      <div className="relative group size-16 shrink-0 rounded-full overflow-hidden border">
                        <img
                          src={avatarPreview}
                          alt="Avatar"
                          className="object-cover size-full"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteAvatar(true);
                            setAvatarPreview("");
                          }}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="size-16 shrink-0 rounded-full border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                    <div className="flex-1">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("avatarFile")?.click()}
                        className="text-xs w-full"
                      >
                        Pilih Foto Profil
                      </Button>
                      <p className="text-[10px] text-muted-foreground mt-1 text-center">
                        Disarankan gambar persegi 1:1, maks 2MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex justify-between">
                    <span>Status Publikasi</span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded font-semibold",
                      status === "PUBLISHED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    )}>
                      {status}
                    </span>
                  </Label>
                  <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-md border">
                    <Switch
                      checked={status === "PUBLISHED"}
                      onCheckedChange={(checked) =>
                        setStatus(checked ? "PUBLISHED" : "DRAFT")
                      }
                    />
                    <div className="text-xs">
                      <p className="font-semibold">Publikasikan Halaman</p>
                      <p className="text-muted-foreground">
                        Aktifkan agar bio page dapat diakses secara publik.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB CONTENT: DESIGN */}
            <TabsContent value="design" className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-lg font-semibold flex items-center gap-1.5">
                  <Sparkles className="size-5 text-amber-500" />
                  <span>Preset Tema</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {Object.keys(PRESETS).map((presetKey) => {
                    const active = themePreset === presetKey;
                    return (
                      <button
                        key={presetKey}
                        type="button"
                        onClick={() => setThemePreset(presetKey)}
                        className={cn(
                          "flex flex-col items-center justify-center p-3 rounded-lg border text-sm capitalize transition-all",
                          active
                            ? "border-primary ring-2 ring-primary bg-primary/5 font-semibold"
                            : "bg-card hover:bg-muted/50"
                        )}
                      >
                        {active && <Check className="size-4 text-primary mb-1" />}
                        <span>{presetKey}</span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setThemePreset("custom")}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-lg border text-sm capitalize transition-all",
                      themePreset === "custom"
                        ? "border-primary ring-2 ring-primary bg-primary/5 font-semibold"
                        : "bg-card hover:bg-muted/50"
                    )}
                  >
                    {themePreset === "custom" && <Check className="size-4 text-primary mb-1" />}
                    <span>Custom</span>
                  </button>
                </div>
              </div>

              {/* Custom Design Panel */}
              <div className={cn(
                "space-y-4 border-t pt-4 transition-all duration-300",
                themePreset !== "custom" ? "opacity-40 pointer-events-none" : ""
              )}>
                <h3 className="text-md font-semibold">Kostumisasi Desain</h3>
                
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="backgroundType">Tipe Background</Label>
                    <select
                      id="backgroundType"
                      value={backgroundType}
                      onChange={(e) => setBackgroundType(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                    >
                      <option value="COLOR">Warna Solid</option>
                      <option value="GRADIENT">Gradien Warna</option>
                      <option value="IMAGE">Gambar Kustom</option>
                    </select>
                  </div>

                  {backgroundType === "COLOR" && (
                    <div className="space-y-2">
                      <Label htmlFor="bgColor">Warna Background (Hex)</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={backgroundValue?.startsWith("#") ? backgroundValue : "#f8fafc"}
                          onChange={(e) => setBackgroundValue(e.target.value)}
                          className="w-12 h-9 p-1 cursor-pointer shrink-0"
                        />
                        <Input
                          id="bgColor"
                          type="text"
                          value={backgroundValue || ""}
                          onChange={(e) => setBackgroundValue(e.target.value)}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                  )}

                  {backgroundType === "GRADIENT" && (
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="gradientValue">Nilai Gradien CSS</Label>
                      <Input
                        id="gradientValue"
                        type="text"
                        value={backgroundValue || ""}
                        onChange={(e) => setBackgroundValue(e.target.value)}
                        placeholder="linear-gradient(to right, #ff7e5f, #feb47b)"
                      />
                      <p className="text-[10px] text-muted-foreground">
                        Gunakan kode sintaks CSS gradien standar.
                      </p>
                    </div>
                  )}

                  {backgroundType === "IMAGE" && (
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Gambar Background</Label>
                      <div className="flex items-center gap-4">
                        {bgImagePreview && !deleteBackground ? (
                          <div className="relative group h-12 w-20 shrink-0 rounded overflow-hidden border">
                            <img
                              src={bgImagePreview}
                              alt="Background"
                              className="object-cover size-full"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteBackground(true);
                                setBgImagePreview("");
                              }}
                              className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="h-12 w-20 shrink-0 rounded border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                            No image
                          </div>
                        )}
                        <div className="flex-1">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("backgroundFile")?.click()}
                            className="text-xs w-full"
                          >
                            Pilih Gambar Background
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="buttonStyle">Gaya Tombol Link</Label>
                    <select
                      id="buttonStyle"
                      value={buttonStyle || "rounded"}
                      onChange={(e) => setButtonStyle(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                    >
                      <option value="square">Kotak (Square)</option>
                      <option value="rounded">Melengkung (Rounded)</option>
                      <option value="pill">Lonjong (Pill)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buttonColor">Warna Tombol (Hex)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={buttonColor?.startsWith("#") ? buttonColor : "#0f172a"}
                        onChange={(e) => setButtonColor(e.target.value)}
                        className="w-12 h-9 p-1 cursor-pointer shrink-0"
                      />
                      <Input
                        id="buttonColor"
                        type="text"
                        value={buttonColor || ""}
                        onChange={(e) => setButtonColor(e.target.value)}
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="textColor">Warna Teks (Hex)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={textColor?.startsWith("#") ? textColor : "#ffffff"}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-12 h-9 p-1 cursor-pointer shrink-0"
                      />
                      <Input
                        id="textColor"
                        type="text"
                        value={textColor || ""}
                        onChange={(e) => setTextColor(e.target.value)}
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fontFamily">Jenis Font</Label>
                    <select
                      id="fontFamily"
                      value={fontFamily || "sans"}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs font-medium"
                    >
                      <option value="sans" className="font-sans">Sans Serif (Inter)</option>
                      <option value="serif" className="font-serif">Serif (Playfair)</option>
                      <option value="mono" className="font-mono">Monospace (Fira Code)</option>
                    </select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB CONTENT: SEO */}
            <TabsContent value="seo" className="space-y-4">
              <h2 className="text-lg font-semibold">Pengaturan SEO</h2>
              <p className="text-xs text-muted-foreground">
                Optimalkan metadata pencarian Google dan Social Share (OpenGraph) untuk halaman bio Anda.
              </p>

              <div className="space-y-2">
                <Label htmlFor="seoTitle">Judul SEO (SEO Title)</Label>
                <Input
                  id="seoTitle"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Contoh: Bio & Tautan Penting - Andy Yohanes"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">Deskripsi SEO (SEO Description)</Label>
                <Textarea
                  id="seoDescription"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Ketik deskripsi halaman bio Anda untuk hasil pencarian..."
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 border-t pt-6">
            <Button type="submit" disabled={pending} className="px-6">
              {pending ? "Menyimpan..." : "Simpan Bio Page"}
            </Button>
            <Link
              href="/admin"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Batal
            </Link>
          </div>
        </form>
      </div>

      {/* RIGHT COLUMN: STICKY PHONE PREVIEW */}
      <div className="lg:col-span-4 lg:sticky lg:top-6 self-start space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5 justify-center lg:justify-start">
          <Eye className="size-4" />
          <span>Live Preview</span>
        </h3>

        {/* Outer Phone Frame */}
        <div className="mx-auto w-[280px] sm:w-[320px] h-[560px] sm:h-[600px] border-[10px] border-slate-900 rounded-[36px] overflow-hidden shadow-2xl relative bg-slate-100 flex flex-col">
          {/* Phone Notch/Speaker */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-b-xl z-30 flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-800 rounded-full mb-1" />
          </div>

          {/* Screen Content Wrapper */}
          <div
            className="flex-1 overflow-y-auto px-5 py-10 flex flex-col items-center select-none"
            style={{
              ...getPreviewBgStyle(),
              color: textColor || "#000000",
              fontFamily:
                fontFamily === "serif"
                  ? "Georgia, serif"
                  : fontFamily === "mono"
                    ? "Courier New, monospace"
                    : "inherit",
            }}
          >
            {/* Avatar */}
            {avatarPreview && !deleteAvatar ? (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-20 h-20 rounded-full border-2 border-white/40 object-cover mt-4 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-400/40 bg-gray-300/20 flex items-center justify-center text-[10px] text-muted-foreground mt-4 shrink-0">
                Avatar
              </div>
            )}

            {/* Display Name */}
            <h4 className="font-bold text-lg mt-3 text-center break-all w-full leading-tight">
              {displayName || "@nama_tampilan"}
            </h4>

            {/* Bio Description */}
            {bio && (
              <p className="text-xs text-center opacity-85 mt-2 max-w-full break-words leading-relaxed">
                {bio}
              </p>
            )}

            {/* Link Buttons container */}
            <div className="w-full mt-6 space-y-3 flex-1 flex flex-col">
              {links.filter(l => l.isActive).map((link, idx) => (
                <div
                  key={idx}
                  className="w-full text-xs font-semibold text-center transition-transform py-3 px-4 shadow-xs"
                  style={{
                    backgroundColor: buttonColor || "#000000",
                    color: textColor || "#ffffff",
                    borderRadius:
                      buttonStyle === "square"
                        ? "6px"
                        : buttonStyle === "pill"
                          ? "9999px"
                          : "12px",
                  }}
                >
                  {link.title || "Tautan Tanpa Judul"}
                </div>
              ))}
              {links.filter(l => l.isActive).length === 0 && (
                <div className="flex-1 flex items-center justify-center text-[10px] text-muted-foreground opacity-60 italic text-center p-4">
                  Belum ada link aktif
                </div>
              )}
            </div>

            {/* Footer Watermark */}
            <div className="text-[9px] opacity-65 text-center mt-6 py-2">
              Powered by Grasiapp
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
