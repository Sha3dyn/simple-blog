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
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("../errors/errorHandler");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const apiBlogRouter = express_1.default.Router();
apiBlogRouter.use(express_1.default.json());
apiBlogRouter.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog = yield prisma.post.findFirst({
            where: {
                id: Number(req.params.id)
            },
            include: {
                comments: {
                    orderBy: {
                        timestamp: 'asc'
                    }
                },
                author: {
                    select: {
                        username: true
                    }
                },
                categories: true
            }
        });
        if (blog) {
            res.json(blog);
        }
        else {
            next(new errorHandler_1.CustomError(404, "Invalid Id"));
        }
    }
    catch (e) {
        next(new errorHandler_1.CustomError());
    }
}));
apiBlogRouter.get("/filter/:category", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield prisma.category.findFirst({
            where: { id: Number(req.params.category) },
            include: {
                posts: {
                    select: { id: true }
                }
            }
        });
        if (category) {
            const ids = category.posts.map(post => post.id);
            const blogposts = yield prisma.post.findMany({
                where: {
                    id: { in: ids }
                },
                include: {
                    author: {
                        select: { username: true }
                    },
                    _count: {
                        select: { comments: true },
                    },
                    categories: true
                }
            });
            res.json(blogposts);
        }
        else {
            next(new errorHandler_1.CustomError(404, "invalid id"));
        }
    }
    catch (e) {
        next(new errorHandler_1.CustomError());
    }
}));
apiBlogRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogposts = yield prisma.post.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                author: {
                    select: { username: true }
                },
                _count: {
                    select: { comments: true },
                },
                categories: true
            }
        });
        res.json(blogposts);
    }
    catch (e) {
        next(new errorHandler_1.CustomError());
    }
}));
exports.default = apiBlogRouter;
