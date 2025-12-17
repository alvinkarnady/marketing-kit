import { writeFile } from "fs/promises";
import path from "path";

export async function uploadImage(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `theme-${Date.now()}-${file.name}`;
  const filepath = path.join(process.cwd(), "public/uploads/themes", filename);

  await writeFile(filepath, buffer);

  return `/uploads/themes/${filename}`;
}
