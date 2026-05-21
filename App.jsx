import React, { useState } from 'react';

// === ダミーデータ（初期の動画リスト） ===
const INITIAL_VIDEOS = [
  { id: 1, title: '【大食い】ラーメン10杯食べきるまで帰れません！', channel: '満腹チャンネル', views: '12万回', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 2, title: '初心者向けReact超入門講座【2026年最新版】', channel: 'プログラミング部', views: '4.5万回', url: 'https://www.w3schools.com/html/movie.mp4' },
];

export default function App() {
  // 状態管理（ステート）
  const [user, setUser] = useState(null); // null: 未ログイン, { name, role: 'user' | 'admin', channelName }
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'login' | 'studio'
  const [videos, setVideos] = useState(INITIAL_VIDEOS);
  
  // 動画投稿用のフォームステート
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // 1. 簡易ログイン処理
  const handleLogin = (role) => {
    if (role === 'admin') {
      setUser({ name: 'テック太郎', role: 'admin', channelName: 'テック開発部' });
      setCurrentView('studio'); // 管理者はログイン後すぐ管理画面へ
    } else {
      setUser({ name: '一般ユーザーA', role: 'user', channelName: null });
      setCurrentView('home');
    }
  };

  // 2. ログアウト処理
  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
  };

  // 3. 動画投稿処理（管理画面用）
  const handleUpload = (e) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return alert('タイトルとURLを入力してください');

    const newVideo = {
      id: Date.now(),
      title: newTitle,
      channel: user?.channelName || '名無しのチャンネル',
      views: '0回',
      url: newUrl
    };

    setVideos([newVideo, ...videos]); // 新しい動画を先頭に追加
    setNewTitle('');
    setNewUrl('');
    alert('動画を投稿しました！普通画面のホームで確認できます。');
  };

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#0f0f0f', color: '#fff', minHeight: '100vh' }}>
      
      {/* ================= ヘッダー ================= */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid #333', alignItems: 'center' }}>
        <h1 style={{ color: '#ff0000', cursor: 'pointer', margin: 0 }} onClick={() => setCurrentView('home')}>YouTube Clone</h1>
        
        {/* ショートカットリンク */}
        <nav style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => setCurrentView('home')} style={btnStyle}>ホーム</button>
          {user?.role === 'admin' && (
            <button onClick={() => setCurrentView('studio')} style={{ ...btnStyle, background: '#272727' }}>⚙️ YouTube Studio（管理画面）</button>
          )}
        </nav>

        {/* ログイン・ユーザー情報情報 */}
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>{user.name} ({user.role === 'admin' ? 'クリエイター' : '一般'})</span>
              <button onClick={handleLogout} style={logoutBtnStyle}>ログアウト</button>
            </div>
          ) : (
            <button onClick={() => setCurrentView('login')} style={loginBtnStyle}>ログイン</button>
          )}
        </div>
      </header>

      {/* ================= メインコンテンツ（画面切り替え） ================= */}
      <main style={{ padding: '20px' }}>
        
        {/* 【通常画面：ホーム（動画一覧）】 */}
        {currentView === 'home' && (
          <div>
            <h2>おすすめ動画</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {videos.map(video => (
                <div key={video.id} style={{ background: '#1f1f1f', borderRadius: '8px', overflow: 'hidden', padding: '10px' }}>
                  {/* 簡易プレイヤーとしてHTML5のvideoタグを使用 */}
                  <video src={video.url} controls style={{ width: '100%', borderRadius: '4px' }} />
                  <h4 style={{ margin: '10px 0 5px 0', fontSize: '14px' }}>{video.title}</h4>
                  <p style={{ margin: 0, color: '#aaa', fontSize: '12px' }}>{video.channel}</p>
                  <p style={{ margin: 0, color: '#aaa', fontSize: '12px' }}>視聴回数: {video.views}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 【ログイン画面】 */}
        {currentView === 'login' && (
          <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', background: '#212121', borderRadius: '8px', textAlign: 'center' }}>
            <h3>ログイン（デモ用）</h3>
            <p style={{ color: '#aaa' }}>開発中のテスト用にボタンで役割を選択できます</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => handleLogin('user')} style={{ ...btnStyle, background: '#0056b3', padding: '12px' }}>一般ユーザーとしてログイン</button>
              <button onClick={() => handleLogin('admin')} style={{ ...btnStyle, background: '#28a745', padding: '12px' }}>クリエイター（管理者）としてログイン</button>
            </div>
          </div>
        )}

        {/* 【管理画面：YouTube Studio（動画投稿 / チャンネル管理）】 */}
        {currentView === 'studio' && user?.role === 'admin' && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
              <h2>ダッシュボード: {user.channelName}</h2>
              <p style={{ color: '#aaa' }}>ここでは動画の投稿やチャンネルの管理ができます。</p>
            </div>

            {/* 動画投稿フォーム */}
            <div style={{ background: '#212121', padding: '20px', borderRadius: '8px' }}>
              <h3>🎥 新しい動画を投稿する</h3>
              <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>動画タイトル</label>
                  <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="例：最高の動画を作ってみた" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>動画ファイルURL（テスト用のmp4リンクなど）</label>
                  <input type="text" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://example.com/video.mp4" style={inputStyle} />
                  <small style={{ color: '#aaa' }}>※テスト時はデフォルトで入っている動画URLを参考にしてください</small>
                </div>
                <button type="submit" style={{ ...btnStyle, background: '#ff0000', padding: '10px' }}>動画を公開する</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// === 簡易インラインスタイル ===
const btnStyle = { color: '#fff', background: 'transparent', border: 'none', padding: '8px 12px', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold' };
const loginBtnStyle = { color: '#3ea6ff', border: '1px solid #3ea6ff', background: 'transparent', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer' };
const logoutBtnStyle = { color: '#aaa', border: '1px solid #aaa', background: 'transparent', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #444', background: '#121212', color: '#fff', boxSizing: 'border-box' };