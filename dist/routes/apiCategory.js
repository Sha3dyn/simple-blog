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
const apiCategoryRouter = express_1.default.Router();
apiCategoryRouter.use(express_1.default.json());
apiCategoryRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield prisma.category.findMany({
            include: {
                _count: {
                    select: { posts: true },
                },
            }
        });
        res.json(categories);
    }
    catch (e) {
        next(new errorHandler_1.CustomError());
    }
}));
exports.default = apiCategoryRouter;
