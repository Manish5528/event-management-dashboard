import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const usersFile = path.join(process.cwd(), "src", "data", "users.json");

type User = { username: string; password: string; emailAddress: string };

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { emailAddress, password } = body;

    
    if (!fs.existsSync(usersFile)) {
      return NextResponse.json(
        { error: "No users found" },
        { status: 404 }
      );
    }

    const fileData = fs.readFileSync(usersFile, "utf8");
    if (!fileData.trim()) {
      return NextResponse.json(
        { error: "No users found" },
        { status: 404 }
      );
    }

    const users: User[] = JSON.parse(fileData);

    const existingUser = users.find(
      (u) => u.emailAddress === emailAddress && u.password === password
    );

    if (!existingUser) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Login successful",
      user: existingUser,
    });
  } catch{
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
