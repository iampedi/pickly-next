import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Fake auth function (replace with real logic if needed)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const auth = (_req: Request) => ({ id: "fakeId" });

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = auth(req);

      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ Upload complete for userId:", metadata.userId);
      console.log("🖼️ Uploaded file URL:", file.ufsUrl);

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
