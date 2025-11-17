"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";

type PollOption = {
  id: string;
  label: string;
  votes: number;
};

type Post = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  gameType: string;
  password: string;
  createdAt: string;
  pollEnabled: boolean;
  pollOptions: PollOption[];
};

const initialPosts: Post[] = [
  {
    id: "p-001",
    title: "솔로 랭크 이렐리아 연구 메모",
    content:
      "이번 주에는 이렐리아를 정복자로 가볼 생각입니다. 빌드 순서와 스킬 트리에 대해 의견을 구합니다.",
    tags: ["이렐리아", "탑", "정복자"],
    gameType: "LOL",
    password: "1234",
    createdAt: "2024-11-20",
    pollEnabled: true,
    pollOptions: [
      { id: "opt-1", label: "삼위일체 선구매", votes: 18 },
      { id: "opt-2", label: "얼어붙은 건틀릿 선구매", votes: 11 },
      { id: "opt-3", label: "선혈포식자 하이브리드", votes: 9 },
    ],
  },
  {
    id: "p-002",
    title: "TFT 페어 업 토너먼트 팀원 모집",
    content:
      "다음 달 아마추어 대회에 나가볼 생각입니다. 페어 업 모드 경험 있으신 분 연락 주세요!",
    tags: ["TFT", "팀원모집", "페어업"],
    gameType: "TFT",
    password: "abcd",
    createdAt: "2024-10-02",
    pollEnabled: false,
    pollOptions: [],
  },
  {
    id: "p-003",
    title: "새 시즌 준비용 듀오 구합니다",
    content:
      "새 시즌 시작하면 플레티넘 목표로 달려보고 싶습니다. 음성 가능하신 분이면 좋겠어요.",
    tags: ["듀오", "랭크", "음성"],
    gameType: "LOL",
    password: "pass",
    createdAt: "2024-08-14",
    pollEnabled: true,
    pollOptions: [
      { id: "opt-4", label: "저녁 8시 이후 가능", votes: 7 },
      { id: "opt-5", label: "주말 낮만 가능", votes: 5 },
    ],
  },
];

const gameTypes = ["LOL", "TFT", "VALORANT", "ETC"];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [selectedPostId, setSelectedPostId] = useState<string>(initialPosts[0].id);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string>("");
  const [gameType, setGameType] = useState<string>(gameTypes[0]);
  const [password, setPassword] = useState<string>("");
  const [pollEnabled, setPollEnabled] = useState<boolean>(false);
  const [pollDraftItems, setPollDraftItems] = useState<string[]>(["", ""]);

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) ?? posts[0],
    [posts, selectedPostId],
  );

  const handleAddPollItem = () => {
    setPollDraftItems((prev) => [...prev, ""]);
  };

  const handleUpdatePollItem = (index: number, value: string) => {
    setPollDraftItems((prev) => prev.map((item, idx) => (idx === index ? value : item)));
  };

  const handleCreatePost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const preparedPollOptions: PollOption[] = pollEnabled
      ? pollDraftItems
          .map((label) => label.trim())
          .filter(Boolean)
          .map((label, index) => ({ id: `new-${Date.now()}-${index}`, label, votes: 0 }))
      : [];

    const newPost: Post = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      gameType,
      password: password.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
      pollEnabled,
      pollOptions: preparedPollOptions,
    };

    if (!newPost.title || !newPost.content || !newPost.password) {
      alert("제목, 내용, 게시글 비밀번호는 필수입니다.");
      return;
    }

    setPosts((prev) => [newPost, ...prev]);
    setSelectedPostId(newPost.id);
    setTitle("");
    setContent("");
    setTags("");
    setGameType(gameTypes[0]);
    setPassword("");
    setPollEnabled(false);
    setPollDraftItems(["", ""]);
  };

  const handleVote = (optionId: string) => {
    if (!selectedPost?.pollEnabled) return;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== selectedPost.id) return post;
        return {
          ...post,
          pollOptions: post.pollOptions.map((option) =>
            option.id === optionId ? { ...option, votes: option.votes + 1 } : option,
          ),
        };
      }),
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.halo} />

      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroRibbon}>
            <span className={styles.ribbonPill}>RedeFriend</span>
            <span className={styles.ribbonPill}>게시글 · 투표</span>
          </div>
          <div className={styles.heroTitle}>
            <h1>게시글 작성 · 목록 · 투표를 하나의 보드에서</h1>
            <p>
              게임 종류, 태그, 비밀번호 관리까지 모두 아우르는 단일 화면입니다. 간결한 입력과 세련된 카드
              레이아웃으로 필요한 정보를 한눈에 확인하세요.
            </p>
          </div>
          <div className={styles.heroPills}>
            <div className={styles.pill}>
              <span className={styles.dot} style={{ background: "#34d399" }} /> 손쉬운 투표 생성 및 집계
            </div>
            <div className={styles.pill}>
              <span className={styles.dot} style={{ background: "#22d3ee" }} /> 게시글 비밀번호, 태그, 게임 종류 필수 입력
            </div>
            <div className={styles.pill}>
              <span className={styles.dot} style={{ background: "#c7d2fe" }} /> 새 글 작성 후 자동 상세 이동
            </div>
          </div>
        </div>
      </header>

      <main className={styles.shell}>
        <section className={styles.boardGrid}>
          <div className={styles.cardGlass}>
            <div className={styles.sectionTitle}>
              <p className={styles.eyebrow}>Create</p>
              <h2 className={styles.title}>새 게시글을 만들어보세요</h2>
              <p className={styles.desc}>필수 입력을 강조하고, 투표 항목을 직관적으로 추가할 수 있게 디자인했습니다.</p>
            </div>

            <form className={styles.formGrid} onSubmit={handleCreatePost}>
              <div className={styles.field} style={{ gridColumn: "1 / -1" }}>
                <label className={styles.label}>제목 *</label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="예) 새 시즌 준비용 듀오 구합니다"
                  className={styles.input}
                />
              </div>

              <div className={styles.field} style={{ gridColumn: "1 / -1" }}>
                <label className={styles.label}>내용 *</label>
                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  rows={4}
                  placeholder="구체적인 요청 사항이나 공유하고 싶은 내용을 적어주세요"
                  className={styles.textarea}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>태그</label>
                <input
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  placeholder="쉼표로 구분해서 작성 (예: 듀오, 랭크, 저녁시간)"
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>게임 종류 *</label>
                <select value={gameType} onChange={(event) => setGameType(event.target.value)} className={styles.select}>
                  {gameTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>게시글 비밀번호 *</label>
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  placeholder="게시글 관리용 비밀번호"
                  className={styles.input}
                />
              </div>

              <div className={styles.pollPanel}>
                <div className={styles.pollHeader}>
                  <div>
                    <p className={styles.labelTitle}>투표 시스템 설정</p>
                    <p className={styles.labelSub}>필요한 만큼 항목을 만들어 투표 흐름을 구성하세요.</p>
                  </div>
                  <label className={styles.pollToggle}>
                    <input
                      type="checkbox"
                      checked={pollEnabled}
                      onChange={(event) => setPollEnabled(event.target.checked)}
                    />
                    투표 사용
                  </label>
                </div>

                {pollEnabled && (
                  <div className={styles.pollItems}>
                    {pollDraftItems.map((item, index) => (
                      <div key={index} className={styles.field}>
                        <label className={styles.label}>투표 항목 {index + 1}</label>
                        <input
                          value={item}
                          onChange={(event) => handleUpdatePollItem(index, event.target.value)}
                          placeholder="예) 주말 오전 고정"
                          className={styles.input}
                        />
                      </div>
                    ))}
                    <button type="button" onClick={handleAddPollItem} className={styles.pollAdd}>
                      + 투표 항목 추가
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.actions}>
                <button
                  type="reset"
                  onClick={() => {
                    setTitle("");
                    setContent("");
                    setTags("");
                    setGameType(gameTypes[0]);
                    setPassword("");
                    setPollEnabled(false);
                    setPollDraftItems(["", ""]);
                  }}
                  className={styles.resetBtn}
                >
                  초기화
                </button>
                <button type="submit" className={styles.submitBtn}>
                  게시글 등록
                </button>
              </div>
            </form>
          </div>

          <div className={styles.cardGlass}>
            <div className={styles.listHeader}>
              <div className={styles.sectionTitle}>
                <p className={styles.eyebrow}>List</p>
                <h2 className={styles.title}>게시글 목록</h2>
              </div>
              <div className={styles.listCount}>
                <span className={styles.dot} style={{ background: "#34d399" }} /> {posts.length}개 글
              </div>
            </div>

            <div className={styles.listStack}>
              {posts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                  className={`${styles.postButton} ${selectedPostId === post.id ? styles.postButtonActive : ""}`}
                >
                  <div className={styles.postTop}>
                    <div className={styles.postMeta}>
                      <span className={styles.gameBadge}>{post.gameType}</span>
                      <p className={styles.postTitle}>{post.title}</p>
                    </div>
                    {post.pollEnabled && <span className={styles.pollBadge}>투표 활성화</span>}
                  </div>
                  <p className={styles.postContentPreview}>{post.content}</p>
                  <div className={styles.postChips}>
                    <span className={styles.chip}>{post.createdAt}</span>
                    {post.tags.map((tag) => (
                      <span key={tag} className={styles.chip}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {selectedPost && (
          <section className={styles.detailGrid}>
            <div className={styles.cardGlass}>
              <div className={styles.detailHeader}>
                <div className={styles.detailTitle}>
                  <p className={styles.eyebrow}>Detail</p>
                  <h2>{selectedPost.title}</h2>
                  <p className={styles.meta}>
                    {selectedPost.createdAt} · {selectedPost.gameType}
                  </p>
                </div>
                <div className={styles.detailBadges}>
                  {selectedPost.pollEnabled && <span className={`${styles.badge} ${styles.badgeIndigo}`}>투표 진행 중</span>}
                  <span className={styles.badge}>비밀번호 설정됨</span>
                </div>
              </div>

              <div className={styles.detailContent}>{selectedPost.content}</div>

              <div className={styles.tagList}>
                {selectedPost.tags.map((tag) => (
                  <span key={tag} className={styles.chip}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {selectedPost.pollEnabled && (
              <div className={styles.cardGlass}>
                <div className={styles.voteHeader}>
                  <div className={styles.sectionTitle}>
                    <p className={styles.eyebrow}>Vote</p>
                    <h3 className={styles.title}>투표 현황</h3>
                    <p className={styles.desc}>바로 클릭해 투표하고, 비율과 총 표수를 바로 확인하세요.</p>
                  </div>
                  <span className={styles.voteTotal}>
                    {selectedPost.pollOptions.reduce((sum, option) => sum + option.votes, 0)} 표
                  </span>
                </div>

                <div className={styles.voteOptions}>
                  {selectedPost.pollOptions.map((option) => {
                    const totalVotes = selectedPost.pollOptions.reduce((sum, item) => sum + item.votes, 0);
                    const ratio = totalVotes ? Math.round((option.votes / totalVotes) * 100) : 0;

                    return (
                      <button key={option.id} onClick={() => handleVote(option.id)} className={styles.voteOption}>
                        <div className={styles.optionTop}>
                          <span>{option.label}</span>
                          <span className={styles.optionVotes}>{option.votes} 표</span>
                        </div>
                        <div className={styles.progressTrack}>
                          <span className={styles.progressBar} style={{ width: `${ratio}%` }} />
                        </div>
                        <p className={styles.progressText}>{ratio}%</p>
                      </button>
                    );
                  })}

                  {selectedPost.pollOptions.length === 0 && (
                    <p className={styles.emptyState}>투표 항목이 없습니다. 작성 시 항목을 추가해 주세요.</p>
                  )}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
