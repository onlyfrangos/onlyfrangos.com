import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { mkdir, stat, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { randomUUID } from "node:crypto";

type UploadedImage = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
};

@Injectable()
export class AvatarStorageService {
  private readonly localDirectory = join(process.cwd(), "uploads", "avatars");
  private readonly localGymDirectory = join(process.cwd(), "uploads", "gyms");
  private readonly localPostDirectory = join(process.cwd(), "uploads", "posts");

  async save(userId: string, file: UploadedImage) {
    const extension = this.extensionFor(file);
    const key = `profile-avatars/${userId}-${randomUUID()}${extension}`;

    if (process.env.NODE_ENV === "production") {
      return this.saveToR2(key, file);
    }

    await mkdir(this.localDirectory, { recursive: true });
    const filename = key.replace("profile-avatars/", "");
    await writeFile(join(this.localDirectory, filename), file.buffer);
    const apiUrl = (process.env.API_PUBLIC_URL ?? "http://localhost:3001").replace(/\/$/, "");
    return `${apiUrl}/api/v1/users/avatar-files/${filename}`;
  }

  async saveGym(gymId: string, file: UploadedImage) {
    const extension = this.extensionFor(file);
    const key = `gym-images/${gymId}-${randomUUID()}${extension}`;

    if (process.env.NODE_ENV === "production") return this.saveToR2(key, file);

    await mkdir(this.localGymDirectory, { recursive: true });
    const filename = key.replace("gym-images/", "");
    await writeFile(join(this.localGymDirectory, filename), file.buffer);
    const apiUrl = (process.env.API_PUBLIC_URL ?? "http://localhost:3001").replace(/\/$/, "");
    return `${apiUrl}/api/v1/gyms/image-files/${filename}`;
  }

  async savePostImage(postId: string, file: UploadedImage) {
    const extension = this.extensionFor(file);
    const key = `post-images/${postId}-${randomUUID()}${extension}`;
    if (process.env.NODE_ENV === "production") return this.saveToR2(key, file);

    await mkdir(this.localPostDirectory, { recursive: true });
    const filename = key.replace("post-images/", "");
    await writeFile(join(this.localPostDirectory, filename), file.buffer);
    const apiUrl = (process.env.API_PUBLIC_URL ?? "http://localhost:3001").replace(/\/$/, "");
    return `${apiUrl}/api/v1/posts/image-files/${filename}`;
  }

  async getLocalFile(filename: string) {
    return this.getLocalImage(this.localDirectory, filename, "Avatar not found");
  }

  async getLocalGymFile(filename: string) {
    return this.getLocalImage(this.localGymDirectory, filename, "Gym image not found");
  }

  async getLocalPostFile(filename: string) {
    return this.getLocalImage(this.localPostDirectory, filename, "Post image not found");
  }

  private async getLocalImage(directory: string, filename: string, message: string) {
    if (!/^[a-zA-Z0-9._-]+$/.test(filename)) throw new NotFoundException();
    const filePath = join(directory, filename);

    try {
      await stat(filePath);
      return filePath;
    } catch {
      throw new NotFoundException(message);
    }
  }

  private async saveToR2(key: string, file: UploadedImage) {
    const endpoint = process.env.R2_ENDPOINT;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucket = process.env.R2_BUCKET;
    const publicUrl = process.env.R2_PUBLIC_URL;

    if (!endpoint || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) {
      throw new InternalServerErrorException("R2 storage is not configured");
    }

    const client = new S3Client({
      region: "auto",
      endpoint,
      credentials: { accessKeyId, secretAccessKey }
    });
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: "public, max-age=31536000, immutable"
      })
    );

    return `${publicUrl.replace(/\/$/, "")}/${key}`;
  }

  private extensionFor(file: UploadedImage) {
    const extensions: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp"
    };
    return extensions[file.mimetype] ?? extname(file.originalname).toLowerCase();
  }
}
