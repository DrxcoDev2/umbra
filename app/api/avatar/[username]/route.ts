import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  const username = params.username;
  const publicDir = path.join(process.cwd(), 'public', 'avatars');

  // Intenta buscar avatar con extensiones png, jpg o jpeg
  const extensions = ['png', 'jpg', 'jpeg'];
  let avatarPath: string | null = null;

  for (const ext of extensions) {
    const possiblePath = path.join(publicDir, `${username}.${ext}`);
    if (fs.existsSync(possiblePath)) {
      avatarPath = possiblePath;
      break;
    }
  }

  // Si no se encontr� avatar, usar default
  if (!avatarPath) {
    avatarPath = path.join(publicDir, 'default.png');
    if (!fs.existsSync(avatarPath)) {
      return new NextResponse('Avatar no encontrado', { status: 404 });
    }
  }

  // Leer archivo
  const imageBuffer = fs.readFileSync(avatarPath);

  // Detectar content type por extensi�n
  const ext = path.extname(avatarPath).toLowerCase();
  let contentType = 'application/octet-stream';
  if (ext === '.png') contentType = 'image/png';
  else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';

  return new NextResponse(imageBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600', // cache 1 hora
    },
  });
}
