import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import prisma from "../lib/prisma";

// @ts-ignore

const calAvgRating = asyncHandler(async (req: Request, res: Response) => {
    const {college} = req.body;
    if (!college || typeof college !== "string") {
        return res.status(400).json({ message: "Invalid request" });
    }
    try {
        const reviews = await prisma.review.findMany({
            where: {
                College: {
                    name: {
                        contains: college,
                        mode: "insensitive",
                    },
                },
            },
            select: {
                rating: true,
                review: true,
            },
        });

        let avgRating = 0;
        let count = 0;

        for (const review of reviews) {
            avgRating += review.rating;
            count++;
        }

        avgRating /= count;

        res.status(200).json({ avgRating });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export {calAvgRating};