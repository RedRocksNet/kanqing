'use client';

import { useState } from 'react';
import FreeDeepToggle from '../../components/FreeDeepToggle';

function formatAnswer(text) {
  if (!text) return [];

  const sections = text
    .split(/\n(?=[^\n：]{1,20}：)/g)
    .map((s) => s.trim())
    .filter(Boolean);

  return sections.map((section) => {
    const match = section.match(/^([^\n：]{1,20}：)\n?([\s\S]*)$/);

    if (match) {
      return {
        title: match[1],
        body: match[2].trim(),
      };
    }

    return {
      title: '',
      body: section,
    };
  });
}

function renderBody(body) {
  const lines = body
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const hasList = lines.some((line) => /^\d+\./.test(line) || /^-\s/.test(line));

  if (!hasList) {
    return <p className="ask-answer-paragraph">{body}</p>;
  }

  return (
    <div className="ask-answer-block">
      {lines.map((line, idx) => {
        if (/^\d+\./.test(line) || /^-\s/.test(line)) {
          return (
            <div key={idx} className="ask-answer-item">
              {line}
            </div>
          );
        }

        return (
          <p key={idx} className="ask-answer-paragraph">
            {line}
          </p>
        );
      })}
    </div>
  );
}

export default function AskPage() {
  const [question, setQuestion] = useState('');
  const [mode, setMode] = useState('free');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    if (e) e.preventDefault();

    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setAnswer('');
    setError('');

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          mode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || '请求失败');
      }

      setAnswer(data?.answer || '');
    } catch (err) {
      setError(err?.message || '发生错误');
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = question.trim() && !loading;
  const formattedAnswer = formatAnswer(answer);

  return (
    <main className="ask-page">
      <div className="ask-shell">
        <section className="ask-main-card">
          <div className="ask-header">
            <div>
              <div className="ask-kicker">KANQING / ASK</div>
              <h1 className="ask-title">看清</h1>
              <p className="ask-subtitle">
                先看方向，再看代价。用更清楚的方式处理复杂问题。
              </p>
            </div>

            <div className="ask-mode-badge">
              <div className="ask-mode-badge-label">当前模式</div>
              <div className="ask-mode-badge-value">
                {mode === 'free' ? 'FREE' : 'DEEP'}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="ask-form">
            <div className="ask-topbar">
              <FreeDeepToggle value={mode} onChange={setMode} />
              <div className="ask-topbar-note">
                {mode === 'free'
                  ? '快速判断 / 更轻量 / 先抓重点'
                  : '深入展开 / 更完整 / 更适合复杂问题'}
              </div>
            </div>

            <div className="ask-input-card">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={`例如：要不要转学？

也可以顺手补一句：
我在犹豫什么？
我最怕失去什么？
我最想保住什么？`}
                rows={9}
                className="ask-textarea"
              />

              <div className="ask-input-footer">
                <div className="ask-input-hint">
                  {mode === 'free'
                    ? 'FREE 会先给你一个方向判断，再指出最关键的理由。'
                    : 'DEEP 会展开核心矛盾、影响因素、路径与代价，适合更难的问题。'}
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="ask-submit"
                >
                  {loading ? '分析中…' : '开始看清'}
                </button>
              </div>
            </div>
          </form>
        </section>

        <aside className="ask-side">
          <div className="ask-side-card">
            <div className="ask-side-kicker">使用方式</div>
            <h2 className="ask-side-title">怎么问，会更准</h2>
            <p className="ask-side-text">
              不必问得很正式，但最好把真正卡住你的点说出来。
            </p>
            <p className="ask-side-text">
              越接近真实矛盾，输出越有用。
            </p>
            <p className="ask-side-text">
              与其只问“要不要”，不如补一句：你最怕失去什么，又最想保住什么。
            </p>
          </div>

          <div className="ask-side-card">
            <div className="ask-side-kicker">FREE vs DEEP</div>

            <div className={`ask-mode-box ${mode === 'free' ? 'selected' : ''}`}>
              <div className="ask-mode-box-title">FREE</div>
              <div className="ask-mode-box-text">
                快速抓核心。适合先看方向、先得到一个清晰判断。
              </div>
            </div>

            <div className={`ask-mode-box ${mode === 'deep' ? 'selected' : ''}`}>
              <div className="ask-mode-box-title">DEEP</div>
              <div className="ask-mode-box-text">
                深入拆解矛盾与代价。适合转学、辞职、关系、去留这类复杂问题。
              </div>
            </div>
          </div>

          <div className="ask-side-card">
            <div className="ask-side-kicker">示例问题</div>
            <div className="ask-chip-wrap">
              {[
                '要不要转学？',
                '要不要辞职？',
                '该不该去见她？',
                '这段关系还要继续吗？',
                '要不要搬去另一个城市？',
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="ask-chip"
                  onClick={() => setQuestion(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {(answer || error || loading) && (
        <section className="ask-result-card">
          <div className="ask-result-head">
            <div>
              <div className="ask-result-kicker">ANALYSIS</div>
              <h2 className="ask-result-title">
                {loading
                  ? '正在看清…'
                  : mode === 'free'
                  ? 'FREE 分析结果'
                  : 'DEEP 分析结果'}
              </h2>
            </div>
            <div className="ask-result-mode">
              模式：{mode === 'free' ? 'FREE' : 'DEEP'}
            </div>
          </div>

          <div className="ask-result-body">
            {loading ? (
              <div className="ask-loading">正在分析，请稍候…</div>
            ) : error ? (
              <div className="ask-error">{error}</div>
            ) : (
              <div className="ask-answer">
                {formattedAnswer.map((section, index) => (
                  <div key={index} className="ask-answer-section">
                    {section.title ? (
                      <div className="ask-answer-title">{section.title}</div>
                    ) : null}
                    {renderBody(section.body)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}