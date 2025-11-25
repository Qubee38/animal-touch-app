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
function speakText(text) {
    // 音声合成の準備
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP'; // 日本語
    utterance.rate = 1.0;     // 速度（1.0が標準）
    utterance.pitch = 1.5;    // 音の高さ（高め）
    // 音声を再生
    speechSynthesis.speak(utterance);
    return utterance;
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
    const utterance = speakText(soundText);
    
    // 音声再生が終わったらフラグを下ろす
    utterance.onend = function() {
        playingStates[animalId] = false;
        console.log(`${animalId} の音声再生が終了`);
    };
    
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
            handleAnimalTouch(animal.id, animal.sound);
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
    
    // 最初のページをレンダリング
    renderAnimals(currentPage);

    // ナビゲーションボタンにイベントリスナーを設定
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons[0].addEventListener('click', prevPage);  // 前のページ
    navButtons[1].addEventListener('click', nextPage);  // 次のページ

    console.log('アプリの初期化が完了しました');
});