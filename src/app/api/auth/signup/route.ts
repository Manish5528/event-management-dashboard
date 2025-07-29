import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const usersFile = path.join(process.cwd(), "src", "data", "users.json");

type User = { 
  username: string; 
  password: string; 
  emailAddress: string; 
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password, emailAddress } = body;

    if (!fs.existsSync(usersFile)) {
      fs.writeFileSync(usersFile, JSON.stringify([]));
    }

    let fileData = fs.readFileSync(usersFile, "utf8");
    if (!fileData.trim()) fileData = "[]";

    const users: User[] = JSON.parse(fileData);

    if (users.some((u) => u.emailAddress === emailAddress)) {
      return NextResponse.json(
        { error: "Email address already registered" },
        { status: 409 }
      );
    }

    const newUser: User = { username, password, emailAddress };
    users.push(newUser);

    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    return NextResponse.json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
