import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import prisma from "../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendMail from "../mail/sendMail";
import { Verifier } from "academic-email-verifier";
import checkCollegeEmail from "../mail/checkAcademic";


//@ts-ignore
const googleSignInOrSignUp = asyncHandler(async (req: Request, res: Response) => {
  const{email,displayName}=req.body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    const user = await prisma.user.create({
      // @ts-ignore
      data: {
        email,
        username:displayName,
        collegeEmailVerified: false,
        emailVerified:true,
      },
    });
    const exp = Date.now() + 1000 * 60 *60*24*30;
    // @ts-ignore
    const token = jwt.sign({ sub: user.user_id, exp }, process.env.SECRET);
    res.cookie("Authorization", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    return res.status(201).json({ message: "User created" });
  }
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
  // @ts-ignore
  const token = jwt.sign({ sub: user.user_id, exp }, process.env.SECRET);
  res.cookie("Authorization", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.status(200).json({ message: "User logged in" });
});


// @ts-ignore
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, password, collegeName, courseName, isOnline, location } =
    req.body;
  const hashedPassword = await bcrypt.hash(password, 8);
  if (!email || !username || !password) {
    res.status(400).json({ message: "Please provide all fields" });
    return;
  }
  const userExists = await prisma.user.findFirst({
    where: {
      OR: [
        { email: email },
        { username: username }
      ]
    }
  });
  
  if (userExists) {
    res.status(409).json({ message: "User already exists" });
    return;
  }

  let isCollegeEmail;

  if (checkCollegeEmail(email)) {
    isCollegeEmail = true;
  } else {
    isCollegeEmail = await Verifier.isAcademic(email);
  }

  if (isCollegeEmail == true) {
    if (!courseName || !collegeName || !location || isOnline === undefined) {
      return res.status(400).json({ message: "Please provide all fields" });
    }
    let college = await prisma.college.findFirst({
      where: {
        name: collegeName,
      },
    });

    if (!college) {
      college = await prisma.college.create({
        data: {
          name: collegeName,
          location,
        },
      });
    }
    const college_id = college.college_id;
    let course = await prisma.course.findFirst({
      where: {
        name: courseName,
      },
    });
    let course_id;
    if (course) {
      course_id = course.course_id;
    } else {
      course = await prisma.course.create({
        data: {
          name: courseName,
          college_id,
          isOnline,
        },
      });
      course_id = course.course_id;
    }
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        collegeEmailVerified: true,
      },
    });
    const userCourse = await prisma.userCourse.create({
      data: {
        user_id: user.user_id,
        course_id,
        college_id,
      },
    });
    const exp = Date.now() + 1000 * 60 * 5;
    // @ts-ignore
    const token = jwt.sign({ sub: user.user_id, exp }, process.env.SECRET);
    const url = `${process.env.BACKEND_URL}/api/user/verify/${token}`;
    const htmlContent = `<a href="${url}">Verify using this link</a>`;
    // @ts-ignore
    sendMail(htmlContent, email);
    res.status(201).json({ message: "User created" });
  } else {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        collegeEmailVerified: false,
      },
    });
    const exp = Date.now() + 1000 * 60 * 5;
    // @ts-ignore
    const token = jwt.sign({ sub: user.user_id, exp }, process.env.SECRET);
    const url = `${process.env.BACKEND_URL}/api/user/verify/${token}`;
    const htmlContent = `<a href="${url}">Verify using this link</a>`;
    // @ts-ignore
    sendMail(htmlContent, email);
    res.status(201).json({ message: "User created" });
  }
});

const verifyUser = asyncHandler(async (req: Request, res: Response) => {
  const token = req.params.token;
  if (!token) {
    res.status(400).json({ message: "Invalid token" });
    return;
  }
  // @ts-ignore
  const { sub, exp } = jwt.verify(token, process.env.SECRET);
  // @ts-ignore
  if (exp < Date.now()) {
    res.status(400).json({ message: "Token expired" });
    return;
  }
  const user = await prisma.user.findUnique({
    where: {
      user_id: sub,
    },
  });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  if (user.emailVerified) {
    res.status(400).json({ message: "User already verified" });
    return;
  }
  await prisma.user.update({
    where: {
      user_id: sub,
    },
    data: {
      emailVerified: true,
    },
  });
  res.status(200).json({ message: "User verified" });
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Please provide all fields" });
    return;
  }
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  if(!user.password){
    res.status(401).json({ message: "Logged in with Google Or Github" });
    return;
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
  // @ts-ignore
  const token = jwt.sign({ sub: user.user_id, exp }, process.env.SECRET);
  res.cookie("Authorization", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.status(200).json({ message: "User logged in" });
});

const getCurrentUserDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: {
        // @ts-ignore
        user_id: req.user.user_id,
      },
      select: {
        user_id: true,
        email: true,
        username: true,
        userCourses: {
          select: {
            Course: {
              select: {
                name: true,
                College: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        reviews: true,
        chatRooms: true,
      },
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  }
);

const getUserDetailsById = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      user_id: userId,
    },
    select: {
      email: true,
      username: true,
      userCourses: {
        select: {
          Course: {
            select: {
              name: true,
              College: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      reviews: true,
      chatRooms: true,
    },
  });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.status(200).json(user);
});

// @ts-ignore
const addCourseToUser = asyncHandler(async (req: Request, res: Response) => {
  const { courseName, collegeName, isOnline, location } = req.body;
  if (!courseName || !collegeName || !location || isOnline === undefined) {
    return res.status(400).json({ message: "Please provide all fields" });
  }
  // @ts-ignore
  const userId = req.user.user_id;
  let college = await prisma.college.findFirst({
    where: {
      name: collegeName,
    },
  });
  if (!college) {
    college = await prisma.college.create({
      data: {
        name: collegeName,
        location,
      },
    });
  }
  const college_id = college.college_id;
  let course = await prisma.course.findFirst({
    where: {
      name: courseName,
    },
  });
  let course_id;
  if (course) {
    course_id = course.course_id;
  } else {
    course = await prisma.course.create({
      data: {
        name: courseName,
        college_id,
        isOnline,
      },
    });
    course_id = course.course_id;
  }
  await prisma.userCourse.create({
    data: {
      user_id: userId,
      course_id,
      college_id,
    },
  });
  res.status(201).json({ message: "Course added to user" });
});

export {
  registerUser,
  loginUser,
  verifyUser,
  getCurrentUserDetails,
  getUserDetailsById,
  addCourseToUser,
  googleSignInOrSignUp,
};
