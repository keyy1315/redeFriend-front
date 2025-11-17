"use client";

import { useMemo, useState } from "react";

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
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.16),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.1),transparent_30%),radial-gradient(circle_at_40%_90%,rgba(94,234,212,0.12),transparent_25%)]" />

      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-700 to-slate-900" />
        <div className="relative max-w-6xl mx-auto px-6 py-12 flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-indigo-100 uppercase tracking-[0.35em]">
            <span className="rounded-full border border-indigo-200/40 px-3 py-1 bg-white/10">RedeFriend</span>
            <span className="rounded-full border border-indigo-200/40 px-3 py-1 bg-white/10">게시글 · 투표</span>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">게시글 작성 · 목록 · 투표를 하나의 보드에서</h1>
            <p className="text-indigo-100/90 text-lg leading-8 max-w-3xl">
              게임 종류, 태그, 비밀번호 관리까지 모두 아우르는 단일 화면입니다. 간결한 입력과 세련된 카드 레이아웃으로
              필요한 정보를 한눈에 확인하세요.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-indigo-50 shadow-lg shadow-indigo-900/40">
              <span className="h-2 w-2 rounded-full bg-emerald-300" /> 손쉬운 투표 생성 및 집계
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-indigo-50 shadow-lg shadow-indigo-900/40">
              <span className="h-2 w-2 rounded-full bg-cyan-300" /> 게시글 비밀번호, 태그, 게임 종류 필수 입력
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-indigo-50 shadow-lg shadow-indigo-900/40">
              <span className="h-2 w-2 rounded-full bg-indigo-200" /> 새 글 작성 후 자동 상세 이동
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-6 py-10 flex flex-col gap-8">
        <section className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-slate-900/30">
            <div className="flex flex-col gap-1">
              <p className="text-xs uppercase tracking-[0.35em] text-indigo-200 font-semibold">Create</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white">새 게시글을 만들어보세요</h2>
              <p className="text-sm text-slate-200/80">필수 입력을 강조하고, 투표 항목을 직관적으로 추가할 수 있게 디자인했습니다.</p>
            </div>

            <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleCreatePost}>
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-sm font-semibold text-indigo-100">제목 *</label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="예) 새 시즌 준비용 듀오 구합니다"
                  className="w-full rounded-xl border border-indigo-200/40 bg-white/10 px-3 py-2 text-white placeholder:text-slate-300/70 focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-sm font-semibold text-indigo-100">내용 *</label>
                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  rows={4}
                  placeholder="구체적인 요청 사항이나 공유하고 싶은 내용을 적어주세요"
                  className="w-full rounded-xl border border-indigo-200/40 bg-white/10 px-3 py-2 text-white placeholder:text-slate-300/70 focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-indigo-100">태그</label>
                <input
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  placeholder="쉼표로 구분해서 작성 (예: 듀오, 랭크, 저녁시간)"
                  className="w-full rounded-xl border border-indigo-200/40 bg-white/10 px-3 py-2 text-white placeholder:text-slate-300/70 focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-indigo-100">게임 종류 *</label>
                <select
                  value={gameType}
                  onChange={(event) => setGameType(event.target.value)}
                  className="w-full rounded-xl border border-indigo-200/40 bg-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
                >
                  {gameTypes.map((type) => (
                    <option key={type} value={type} className="bg-slate-900 text-white">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-indigo-100">게시글 비밀번호 *</label>
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  placeholder="게시글 관리용 비밀번호"
                  className="w-full rounded-xl border border-indigo-200/40 bg-white/10 px-3 py-2 text-white placeholder:text-slate-300/70 focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-3 rounded-2xl border border-dashed border-emerald-300/60 bg-emerald-500/5 px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-emerald-100">투표 시스템 설정</p>
                    <p className="text-xs text-emerald-100/80">필요한 만큼 항목을 만들어 투표 흐름을 구성하세요.</p>
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-50">
                    <input
                      type="checkbox"
                      checked={pollEnabled}
                      onChange={(event) => setPollEnabled(event.target.checked)}
                      className="h-4 w-4 rounded border-emerald-200 text-emerald-600 focus:ring-emerald-400"
                    />
                    투표 사용
                  </label>
                </div>

                {pollEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pollDraftItems.map((item, index) => (
                      <div key={index} className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-emerald-50">투표 항목 {index + 1}</label>
                        <input
                          value={item}
                          onChange={(event) => handleUpdatePollItem(index, event.target.value)}
                          placeholder="예) 주말 오전 고정"
                          className="w-full rounded-lg border border-emerald-200/40 bg-white/10 px-3 py-2 text-white placeholder:text-emerald-50/60 focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddPollItem}
                      className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200/50 bg-white/5 px-3 py-2 text-sm font-semibold text-emerald-50 shadow-sm hover:bg-white/10"
                    >
                      + 투표 항목 추가
                    </button>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 flex flex-wrap justify-end gap-3">
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
                  className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10"
                >
                  초기화
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 hover:brightness-110"
                >
                  게시글 등록
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-slate-900/30 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-indigo-200 font-semibold">List</p>
                <h2 className="text-2xl font-bold text-white">게시글 목록</h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-indigo-100 bg-white/10 border border-white/10 px-3 py-1 rounded-full">
                <span className="h-2 w-2 rounded-full bg-emerald-300" /> {posts.length}개 글
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {posts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                  className={`group text-left rounded-2xl border transition-all duration-150 ${
                    selectedPostId === post.id
                      ? "border-emerald-300/70 bg-white/10 shadow-lg shadow-emerald-500/20"
                      : "border-white/10 bg-white/5 hover:border-emerald-300/60 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 px-4 pt-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-emerald-200 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-200/40">
                        {post.gameType}
                      </span>
                      <p className="text-sm font-semibold text-white group-hover:text-emerald-100">{post.title}</p>
                    </div>
                    {post.pollEnabled && (
                      <span className="text-[10px] font-semibold text-indigo-100 bg-indigo-500/20 border border-indigo-200/40 px-2 py-1 rounded-full">
                        투표 활성화
                      </span>
                    )}
                  </div>
                  <p className="mt-1 px-4 text-sm text-slate-200/80 line-clamp-2">{post.content}</p>
                  <div className="mt-3 px-4 pb-4 flex flex-wrap gap-2 text-[11px] text-slate-200/70">
                    <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">{post.createdAt}</span>
                    {post.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
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
          <section className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-slate-900/30">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-2">
                  <p className="text-xs uppercase tracking-[0.35em] text-indigo-200 font-semibold">Detail</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedPost.title}</h2>
                  <p className="text-sm text-slate-200/80">
                    {selectedPost.createdAt} · {selectedPost.gameType}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedPost.pollEnabled && (
                    <span className="px-3 py-1 text-xs font-semibold bg-indigo-500/20 border border-indigo-200/40 text-indigo-50 rounded-full">
                      투표 진행 중
                    </span>
                  )}
                  <span className="px-3 py-1 text-xs font-semibold bg-white/10 border border-white/10 text-slate-100 rounded-full">
                    비밀번호 설정됨
                  </span>
                </div>
              </div>

              <div className="mt-4 text-base leading-7 text-slate-100 whitespace-pre-line bg-white/5 border border-white/10 rounded-2xl p-4">
                {selectedPost.content}
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-[12px] text-slate-200/80">
                {selectedPost.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {selectedPost.pollEnabled && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-slate-900/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-indigo-200 font-semibold">Vote</p>
                    <h3 className="text-xl font-bold text-white">투표 현황</h3>
                    <p className="text-xs text-indigo-100/80 mt-1">바로 클릭해 투표하고, 비율과 총 표수를 바로 확인하세요.</p>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-50 bg-white/10 border border-white/15 px-2 py-1 rounded-full">
                    {selectedPost.pollOptions.reduce((sum, option) => sum + option.votes, 0)} 표
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {selectedPost.pollOptions.map((option) => {
                    const totalVotes = selectedPost.pollOptions.reduce((sum, item) => sum + item.votes, 0);
                    const ratio = totalVotes ? Math.round((option.votes / totalVotes) * 100) : 0;

                    return (
                      <button
                        key={option.id}
                        onClick={() => handleVote(option.id)}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left shadow hover:border-emerald-300/70 hover:bg-white/10 transition"
                      >
                        <div className="flex items-center justify-between text-sm font-semibold text-white">
                          <span>{option.label}</span>
                          <span className="text-emerald-200">{option.votes} 표</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-white/5 overflow-hidden border border-white/10">
                          <span
                            className="block h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400"
                            style={{ width: `${ratio}%` }}
                          />
                        </div>
                        <p className="mt-1 text-[11px] text-slate-200/70">{ratio}%</p>
                      </button>
                    );
                  })}

                  {selectedPost.pollOptions.length === 0 && (
                    <p className="text-xs text-indigo-100/80">투표 항목이 없습니다. 작성 시 항목을 추가해 주세요.</p>
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
