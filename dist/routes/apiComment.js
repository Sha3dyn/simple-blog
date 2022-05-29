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
const apiCommentRouter = express_1.default.Router();
apiCommentRouter.use(express_1.default.json());
apiCommentRouter.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield prisma.comment.findFirst({
        where: {
            id: Number(req.params.id)
        },
    });
    if (comment) {
        try {
            yield prisma.comment.delete({
                where: {
                    id: Number(req.params.id)
                }
            });
            res.json(yield prisma.comment.findMany());
        }
        catch (e) {
            next(new errorHandler_1.CustomError());
        }
    }
    else {
        next(new errorHandler_1.CustomError(400, "Invalid id"));
    }
}));
apiCommentRouter.put("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield prisma.comment.findFirst({
        where: {
            id: Number(req.params.id)
        },
    });
    if (comment) {
        try {
            yield prisma.comment.update({
                where: {
                    id: Number(req.params.id)
                },
                data: {
                    content: req.body.content,
                    username: req.body.username,
                    timestamp: req.body.timestamp,
                    postId: req.body.postId
                }
            });
            res.json(yield prisma.comment.findMany());
        }
        catch (e) {
            next(new errorHandler_1.CustomError());
        }
    }
    else {
        next(new errorHandler_1.CustomError(400, "Invalid id"));
    }
}));
apiCommentRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.content && req.body.postId) {
        try {
            yield prisma.comment.create({
                data: {
                    content: req.body.content,
                    username: req.body.username,
                    postId: Number(req.body.postId)
                }
            });
            res.json(yield prisma.comment.findMany());
        }
        catch (e) {
            next(new errorHandler_1.CustomError());
        }
    }
    else {
        next(new errorHandler_1.CustomError(400, "Invalid parameters"));
    }
}));
apiCommentRouter.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield prisma.comment.findFirst({
        where: {
            id: Number(req.params.id)
        },
    });
    if (comment) {
        try {
            res.json(comment);
        }
        catch (e) {
            next(new errorHandler_1.CustomError());
        }
    }
    else {
        next(new errorHandler_1.CustomError(400, "Invalid id"));
    }
}));
apiCommentRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(yield prisma.comment.findMany());
    }
    catch (e) {
        next(new errorHandler_1.CustomError());
    }
}));
exports.default = apiCommentRouter;
