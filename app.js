// アプリの初期化
console.log('アプリが起動しました');

// 現在のページ番号
let currentPage = 1;

// 音声再生中かどうかを管理するオブジェクト
const playingStates = {};

// 全動物の再生状態を初期化
animals.forEach(animal => {
    playingStates[animal.id] = false;
});

// Web Speech API を使った音声合成関数（テスト用）
// function speakText(text) {
//     // 音声合成の準備
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = 'ja-JP'; // 日本語
//     utterance.rate = 1.0;     // 速度（1.0が標準）
//     utterance.pitch = 1.5;    // 音の高さ（高め）
//     // 音声を再生
//     speechSynthesis.speak(utterance);
//     return utterance;
// }

// 音声ファイルをプリロード
const audioCache = {};

function preloadSounds() {
    animals.forEach(animal => {
        const audio = new Audio(`./assets/sounds/${animal.id}.mp3`);
        audio.preload = 'auto';
        audioCache[animal.id] = audio;
    });
    console.log('音声ファイルのプリロードが完了しました');
}

function playSound(animalId) {
    const audio = audioCache[animalId];
    if (audio) {
        audio.currentTime = 0; // 最初から再生
        audio.play();
        return audio;
    }
}

// 動物カードをタップしたときの処理
function handleAnimalTouch(animalId, soundText) {
    console.log(`${animalId} がタップされました`);
    
    // すでに再生中なら何もしない
    if (playingStates[animalId]) {
        console.log(`${animalId} は再生中なので無視します`);
        return;
    }
    
    // 再生中フラグを立てる
    playingStates[animalId] = true;
    console.log(`${animalId} の音声を再生開始`);
    
    // 音声を再生
    const audio = playSound(animalId);
    
    // イベントリスナーを addEventListener で設定
    audio.addEventListener('ended', function() {
        playingStates[animalId] = false;
        console.log(`${animalId} の音声再生が終了`);
    }, { once: true }); // once: true で1回だけ実行
    
    // カードにアニメーションを追加（後で実装）
    const card = document.getElementById(animalId);
    card.classList.add('touched');
    
    // アニメーション終了後にクラスを削除
    setTimeout(() => {
        card.classList.remove('touched');
    }, 400);
}

function renderAnimals(page) {
    console.log(`ページ ${page} をレンダリング`);

    // 指定されたページの動物のみをフィルタリング
    const pageAnimals = animals.filter(animal => animal.page === page);

    // グリッドコンテナを取得
    const grid = document.querySelector('.animals-grid');

    // 既存の内容をクリア
    grid.innerHTML = '';
    
    // 各動物のカードを生成
    pageAnimals.forEach(animal => {
        // カード要素を作成
        const card = document.createElement('div');
        card.className = 'animal-card';
        card.id = animal.id;

        // 絵文字要素を作成
        const emoji = document.createElement('div');
        emoji.className = 'animal-emoji';
        emoji.textContent = animal.emoji;

        // 名前要素を作成
        const name = document.createElement('div');
        name.className = 'animal-name';
        name.textContent = animal.name;

        // カードに要素を追加
        card.appendChild(emoji);
        card.appendChild(name);
        
        // クリックイベントを設定
        card.addEventListener('click', function() {
            handleAnimalTouch(animal.id);
        });

        // グリッドにカードを追加
        grid.appendChild(card);
    });

    // ページインジゲーターを追加
    updatePageIndicator();
}

// ページインジゲーターを更新する関数
function updatePageIndicator() {
    const indicator = document.querySelector('.page-indicator');
    indicator.textContent = `ページ ${currentPage} / 2`;
}

// 次のページへ移動
function nextPage() {
    currentPage = currentPage === 2 ? 1 : currentPage + 1;
    renderAnimals(currentPage);
}

// 前のページへ移動
function prevPage() {
    currentPage = currentPage === 1 ? 2 : currentPage - 1;
    renderAnimals(currentPage);
}

// ページ読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMの読み込みが完了しました');

    // 音声ファイルをプリロード
    preloadSounds();

    // 初期ページ（ページ1）をレンダリング
    renderAnimals(currentPage);
    
    // ナビゲーションボタンにイベントリスナーを設定
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons[0].addEventListener('click', prevPage);
    navButtons[1].addEventListener('click', nextPage);
    
    // 設定画面の要素を取得
    const settingsModal = document.getElementById('settingsModal');
    const backButton = document.getElementById('backButton');
    const settingsButton = document.querySelector('.header-right');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    const showNamesCheckbox = document.getElementById('showNames');
    
    // 長押しタイマー用の変数
    let longPressTimer;
    
    // 設定ボタンの長押し検出（1秒）
    settingsButton.addEventListener('touchstart', function(e) {
        e.preventDefault();
        longPressTimer = setTimeout(function() {
            openSettings();
        }, 1000); // 1秒の長押し
    });
    
    settingsButton.addEventListener('touchend', function(e) {
        e.preventDefault();
        clearTimeout(longPressTimer);
    });
    
    settingsButton.addEventListener('touchcancel', function(e) {
        e.preventDefault();
        clearTimeout(longPressTimer);
    });
    
    // マウス操作（PC用）
    settingsButton.addEventListener('mousedown', function() {
        longPressTimer = setTimeout(function() {
            openSettings();
        }, 1000);
    });
    
    settingsButton.addEventListener('mouseup', function() {
        clearTimeout(longPressTimer);
    });
    
    settingsButton.addEventListener('mouseleave', function() {
        clearTimeout(longPressTimer);
    });
    
    // 設定画面を開く
    function openSettings() {
        console.log('設定画面を開きます');
        settingsModal.classList.add('show');
    }
    
    // 設定画面を閉じる
    function closeSettings() {
        console.log('設定画面を閉じます');
        settingsModal.classList.remove('show');
    }
    
    // 戻るボタン
    backButton.addEventListener('click', closeSettings);
    
    // モーダルの背景をクリックしても閉じる
    settingsModal.addEventListener('click', function(e) {
        if (e.target === settingsModal) {
            closeSettings();
        }
    });
    
    // 音量スライダーの変更
    volumeSlider.addEventListener('input', function() {
        const volume = this.value;
        volumeValue.textContent = volume;
        // 音量を実際に適用（Web Speech APIの音量調整）
        speechSynthesis.cancel(); // 再生中の音声をキャンセル
        console.log(`音量を ${volume}% に設定しました`);
    });
    
    // 名前表示の切り替え
    showNamesCheckbox.addEventListener('change', function() {
        const animalNames = document.querySelectorAll('.animal-name');
        animalNames.forEach(name => {
            name.style.display = this.checked ? 'block' : 'none';
        });
        console.log(`名前表示: ${this.checked ? 'ON' : 'OFF'}`);
    });
    
    console.log('アプリの初期化が完了しました');
});