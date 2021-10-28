const path = require('path');
const async = require('async');
const LedMatrix = require("easybotics-rpi-rgb-led-matrix");
const client = require('cheerio-httpcli');
const mysql = require('mysql');
const date = require('date-utils');
const fs = require('fs');
const readline = require('readline');
let matrix;
let fontpath;

async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function getNowDatetime () {
    const dt = new Date();
    let dtformat = dt.toFormat("YYYY/MM/DD HH24:MI:SS");
    return dtformat;
}

function getNews (url) {
    return new Promise((resolve, reject) => {
		client.fetch(url, {}, function(err, $, res) {
            let answer = new Array();
            // let answer;
			if (err) { console.log("error"); return; }
        
			$("item > title").each(function(idx) {
                answer.unshift( $(this).text());
                //console.log(answer);
                // answer = $(this).text();
                // console.log( $(this).text() );
            });
			console.log("\n" + "RSSのタイトルを取得しました。");
			resolve(answer);
		});
	});
}

function getTextWidth (text) {
    console.log(text + 'llll')
    let width = text.length * 16;
    return width;
}

function insertHistory (con, text) {
    let $sql = 'insert into text_histories (body, created_at, updated_at) values (?, ?, ?)';
    let dtformat = getNowDatetime();
    con.query($sql, [text, dtformat, dtformat], function (error, results, fields) {
        console.log(results);
    });
}

function interruptRejector (isAvailavle, res) {
    if (isAvailavle == false) {
        console.log('false');
        res.send('false');
        return -1;
    }
}

async function stringLength (string) {
    return new Promise((resolve, reject) => {
        let text = string;
        let code;
        let result = 0;
        let textCode = [];
        let fontdata;
        let lnum;
        let charWidths = [];
        let dwidthline;
        fs.readFile(path.resolve(__dirname, '..')+'/fonts/'+'ufo.bdf', 'utf-8', (err, data) => {
            if (err)throw err;
            // console.log(data);
            fontdata = data.split('\n');
            code = text.charCodeAt();
            // res.send(text);
            // GETで入力された文字列から1文字ずつ文字コードを取得して、textCode配列に格納する
            for (let i=0; i<text.length; i++) {
                code = text.charCodeAt(i);
                textCode.push(code);
            }
            console.log(textCode);
            // fontdata配列から入力された文字の行番号を取得する
            for (i=0; i<text.length; i++) {
                lnum = fontdata.indexOf("ENCODING " + textCode[i]);
                while (fontdata[lnum].indexOf("DWIDTH ") == -1) {
                    console.log("行" + lnum + "はマッチしませんでした。");
                    lnum++;
                }
                console.log(lnum);
                console.log(fontdata[lnum]);
                dwidthline = fontdata[lnum].split(' ');
                charWidths.push(dwidthline[1]);
            }
            console.log("charWidths:: ");
            console.log(charWidths);
            // charWidthsの総和を取得
            for (i=0; i<charWidths.length; i++) {
                result += parseInt(charWidths[i], 10);
            }
            console.log("result: " + result);
            console.log("--- ---");
            resolve(result);
        });
    });
}

async function stringLength2 (string) {
    let width=0;
    for (let i=0; i<string.length; i++){
        if(' '<=string[i]&&string[i]<='}'){
            width+=8;
        }
        else{
            width+=16;
        }
    }
    return width;
}

async function main() {
    fontpath =  path.resolve(__dirname, '..')+'/fonts/'+'ufo.bdf';
    let colors = { r:255, g:255, b:255 };
    let colors2 = { r:255, g:255, b:255 };
    let colors3 = { r:0, g:0, b:0 };
    let speed = 50;
    let panelsize = 0;
    let isAvailavle = true;
    let gradationFlag = false;
    let pause = false;
    let cur = 0;
    let cur2 = 0;
    
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'eisuke',
        password: 'password',
        database: 'testdb'
    });

    exports.test = async function () {
        let i, y;
        while (1) {
            for (i=0; i<50; i++) {
                for (y=0; y<15; y++) {
                    matrix.setPixel(i, y, 0, 0, 0);
                }
                for (y=0; y<15; y++) {
                    matrix.setPixel(i, y, 255, 255, 255);
                }
                matrix.update();
                await sleep(33);
            }
        }
    }

    exports.index = async function (req, res) {
        if (interruptRejector(isAvailavle, res) == -1) { 
            return -1;
        }
        if (panelsize == 32) {
            matrix = new LedMatrix(32, 32, 1, 3, 50, 'adafruit-hat' );
        }
        else {
            matrix = new LedMatrix(16, 32, 1, 3, 50, 'adafruit-hat' );
        }
        res.send('text show');
        let text = req.body.text;
        console.log(text + 'ttt')
        let width = await stringLength2(text);
        console.log("Width: " + width);
        let x = matrix.getWidth();
        let xorig = x
        insertHistory(con, text);
        isAvailavle = false;
        while (isAvailavle == false) {
            matrix.clear();
            if (gradationFlag == true){
                cur2 = cur2 - 12;
                if (cur2 < -254) {cur2 = 255;}
                cur = cur2;
                if (cur < 0) {cur = cur2 * -1;}
                colors3.r = (colors.r * cur + colors2.r * (255 - cur)) / 255;
                colors3.g = (colors.g * cur + colors2.g * (255 - cur)) / 255;
                colors3.b = (colors.b * cur + colors2.b * (255 - cur)) / 255;
                matrix.drawText(x, 0, text, fontpath, colors3.r, colors3.g, colors3.b);
            }
            else{
                matrix.drawText(x, 0, text, fontpath, colors.r, colors.g, colors.b);
            }
            matrix.update();
            if (pause === false) {x--;}
            console.log(x);
            await sleep(1000 / speed);
            if (x+width < 0) {x = xorig;}
        }
        isAvailavle = true;
        console.log('done: '+text);
    }

    exports.FlowingLine = async function (req, res) {
        if (interruptRejector(isAvailavle, res) == -1) { 
            return -1;
        }
        matrix = new LedMatrix(16, 32, 1, 3, 50, 'adafruit-hat' );
        res.send('Flowing Line');
        let num = req.body.Line_Num;
        let ATime = req.body.Line_Time*100;
        let Arrow = req.body.Line_Arrow;
        // 0:RtoL 1:LtoR 2:DtoU 3:UtoD
        if(num==1){ATime=1000}
        let PTime = 0;
        let LTime = 0;
        let x = -1;
        while (PTime<ATime+20) {
            matrix.clear();
            // 1000,-1 0,95
            // 1000,96 0,0
            // 1000,-1 0,15
            // 1000,16 0,0
            // -96/1000000*(x-1000)*(x-1000)+95
            LTime = PTime;
            for(let i=0; i<num; i++){
                if(Arrow==0&&-1<LTime&&LTime<1000){x = 96*(LTime-1000)*(LTime-1000)/1000000-1;}
                else if(Arrow==1&&-1<LTime&&LTime<1000){x = -96*(LTime-1000)*(LTime-1000)/1000000+96;}
                else if(Arrow==2&&-1<LTime&&LTime<1000){x = 16*(LTime-1000)*(LTime-1000)/1000000-1;}
                else if(Arrow==3&&-1<LTime&&LTime<1000){x = -16*(LTime-1000)*(LTime-1000)/1000000+16;}
                else{x = -1;}
                if(Arrow==0||Arrow==1){matrix.drawLine(x, 0, x, 15, 255, 0, 0);}
                else if(Arrow==2||Arrow==3){matrix.drawLine(0, x, 95, x, 255, 0, 0);}
                else{
                    res.send('Arrow mode error');
                    break;
                }
                if(num!=1){LTime-=(ATime-1000)/(num-1);}
            }
            matrix.update();
            await sleep(17);
            PTime += 17;
        }
        matrix.clear();
        matrix.update();
    }

    exports.colors = function(req, res) {
        colors = req.body.colors;
        console.log(colors);
        res.send('got: ' + colors);
    }

    exports.colors2 = function(req, res) {
        colors2 = req.body.colors2;
        console.log(colors2);
        res.send('got: ' + colors2);
    }
    
    exports.panelsize = function(req, res) {
        panelsize = req.body.panelsize;
        console.log(panelsize);
        res.send('got: ' + panelsize);
    }
    
    exports.gradationFlag = function(req, res) {
        gradationFlag = req.body.gradationFlag;
        console.log(gradationFlag);
        res.send('got: ' + gradationFlag);
    }

    exports.history = function(req, res) {
        let sql = "select id, body from text_histories order by id desc";
        con.query(sql, function (error, results, fields) {
            res.json({
                histories: results
            });
        });
    }

    exports.phrase = function(req, res) {
        let sql = 'select id, body, created_at from phrases order by id desc';
        con.query(sql, function (error, results, fields) {
            res.json({
                phrases: results
            });
        });
    }

    exports.feedlist = function(req, res) {
        let sql = 'select id, name, url from feeds order by id desc';
        con.query(sql, function (error, results, fields) {
            res.json({
                feeds: results
            });
        });
    }

    exports.addPhrase = function(req, res) {
        let text = req.body.text;
        let $sql = 'insert into phrases (body, created_at, updated_at) values (?, ?, ?)';
        let dtformat = getNowDatetime();
        con.query($sql, [text, dtformat, dtformat], function (error, results, fields) {
            console.log('Phrase追加完了' + text);
        });
    }

    exports.addFeed = function(req, res) {
        let name = req.body.name;
        let url = req.body.url;
        let sql = 'insert into feeds (name, url, created_at, updated_at) values (?, ?, ?, ?)';
        let dtformat = getNowDatetime();
        con.query(sql, [name, url, dtformat, dtformat], function (error, results, fields) {
            console.log('RSS追加完了' + name + ' : ' + url);
        });
    }

    exports.showNews = async function(req, res) {
        if (interruptRejector(isAvailavle, res) == -1) { 
            return -1;
        }
        let name = req.body.name;
        let url;
        let newsStrings;
        console.log(name);
        let sql = 'select url from feeds where name = ?';
        con.query(sql, [name], async function (error, results, fields) {
            console.log('News配信開始' + name);
            url = results[0].url;
            console.log('URL: ' + url);
            newsStrings = await getNews(url);
            for (title of newsStrings) {
                console.log(title);
            }
            for (title of newsStrings) {
                newsStrings += title;
            }
            res.send('got news string.')
            let x = 96;
            let tail = await stringLength(newsStrings);
            isAvailavle = false;
            while (x+tail >= 0) {
                matrix.clear();
                if (isAvailavle == true) {
                    break;
                }
                matrix.drawText(x, 0, newsStrings, fontpath, colors.r, colors.g, colors.b);
                matrix.update();
                if (pause === false) {
                    x--;
                }
                console.log(x);
                await sleep(speed);
            }
            isAvailavle = true;
            console.log('done: '+text);
        });
    }

    exports.speed = function (req, res) {
        speed = req.body.speed;
        console.log(speed);
        res.send('got: ' + speed)
    }

    exports.updateFeed = function (req, res) {
        console.log(req.body.name);
        console.log(req.body.url);
        let id = req.body.id;
        let name = req.body.name;
        let url = req.body.url;
        let sql = 'update feeds set name = ?, url = ? where id = ?';
        con.query(sql, [name, url, id], async function (error, results, fields) {
            res.send('done')
        })
    }

    exports.status = function (req, res) {
        res.json({
            speed: speed,
            loop: false,
            colors: colors,
            colors2: colors2,
            panelsize: panelsize,
            gradationFlag: gradationFlag,
            isAvailavle: isAvailavle
        });
    }

    exports.gaming = async function (req, res) {
        let r = 255;
        let g = 0;
        let b = 0;
        while (1) {
            matrix.clear();
            matrix.fill(r, g, b)
            matrix.update();
            if (r === 255 && b === 0 && g<=255) {
                g++
            }
            if (g === 255 && b === 0 && r>=0) {
                r--
            }
            if (g === 255 && r === 0 && b<=255) {
                b++
            }
            if (b === 255 && r === 0 && g>=0) {
                g--
            }
            if (b === 255 && g === 0 && r<=255) {
                r++
            }
            if (r === 255 && g === 0 && b>=0) {
                b--
            }
            if (r % 3 === 0) {
                await sleep(1);
            }
        }
    }

    exports.updatePause = function (req, res) {
        pause = !pause
        res.send('done')
    }
    exports.updateStop = function (req, res) {
        isAvailavle = true;
        matrix.clear();
        matrix.update();
        res.send('done')
    }

    exports.deletePhrase = function (req, res) {
        console.log(req.body.id)
        let sql = 'delete from phrases where id = ?';
        con.query(sql, [req.body.id], async function (error, results, fields) {
            res.send('done')
        })
    }

    exports.deleteFeed = function (req, res) {
        console.log(req.body.id.id)
        let sql = 'delete from feeds where id = ?';
        con.query(sql, [req.body.id.id], async function (error, results, fields) {
            res.send('done')
        })
    }

    exports.updatePhrase = function (req, res) {
        console.log(req.body.item.body)
        let body = req.body.item.body
        let id = req.body.item.id
        let sql = 'update phrases set body = ?, updated_at = ? where id = ?';
        con.query(sql, [body, getNowDatetime(), id], async function (error, results, fields) {
            res.send('updated')
        })
    }
}
main();