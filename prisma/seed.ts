import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const categories = [
  { value: "app", label: "Application", icon: "AppWindowIcon" },
  { value: "band", label: "Music Band", icon: "MusicNoteIcon" },
  { value: "blog", label: "Blog", icon: "PenIcon" },
  { value: "book", label: "Book", icon: "BookIcon" },
  { value: "course", label: "Course", icon: "GraduationCapIcon" },
  { value: "documentary", label: "Documentary", icon: "FileTextIcon" },
  { value: "instagram", label: "Instagram", icon: "InstagramLogoIcon" },
  { value: "movie", label: "Movie", icon: "FilmSlateIcon" },
  { value: "podcast", label: "Podcast", icon: "MicrophoneIcon" },
  { value: "series", label: "Series", icon: "TelevisionSimpleIcon" },
  { value: "song", label: "Song", icon: "MusicNoteIcon" },
  { value: "tiktok", label: "Tiktok", icon: "MonitorPlayIcon" },
  { value: "video", label: "Video", icon: "MonitorPlayIcon" },
  { value: "website", label: "Website", icon: "GlobeIcon" },
  { value: "youtube", label: "Youtube", icon: "YoutubeLogoIcon" },
  { value: "game", label: "Game", icon: "GameControllerIcon" },
];

async function main() {
  // پاک‌سازی جدول Category
  await prisma.category.deleteMany();

  for (const category of categories) {
    await prisma.category.create({
      data: {
        value: category.value,
        label: category.label,
        icon: category.icon,
      },
    });
  }

  console.log("✅ Categories (EN) fully reset and seeded.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    prisma.$disconnect();
    process.exit(1);
  });
