import React, { useState, useMemo, useEffect } from 'react';
import {
  Scissors,
  Sparkles,
  Heart,
  Search,
  MapPin,
  Star,
  Calendar,
  User,
  X,
  CheckCircle2,
  Flower2,
  Smile,
  Shield,
  Activity,
  ChevronRight,
  Clock,
} from 'lucide-react';
import './App.css';

type CategoryId = 'all' | 'hair' | 'relax' | 'nail' | 'eyelash' | 'pierce' | 'massage' | 'acupuncture';

interface MenuOption {
  id: string;
  name: string;
  time: string;
  price: number;
  oldPrice?: number;
}

interface Salon {
  id: string;
  name: string;
  category: CategoryId;
  categoryLabel: string;
  image: string;
  access: string;
  rating: number;
  reviewsCount: number;
  tags: string[];
  couponTitle: string;
  couponPrice: number;
  couponOldPrice: number;
  menus: MenuOption[];
}

const CATEGORIES: { id: CategoryId; label: string; icon: any }[] = [
  { id: 'all', label: 'すべて', icon: Sparkles },
  { id: 'hair', label: 'ヘアサロン', icon: Scissors },
  { id: 'relax', label: 'リラク', icon: Flower2 },
  { id: 'nail', label: 'ネイル', icon: Sparkles },
  { id: 'eyelash', label: 'まつ毛', icon: Smile },
  { id: 'pierce', label: 'ピアス', icon: Shield },
  { id: 'massage', label: 'マッサージ', icon: Activity },
  { id: 'acupuncture', label: '鍼灸院', icon: Flower2 },
];

const SALONS: Salon[] = [
  {
    id: 's1',
    name: 'Aura Hair & Spa 恵比寿',
    category: 'hair',
    categoryLabel: 'ヘアサロン',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    access: '恵比寿駅西口より徒歩3分',
    rating: 4.8,
    reviewsCount: 142,
    tags: ['カットが得意', '個室あり', 'ヘッドスパ'],
    couponTitle: '【人気No.1】小顔カット＋極上アロマヘッドスパ',
    couponPrice: 6600,
    couponOldPrice: 11000,
    menus: [
      { id: 'm1-1', name: '小顔カット＋極上アロマヘッドスパ', time: '60分', price: 6600, oldPrice: 11000 },
      { id: 'm1-2', name: '透明感アディクシーカラー＋カット', time: '90分', price: 8800, oldPrice: 14300 },
    ],
  },
  {
    id: 's2',
    name: 'Lulu Aroma & Relaxation 表参道',
    category: 'relax',
    categoryLabel: 'リラクゼーション',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    access: '表参道駅A4出口 徒歩2分',
    rating: 4.9,
    reviewsCount: 210,
    tags: ['完全個室', 'アロママッサージ', 'ペア利用可'],
    couponTitle: '【全身疲労解消】極上アロマリンパトリートメント 90分',
    couponPrice: 8200,
    couponOldPrice: 13500,
    menus: [
      { id: 'm2-1', name: '極上アロマリンパトリートメント 90分', time: '90分', price: 8200, oldPrice: 13500 },
      { id: 'm2-2', name: '首肩コリ撃退ヘッド＋ボディ 60分', time: '60分', price: 5800, oldPrice: 9000 },
    ],
  },
  {
    id: 's3',
    name: 'Blanc Nail & Eyelash 渋谷',
    category: 'nail',
    categoryLabel: 'ネイル',
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6c97d34?auto=format&fit=crop&w=600&q=80',
    access: '渋谷駅ハチ公口 徒歩4分',
    rating: 4.7,
    reviewsCount: 98,
    tags: ['パラジェル', 'ニュアンスネイル', '持ち込みデザイン'],
    couponTitle: '【初回オフ無料】トレンドニュアンスアート付け放題',
    couponPrice: 7500,
    couponOldPrice: 11000,
    menus: [
      { id: 'm3-1', name: 'トレンドニュアンスアート付け放題（オフ込）', time: '120分', price: 7500, oldPrice: 11000 },
      { id: 'm3-2', name: 'シンプルワンカラー / グラデーション', time: '60分', price: 4900, oldPrice: 7500 },
    ],
  },
  {
    id: 's4',
    name: 'Luminous まつ毛パーマ・眉毛専門店',
    category: 'eyelash',
    categoryLabel: 'まつ毛',
    image: 'https://images.unsplash.com/photo-1512290900672-ed29d06b1275?auto=format&fit=crop&w=600&q=80',
    access: '新宿駅東南口 徒歩2分',
    rating: 4.9,
    reviewsCount: 312,
    tags: ['パリジェンヌ', 'アイブロウ', '同時施術可'],
    couponTitle: '【次世代まつ毛パーマ】パリジェンヌラッシュリフト',
    couponPrice: 5500,
    couponOldPrice: 8000,
    menus: [
      { id: 'm4-1', name: 'パリジェンヌラッシュリフト＋ケラチントリートメント', time: '60分', price: 5500, oldPrice: 8000 },
      { id: 'm4-2', name: '美眉アイブロウワックススタイリング', time: '45分', price: 4800, oldPrice: 6500 },
    ],
  },
  {
    id: 's5',
    name: 'Medical Pierce Studio 銀座',
    category: 'pierce',
    categoryLabel: 'ピアス',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    access: '銀座駅C8出口 徒歩1分',
    rating: 4.8,
    reviewsCount: 165,
    tags: ['医師施術', '痛みが少ない', '軟骨対応'],
    couponTitle: '【医療用ピアッシング】耳たぶ（両耳）＋ファーストピアス込',
    couponPrice: 6000,
    couponOldPrice: 9000,
    menus: [
      { id: 'm5-1', name: '耳たぶ（両耳）ピアッシング', time: '30分', price: 6000, oldPrice: 9000 },
      { id: 'm5-2', name: '軟骨・トラガス ピアッシング（1箇所）', time: '30分', price: 8800, oldPrice: 12000 },
    ],
  },
  {
    id: 's6',
    name: 'ReBody 整体＆もみほぐしサロン',
    category: 'massage',
    categoryLabel: 'マッサージ',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80',
    access: '池袋駅西口 徒歩3分',
    rating: 4.7,
    reviewsCount: 188,
    tags: ['骨盤矯正', '全身もみほぐし', '国家資格者在籍'],
    couponTitle: '【全身コリ撃退】骨盤矯正＋全身もみほぐし 75分',
    couponPrice: 5900,
    couponOldPrice: 9800,
    menus: [
      { id: 'm6-1', name: '骨盤矯正＋全身もみほぐし 75分', time: '75分', price: 5900, oldPrice: 9800 },
      { id: 'm6-2', name: '本格ドライヘッドスパ＋首肩集中 45分', time: '45分', price: 4500, oldPrice: 7000 },
    ],
  },
  {
    id: 's7',
    name: '和み鍼灸・美容鍼サロン 中目黒',
    category: 'acupuncture',
    categoryLabel: '鍼灸院',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
    access: '中目黒駅正面出口 徒歩4分',
    rating: 4.9,
    reviewsCount: 134,
    tags: ['美容鍼', '小顔矯正', '女性スタッフ多数'],
    couponTitle: '【圧倒的リフトアップ】立体小顔美容鍼＋高保湿パック',
    couponPrice: 6900,
    couponOldPrice: 12000,
    menus: [
      { id: 'm7-1', name: '立体小顔美容鍼＋高保湿パック 60分', time: '60分', price: 6900, oldPrice: 12000 },
      { id: 'm7-2', name: '全身トータル鍼灸メンテナンス 90分', time: '90分', price: 9800, oldPrice: 15000 },
    ],
  },
];

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'favorites' | 'reservations'>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('beauty_favs');
      return saved ? JSON.parse(saved) : ['s1', 's4'];
    } catch {
      return ['s1', 's4'];
    }
  });

  const [reservations, setReservations] = useState<{ id: string; salonName: string; menuName: string; price: number; date: string }[]>(() => {
    try {
      const saved = localStorage.getItem('beauty_resvs');
      return saved ? JSON.parse(saved) : [
        { id: 'r1', salonName: 'Aura Hair & Spa 恵比寿', menuName: '小顔カット＋極上アロマヘッドスパ', price: 6600, date: '11月15日(日) 14:00〜' }
      ];
    } catch {
      return [];
    }
  });

  const [activeSalonModal, setActiveSalonModal] = useState<Salon | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('beauty_favs', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('beauty_resvs', JSON.stringify(reservations));
    } catch {}
  }, [reservations]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleBookMenu = (salon: Salon, menu: MenuOption) => {
    const newResv = {
      id: Date.now().toString(),
      salonName: salon.name,
      menuName: menu.name,
      price: menu.price,
      date: '11月20日(金) 15:00〜',
    };
    setReservations((prev) => [newResv, ...prev]);
    setActiveSalonModal(null);
    setActiveTab('reservations');
    showToast('予約が完了しました！');
  };

  const filteredSalons = useMemo(() => {
    return SALONS.filter((salon) => {
      const matchCat = selectedCategory === 'all' || salon.category === selectedCategory;
      const matchQuery =
        salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salon.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salon.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const favoriteSalons = SALONS.filter((s) => favorites.includes(s.id));

  return (
    <div className="app-shell">
      {toastMessage && (
        <div className="toast-alert">
          <CheckCircle2 size={18} color="#e8cfa6" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-icon">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="app-title">Lumière</h1>
            <p className="app-subtitle">BEAUTY &amp; RELAX SALON</p>
          </div>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => setActiveTab('favorites')}
            aria-label="お気に入り"
          >
            <Heart size={18} fill={favorites.length > 0 ? '#d98880' : 'none'} color={favorites.length > 0 ? '#d98880' : '#2b2724'} />
            {favorites.length > 0 && <span className="badge-dot" />}
          </button>
        </div>
      </header>

      <main className="main-content">
        {activeTab === 'home' && (
          <>
            {/* Search Bar */}
            <div className="search-bar-wrap">
              <Search size={18} className="search-icon-pos" />
              <input
                type="text"
                className="search-input"
                placeholder="サロン名、メニュー、こだわり条件で検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Grid */}
            <div className="category-grid">
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`cat-card ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <div className="cat-icon-wrap">
                      <IconComponent size={20} />
                    </div>
                    <span className="cat-name">{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Salon List Section */}
            <div>
              <div className="section-title-row">
                <h2 className="section-title">
                  <Sparkles size={16} color="#d98880" />
                  おすすめサロン・予約プラン
                </h2>
                <span className="section-link">{filteredSalons.join ? filteredSalons.length : 0}件</span>
              </div>

              <div className="salon-list" style={{ marginTop: '10px' }}>
                {filteredSalons.map((salon) => {
                  const isFav = favorites.includes(salon.id);
                  return (
                    <div
                      key={salon.id}
                      className="salon-card"
                      onClick={() => setActiveSalonModal(salon)}
                    >
                      <div className="salon-img-box">
                        <img src={salon.image} alt={salon.name} />
                        <span className="salon-tag">{salon.categoryLabel}</span>
                        <button
                          type="button"
                          className={`salon-fav-btn ${isFav ? 'saved' : ''}`}
                          onClick={(e) => toggleFavorite(salon.id, e)}
                          aria-label="お気に入り"
                        >
                          <Heart size={18} fill={isFav ? '#e04f5f' : 'none'} />
                        </button>
                      </div>

                      <div className="salon-body">
                        <div className="salon-header-row">
                          <h3 className="salon-name">{salon.name}</h3>
                          <div className="salon-rating">
                            <Star size={14} fill="#d4a373" />
                            <span>{salon.rating}</span>
                            <span style={{ fontSize: '0.7rem', color: '#7a7067' }}>({salon.reviewsCount})</span>
                          </div>
                        </div>

                        <p className="salon-access">
                          <MapPin size={12} style={{ display: 'inline', marginRight: '3px' }} />
                          {salon.access}
                        </p>

                        <div className="coupon-preview">
                          <span className="coupon-title">{salon.couponTitle}</span>
                          <div className="coupon-price">
                            ¥{salon.couponPrice.toLocaleString()}
                            <span>¥{salon.couponOldPrice.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="salon-footer">
                          <div className="salon-tags-row">
                            {salon.tags.map((t) => (
                              <span key={t} className="mini-tag">{t}</span>
                            ))}
                          </div>
                          <button type="button" className="reserve-go-btn">
                            空席確認・予約 <ChevronRight size={14} style={{ display: 'inline' }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {activeTab === 'favorites' && (
          <div>
            <div className="section-title-row">
              <h2 className="section-title">お気に入りサロン ({favoriteSalons.length})</h2>
            </div>
            {favoriteSalons.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7a7067' }}>
                <Heart size={36} color="#d98880" style={{ marginBottom: '10px' }} />
                <p style={{ fontSize: '0.88rem' }}>お気に入り登録されたサロンはまだありません。</p>
              </div>
            ) : (
              <div className="salon-list" style={{ marginTop: '12px' }}>
                {favoriteSalons.map((salon) => (
                  <div
                    key={salon.id}
                    className="salon-card"
                    onClick={() => setActiveSalonModal(salon)}
                  >
                    <div className="salon-img-box">
                      <img src={salon.image} alt={salon.name} />
                      <span className="salon-tag">{salon.categoryLabel}</span>
                      <button
                        type="button"
                        className="salon-fav-btn saved"
                        onClick={(e) => toggleFavorite(salon.id, e)}
                      >
                        <Heart size={18} fill="#e04f5f" />
                      </button>
                    </div>
                    <div className="salon-body">
                      <h3 className="salon-name">{salon.name}</h3>
                      <p className="salon-access">{salon.access}</p>
                      <div className="coupon-preview">
                        <span className="coupon-title">{salon.couponTitle}</span>
                        <div className="coupon-price">¥{salon.couponPrice.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reservations' && (
          <div>
            <div className="section-title-row">
              <h2 className="section-title">予約履歴・確認</h2>
            </div>
            {reservations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7a7067' }}>
                <Calendar size={36} color="#d98880" style={{ marginBottom: '10px' }} />
                <p style={{ fontSize: '0.88rem' }}>現在、予約しているサロンはありません。</p>
              </div>
            ) : (
              <div className="salon-list" style={{ marginTop: '12px' }}>
                {reservations.map((res) => (
                  <div key={res.id} className="salon-card" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className="log-tag meal" style={{ background: '#fcf1f0', color: '#b05249' }}>予約確定</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7a7067' }}>
                        <Clock size={12} style={{ display: 'inline', marginRight: '3px' }} />
                        {res.date}
                      </span>
                    </div>
                    <h3 className="salon-name" style={{ fontSize: '1rem', marginBottom: '4px' }}>{res.salonName}</h3>
                    <p style={{ fontSize: '0.84rem', fontWeight: 700, color: '#2b2724', margin: '0 0 10px' }}>{res.menuName}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #eae4de' }}>
                      <span style={{ fontSize: '0.8rem', color: '#7a7067' }}>お支払い目安: <strong>¥{res.price.toLocaleString()}</strong></span>
                      <button
                        type="button"
                        style={{ background: '#fff', border: '1px solid #eae4de', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                        onClick={() => {
                          setReservations((prev) => prev.filter((x) => x.id !== res.id));
                          showToast('予約をキャンセルしました');
                        }}
                      >
                        予約をキャンセル
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Salon Detail & Menu Modal */}
      {activeSalonModal && (
        <div className="modal-overlay" onClick={() => setActiveSalonModal(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-img-wrap">
              <img src={activeSalonModal.image} alt={activeSalonModal.name} />
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setActiveSalonModal(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-content-body">
              <div>
                <span className="salon-tag" style={{ position: 'static', display: 'inline-block', marginBottom: '6px' }}>
                  {activeSalonModal.categoryLabel}
                </span>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px' }}>{activeSalonModal.name}</h2>
                <p style={{ fontSize: '0.8rem', color: '#7a7067', margin: '0 0 12px' }}>{activeSalonModal.access}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {activeSalonModal.tags.map((t) => (
                    <span key={t} className="mini-tag">{t}</span>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 800, margin: '0 0 10px' }}>予約・クーポンメニュー</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activeSalonModal.menus.map((menu) => (
                    <div key={menu.id} className="menu-item-card">
                      <div className="menu-info">
                        <h4 className="menu-name">{menu.name}</h4>
                        <p className="menu-time">所要時間：{menu.time}</p>
                        <div className="menu-price-row">
                          <span className="menu-price">¥{menu.price.toLocaleString()}</span>
                          {menu.oldPrice && <span className="menu-price-old">¥{menu.oldPrice.toLocaleString()}</span>}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="book-action-btn"
                        onClick={() => handleBookMenu(activeSalonModal, menu)}
                      >
                        予約する
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button
          type="button"
          className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Search size={20} />
          <span>さがす</span>
        </button>
        <button
          type="button"
          className={`nav-tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <Heart size={20} />
          <span>
            お気に入り
            {favorites.length > 0 && <span className="badge-count">{favorites.length}</span>}
          </span>
        </button>
        <button
          type="button"
          className={`nav-tab ${activeTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          <Calendar size={20} />
          <span>予約確認</span>
        </button>
      </nav>
    </div>
  );
}

export default App;