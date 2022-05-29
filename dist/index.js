"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const errorHandler_1 = __importDefault(require("./errors/errorHandler"));
const apiAuth_1 = __importDefault(require("./routes/apiAuth"));
const apiBlog_1 = __importDefault(require("./routes/apiBlog"));
const apiPost_1 = __importDefault(require("./routes/apiPost"));
const apiComment_1 = __importDefault(require("./routes/apiComment"));
const apiCategory_1 = __importDefault(require("./routes/apiCategory"));
const apiHandleCategory_1 = __importDefault(require("./routes/apiHandleCategory"));
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3109;
const checkToken = (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        jsonwebtoken_1.default.verify(token, String(process.env.SECRET));
        next();
    }
    catch (e) {
        res.status(401).json({});
    }
};
app.use(express_1.default.static(path_1.default.resolve(__dirname, "public")));
app.use("/api/auth", apiAuth_1.default);
app.use("/api/blog", apiBlog_1.default);
app.use("/api/post", checkToken, apiPost_1.default);
app.use("/api/comment", apiComment_1.default);
app.use("/api/category", apiCategory_1.default);
app.use("/api/handleCategory", checkToken, apiHandleCategory_1.default);
app.get('*', (req, res) => res.sendFile(path_1.default.resolve(__dirname, 'public/index.html')));
app.use(errorHandler_1.default);
app.use((req, res, next) => {
    if (!res.headersSent) {
        res.status(404).json({ message: "Invalid route" });
    }
    next();
});
app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});
