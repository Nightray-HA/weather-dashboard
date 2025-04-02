import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";
import { addHours } from "date-fns";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null,
      },
    });

    // 🔐 Buat token verifikasi
    const token = randomBytes(32).toString("hex");
    const expires = addHours(new Date(), 1);

    await prisma.verificationToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    // 📧 Kirim email verifikasi
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify?token=${token}`;

    await transporter.sendMail({
      from: `"Weather Dashboard" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Verifikasi Email Anda",
      html: `
        <h2>Halo ${name},</h2>
        <p>Terima kasih telah mendaftar. Klik tombol di bawah untuk verifikasi email Anda:</p>
        <a href="${verifyUrl}" style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;">
          Verifikasi Email
        </a>
        <p>Link ini berlaku selama 1 jam.</p>
      `,
    });

    return NextResponse.json({ message: "Registrasi berhasil. Silakan cek email untuk aktivasi akun anda." });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat registrasi" },
      { status: 500 }
    );
  }
}
