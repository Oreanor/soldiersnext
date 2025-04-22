import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { password } = await request.json();
  const correctPassword = process.env.ADMIN_PASSWORD; // Получаем пароль из переменных окружения

  if (password === correctPassword) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json(
      { error: 'Неверный пароль' },
      { status: 401 }
    );
  }
}