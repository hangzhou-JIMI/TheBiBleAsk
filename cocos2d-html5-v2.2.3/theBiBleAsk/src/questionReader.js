/**
 * Created by luzexi on 14-9-7.
 */




function Question(){
    var ques = new Object;
    ques.id = 0;
    ques.ask = "";
    ques.answer = [];
    return ques;
};




function QuestionMgr(){};
QuestionMgr.prototype.answer_lst = [];
QuestionMgr.prototype.randomQuestion = function()
{
    var index = parseInt((Math.random()*1000)%this.answer_lst.length);
    return this.answer_lst[index];
};


var g_questionMgr = new QuestionMgr();

function questionReader(txt)
{
    if(g_questionMgr.answer_lst.length > 0 ) return;

    var data1 = txt.split("\r\n");
    var data = [];
    for(var i = 0 ; i<data1.length ; i++)
    {
        var tmp = data1[i].split('\t');
        for(var j = 0 ; j < tmp.length ; j++)
        {
            if(tmp[j].length > 0 )
            {
                data.push(tmp[j]);
            }
        }
//        data = data.concat(data1[i].split('\t'));
    }
    for(var i = 0 ; i<data.length ;i+=5)
    {
        //
        var ques = Question();
        ques.id = data[i];
        ques.ask = data[i+1];
        ques.answer.push(data[i+2]);
        ques.answer.push(data[i+3]);
        ques.answer.push(data[i+4]);

        g_questionMgr.answer_lst.push(ques);
    }

    cc.log("end read");
};