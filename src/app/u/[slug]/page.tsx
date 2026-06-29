import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { BackgroundType } from "@/generated/prisma/client";
import Image from "next/image";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bio = await prisma.bioPage.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { avatarMedia: true },
  });

  if (!bio) {
    return {
      title: "Not Found",
    };
  }

  const title = bio.seoTitle ? { absolute: bio.seoTitle } : `${bio.displayName} | GrasiApp`;
  const description = bio.seoDescription || bio.bio || undefined;
  const image = bio.avatarMedia?.url ? bio.avatarMedia.url : undefined;

  return {
    title,
    description,
    openGraph: {
      title: bio.seoTitle || `${bio.displayName} | GrasiApp`,
      description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function BioPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const bio = await prisma.bioPage.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      links: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
      avatarMedia: true,
      backgroundMedia: true,
    },
  });

  if (!bio) notFound();

  const bgStyle: React.CSSProperties = {};
  if (bio.backgroundType === BackgroundType.COLOR && bio.backgroundValue) {
    bgStyle.backgroundColor = bio.backgroundValue;
  } else if (
    bio.backgroundType === BackgroundType.GRADIENT &&
    bio.backgroundValue
  ) {
    bgStyle.background = bio.backgroundValue;
  }

  return (
    <div
      className="relative flex min-h-screen flex-col items-center px-4 py-12"
      style={{
        ...bgStyle,
        color: bio.textColor ?? "#ffffff",
      }}
    >
      {bio.backgroundType === BackgroundType.IMAGE &&
        bio.backgroundMedia?.url && (
          <Image
            src={bio.backgroundMedia.url}
            alt=""
            fill
            className="object-cover"
            priority
          />
        )}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6">
        {bio.avatarMedia?.url && (
          <Image
            src={bio.avatarMedia.url}
            alt={bio.displayName}
            width={96}
            height={96}
            className="rounded-full border-2 border-white/30 object-cover"
          />
        )}
        <div className="text-center">
          <h1 className="text-2xl font-bold">{bio.displayName}</h1>
          {bio.bio && (
            <p className="mt-2 text-sm opacity-90">{bio.bio}</p>
          )}
        </div>
        <div className="flex w-full flex-col gap-3">
          {bio.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target={link.openInNewTab ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="block w-full rounded-full px-6 py-3 text-center font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: bio.buttonColor ?? "#000000",
                color: bio.textColor ?? "#ffffff",
                borderRadius:
                  bio.buttonStyle === "square"
                    ? "0.5rem"
                    : bio.buttonStyle === "pill"
                      ? "9999px"
                      : "0.75rem",
              }}
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
