import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const city = url.searchParams.get("city") || undefined;
    const condition = url.searchParams.get("condition") || undefined;
    const minTemp = parseFloat(url.searchParams.get("minTemp") || "") || undefined;
    const maxTemp = parseFloat(url.searchParams.get("maxTemp") || "") || undefined;
    const startDate = url.searchParams.get("startDate") ? new Date(url.searchParams.get("startDate")!) : undefined;
    const endDate = url.searchParams.get("endDate") ? new Date(url.searchParams.get("endDate")!) : undefined;
    const pageParam = parseInt(url.searchParams.get("page") || "1");
    const itemsPerPageParam = parseInt(url.searchParams.get("itemsPerPage") || "10");

    // Pastikan page & itemsPerPage minimal 1
    let page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    let itemsPerPage = isNaN(itemsPerPageParam) || itemsPerPageParam < 1 ? 10 : itemsPerPageParam;

    // Siapkan whereClause jika ada fitur filter
    const whereClause: any = {};

    if (city) whereClause.city = city;
    if (condition) whereClause.condition = condition;
    if (minTemp !== undefined && maxTemp !== undefined) {
      whereClause.temp = { gte: minTemp, lte: maxTemp };
    }
    if (startDate && endDate) {
      whereClause.timestamp = { gte: startDate, lte: endDate };
    }

    const totalItems = await prisma.weather.count({ where: whereClause });

    // Hitung total halaman
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    // Jika page > totalPages, set page = totalPages (hindari skip negatif)
    if (page > totalPages && totalPages > 0) {
      page = totalPages;
    }

    // Ambil data weather dengan pagination
    const data = await prisma.weather.findMany({
      where: whereClause,
      orderBy: { timestamp: "desc" },
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
    });

    const safeData = Array.isArray(data) ? data : [];

    return NextResponse.json({
      data: safeData,
      totalItems,
      itemsPerPage,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    console.error("❌ Error:", err);
    return NextResponse.json(
      { message: "Gagal ambil data cuaca" },
      { status: 500 }
    );
  }
}
