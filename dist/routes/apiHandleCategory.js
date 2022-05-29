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
const apiHandleCategoryRouter = express_1.default.Router();
apiHandleCategoryRouter.use(express_1.default.json());
apiHandleCategoryRouter.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield prisma.category.findFirst({
        where: {
            id: Number(req.params.id)
        },
    });
    if (category) {
        try {
            yield prisma.category.delete({
                where: {
                    id: Number(req.params.id)
                }
            });
            res.json(yield prisma.category.findMany());
        }
        catch (e) {
            next(new errorHandler_1.CustomError());
        }
    }
    else {
        next(new errorHandler_1.CustomError(400, "Invalid id"));
    }
}));
apiHandleCategoryRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.name) {
        try {
            yield prisma.category.create({
                data: {
                    name: req.body.name,
                }
            });
            res.json(yield prisma.category.findMany());
        }
        catch (e) {
            next(new errorHandler_1.CustomError());
        }
    }
    else {
        next(new errorHandler_1.CustomError(400, "Invalid parameters"));
    }
}));
exports.default = apiHandleCategoryRouter;
