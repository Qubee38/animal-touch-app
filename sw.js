// Service Worker のバージョン（アプリを更新したらこれを変更する）
const CACHE_VERSION = 'animal-touch-v1.0.0';

// キャッシュするファイルのリスト
const CACHE_FILES = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/animals.js',
    '/assets/sounds/dog.mp3',
    '/assets/sounds/cat.mp3',
    '/assets/sounds/cow.mp3',
    '/assets/sounds/pig.mp3',
    '/assets/sounds/sheep.mp3',
    '/assets/sounds/chicken.mp3',
    '/assets/sounds/duck.mp3',
    '/assets/sounds/horse.mp3'
];

// インストール時の処理
self.addEventListener('install', (event) => {
    console.log('[Service Worker] インストール開始');
    
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => {
                console.log('[Service Worker] ファイルをキャッシュに保存中...');
                return cache.addAll(CACHE_FILES);
            })
            .then(() => {
                console.log('[Service Worker] すべてのファイルをキャッシュしました');
                // 即座にアクティベート
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] キャッシュ失敗:', error);
            })
    );
});

// アクティベーション時の処理
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] アクティベーション開始');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                // 古いキャッシュを削除
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_VERSION) {
                            console.log('[Service Worker] 古いキャッシュを削除:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[Service Worker] アクティベーション完了');
                // すべてのクライアントを即座に制御下に置く
                return self.clients.claim();
            })
    );
});

// フェッチ時の処理（リクエストをインターセプト）
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // キャッシュにあればそれを返す
                if (cachedResponse) {
                    console.log('[Service Worker] キャッシュから返す:', event.request.url);
                    return cachedResponse;
                }
                
                // キャッシュになければネットワークから取得
                console.log('[Service Worker] ネットワークから取得:', event.request.url);
                return fetch(event.request)
                    .then((response) => {
                        // レスポンスが有効かチェック
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // レスポンスをクローンしてキャッシュに保存
                        const responseToCache = response.clone();
                        caches.open(CACHE_VERSION)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch((error) => {
                        console.error('[Service Worker] フェッチ失敗:', error);
                        // オフライン時のフォールバック（オプション）
                        return caches.match('/index.html');
                    });
            })
    );
});