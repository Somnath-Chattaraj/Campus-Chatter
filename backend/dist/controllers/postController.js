"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.deletePost = exports.getAllCommunities = exports.searchPosts = exports.unlikePost = exports.postLiked = exports.createComment = exports.fetchSinglePost = exports.likePost = exports.fetchPosts = exports.createPost = exports.getCommunities = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const fuse_js_1 = __importDefault(require("fuse.js"));
const sendMail_1 = __importDefault(require("../mail/sendMail"));
// @ts-ignore
const searchPosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
    }
    const posts = yield prisma_1.default.post.findMany({
        select: {
            post_id: true,
            title: true,
            content: true,
            College: {
                select: {
                    name: true,
                },
            },
            User: {
                select: {
                    username: true,
                    pic: true,
                },
            },
        },
    });
    const fuse = new fuse_js_1.default(posts, {
        keys: ["title", "content", "College.name"],
        threshold: 0.6,
    });
    const searchResults = fuse.search(query).map((result) => result.item);
    return res.status(200).json({ posts: searchResults });
}));
exports.searchPosts = searchPosts;
// @ts-ignore
const getCommunities = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const user_id = req.user.user_id;
    // const user_id = "clzfffeey0000e6hx5j16b96c";
    const communities = yield prisma_1.default.userCourse.findMany({
        where: {
            user_id: user_id,
        },
        select: {
            college_id: true,
            College: {
                select: {
                    name: true,
                },
            },
        },
        distinct: ["college_id"],
    });
    // @ts-ignore
    const communityIds = communities.map((community) => community.college_id);
    // @ts-ignore
    if (communityIds.length === 0) {
        return res.status(200).json({ communityIds: [] });
    }
    let college = [];
    for (let i = 0; i < communityIds.length; i++) {
        college[i] = yield prisma_1.default.college.findUnique({
            where: {
                college_id: communityIds[i],
            },
            select: {
                college_id: true,
                name: true,
            },
        });
    }
    return res.status(200).json({ college });
}));
exports.getCommunities = getCommunities;
// @ts-ignore
const createPost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, collegeId } = req.body;
    // @ts-ignore
    const user_id = req.user.user_id;
    if (!title || !content || !collegeId) {
        return res.status(400).json({ message: "Required fields are missing" });
    }
    const user = yield prisma_1.default.user.findUnique({
        where: { user_id },
    });
    if (!user) {
        return res.status(404).json({ message: "User not recognized" });
    }
    const post = yield prisma_1.default.post.create({
        // @ts-ignore
        data: {
            title,
            content,
            user_id,
            college_id: collegeId,
        },
    });
    return res.status(201).json({ post });
}));
exports.createPost = createPost;
// @ts-ignore
const fetchPosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, collegeId } = req.body;
    const pageNumber = page;
    const postsPerPage = 4;
    const offset = (pageNumber - 1) * postsPerPage;
    const posts = yield prisma_1.default.post.findMany({
        where: collegeId ? { college_id: collegeId } : {},
        orderBy: {
            createdAt: "desc",
        },
        select: {
            post_id: true,
            title: true,
            content: true,
            likes: true,
            College: {
                select: {
                    name: true,
                },
            },
            User: {
                select: {
                    username: true,
                    pic: true,
                },
            },
            _count: {
                select: {
                    Comments: true,
                },
            },
        },
        take: postsPerPage,
        skip: offset,
    });
    const totalPosts = yield prisma_1.default.post.count();
    const isOver = offset + postsPerPage >= totalPosts;
    return res.status(200).json({ posts, isOver });
}));
exports.fetchPosts = fetchPosts;
// @ts-ignore
const likePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.body;
    // @ts-ignore
    const post = yield prisma_1.default.post.findUnique({
        where: { post_id: postId },
        select: {
            likes: true,
        },
    });
    // @ts-ignore
    const user_id = req.user.user_id;
    const like = yield prisma_1.default.like.findFirst({
        where: {
            post_id: postId,
            user_id: user_id,
        },
    });
    if (like) {
        return res.status(400).json({ message: "Post already liked" });
    }
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }
    const likes = post.likes + 1;
    const updatedPost = yield prisma_1.default.post.update({
        where: { post_id: postId },
        data: {
            likes,
        },
    });
    yield prisma_1.default.like.create({
        data: {
            post_id: postId,
            user_id,
        },
    });
    return res.status(200).json({ updatedPost });
}));
exports.likePost = likePost;
// @ts-ignore
const fetchSinglePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const post = yield prisma_1.default.post.findUnique({
        where: { post_id: postId },
        select: {
            post_id: true,
            title: true,
            content: true,
            likes: true,
            College: {
                select: {
                    name: true,
                },
            },
            User: {
                select: {
                    username: true,
                    pic: true,
                },
            },
            Comments: {
                select: {
                    comment_id: true,
                    content: true,
                    user_id: true,
                    User: {
                        select: {
                            username: true,
                            pic: true,
                        },
                    },
                },
            },
        },
    });
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }
    return res.status(200).json({ post });
}));
exports.fetchSinglePost = fetchSinglePost;
// @ts-ignore
const deletePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.body;
    const post = yield prisma_1.default.post.findUnique({
        select: {
            User: {
                select: {
                    user_id: true,
                },
            },
        },
        where: { post_id: postId },
    });
    // @ts-ignore
    const user_id = req.user.user_id;
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }
    if (post.User.user_id !== user_id) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(200).json({ message: "Post deleted" });
}));
exports.deletePost = deletePost;
// @ts-ignore
const createComment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, content } = req.body;
    // @ts-ignore
    const user_id = req.user.user_id;
    if (!postId || !content) {
        return res.status(400).json({ message: "Required fields are missing" });
    }
    const user = yield prisma_1.default.user.findUnique({
        where: { user_id },
    });
    if (!user) {
        return res.status(404).json({ message: "User not recognized" });
    }
    const comment = yield prisma_1.default.comment.create({
        data: {
            content,
            user_id,
            post_id: postId,
        },
    });
    const post = yield prisma_1.default.post.findUnique({
        where: { post_id: postId },
        select: {
            title: true,
            User: {
                select: {
                    email: true,
                    user_id: true,
                },
            },
        },
    });
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }
    if (post.User.user_id === user_id) {
        return res.status(201).json({ comment });
    }
    const email = post.User.email;
    const postTitle = post.title;
    const commentContent = comment.content;
    const commentAuthor = user.username;
    const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
    <h2 style="color: #4CAF50; text-align: center;">New Comment on Your Post</h2>
    
    <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <h3 style="color: #333;">Post Title: ${postTitle}</h3>
      <p style="color: #666; font-size: 14px;">A new comment has been added to your post:</p>

      <blockquote style="background-color: #f9f9f9; border-left: 4px solid #4CAF50; padding: 10px 20px; margin: 10px 0; color: #555;">
        ${commentContent}
      </blockquote>

      <p style="color: #666; font-size: 14px;">Commented by: <strong>${commentAuthor}</strong></p>
      <a href="https://campusify.site/posts/${postId}" style="display: inline-block; margin-top: 20px; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Post</a>
    </div>

    <footer style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
      <p>Campusify</p>
      <p><a href="https://campusify.site" style="color: #4CAF50;">Visit our website</a></p>
    </footer>
  </div>
`;
    (0, sendMail_1.default)(htmlContent, email, "New Comment on Your Post");
    return res.status(201).json({ comment });
}));
exports.createComment = createComment;
// @ts-ignore
const deleteComment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.body;
    const comment = yield prisma_1.default.comment.findUnique({
        select: {
            User: {
                select: {
                    user_id: true,
                },
            },
        },
        where: { comment_id: commentId },
    });
    // @ts-ignore
    const user_id = req.user.user_id;
    if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.User.user_id !== user_id) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(200).json({ message: "Comment deleted" });
}));
exports.deleteComment = deleteComment;
// @ts-ignore
const postLiked = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.body;
    // @ts-ignore
    const user_id = req.user.user_id;
    const likes = yield prisma_1.default.like.findFirst({
        where: {
            post_id: postId,
            user_id: user_id,
        },
    });
    if (likes) {
        return res.status(200).json({ postLiked: true });
    }
    return res.status(200).json({ postLiked: false });
}));
exports.postLiked = postLiked;
// @ts-ignore
const unlikePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.body;
    // @ts-ignore
    const user_id = req.user.user_id;
    const like = yield prisma_1.default.like.findFirst({
        where: {
            post_id: postId,
            user_id: user_id,
        },
    });
    const post = yield prisma_1.default.post.findUnique({
        where: { post_id: postId },
        select: {
            likes: true,
        },
    });
    if (!like) {
        return res.status(400).json({ message: "Post not liked" });
    }
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }
    const likes = post.likes - 1;
    const updatedPost = yield prisma_1.default.post.update({
        where: { post_id: postId },
        data: {
            likes,
        },
    });
    yield prisma_1.default.like.delete({
        where: {
            like_id: like.like_id,
        },
    });
    return res.status(200).json({ updatedPost });
}));
exports.unlikePost = unlikePost;
// @ts-ignore
const getAllCommunities = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const college = yield prisma_1.default.college.findMany({
        orderBy: {
            name: "asc",
        },
        select: {
            college_id: true,
            name: true,
        },
    });
    return res.status(200).json({ college });
}));
exports.getAllCommunities = getAllCommunities;
