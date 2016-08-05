  // 現役の学年
  var activeYear = 3;
  // 現状4年生からob
  var obStartYear = 5-activeYear;

// OBならOB何年目か、現役なら現役何年目か返す
function getOBYear(date) {
  var graduateYear = new Date(date);

  var retText;
  var yearNum;
// console.log(thisYear.getFullYear(),graduateYear.getFullYear());
  if(isOB(graduateYear)){
    yearNum = thisYear.getFullYear() - graduateYear.getFullYear() + obStartYear;
    retText = "OB " + yearNum.toString();
  }
  else{
    yearNum = 5 - (graduateYear.getFullYear() - thisYear.getFullYear());
    retText = "現 " + yearNum.toString();
  }
  // console.log(yearNum);
  // console.log(retText);
  return retText;
}

// OBかどうか判定する
function isOB(graduateYear) {
  // 3年生までが現役？
  var thisYear = getJSTDate(new Date());
  if(thisYear.getFullYear()+obStartYear-1<graduateYear.getFullYear()){
    return false;
  }
  return true;
}

// dateを表示用フォーマットにあったstrに
function dateToFormatStr(date) {
  if(date==null){
    return null;
  }
  date = new Date(date);
  minute = (date.getHours()-9)*60 + date.getMinutes();
  second = ('0' + date.getSeconds()).slice(-2);
  milliSecond = (date.getMilliseconds()+'00').slice(0,3);

  if(minute!=0){
    return minute+':'+second+'.'+milliSecond;
  }
  return second+'.'+milliSecond;
};

  function timeStrToDate(str){
    if(str==null){
      return null;
    }
    return makeTime(str.match(/^(\d{1,3}):(\d{1,2}).(\d{1,3})$|^(\d{1,2}).(\d{1,3})$|^(\d{1,2})$/));
  }

  // フォーマットからdateを作成
  function makeTime(entryTime){
    if(entryTime==null){
      return null;
    }
    var time=0;
    if(typeof entryTime[1] !== "undefined"){
      time = Number(entryTime[1])*60000;//分をミリ秒で
      time += Number(entryTime[2])*1000;//秒をミリ秒で
      time += Number(entryTime[3]);//ミリ秒
    }
    else if(typeof entryTime[4] !== "undefined"){
      time = Number(entryTime[4])*1000;//秒をミリ秒で
      time += Number(entryTime[5]);//ミリ秒
    }
    else if(typeof entryTime[6] !== "undefined"){
      time = Number(entryTime[6])*1000;//秒をミリ秒で
    }
    //0が入力された場合
    if(Number.isNaN(time)){
      return null;
    }
    return new Date(time);
  }
  // 読み込んだCSVデータを二次元配列に変換する関数convertCSVtoArray()の定義
  function convertCSVtoArray(str){ // 読み込んだCSVデータが文字列として渡される
      var result = []; // 最終的な二次元配列を入れるための配列
      var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成
      // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
      for(var i=0;i<tmp.length;++i){
          result[i] = tmp[i].split(',');
      }
      return result;
  }

  //途中タブのみの行があるとうまくパースできない？
  function convertTSVtoArray(str){ // 読み込んだCSVデータが文字列として渡される
      var result = []; // 最終的な二次元配列を入れるための配列
      var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成
      // 各行ごとにタブで区切った文字列を要素とした二次元配列を生成
      for(var i=0;i<tmp.length;++i){
          result[i] = tmp[i].split('\t');
      }
      return result;
  }

  // エントリーデータの追加
  function addEntryData(programId,entryDataObj){
    $.ajax({
      method: 'POST',
      url: '/db/entry',
      contentType: 'application/json',
      async:false,
      data: JSON.stringify({
        programId:programId,
        entryData:entryDataObj
      }),
      success: function(msg){
        console.log(entryDataObj)
      }
    });
  }

  // ユーザidがあるか検索し、なければユーザを新規作成する。
  function getUserId(entryData,header){
    var userId = entryData[header.indexOf("ユーザID")];
    $.ajax({
      method: 'GET',
      url: '/db/user',
      async:false,
      data: "uid="+userId,
      success: function(msg){
        if(msg.length<1){
          addUserData(entryData,header);
        }
      }
    });
    return userId;
  }

// ユーザデータの追加
function addUserData(entryData,header){
  var userId = entryData[header.indexOf("ユーザID")];
  var userName = entryData[header.indexOf("参加者情報")];
  var sex = entryData[header.indexOf("性別")];
  var department = entryData[header.indexOf("学科")];
  var graduateYear = makeGraduateYear(entryData[header.indexOf("学年")]);
  $.ajax({
    method: 'POST',
    url: '/db/user',
    async:false,
    data: {
      userId: userId,
      userName: userName,
      sex: sex,
      department: department,
      graduateYear: graduateYear
    }
  });
}

//卒業年度のDateに変換
function makeGraduateYear(graduateYear){
  var graduateYearDate;
  if(String(graduateYear).length==1){
    var thisYear = getJSTDate(new Date()).getFullYear();
    graduateYearDate = getJSTDate(new Date( thisYear+(5-graduateYear) , 0 , 1 ));
  }
  else{
    graduateYearDate = getJSTDate(new Date( graduateYear , 0 , 1 ));
  }
  return graduateYearDate;
}

// 時間をjstに変換
function getJSTDate(date){
  return new Date(date.getTime()-date.getTimezoneOffset()*60000);
}
