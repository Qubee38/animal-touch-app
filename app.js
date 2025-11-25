// アプリの初期化
console.log('アプリが起動しました');

// 音声再生中かどうかを管理するオブジェクト
const playingStates = {
    dog: false,
    cat: false,
    cow: false,
    pig: false
};

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

// ページ読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMの読み込みが完了しました');
    
    // 犬のカード
    const dogCard = document.getElementById('dog');
    dogCard.addEventListener('click', function() {
        handleAnimalTouch('dog', 'ワンワン');
    });
    
    // 猫のカード
    const catCard = document.getElementById('cat');
    catCard.addEventListener('click', function() {
        handleAnimalTouch('cat', 'ニャーニャー');
    });

    // 牛のカード
    const cowCard = document.getElementById('cow');
    cowCard.addEventListener('click', function() {
        handleAnimalTouch('cow', 'モーモー');
    });

    // 豚のカード
    const pigCard = document.getElementById('pig');
    pigCard.addEventListener('click', function() {
        handleAnimalTouch('pig', 'ブーブー');
    });

    console.log('すべての動物カードにイベントリスナーを設定しました');
});