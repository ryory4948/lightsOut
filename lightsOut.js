//ゲームの状態(初期状態は未開始状態)
let inGame = false;

//N × N のゲームサイズN
const gameSize = 5;

//ヒントを格納する配列
let hints = [];

//全てのチェックボックスを配列に格納
const lightLists = Array.prototype.slice.call(document.getElementsByClassName("light"));

//難易度選択から値を取得
let select = document.getElementById("level");
let max;
let min;

//各ボタンの定義
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const hintButton = document.getElementById("hint");

//初期状態時はヒントボタンと最初からボタンは非活性化状態
resetButton.disabled = true;
hintButton.disabled = true;

//ID="timer"を取得
const time = document.getElementById("timer");

// 開始時間
let startTime;

// 停止時間
let stopTime = 0;

// タイムアウトID
let timeoutID;

//初期状態ではチェックボックスは非活性
disabledCheckBox();

// 時間を表示する関数
function displayTime() {
  const currentTime = new Date(Date.now() - startTime + stopTime);
  const m = String(currentTime.getMinutes()).padStart(2, '0');
  const s = String(currentTime.getSeconds()).padStart(2, '0');
  const ms = String(currentTime.getMilliseconds()).padStart(3, '0');

  time.textContent = `${m}:${s}.${ms}`;
  timeoutID = setTimeout(displayTime, 10);
}

//難易度設定
function selectLevel() {
  if (select.value == "hard") {
    max = 29;
    min = 20;
  } else if (select.value == "normal") {
    max = 19;
    min = 10;
  } else {
    max = 9;
    min = 3;
  }
}

//開始ボタンの動作
function start() {
  //ゲーム未開始状態の時
  if (inGame == false) {
    //ゲーム開始状態に遷移
    inGame = true;

    //開始ボタンのとき
    if (document.getElementById("start").value == "start") {

      //レベル参照
      selectLevel();

      //時間進める
      startTime = Date.now();
      displayTime();

      //ランダム点灯させる
      randomCheck();

      //最初からボタンを非活性化
      resetButton.disabled = true;

    //再開ボタンの時
    } else if (document.getElementById("start").value == "restart") {

      //最初からボタンを非活性化
      resetButton.disabled = true;

      //時間進める
      startTime = Date.now();
      displayTime();
    }

    //一時停止ボタンに変化
    document.getElementById("start").innerHTML = '<i class="fa-solid fa-pause"></i>再開';
    document.getElementById("start").value = "stop";

    //チェックボックスを活性化
    disabledCheckBox();

  //一時停止ボタンの時
  } else {
    //ゲーム未開始状態に変更
    inGame = false;

    //再開ボタンに変化
    document.getElementById("start").innerHTML = '<i class="fa-solid fa-play"></i>再開';
    document.getElementById("start").value = "restart";

    //最初からボタンを非活性化
    resetButton.disabled = false;

    //時間ストップ
    clearTimeout(timeoutID);
    stopTime += (Date.now() - startTime);

    //チェックボックスを非活性化
    disabledCheckBox();
  }
}

//最初からボタンの動作
function reset() {
  //盤面リセット
  for (let i = 0; i < lightLists.length; i++){
    lightLists[i].checked = false;
  }
  //ヒントボタンの非活性化
  hintButton.disabled = true;

  //時間のリセット
  time.textContent = '00:00.000';
  stopTime = 0;

  //開始ボタンに変化
  document.getElementById("start").innerHTML = "<i class='fa-solid fa-play'></i>開始";
  document.getElementById("start").value = "start";

  //ヒントの赤枠を元に戻す
  for (let i = 0; i < lightLists.length; i++) {
    lightLists[i].parentNode.style.cssText = "border-color: black;"
    lightLists[i].setAttribute("disabled", "disabled");
  }

  //hints配列の中身をリセット
  hints=[];
}



//ゲーム開始状態の時のみチェックボックスを活性化
function disabledCheckBox() {
  if (inGame == false) {
    //ヒントボタンを非活性化
    hintButton.disabled = true;
    //全てのチェックボックスを非活性化
    for (let i = 0; i < lightLists.length; i++){
      lightLists[i].setAttribute("disabled", "disabled");
    }
  } else {
    //全てのチェックボックスを活性化
    for (let i = 0; i < lightLists.length; i++){
      hintButton.disabled = false;
      lightLists[i].removeAttribute("disabled");
    }
  }
}

//クリア可能なようにランダム点灯する
function randomCheck() {
  let shuffleNumber = Math.floor(Math.random() * (max - min)) + min;
  //初期状態時にチェックするチェックボックスを決定
  for (let i = 0; i < shuffleNumber; i++) {
    let shuffleCheck = Math.floor(Math.random() * 24);
    //答えをhintsに格納
    hints[i] = shuffleCheck;
    if (lightLists[shuffleCheck].checked) {
      lightLists[shuffleCheck].checked = false;
    } else {
      lightLists[shuffleCheck].checked = true;
    }
    clickCheckBox(shuffleCheck);
  }
}

//チェックボックスクリック時にindex番号をclickCheckBoxに渡す
for (let i = 0; i < lightLists.length; i++){
  lightLists[i].onclick = () => {
    hints[hints.length] = Number(i);
    clickCheckBox(i);
  }
}

let clickCheckBox = (index) => {
  if (inGame == false) {
    //ゲーム未開始状態ならreturn
    return;
  } else {
    //indexを数値型に変換
    index = Number(index);

    //クリックされたチェックボックスの上を反転
    let indexAbove = index - gameSize;
    if (index > (gameSize - 1)) {
      if (lightLists[indexAbove].checked) {
        lightLists[indexAbove].checked = false;
      } else {
        lightLists[indexAbove].checked = true;
      }
    }

    //クリックされたチェックボックスの下を反転
    let indexBelow = index + gameSize;
    if (index < (lightLists.length - gameSize)) {
      if (lightLists[indexBelow].checked) {
        lightLists[indexBelow].checked = false;
      } else {
        lightLists[indexBelow].checked = true;
      }
    }

    //クリックされたチェックボックスの左を反転
    let indexLeft = index - 1;
    if (index % gameSize !=  0) {
      if (lightLists[indexLeft].checked) {
        lightLists[indexLeft].checked = false;
      } else {
        lightLists[indexLeft].checked = true;
      }
    }

    //クリックされたチェックボックスの右を反転
    let indexRight = index + 1;
    if (index % gameSize != (gameSize-1)) {
      if (lightLists[indexRight].checked) {
        lightLists[indexRight].checked = false;
      } else {
        lightLists[indexRight].checked = true;
      }
    }

    //ゲームクリアかを判定する
    if (gameClear()) {
      //時間ストップ
      clearTimeout(timeoutID);
      stopTime += (Date.now() - startTime);

      //クリアタイムを格納
      swal("ゲームクリア!","クリアタイムは【"+time.textContent+"】です");
      inGame = false;

      //開始ボタンに変化
      document.getElementById("start").innerHTML = "<i class='fa-solid fa-play'></i>開始";
      document.getElementById("start").value = "start";

      //ヒントの赤枠を元に戻す
      for (let i = 0; i < lightLists.length; i++){
        lightLists[i].parentNode.style.cssText = "border-color: black;"
      }
      //hintsをリセット
      hints = [];

      //時間リセット
      time.textContent = '00:00.000';
      stopTime = 0;

      //チェックボックスを非活性化
      disabledCheckBox();
    }
  }
}

//ゲームクリア条件の定義
const gameClear = () => {
  //全てのチェックボックスが非チェック状態ならtrue
  for (let i = 0; i < lightLists.length; i++){
    if (lightLists[i].checked) {
      return false;
    }
  }
  return true;
  }

//ヒントボタンの動作
function hint() {
  //ヒントボタンを非活性化
  hintButton.disabled = true;

  //昇順にソート
  hints = hints.sort(
    function (a, b) {
      return (a < b ? -1 : 1);
  }
  );
  alert(hints);
  //偶数回格納されている要素を削除
  for (let i = 1; i <= hints.length; i++){
    if (hints[i-1] == hints[i]) {
      hints.splice(i-1, 2);
    }
  }
  alert(hints);
    //空値を削除して詰める
  hints = hints.filter(Number.isFinite);
  alert(hints);
  for (let i = 1; i <= hints.length; i++){
    if (hints[i-1] == hints[i]) {
      hints.splice(i-1, 2);
    }
  }
  alert(hints);
    //空値を削除して詰める
  hints = hints.filter(Number.isFinite);
  alert(hints);
  //
  for (let i = 0; i < hints.length; i++){
    lightLists[hints[i]].parentNode.style.cssText = "border-color:red; border-width: 2px;";
  }
}
