import express from 'express'
import prisma from '../lib/prisma';
import { postReview, filterReviews,getFullReview, deleteReview, editReview } from '../controllers/reviewControllers';

const reviewRoute = express.Router();

// reviewRoute.post('/', async (req, res)=> {
//     const email = req.body.email;
//     const review = req.body.review;
//     const rating = req.body.rating;
//     const college = req.body.college;
//     const Ucourse = req.body.course;
//     const reviewForCollege = req.body.reviewForCollege;
//     if (email) {
//         const user = await prisma.user.findFirst({
//             where: {
//                 email
//             }
//         })
//         if (user) {
//             const user_id = user.user_id;
//             const collegeEmailVerified = user.collegeEmailVerified;
            
//             if (collegeEmailVerified) {
//                 const courses = await prisma.userCourse.findMany({
//                     select: {
//                         Course: {
//                             select: {
//                                 course_id: true,
//                                 name: true,
//                                 isOnline: true,
//                                 College: {
//                                     select: {
//                                         college_id: true,
//                                         name: true,
//                                     }
//                                 }
//                             }
//                         }   
//                     },
//                     where: {
//                         user_id: user_id
//                     }
//                 })
//                 if (reviewForCollege && college) {
//                     let flag = false;
//                     let courseCollegeId;
//                     if (courses.length > 0) {
//                         courses.map(course => {
//                             if (course.Course.College?.name == college) {
//                                 flag = true;
//                                 courseCollegeId = course.Course.College?.college_id;
//                             }
//                         })

//                     }
//                     if (flag && courseCollegeId) {
//                         // writing review for a college
//                         await prisma.review.create({
//                             data: {
//                                 user_id: user_id,
//                                 college_id: courseCollegeId,
//                                 rating: rating,
//                                 review: review
//                             }
//                         })
//                         console.log("review written")
//                         res.status(201).json({ message: "Review written" })
//                     }
//                     else {
//                         res.status(404).json({ message: "Your were never enrolled in this college" })
//                     }
//                 } else if (!reviewForCollege) {
//                     let flag = false;
//                     let courseId;
//                     if (courses.length > 0) {
//                         courses.map(course => {
//                             if (course.Course.name == Ucourse) {
//                                 flag = true;
//                                 courseId = course.Course.course_id;
//                             }
//                         })
//                     }
//                     if (flag && Ucourse) {
//                         // writing review for a course
//                         await prisma.review.create({
//                             data: {
//                                 user_id: user_id,
//                                 course_id: courseId,
//                                 rating: rating,
//                                 review: review
//                             }
//                         })
//                         console.log("review written")
//                         res.status(201).json({ message: "Review written" })
//                     } else {
//                         res.status(404).json({ message: "Your were never enrolled in this course" })
//                     }
//                 }
//         } else {
//             res.status(404).json({ message: "Please verify your college email to write a review" })
//         }
            
//         }
//     }

// })
// reviewRoute.post('/', async (req, res) => {
//     const { email, review, rating, college, course: Ucourse, reviewForCollege } = req.body;
  
//     try {
//       if (!email || !review || !rating || (!college && !Ucourse)) {
//         return res.status(400).json({ message: "Required fields are missing" });
//       }
  
//       const user = await prisma.user.findFirst({
//         where: { email },
//       });
  
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }
  
//       const user_id = user.user_id;
//       const collegeEmailVerified = user.collegeEmailVerified;
  
//       if (!collegeEmailVerified) {
//         return res.status(403).json({ message: "Please verify your college email to write a review" });
//       }
  
//       const courses = await prisma.userCourse.findMany({
//         select: {
//           Course: {
//             select: {
//               course_id: true,
//               name: true,
//               isOnline: true,
//               College: {
//                 select: {
//                   college_id: true,
//                   name: true,
//                 },
//               },
//             },
//           },
//         },
//         where: { user_id },
//       });
  
//       if (reviewForCollege && college) {
//         const course = courses.find(course => course.Course.College?.name === college);
  
//         if (course) {
//           const courseCollegeId = course.Course.College?.college_id;
//           await prisma.review.create({
//             data: {
//               user_id,
//               college_id: courseCollegeId,
//               rating,
//               review,
//             },
//           });
//           return res.status(201).json({ message: "Review written for college" });
//         } else {
//           return res.status(404).json({ message: "You were never enrolled in this college" });
//         }
//       } else if (!reviewForCollege && Ucourse) {
//         const course = courses.find(course => course.Course.name === Ucourse);
  
//         if (course) {
//           const courseId = course.Course.course_id;
//           await prisma.review.create({
//             data: {
//               user_id,
//               course_id: courseId,
//               rating,
//               review,
//             },
//           });
//           return res.status(201).json({ message: "Review written for course" });
//         } else {
//           return res.status(404).json({ message: "You were never enrolled in this course" });
//         }
//       } else {
//         return res.status(400).json({ message: "Invalid request" });
//       }
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
// });

// reviewRoute.get('/', async (req, res) => {
    
//   });
// reviewRoute.use('/:id') // delete a review by id

reviewRoute.route("/").post(postReview);
reviewRoute.route("/").get(filterReviews);
reviewRoute.route("/delete/:reviewId").delete(deleteReview);
reviewRoute.route("/edit/:reviewId").put(editReview);
reviewRoute.route("/get/:reviewId").get(getFullReview);

export default reviewRoute;