'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '@/styles/landing.css';

export default function LandingPage() {
  const router = useRouter();
  const navbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Navbar scroll effect
    const handleScroll = () => {
      if (navbarRef.current) {
        navbarRef.current.classList.toggle('scrolled', window.scrollY > 20);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Intersection Observer for fade-up on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.anim-fade-up').forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-root">
      {/* ════════════════════════════════════════
           NAVBAR
      ════════════════════════════════════════ */}
      <nav className="lp-navbar" id="navbar" ref={navbarRef}>
        <div className="lp-nav-inner">
          <Link href="/" className="lp-nav-logo">
            <div className="lp-nav-logo-icon bg-transparent shadow-none">
              <img src="/logo.png" alt="NebulaEnglish Logo" className="w-full h-full object-contain" />
            </div>
            <div className="lp-nav-logo-text">Nebula<span>English</span></div>
          </Link>
          <div className="lp-nav-links">
            <a href="#skills" onClick={(e) => scrollToSection(e, 'skills')} className="lp-nav-link">Kỹ năng</a>
            <a href="#ai" onClick={(e) => scrollToSection(e, 'ai')} className="lp-nav-link">Tính năng AI</a>
            <a href="#exam" onClick={(e) => scrollToSection(e, 'exam')} className="lp-nav-link">Luyện đề</a>
            <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="lp-nav-link">Bảng giá</a>
            <a href="#community" onClick={(e) => scrollToSection(e, 'community')} className="lp-nav-link">Cộng đồng</a>
          </div>
          <div className="lp-nav-spacer"></div>
          <div className="lp-nav-actions">
            <Link href="/login" className="lp-btn-ghost">Đăng nhập</Link>
            <Link href="/register" className="lp-btn-primary">Đăng ký miễn phí 🚀</Link>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════════════
           HERO
      ════════════════════════════════════════ */}
      <section className="lp-hero">
        <div className="lp-hero-blob lp-hero-blob-1"></div>
        <div className="lp-hero-blob lp-hero-blob-2"></div>
        <div className="lp-hero-blob lp-hero-blob-3"></div>

        <div className="lp-hero-inner lp-container">
          {/* Left */}
          <div className="lp-hero-left">
            <div className="lp-tag lp-hero-tag">🤖 AI-Powered · Gamification · Personalized</div>
            <h1 className="lp-hero-title">
              Học Tiếng Anh<br/>
              <span className="line2">Thông Minh Hơn,</span><br/>
              <span className="line3">Nhanh Hơn, Vui Hơn</span>
            </h1>
            <p className="lp-hero-desc">
              Nền tảng học tiếng Anh cá nhân hóa với AI – tự động xác định trình độ,
              tạo lộ trình riêng và biến việc học thành một trò chơi thú vị mỗi ngày.
            </p>
            <div className="lp-hero-cta">
              <Link href="/register" className="lp-btn-hero-primary">
                Bắt đầu miễn phí
                <svg className="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/placement-test" className="lp-btn-hero-secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Kiểm tra trình độ
              </Link>
            </div>
            <div className="lp-hero-social-proof">
              <div className="lp-avatar-stack">
                <div className="lp-avatar-item" style={{ background: 'linear-gradient(135deg,#FF6B35,#FF9966)' }}>N</div>
                <div className="lp-avatar-item" style={{ background: 'linear-gradient(135deg,#4ECDC4,#6BCB77)' }}>T</div>
                <div className="lp-avatar-item" style={{ background: 'linear-gradient(135deg,#A78BFA,#8B5CF6)' }}>L</div>
                <div className="lp-avatar-item" style={{ background: 'linear-gradient(135deg,#FFD93D,#FF9966)' }}>M</div>
                <div className="lp-avatar-item" style={{ background: 'linear-gradient(135deg,#1E1B4B,#4338CA)' }}>+</div>
              </div>
              <span className="lp-social-text"><strong>50,000+</strong> học viên đang học</span>
              <div className="lp-star-row">
                <span className="lp-star">★</span><span className="lp-star">★</span><span className="lp-star">★</span><span className="lp-star">★</span><span className="lp-star">★</span>
                <span className="lp-star-label">&nbsp;4.9/5</span>
              </div>
            </div>
          </div>

          {/* Right – app mockup */}
          <div className="lp-hero-right">
            <div className="lp-hero-phone">
              {/* Floating badges */}
              <div className="lp-float-badge fb-streak">
                <div className="badge-icon">🔥</div>
                <div>
                  <div className="badge-val">30</div>
                  <div className="badge-sub">Ngày streak</div>
                </div>
              </div>
              <div className="lp-float-badge fb-badge">
                <div className="badge-icon">🏅</div>
                <div>
                  <div className="badge-val">Badge mới!</div>
                  <div className="badge-sub">Speaking Star</div>
                </div>
              </div>
              <div className="lp-float-badge fb-rank">
                <div className="badge-icon">🏆</div>
                <div>
                  <div className="badge-val">#3</div>
                  <div className="badge-sub">Bảng xếp hạng</div>
                </div>
              </div>

              <div className="lp-app-mockup">
                {/* Topbar */}
                <div className="lp-mockup-topbar">
                  <div className="lp-mockup-logo">🚀 NebulaEnglish</div>
                  <div className="lp-mockup-streak">🔥 30 ngày</div>
                </div>
                {/* Body */}
                <div className="lp-mockup-body">
                  <div className="lp-mockup-greeting">Chào buổi sáng, <span>Minh!</span> ☀️</div>
                  {/* Progress card */}
                  <div className="lp-mockup-progress-card">
                    <div className="lp-mpc-label">Bài học hôm nay</div>
                    <div className="lp-mpc-title">Unit 4 – Present Perfect Tense</div>
                    <div className="lp-mpc-bar"><div className="lp-mpc-fill"></div></div>
                    <div className="lp-mpc-meta"><span>12/20 bài tập</span><span>62% hoàn thành</span></div>
                  </div>
                  {/* Skill chips */}
                  <div className="lp-mockup-skills">
                    <div className="lp-skill-chip">
                      <div className="lp-skill-chip-ico">📖</div>
                      <div>
                        <div className="lp-skill-chip-name">Từ vựng</div>
                        <div className="lp-skill-chip-sub">850 từ đã học</div>
                      </div>
                    </div>
                    <div className="lp-skill-chip">
                      <div className="lp-skill-chip-ico">🗣️</div>
                      <div>
                        <div className="lp-skill-chip-name">Phát âm</div>
                        <div className="lp-skill-chip-sub">Điểm: 92/100</div>
                      </div>
                    </div>
                    <div className="lp-skill-chip">
                      <div className="lp-skill-chip-ico">👂</div>
                      <div>
                        <div className="lp-skill-chip-name">Nghe</div>
                        <div className="lp-skill-chip-sub">B2 level</div>
                      </div>
                    </div>
                    <div className="lp-skill-chip">
                      <div className="lp-skill-chip-ico">✍️</div>
                      <div>
                        <div className="lp-skill-chip-name">Writing</div>
                        <div className="lp-skill-chip-sub">AI chấm bài</div>
                      </div>
                    </div>
                  </div>
                  {/* XP */}
                  <div className="lp-mockup-xp">
                    <div className="lp-xp-icon">⚡</div>
                    <div style={{ flex: 1 }}>
                      <div className="lp-xp-label">ĐIỂM KINH NGHIỆM</div>
                      <div className="lp-xp-bar"><div className="lp-xp-fill"></div></div>
                    </div>
                    <div className="lp-xp-val">1,240 XP</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
           STATS BAND
      ════════════════════════════════════════ */}
      <div className="lp-stats-band">
        <div className="lp-container">
          <div className="lp-stats-grid">
            <div className="lp-stat-item">
              <div className="lp-stat-num">50,000+</div>
              <div className="lp-stat-label">Học viên đang học</div>
            </div>
            <div className="lp-stat-item">
              <div className="lp-stat-num">1,200+</div>
              <div className="lp-stat-label">Bài học được thiết kế</div>
            </div>
            <div className="lp-stat-item">
              <div className="lp-stat-num">98%</div>
              <div className="lp-stat-label">Học viên hài lòng</div>
            </div>
            <div className="lp-stat-item">
              <div className="lp-stat-num">4.9 ⭐</div>
              <div className="lp-stat-label">Đánh giá trung bình</div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
           6 SKILLS
      ════════════════════════════════════════ */}
      <section className="lp-section" id="skills">
        <div className="lp-container">
          <div className="lp-section-header anim-fade-up">
            <div className="lp-tag" style={{ background: 'rgba(255,107,53,.1)', color: 'var(--lp-primary)' }}>📚 6 Kỹ Năng Toàn Diện</div>
            <h2 className="lp-section-title">Thành thạo tiếng Anh với<br/><span>đầy đủ 6 kỹ năng</span></h2>
            <p className="lp-section-desc">Mỗi kỹ năng được thiết kế bởi các chuyên gia ngôn ngữ, kết hợp AI để cá nhân hóa lộ trình cho từng người học.</p>
          </div>

          <div className="lp-skills-grid anim-fade-up">
            {/* Vocabulary */}
            <div className="lp-skill-card" style={{ '--hover-color': 'var(--lp-primary)' } as any}>
              <div className="lp-skill-card-icon" style={{ background: 'rgba(255,107,53,0.1)' }}>📖</div>
              <div className="lp-skill-card-title">Từ Vựng</div>
              <div className="lp-skill-card-desc">Học từ theo chủ đề, spaced repetition thông minh. Flashcard tương tác với hình ảnh và audio chuẩn.</div>
              <div className="lp-skill-card-features">
                <span className="lp-skill-feat" style={{ background: 'rgba(255,107,53,.1)', color: 'var(--lp-primary)' }}>Flashcard</span>
                <span className="lp-skill-feat" style={{ background: 'rgba(255,107,53,.1)', color: 'var(--lp-primary)' }}>Spaced Repetition</span>
                <span className="lp-skill-feat" style={{ background: 'rgba(255,107,53,.1)', color: 'var(--lp-primary)' }}>1000+ chủ đề</span>
              </div>
            </div>
            {/* Grammar */}
            <div className="lp-skill-card">
              <div className="lp-skill-card-icon" style={{ background: 'rgba(78,205,196,.1)' }}>🔤</div>
              <div className="lp-skill-card-title">Ngữ Pháp</div>
              <div className="lp-skill-card-desc">Bài học lý thuyết rõ ràng kết hợp bài tập tương tác. Giải thích chi tiết sau mỗi câu đúng/sai.</div>
              <div className="lp-skill-card-features">
                <span className="lp-skill-feat" style={{ background: 'rgba(78,205,196,.12)', color: '#0E9F9F' }}>Lý thuyết</span>
                <span className="lp-skill-feat" style={{ background: 'rgba(78,205,196,.12)', color: '#0E9F9F' }}>Bài tập tương tác</span>
                <span className="lp-skill-feat" style={{ background: 'rgba(78,205,196,.12)', color: '#0E9F9F' }}>A1 → C1</span>
              </div>
            </div>
            {/* Listening */}
            <div className="lp-skill-card">
              <div className="lp-skill-card-icon" style={{ background: 'rgba(167,139,250,.12)' }}>👂</div>
              <div className="lp-skill-card-title">Nghe Hiểu</div>
              <div className="lp-skill-card-desc">Audio chuẩn native speaker, điều chỉnh tốc độ 0.75x–1.5x. Bài tập fill-in-the-blank và transcript.</div>
              <div className="lp-skill-card-features">
                <span className="lp-skill-feat" style={{ background: 'rgba(167,139,250,.15)', color: '#7C3AED' }}>0.75x–1.5x</span>
                <span className="lp-skill-feat" style={{ background: 'rgba(167,139,250,.15)', color: '#7C3AED' }}>Transcript</span>
                <span className="lp-skill-feat" style={{ background: 'rgba(167,139,250,.15)', color: '#7C3AED' }}>Native Audio</span>
              </div>
            </div>
            {/* Speaking */}
            <div className="lp-skill-card">
              <div className="lp-skill-card-icon" style={{ background: 'rgba(255,107,53,.08)' }}>🗣️</div>
              <div className="lp-skill-card-title">Nói & Phát Âm</div>
              <div className="lp-skill-card-desc">AI nhận dạng giọng nói, chấm điểm phát âm từng âm tiết. So sánh với giọng chuẩn và gợi ý cải thiện.</div>
              <div className="lp-skill-card-features">
                <span className="lp-skill-feat" style={{ background: 'rgba(255,107,53,.1)', color: 'var(--lp-primary)' }}>AI Scoring</span>
                <span className="lp-skill-feat" style={{ background: 'rgba(255,107,53,.1)', color: 'var(--lp-primary)' }}>Waveform</span>
                <span className="lp-skill-feat" style={{ background: 'rgba(255,107,53,.1)', color: 'var(--lp-primary)' }}>Real-time</span>
              </div>
            </div>
            {/* Writing */}
            <div className="lp-skill-card">
              <div className="lp-skill-card-icon" style={{ background: 'rgba(107,203,119,.12)' }}>✍️</div>
              <div className="lp-skill-card-title">Viết</div>
              <div className="lp-skill-card-desc">AI chấm bài theo 4 tiêu chí: ngữ pháp, từ vựng, mạch văn, nhiệm vụ. Phản hồi chi tiết từng lỗi.</div>
              <div className="lp-skill-card-features">
                <span className="lp-skill-feat" style={{ background: 'rgba(107,203,119,.12)', color: '#2E8B3A' }}>AI Grading</span>
                <span className="lp-skill-feat" style={{ background: 'rgba(107,203,119,.12)', color: '#2E8B3A' }}>Error Highlight</span>
                <span className="lp-skill-feat" style={{ background: 'rgba(107,203,119,.12)', color: '#2E8B3A' }}>IELTS Task</span>
              </div>
            </div>
            {/* Reading */}
            <div className="lp-skill-card">
              <div className="lp-skill-card-icon" style={{ background: 'rgba(255,217,61,.15)' }}>📝</div>
              <div className="lp-skill-card-title">Đọc Hiểu</div>
              <div className="lp-skill-card-desc">Đoạn văn đa cấp độ, click từ tra nghĩa ngay, highlight từ mới lưu vào từ điển cá nhân.</div>
              <div className="lp-skill-card-features">
                <span className="lp-skill-feat" style={{ background: 'rgba(255,217,61,.18)', color: '#B45309' }}>Mini Dict</span>
                <span className="lp-skill-feat" style={{ background: 'rgba(255,217,61,.18)', color: '#B45309' }}>Highlight</span>
                <span className="lp-skill-feat" style={{ background: 'rgba(255,217,61,.18)', color: '#B45309' }}>A1 → C1</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
           AI SECTION
      ════════════════════════════════════════ */}
      <section className="lp-section lp-ai-section" id="ai">
        <div className="lp-container">
          <div className="lp-ai-inner">
            <div className="lp-ai-left anim-fade-up">
              <div className="lp-tag" style={{ background: 'rgba(167,139,250,.18)', color: '#c4b5fd' }}>🤖 Powered by Nebula AI</div>
              <h2 className="lp-section-title">Trợ lý AI cá nhân<br/><span style={{ color: 'var(--lp-accent)' }}>học cùng bạn 24/7</span></h2>
              <p className="lp-section-desc">
                Không chỉ là bài học tĩnh — AI phân tích điểm yếu, gợi ý bài phù hợp và trò chuyện thực tế để bạn tự tin hơn mỗi ngày.
              </p>
              <div className="lp-ai-cards">
                <div className="lp-ai-card">
                  <div className="lp-ai-card-icon" style={{ background: 'rgba(167,139,250,.2)' }}>🗨️</div>
                  <div>
                    <div className="lp-ai-card-title">AI Chatbot luyện hội thoại</div>
                    <div className="lp-ai-card-desc">Mô phỏng 10+ tình huống thực tế: đặt phòng, phỏng vấn, mua sắm. AI sửa lỗi nhẹ nhàng trong lúc chat.</div>
                  </div>
                </div>
                <div className="lp-ai-card">
                  <div className="lp-ai-card-icon" style={{ background: 'rgba(107,203,119,.18)' }}>🎯</div>
                  <div>
                    <div className="lp-ai-card-title">Chấm điểm phát âm thông minh</div>
                    <div className="lp-ai-card-desc">So sánh giọng người học với native speaker theo từng âm vị. Điểm số 0–100 + gợi ý cải thiện cụ thể.</div>
                  </div>
                </div>
                <div className="lp-ai-card">
                  <div className="lp-ai-card-icon" style={{ background: 'rgba(255,217,61,.18)' }}>✏️</div>
                  <div>
                    <div className="lp-ai-card-title">AI Writing Checker</div>
                    <div className="lp-ai-card-desc">Phân tích bài viết theo 4 tiêu chí IELTS. Highlight lỗi, giải thích nguyên nhân và đề xuất sửa.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="anim-fade-up">
              <div className="lp-chat-demo">
                <div className="lp-chat-topbar">
                  <div className="lp-chat-avatar">🤖</div>
                  <div>
                    <div className="lp-chat-name">AI English Coach</div>
                    <div className="lp-chat-status">● Đang hoạt động</div>
                  </div>
                  <div className="lp-chat-scenario">🏨 Đặt phòng khách sạn</div>
                </div>
                <div className="lp-chat-body">
                  <div className="lp-msg ai">
                    <div className="lp-msg-bubble">Hello! I'm Alex, the front desk manager. How can I help you today?</div>
                  </div>
                  <div className="lp-msg user">
                    <div>
                      <div className="lp-msg-bubble">I want to <span style={{ textDecoration: 'underline', textDecorationColor: '#fca', textDecorationStyle: 'wavy' }}>reservate</span> a room for 3 nights.</div>
                      <div className="lp-msg-error">💡 "reservate" → "reserve" hoặc "make a reservation"</div>
                    </div>
                  </div>
                  <div className="lp-msg ai">
                    <div className="lp-msg-bubble">Of course! What type of room would you prefer — single, double, or a suite?</div>
                  </div>
                  <div className="lp-msg user">
                    <div className="lp-msg-bubble">A double room please. Do you have ocean view?</div>
                  </div>
                  <div className="lp-msg ai">
                    <div className="lp-msg-bubble">Great choice! We have ocean-view double rooms available. Check-in date? 🌊</div>
                  </div>
                </div>
                <div className="lp-chat-input-bar">
                  <div className="lp-chat-input">Nhập câu trả lời của bạn…</div>
                  <button className="lp-chat-send">➤</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
           HOW IT WORKS
      ════════════════════════════════════════ */}
      <section className="lp-section lp-how-section">
        <div className="lp-container">
          <div className="lp-section-header anim-fade-up">
            <div className="lp-tag" style={{ background: 'rgba(78,205,196,.1)', color: '#0E9F9F' }}>🗺️ Quy Trình 4 Bước</div>
            <h2 className="lp-section-title">Bắt đầu học chỉ với<br/><span>4 bước đơn giản</span></h2>
            <p className="lp-section-desc">Từ đăng ký đến học bài đầu tiên chỉ mất chưa đầy 5 phút.</p>
          </div>
          <div className="lp-steps anim-fade-up">
            <div className="lp-step">
              <div className="lp-step-num"><div className="lp-step-icon">📝</div></div>
              <div className="lp-step-title">Đăng ký miễn phí</div>
              <div className="lp-step-desc">Tạo tài khoản bằng email, Google hoặc Facebook chỉ trong 30 giây.</div>
            </div>
            <div className="lp-step">
              <div className="lp-step-num"><div className="lp-step-icon">📋</div></div>
              <div className="lp-step-title">Kiểm tra trình độ</div>
              <div className="lp-step-desc">Làm bài test 40 câu để AI xác định chính xác level từ A1 đến C1.</div>
            </div>
            <div className="lp-step">
              <div className="lp-step-num"><div className="lp-step-icon">🗺️</div></div>
              <div className="lp-step-title">Nhận lộ trình riêng</div>
              <div className="lp-step-desc">AI tạo lộ trình cá nhân hóa theo trình độ, mục tiêu và thời gian học của bạn.</div>
            </div>
            <div className="lp-step">
              <div className="lp-step-num"><div className="lp-step-icon">🚀</div></div>
              <div className="lp-step-title">Học & Tiến bộ mỗi ngày</div>
              <div className="lp-step-desc">Học bài, tích XP, duy trì streak và leo hạng trên bảng xếp hạng cộng đồng.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
           GAMIFICATION
      ════════════════════════════════════════ */}
      <section className="lp-section lp-game-section">
        <div className="lp-container">
          <div className="lp-game-inner">
            <div className="anim-fade-up">
              <div className="lp-tag" style={{ background: 'rgba(255,217,61,.15)', color: '#B45309' }}>🎮 Game Hóa Việc Học</div>
              <h2 className="lp-section-title">Học vui như<br/><span>chơi game</span></h2>
              <p className="lp-section-desc">Hệ thống gamification đầy đủ giúp bạn duy trì động lực học mỗi ngày mà không cảm thấy nhàm chán.</p>
              <div className="lp-game-grid">
                <div className="lp-game-card">
                  <div className="lp-game-card-icon">⚡</div>
                  <div className="lp-game-card-title">XP & Level</div>
                  <div className="lp-game-card-desc">Tích điểm sau mỗi bài học, level up từ Beginner lên Master.</div>
                </div>
                <div className="lp-game-card">
                  <div className="lp-game-card-icon">🔥</div>
                  <div className="lp-game-card-title">Streak</div>
                  <div className="lp-game-card-desc">Duy trì chuỗi ngày học liên tiếp. Phần thưởng đặc biệt mỗi milestone.</div>
                </div>
                <div className="lp-game-card">
                  <div className="lp-game-card-icon">🏅</div>
                  <div className="lp-game-card-title">Huy Hiệu</div>
                  <div className="lp-game-card-desc">Mở khóa 50+ badge khi đạt thành tích. Hiển thị trên profile.</div>
                </div>
                <div className="lp-game-card">
                  <div className="lp-game-card-icon">🛍️</div>
                  <div className="lp-game-card-title">Cửa Hàng XP</div>
                  <div className="lp-game-card-desc">Dùng XP mua avatar, theme giao diện và tăng cường học tập.</div>
                </div>
              </div>
            </div>

            <div className="anim-fade-up">
              <div className="lp-leaderboard-card">
                <div className="lp-lb-header">
                  <div>🏆</div>
                  <div className="lp-lb-title">Bảng Xếp Hạng</div>
                  <div className="lp-lb-period">Tuần này</div>
                </div>
                <div className="lp-lb-row">
                  <div className="lp-lb-rank" style={{ background: 'linear-gradient(135deg,#FFD93D,#FF9966)', color: '#fff' }}>🥇</div>
                  <div className="lp-lb-avatar" style={{ background: 'linear-gradient(135deg,#FF6B35,#FF9966)' }}>N</div>
                  <div className="lp-lb-name">Nguyễn Minh Tuấn</div>
                  <div className="lp-lb-xp">3,840 XP</div>
                </div>
                <div className="lp-lb-row">
                  <div className="lp-lb-rank" style={{ background: 'linear-gradient(135deg,#9CA3AF,#D1D5DB)', color: '#fff' }}>🥈</div>
                  <div className="lp-lb-avatar" style={{ background: 'linear-gradient(135deg,#4ECDC4,#6BCB77)' }}>T</div>
                  <div className="lp-lb-name">Trần Thị Lan Anh</div>
                  <div className="lp-lb-xp">3,210 XP</div>
                </div>
                <div className="lp-lb-row">
                  <div className="lp-lb-rank" style={{ background: 'linear-gradient(135deg,#CD7F32,#D97706)', color: '#fff' }}>🥉</div>
                  <div className="lp-lb-avatar" style={{ background: 'linear-gradient(135deg,#A78BFA,#8B5CF6)' }}>L</div>
                  <div className="lp-lb-name">Lê Hoàng Nam</div>
                  <div className="lp-lb-xp">2,950 XP</div>
                </div>
                <div className="lp-lb-row" style={{ background: 'rgba(255,107,53,.04)' }}>
                  <div className="lp-lb-rank" style={{ background: 'rgba(255,107,53,.1)', color: 'var(--lp-primary)' }}>12</div>
                  <div className="lp-lb-avatar" style={{ background: 'linear-gradient(135deg,#FFD93D,#FF9966)' }}>B</div>
                  <div className="lp-lb-name" style={{ color: 'var(--lp-primary)', fontWeight: 800 }}>Bạn (Bảo)</div>
                  <div className="lp-lb-xp">1,240 XP</div>
                </div>
                <div style={{ padding: '12px 20px', textAlign: 'center' }}>
                  <Link href="/leaderboard" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--lp-primary)' }}>Xem bảng xếp hạng đầy đủ →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
           EXAM SECTION
      ════════════════════════════════════════ */}
      <section className="lp-section lp-exam-section" id="exam">
        <div className="lp-container">
          <div className="lp-section-header anim-fade-up">
            <div className="lp-tag" style={{ background: 'rgba(167,139,250,.12)', color: '#7C3AED' }}>🎓 Luyện Thi Chứng Chỉ</div>
            <h2 className="lp-section-title">Chinh phục <span>IELTS · TOEIC · TOEFL</span><br/>với giao diện thi thật</h2>
            <p className="lp-section-desc">Đề thi mô phỏng chuẩn xác, chấm điểm AI tức thì và phân tích điểm mạnh/yếu chi tiết sau mỗi lần thi.</p>
          </div>
          <div className="lp-exam-cards anim-fade-up">
            <div className="lp-exam-card">
              <div className="lp-exam-card-header" style={{ background: 'linear-gradient(135deg,#4ECDC4,#6BCB77)' }}>
                <div className="lp-exam-card-title-big">IELTS</div>
              </div>
              <div className="lp-exam-card-body">
                <div className="lp-exam-card-name">IELTS Academic & General</div>
                <div className="lp-exam-card-desc">Luyện đề chuẩn British Council với 4 sections đầy đủ. AI chấm Writing và Speaking.</div>
                <div className="lp-exam-features">
                  <div className="lp-exam-feat"><div className="lp-exam-feat-dot" style={{ background: '#4ECDC4' }}></div>Listening, Reading, Writing, Speaking</div>
                  <div className="lp-exam-feat"><div className="lp-exam-feat-dot" style={{ background: '#4ECDC4' }}></div>Band score 0–9 ước tính</div>
                </div>
                <button className="lp-btn-exam">Luyện IELTS →</button>
              </div>
            </div>
            <div className="lp-exam-card">
              <div className="lp-exam-card-header" style={{ background: 'linear-gradient(135deg,#FF6B35,#FF9966)' }}>
                <div className="lp-exam-card-title-big">TOEIC</div>
              </div>
              <div className="lp-exam-card-body">
                <div className="lp-exam-card-name">TOEIC Listening & Reading</div>
                <div className="lp-exam-card-desc">Format chuẩn ETS, 200 câu / 120 phút. Điểm scaled score 10–990.</div>
                <div className="lp-exam-features">
                  <div className="lp-exam-feat"><div className="lp-exam-feat-dot" style={{ background: 'var(--lp-primary)' }}></div>Part 1–7 đầy đủ</div>
                  <div className="lp-exam-feat"><div className="lp-exam-feat-dot" style={{ background: 'var(--lp-primary)' }}></div>Scaled score conversion</div>
                </div>
                <button className="lp-btn-exam">Luyện TOEIC →</button>
              </div>
            </div>
            <div className="lp-exam-card">
              <div className="lp-exam-card-header" style={{ background: 'linear-gradient(135deg,#A78BFA,#8B5CF6)' }}>
                <div className="lp-exam-card-title-big">TOEFL</div>
              </div>
              <div className="lp-exam-card-body">
                <div className="lp-exam-card-name">TOEFL iBT</div>
                <div className="lp-exam-card-desc">Luyện Reading & Listening theo format TOEFL iBT. Điểm số 0–120.</div>
                <div className="lp-exam-features">
                  <div className="lp-exam-feat"><div className="lp-exam-feat-dot" style={{ background: '#A78BFA' }}></div>Reading + Listening</div>
                  <div className="lp-exam-feat"><div className="lp-exam-feat-dot" style={{ background: '#A78BFA' }}></div>Score 0–120</div>
                </div>
                <button className="lp-btn-exam">Luyện TOEFL →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
           PRICING
      ════════════════════════════════════════ */}
      <section className="lp-section lp-pricing-section" id="pricing">
        <div className="lp-container">
          <div className="lp-section-header anim-fade-up">
            <div className="lp-tag" style={{ background: 'rgba(107,203,119,.12)', color: '#2E8B3A' }}>💎 Bảng Giá</div>
            <h2 className="lp-section-title">Miễn phí để bắt đầu,<br/><span>Premium để bứt phá</span></h2>
            <p className="lp-section-desc">Tất cả tính năng cơ bản hoàn toàn miễn phí. Nâng cấp Premium để mở khóa AI không giới hạn.</p>
          </div>
          <div className="lp-pricing-grid anim-fade-up">
            <div className="lp-pricing-card">
              <div className="lp-plan-name">Free</div>
              <div className="lp-plan-free">0₫</div>
              <div className="lp-plan-desc">Bắt đầu hành trình học tiếng Anh hoàn toàn miễn phí</div>
              <div className="lp-plan-divider"></div>
              <div className="lp-plan-features">
                <div className="lp-plan-feat"><span className="lp-feat-check">✓</span>Bài học cơ bản tất cả kỹ năng</div>
                <div className="lp-plan-feat"><span className="lp-feat-check">✓</span>Placement Test xác định trình độ</div>
                <div className="lp-plan-feat"><span className="lp-feat-check">✓</span>Flashcard & Spaced Repetition</div>
                <div className="lp-plan-feat"><span className="lp-feat-check">✓</span>Gamification (XP, Streak, Badge)</div>
              </div>
              <button className="lp-btn-plan-free" onClick={() => router.push('/register')}>Đăng ký miễn phí</button>
            </div>
            <div className="lp-pricing-card popular">
              <div className="lp-popular-tag">Phổ biến nhất 🔥</div>
              <div className="lp-plan-name">Premium</div>
              <div className="lp-plan-price"><sup>₫</sup>99,000<span className="period">/tháng</span></div>
              <div className="lp-plan-desc">Mở khóa toàn bộ tính năng AI và luyện đề không giới hạn</div>
              <div className="lp-plan-divider"></div>
              <div className="lp-plan-features">
                <div className="lp-plan-feat"><span className="lp-feat-check">✓</span>Tất cả tính năng Free</div>
                <div className="lp-plan-feat"><span className="lp-feat-check">✓</span><strong>AI Chat luyện hội thoại</strong></div>
                <div className="lp-plan-feat"><span className="lp-feat-check">✓</span><strong>AI Writing Checker đầy đủ</strong></div>
                <div className="lp-plan-feat"><span className="lp-feat-check">✓</span><strong>Luyện đề mô phỏng chuẩn</strong></div>
              </div>
              <button className="lp-btn-plan-premium" onClick={() => router.push('/register')}>Dùng thử miễn phí →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
           FOOTER
      ════════════════════════════════════════ */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-grid">
            <div className="lp-footer-brand">
              <Link href="/" className="lp-nav-logo">
                <div className="lp-nav-logo-icon bg-transparent shadow-none">
                  <img src="/logo.png" alt="NebulaEnglish Logo" className="w-full h-full object-contain" />
                </div>
                <div className="lp-nav-logo-text" style={{ color: '#fff' }}>NebulaEnglish</div>
              </Link>
              <p className="lp-footer-tagline">Nền tảng học tiếng Anh thông minh, cá nhân hóa theo từng người học, kết hợp AI và gamification.</p>
              <div className="lp-footer-social">
                <a href="#" className="lp-social-btn">f</a>
                <a href="#" className="lp-social-btn">in</a>
                <a href="#" className="lp-social-btn">yt</a>
              </div>
            </div>
            <div>
              <div className="lp-footer-col-title">Sản phẩm</div>
              <div className="lp-footer-links">
                <a href="#skills" className="lp-footer-link">6 Kỹ năng học</a>
                <a href="#ai" className="lp-footer-link">Tính năng AI</a>
                <a href="#pricing" className="lp-footer-link">Bảng giá</a>
              </div>
            </div>
            <div>
              <div className="lp-footer-col-title">Học tập</div>
              <div className="lp-footer-links">
                <a href="#" className="lp-footer-link">Từ vựng</a>
                <a href="#" className="lp-footer-link">Ngữ pháp</a>
                <a href="#" className="lp-footer-link">Luyện nói</a>
              </div>
            </div>
            <div>
              <div className="lp-footer-col-title">Hỗ trợ</div>
              <div className="lp-footer-links">
                <a href="#" className="lp-footer-link">Trung tâm trợ giúp</a>
                <a href="#" className="lp-footer-link">Liên hệ</a>
              </div>
            </div>
          </div>
          <div className="lp-footer-bottom">
            <div className="lp-footer-copy">© 2025 NebulaEnglish. Made with ❤️ for Vietnamese learners.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
