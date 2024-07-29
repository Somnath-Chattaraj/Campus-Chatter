import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

// @ts-ignore
const postReview = asyncHandler(async(req: Request, res: Response) => {
    const { review, rating, college, course: Ucourse, reviewForCollege } = req.body;
    const token = req.cookies.Authorization;
    // @ts-ignore
    const decoded = jwt.verify(token, process.env.SECRET);
    const user_id = decoded.sub;
    if (!review || !rating || (!college && !Ucourse)) {
        return res.status(400).json({ message: "Required fields are missing" });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    try {
        const user = await prisma.user.findFirst({
            where: { user_id },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { collegeEmailVerified } = user;

        if (!collegeEmailVerified) {
            return res.status(403).json({ message: "Please verify your college email to write a review" });
        }

        const courses = await prisma.userCourse.findMany({
            select: {
                Course: {
                    select: {
                        course_id: true,
                        name: true,
                        isOnline: true,
                        College: {
                            select: {
                                college_id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            where: { user_id },
        });

        const findCourse = (condition: (course: any) => boolean) => {
            return courses.find(condition);
        };

        const createReview = async (reviewData: any) => {
            await prisma.review.create({
                data: reviewData,
            });
        };

        if (reviewForCollege && college) {
            const course = findCourse(course => course.Course.College?.name === college);

            if (course) {
                const courseCollegeId = course.Course.College?.college_id;
                await createReview({
                    user_id,
                    college_id: courseCollegeId,
                    rating,
                    review,
                    createdAt: new Date(),
                });
                return res.status(201).json({ message: "Review written for college" });
            } else {
                return res.status(404).json({ message: "You were never enrolled in this college" });
            }
        } else if (!reviewForCollege && Ucourse) {
            const course = findCourse(course => course.Course.name === Ucourse);

            if (course) {
                const courseId = course.Course.course_id;
                await createReview({
                    user_id,
                    course_id: courseId,
                    rating,
                    review,
                    createdAt: new Date(),
                });
                return res.status(201).json({ message: "Review written for course" });
            } else {
                return res.status(404).json({ message: "You were never enrolled in this course" });
            }
        } else {
            return res.status(400).json({ message: "Invalid request" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// @ts-ignore
const filterReviews = asyncHandler(async (req: Request, res: Response) => {
    const { keyword } = req.query;
  
    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).send('Keyword query parameter is required and should be a string');
    }
  
    try {
      const reviews = await prisma.review.findMany({
        where: {
          OR: [
            {
              College: {
                name: {
                  contains: keyword,
                  mode: 'insensitive',
                },
              },
            },
            {
              Course: {
                name: {
                  contains: keyword,
                  mode: 'insensitive',
                },
              },
            },
          ],
        },
        select: {
            review_id: true,
            review: true,
            rating: true,
            createdAt: true,
            updatedAt: true,
            College: true,
            Course: true,
            User: true,
          },
      });
  
      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while fetching reviews');
    }
})

// @ts-ignore
const getFullReview = asyncHandler(async (req: Request, res: Response) => {
    const {reviewId} = req.params;
    const review = await prisma.review.findFirst({
        where: {
            review_id: reviewId,
        },
    });
    if (!review) {
        return res.status(404).json({ message: "Review not found" });
    }
    try {
        return res.status(200).json(review);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// @ts-ignore
const deleteReview = asyncHandler(async (req: Request, res: Response) => {
    const {reviewId} = req.params;
    const token = req.cookies.Authorization;
    // @ts-ignore
    const decoded = jwt.verify(token, process.env.SECRET);
    const user_id = decoded.sub;
    const review = await prisma.review.findFirst({
        where: {
            review_id: reviewId,
            user_id,
        },
    });
    if (!review) {
        return res.status(404).json({ message: "Review not found" });
    }
    try {
        await prisma.review.delete({
            where: {
                review_id: reviewId,
                user_id,
            },
        });
        return res.status(200).json({ message: "Review deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
})



// @ts-ignore
const editReview = asyncHandler(async (req: Request, res: Response) => {
    const {reviewId} = req.params;
    const { rating, updateReview } = req.body;
    const token = req.cookies.Authorization;
    // @ts-ignore
    const decoded = jwt.verify(token, process.env.SECRET);
    const user_id = decoded.sub;
    const review = await prisma.review.findFirst({
        where: {
            review_id: reviewId,
            user_id,
        },
    });
    if (!review) {
        return res.status(404).json({ message: "Review not found" });
    }
    try {
        await prisma.review.update({
            where: {
                review_id: reviewId,
                user_id,
            },
            data: {
                rating,
                review: updateReview,
                updatedAt: new Date(),
            },
        });
        return res.status(200).json({ message: "Review updated" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export  {postReview, filterReviews , getFullReview, deleteReview, editReview}
