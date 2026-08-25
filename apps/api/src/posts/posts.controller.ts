import {
  BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, Res,
  UploadedFiles, UseGuards, UseInterceptors
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import type { Response } from "express";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AvatarStorageService } from "../users/avatar-storage.service";
import { PostsService } from "./posts.service";

type ImageFile = { buffer: Buffer; mimetype: string; originalname: string; size: number };
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

@ApiTags("posts")
@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService, private readonly imageStorage: AvatarStorageService) {}

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  getById(@Param("id") id: string) { return this.postsService.getById(id); }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor("images", 4, { limits: { fileSize: 5 * 1024 * 1024 } }))
  create(@Req() request: { user: { sub: string } }, @Body("caption") caption: string, @UploadedFiles() files: ImageFile[] = []) {
    this.validateFiles(files, true);
    return this.postsService.create(request.user.sub, caption ?? "", files, this.imageStorage);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  @UseInterceptors(FilesInterceptor("images", 4, { limits: { fileSize: 5 * 1024 * 1024 } }))
  update(
    @Param("id") id: string,
    @Req() request: { user: { sub: string } },
    @Body("caption") caption: string,
    @Body("replaceImages") replaceImages: string,
    @Body("mediaOrder") mediaOrder: string | undefined,
    @UploadedFiles() files: ImageFile[] = []
  ) {
    this.validateFiles(files, false);
    return this.postsService.update(id, request.user.sub, caption ?? "", replaceImages === "true", mediaOrder, files, this.imageStorage);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string, @Req() request: { user: { sub: string } }) {
    return this.postsService.remove(id, request.user.sub);
  }

  @Get("image-files/:filename")
  async getImageFile(@Param("filename") filename: string, @Res() response: Response) {
    return response.sendFile(await this.imageStorage.getLocalPostFile(filename));
  }

  private validateFiles(files: ImageFile[], required: boolean) {
    if ((required && files.length === 0) || files.length > 4) throw new BadRequestException("Envie de 1 a 4 imagens");
    if (files.some((file) => !allowedTypes.includes(file.mimetype) || !this.hasValidSignature(file))) throw new BadRequestException("Apenas imagens JPG, PNG ou WebP são permitidas");
  }

  private hasValidSignature(file: ImageFile) {
    const bytes = file.buffer;
    if (file.mimetype === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    if (file.mimetype === "image/png") return bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    if (file.mimetype === "image/webp") return bytes.subarray(0, 4).toString() === "RIFF" && bytes.subarray(8, 12).toString() === "WEBP";
    return false;
  }
}
