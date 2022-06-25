"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const connectDatabase_1 = __importDefault(require("./lib/connectDatabase"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const user_1 = __importDefault(require("./routes/user"));
const auth_1 = __importDefault(require("./routes/auth"));
const aktien_transaktion_1 = __importDefault(require("./routes/aktien-transaktion"));
const aktien_1 = __importDefault(require("./routes/aktien"));
const dividenden_1 = __importDefault(require("./routes/dividenden"));
const historisch_1 = __importDefault(require("./routes/historisch"));
const lists_1 = __importDefault(require("./routes/lists"));
const app = (0, express_1.default)();
const { PORT, MONGODB_URI } = process.env;
if (typeof MONGODB_URI !== 'string') {
    console.error('Could not start the server:\nMONGODB_URI is not a string');
}
else {
    (0, connectDatabase_1.default)(MONGODB_URI);
    startServer();
}
function startServer() {
    app.use(express_1.default.json());
    app.use((0, morgan_1.default)('common'));
    app.use('/api/auth', auth_1.default);
    app.use('/api/user', user_1.default);
    app.use('/api/aktie-transaktion', aktien_transaktion_1.default);
    app.use('/api/aktien', aktien_1.default);
    app.use('/api/dividenden', dividenden_1.default);
    app.use('/api/historisch', historisch_1.default);
    app.use('/api/lists', lists_1.default);
    app.use(errorHandler_1.default);
    if (process.env.NODE_ENV === 'production') {
        app.use(express_1.default.static('client/build'));
        app.get('*', (req, res) => {
            res.sendFile(path_1.default.resolve(__dirname, 'client', 'build', 'index.html'));
        });
    }
    app.listen(PORT, () => {
        console.log(`Server listening at http://localhost:${PORT}`);
    });
}
