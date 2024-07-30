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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
// @ts-ignore
function requireAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.cookies.Authorization;
            // @ts-ignore
            const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET);
            // @ts-ignore
            if (Date.now() >= decoded.exp) {
                res.sendStatus(410);
                return;
            }
            const user = yield prisma_js_1.default.user.findUnique({
                where: {
                    user_id: decoded.sub,
                },
            });
            if (!user) {
                res.sendStatus(401);
                return;
            }
            req.user = user;
            next();
        }
        catch (err) {
            res.sendStatus(401);
            return;
        }
    });
}
exports.default = requireAuth;
